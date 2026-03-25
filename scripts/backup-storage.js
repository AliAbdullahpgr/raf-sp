const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

function fileSafeName(value) {
  return String(value).replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
}

async function writeJson(filePath, data) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function findLatestBackupDir() {
  const backupRoot = path.join(process.cwd(), 'backups');
  const entries = await fs.promises.readdir(backupRoot, { withFileTypes: true });
  const directories = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const fullPath = path.join(backupRoot, entry.name);
    const stats = await fs.promises.stat(fullPath);
    directories.push({ fullPath, mtimeMs: stats.mtimeMs });
  }

  directories.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return directories[0] ? directories[0].fullPath : null;
}

async function main() {
  const backupDir = process.argv[2] || (await findLatestBackupDir());
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!backupDir) {
    throw new Error('No backup directory found.');
  }

  if (!projectUrl || !serviceRoleKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  }

  const objectsPath = path.join(backupDir, 'storage', 'objects.json');
  const objects = JSON.parse(await fs.promises.readFile(objectsPath, 'utf8'));

  if (!Array.isArray(objects) || objects.length === 0) {
    console.log('No storage objects to download.');
    return;
  }

  const supabase = createClient(projectUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const manifest = [];

  for (const object of objects) {
    const bucketId = object.bucket_id;
    const objectName = object.name;
    const targetPath = path.join(
      backupDir,
      'storage-files',
      fileSafeName(bucketId),
      ...String(objectName)
        .split('/')
        .filter(Boolean)
        .map((segment) => fileSafeName(segment)),
    );

    console.log(`Downloading ${bucketId}/${objectName}`);

    const { data, error } = await supabase.storage.from(bucketId).download(objectName);

    if (error) {
      throw error;
    }

    const bytes = Buffer.from(await data.arrayBuffer());
    await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.promises.writeFile(targetPath, bytes);

    manifest.push({
      bucketId,
      objectName,
      outputFile: path.relative(backupDir, targetPath),
      size: bytes.length,
      metadata: object.metadata || null,
    });
  }

  await writeJson(path.join(backupDir, 'storage-files-manifest.json'), manifest);
  console.log(`Storage backup complete: ${path.join(backupDir, 'storage-files')}`);
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});
