const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

require('dotenv').config();

const BATCH_SIZE = Number(process.env.BACKUP_BATCH_SIZE || 1000);
const BACKUP_ROOT = path.join(process.cwd(), 'backups');
const SYSTEM_SCHEMAS = ['pg_catalog', 'information_schema'];

function isLocalConnection(connectionString) {
  return /localhost|127\.0\.0\.1/i.test(connectionString);
}

function quoteIdent(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function fileSafeName(value) {
  return String(value).replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
}

function nowStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function endStream(stream) {
  return new Promise((resolve, reject) => {
    stream.on('error', reject);
    stream.end(resolve);
  });
}

async function writeJson(filePath, data) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function fetchAll(client, query, params = []) {
  const result = await client.query(query, params);
  return result.rows;
}

async function main() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DIRECT_URL or DATABASE_URL must be set in the environment.');
  }

  const outputDir = path.join(BACKUP_ROOT, nowStamp());
  const client = new Client({
    connectionString,
    ssl: isLocalConnection(connectionString) ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    statement_timeout: 0,
    query_timeout: 0,
    application_name: 'raf-sp-lat-backup',
  });

  await fs.promises.mkdir(outputDir, { recursive: true });

  const manifest = {
    createdAt: new Date().toISOString(),
    outputDir,
    batchSize: BATCH_SIZE,
    source: process.env.DIRECT_URL ? 'DIRECT_URL' : 'DATABASE_URL',
    tables: [],
    extensions: [],
    sequences: [],
    foreignKeys: [],
    indexes: [],
    policies: [],
    routines: [],
    views: [],
  };

  try {
    console.log(`Creating backup in ${outputDir}`);
    await client.connect();
    await client.query('BEGIN');
    await client.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY');

    const identityRows = await fetchAll(
      client,
      `
        select
          current_database() as database_name,
          current_user as database_user,
          version() as server_version
      `,
    );

    manifest.database = identityRows[0];

    manifest.extensions = await fetchAll(
      client,
      `
        select extname, extversion
        from pg_extension
        order by extname
      `,
    );

    manifest.sequences = await fetchAll(
      client,
      `
        select
          schemaname as schema_name,
          sequencename as sequence_name,
          start_value,
          min_value,
          max_value,
          increment_by,
          cycle,
          cache_size,
          last_value
        from pg_sequences
        where schemaname not in ('pg_catalog', 'information_schema')
          and schemaname not like 'pg_toast%'
          and schemaname not like 'pg_temp_%'
        order by schemaname, sequencename
      `,
    );

    manifest.foreignKeys = await fetchAll(
      client,
      `
        select
          tc.constraint_name,
          tc.table_schema,
          tc.table_name,
          kcu.column_name,
          ccu.table_schema as foreign_table_schema,
          ccu.table_name as foreign_table_name,
          ccu.column_name as foreign_column_name
        from information_schema.table_constraints tc
        join information_schema.key_column_usage kcu
          on tc.constraint_name = kcu.constraint_name
         and tc.table_schema = kcu.table_schema
        join information_schema.constraint_column_usage ccu
          on ccu.constraint_name = tc.constraint_name
         and ccu.constraint_schema = tc.table_schema
        where tc.constraint_type = 'FOREIGN KEY'
          and tc.table_schema not in ('pg_catalog', 'information_schema')
          and tc.table_schema not like 'pg_toast%'
          and tc.table_schema not like 'pg_temp_%'
        order by tc.table_schema, tc.table_name, tc.constraint_name, kcu.ordinal_position
      `,
    );

    manifest.indexes = await fetchAll(
      client,
      `
        select schemaname as schema_name, tablename as table_name, indexname as index_name, indexdef as index_definition
        from pg_indexes
        where schemaname not in ('pg_catalog', 'information_schema')
          and schemaname not like 'pg_toast%'
          and schemaname not like 'pg_temp_%'
        order by schemaname, tablename, indexname
      `,
    );

    manifest.policies = await fetchAll(
      client,
      `
        select
          schemaname as schema_name,
          tablename as table_name,
          policyname as policy_name,
          permissive,
          roles,
          cmd,
          qual,
          with_check
        from pg_policies
        where schemaname not in ('pg_catalog', 'information_schema')
          and schemaname not like 'pg_toast%'
          and schemaname not like 'pg_temp_%'
        order by schemaname, tablename, policyname
      `,
    );

    manifest.routines = await fetchAll(
      client,
      `
        select
          n.nspname as schema_name,
          p.proname as routine_name,
          pg_get_function_identity_arguments(p.oid) as identity_arguments,
          pg_get_functiondef(p.oid) as definition
        from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
        where n.nspname not in ('pg_catalog', 'information_schema')
          and n.nspname not like 'pg_toast%'
          and n.nspname not like 'pg_temp_%'
        order by n.nspname, p.proname
      `,
    );

    manifest.views = await fetchAll(
      client,
      `
        select
          schemaname as schema_name,
          viewname as view_name,
          definition
        from pg_views
        where schemaname not in ('pg_catalog', 'information_schema')
          and schemaname not like 'pg_toast%'
          and schemaname not like 'pg_temp_%'
        order by schemaname, viewname
      `,
    );

    const tables = await fetchAll(
      client,
      `
        select
          n.nspname as schema_name,
          c.relname as table_name,
          c.relkind,
          c.relispartition
        from pg_class c
        join pg_namespace n on n.oid = c.relnamespace
        where c.relkind in ('r', 'p')
          and not c.relispartition
          and n.nspname not in ('pg_catalog', 'information_schema')
          and n.nspname not like 'pg_toast%'
          and n.nspname not like 'pg_temp_%'
        order by n.nspname, c.relname
      `,
    );

    for (const table of tables) {
      const { schema_name: schemaName, table_name: tableName, relkind } = table;
      const tableLabel = `${schemaName}.${tableName}`;
      const tableDir = path.join(outputDir, fileSafeName(schemaName));
      const dataPath = path.join(tableDir, `${fileSafeName(tableName)}.json`);
      const metaPath = path.join(tableDir, `${fileSafeName(tableName)}.meta.json`);
      const qualifiedTable = `${quoteIdent(schemaName)}.${quoteIdent(tableName)}`;

      console.log(`Exporting ${tableLabel}`);

      const columns = await fetchAll(
        client,
        `
          select
            column_name,
            data_type,
            udt_name,
            is_nullable,
            column_default,
            ordinal_position
          from information_schema.columns
          where table_schema = $1
            and table_name = $2
          order by ordinal_position
        `,
        [schemaName, tableName],
      );

      const primaryKeyColumns = (
        await fetchAll(
          client,
          `
            select a.attname as column_name
            from pg_index i
            join pg_class c on c.oid = i.indrelid
            join pg_namespace n on n.oid = c.relnamespace
            join unnest(i.indkey) with ordinality as keycols(attnum, ordinality) on true
            join pg_attribute a on a.attrelid = c.oid and a.attnum = keycols.attnum
            where i.indisprimary
              and n.nspname = $1
              and c.relname = $2
            order by keycols.ordinality
          `,
          [schemaName, tableName],
        )
      ).map((row) => row.column_name);

      const [{ row_count: rowCount }] = await fetchAll(
        client,
        `select count(*)::bigint as row_count from ${qualifiedTable}`,
      );

      await fs.promises.mkdir(tableDir, { recursive: true });

      const stream = fs.createWriteStream(dataPath, { encoding: 'utf8' });
      stream.write('[\n');

      const orderBy =
        primaryKeyColumns.length > 0
          ? primaryKeyColumns.map((columnName) => quoteIdent(columnName)).join(', ')
          : 'ctid';

      let firstRow = true;
      let offset = 0;
      let exported = 0;

      while (true) {
        const batchResult = await client.query(
          `select * from ${qualifiedTable} order by ${orderBy} limit $1 offset $2`,
          [BATCH_SIZE, offset],
        );

        if (batchResult.rows.length === 0) {
          break;
        }

        for (const row of batchResult.rows) {
          if (!firstRow) {
            stream.write(',\n');
          }

          stream.write(JSON.stringify(row));
          firstRow = false;
        }

        exported += batchResult.rows.length;
        offset += batchResult.rows.length;
        console.log(`  ${tableLabel}: ${exported}/${rowCount}`);
      }

      stream.write('\n]\n');
      await endStream(stream);

      const tableMeta = {
        schema: schemaName,
        table: tableName,
        kind: relkind === 'p' ? 'partitioned' : 'table',
        rowCount,
        primaryKeyColumns,
        columns,
        dataFile: path.relative(outputDir, dataPath),
      };

      manifest.tables.push(tableMeta);
      await writeJson(metaPath, tableMeta);
    }

    await client.query('COMMIT');

    await writeJson(path.join(outputDir, 'manifest.json'), manifest);
    await writeJson(
      path.join(outputDir, 'README.json'),
      {
        note: 'This backup contains table data in JSON plus database metadata. It is not a pg_dump SQL archive.',
        coverage: [
          'All non-system schemas and tables visible to the configured database user',
          'Per-table rows exported in JSON format',
          'Columns, primary keys, indexes, foreign keys, policies, routines, views, extensions, and sequences metadata',
        ],
        limits: [
          'This backup does not produce a native pg_dump SQL file',
          'Large tables are exported in paged JSON batches to reduce memory pressure, but restore must be custom',
          'Supabase Storage object files are not included because they are not stored in Postgres table rows',
        ],
      },
    );

    console.log(`Backup complete: ${outputDir}`);
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // Ignore rollback errors if the session is already closed.
    }

    throw error;
  } finally {
    try {
      await client.end();
    } catch {
      // Ignore close errors.
    }
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});
