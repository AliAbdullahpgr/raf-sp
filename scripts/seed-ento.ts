import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

type EntoRow = {
  itemNo: number;
  name: string;
  quantityLabel: string | null;
  dateReceived: Date | null;
  lastVerification: Date | null;
  lastVerificationLabel: string | null;
  registerLabel: string;
  sourceLine: string;
};

const parseDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const cleaned = value.replace(/[^0-9.]/g, "");
  const [day, month, year] = cleaned.split(".").filter(Boolean);
  if (!day || !month || !year) return null;
  const parsed = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const ensureTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ento_profile (
      id SERIAL PRIMARY KEY,
      department_id TEXT UNIQUE NOT NULL,
      department_name TEXT NOT NULL,
      location TEXT,
      focal_person TEXT,
      designation TEXT,
      email TEXT,
      officers INTEGER,
      officials INTEGER,
      land_acres NUMERIC(10,2),
      rooms INTEGER,
      register_title TEXT,
      register_note TEXT,
      compiled_on DATE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ento_inventory_items (
      id SERIAL PRIMARY KEY,
      item_no INTEGER NOT NULL,
      name TEXT NOT NULL,
      quantity_label TEXT,
      date_received DATE,
      last_verified DATE,
      last_verification_label TEXT,
      register_label TEXT,
      source_line TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`CREATE INDEX IF NOT EXISTS ento_inventory_item_no_idx ON ento_inventory_items (item_no);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS ento_inventory_date_received_idx ON ento_inventory_items (date_received);`);
};

const seedProfile = async () => {
  const profile = {
    department_id: "ento",
    department_name: "Entomological Research Sub Station Multan",
    location: "Multan, Punjab",
    focal_person: "Dr. Asifa Hameed",
    designation: "Principal Scientist",
    email: "asifa_hameed_sheikh@yahoo.com",
    officers: 3,
    officials: 2,
    land_acres: 3.5,
    rooms: 5,
    register_title: "List of Non-Consumable Items - Stock Register (2) - CLCV Project",
    register_note:
      "Exact entries from ERSS Multan stock register including continuation notes for Register (3), DSR/auction remarks, and verification history.",
    compiled_on: parseDate("25.08.2025"),
  };

  await pool.query(
    `
    INSERT INTO ento_profile (
      department_id, department_name, location, focal_person, designation, email,
      officers, officials, land_acres, rooms, register_title, register_note, compiled_on, updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12, $13, NOW()
    )
    ON CONFLICT (department_id)
    DO UPDATE SET
      department_name = EXCLUDED.department_name,
      location = EXCLUDED.location,
      focal_person = EXCLUDED.focal_person,
      designation = EXCLUDED.designation,
      email = EXCLUDED.email,
      officers = EXCLUDED.officers,
      officials = EXCLUDED.officials,
      land_acres = EXCLUDED.land_acres,
      rooms = EXCLUDED.rooms,
      register_title = EXCLUDED.register_title,
      register_note = EXCLUDED.register_note,
      compiled_on = EXCLUDED.compiled_on,
      updated_at = NOW();
  `,
    [
      profile.department_id,
      profile.department_name,
      profile.location,
      profile.focal_person,
      profile.designation,
      profile.email,
      profile.officers,
      profile.officials,
      profile.land_acres,
      profile.rooms,
      profile.register_title,
      profile.register_note,
      profile.compiled_on,
    ]
  );
};

const parseItems = (raw: string): EntoRow[] => {
  const lines = raw.split(/\r?\n/);
  const rows: EntoRow[] = [];
  const registerLabel = "Stock Register (2) - CLCV Project";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) continue;
    if (trimmed.includes("---") || trimmed.toLowerCase().includes("name")) continue;

    const cells = trimmed.split("|").map((cell) => cell.trim());
    if (cells.length < 6) continue;

    const itemNo = Number(cells[1]);
    if (!Number.isFinite(itemNo)) continue;

    const name = cells[2];
    const quantityLabel = cells[3] || null;
    const dateReceived = parseDate(cells[4]);
    const lastVerificationLabel = cells[5] || null;
    const lastVerification = parseDate(cells[5]);

    rows.push({
      itemNo,
      name,
      quantityLabel,
      dateReceived,
      lastVerification,
      lastVerificationLabel,
      registerLabel,
      sourceLine: trimmed,
    });
  }

  return rows;
};

const seedItems = async () => {
  const dataFilePath = path.join(process.cwd(), "lib", "data", "ento.txt");
  const fileContent = fs.readFileSync(dataFilePath, "utf-8");
  const items = parseItems(fileContent);

  console.log(`Parsed ${items.length} entomology inventory rows.`);

  await pool.query("BEGIN");
  try {
    await pool.query("TRUNCATE TABLE ento_inventory_items RESTART IDENTITY;");

    for (const item of items) {
      await pool.query(
        `
          INSERT INTO ento_inventory_items (
            item_no,
            name,
            quantity_label,
            date_received,
            last_verified,
            last_verification_label,
            register_label,
            source_line,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW());
        `,
        [
          item.itemNo,
          item.name,
          item.quantityLabel,
          item.dateReceived,
          item.lastVerification,
          item.lastVerificationLabel,
          item.registerLabel,
          item.sourceLine,
        ]
      );
    }

    await pool.query("COMMIT");
    console.log(`Inserted ${items.length} entomology inventory records.`);
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in the environment");
  }

  await ensureTables();
  await seedProfile();
  await seedItems();
}

main()
  .then(() => {
    console.log("Entomology data seeded successfully.");
    return pool.end();
  })
  .catch(async (error) => {
    console.error("Failed to seed entomology data:", error);
    await pool.end();
    process.exit(1);
  });
