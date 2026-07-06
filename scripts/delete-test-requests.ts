import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1, // single connection avoids cross-connection prepared-statement issues
});

type Target = {
  status: string;
  resourceName: string;
  requestingDeptContains: string;
  lendingDeptContains: string;
};

// NOTE: DB stores "Agriculture Engineering" (UI shows "Agriculture Engineering Field Wing")
// and "Agricultural Extension Wing". Substring contains used for resilience.
const targets: Target[] = [
  {
    status: "PENDING",
    resourceName: "Director Agricultural Engineering (Training Bahawalpur)",
    requestingDeptContains: "Agricultural Extension Wing",
    lendingDeptContains: "Agriculture Engineering",
  },
  {
    status: "PENDING",
    resourceName: "Assistant Director Agriculturla Engineering Vehari",
    requestingDeptContains: "Agricultural Extension Wing",
    lendingDeptContains: "Agriculture Engineering",
  },
  {
    status: "PENDING",
    resourceName: "Director Agricultural Engineering Bahawalpur",
    requestingDeptContains: "Agricultural Extension Wing",
    lendingDeptContains: "Agriculture Engineering",
  },
  {
    status: "PENDING",
    resourceName: "SAO / EADA",
    requestingDeptContains: "Agriculture Engineering",
    lendingDeptContains: "Agricultural Extension Wing",
  },
  {
    status: "REJECTED",
    resourceName: "SAO / EADA",
    requestingDeptContains: "Agriculture Engineering",
    lendingDeptContains: "Agricultural Extension Wing",
  },
  {
    status: "REJECTED",
    resourceName: "Office of the Assistant Director Agriculture (Ext)",
    requestingDeptContains: "Agriculture Engineering",
    lendingDeptContains: "Agricultural Extension Wing",
  },
  {
    status: "PENDING",
    resourceName: "Executive Hall-I",
    requestingDeptContains: "Agriculture Engineering",
    lendingDeptContains: "Nawaz Shareef University of Agriculture",
  },
];

// Build a parameterised OR clause for all targets.
const params: (string | Date)[] = [];
const orClauses = targets.map((t) => {
  params.push(t.status, t.resourceName, `%${t.requestingDeptContains}%`, `%${t.lendingDeptContains}%`);
  return (
    "(rr.status = $%P% AND rr.\"resourceName\" = $%P% AND " +
    "rd.name ILIKE $%P% AND ld.name ILIKE $%P%)"
  );
});

// Replace %P% placeholders with 1-based param indices.
let paramIdx = 0;
const orSql = orClauses
  .map((clause) => clause.replace(/\$%P%/g, () => `$${++paramIdx}`))
  .join(" OR ");

const matchSql = `
  SELECT rr.id, rr.status, rr."resourceName", rr."createdAt",
         rd.name AS "requestingDept", ld.name AS "lendingDept"
  FROM "ResourceRequest" rr
  JOIN "Department" rd ON rd.id = rr."requestingDeptId"
  JOIN "Department" ld ON ld.id = rr."lendingDeptId"
  WHERE rr."createdAt" >= $${params.length + 1}
    AND rr."createdAt" < $${params.length + 2}
    AND (${orSql})
  ORDER BY rr."createdAt" ASC;
`;
params.push(new Date("2026-02-24T00:00:00+05:00"), new Date("2026-02-26T00:00:00+05:00"));

async function main() {
  const confirm = process.argv.includes("--confirm");
  console.log(
    confirm ? "MODE: DELETE (confirm)" : "MODE: DRY RUN (pass --confirm to actually delete)"
  );

  const { rows } = await pool.query(matchSql, params);

  console.log(`\nMatched ${rows.length} of ${targets.length} target(s):\n`);
  for (const r of rows) {
    console.log(
      `  [${r.status}] "${r.resourceName}"  ${r.requestingDept} -> ${r.lendingDept}  created=${r.createdAt.toISOString()}  id=${r.id}`
    );
  }

  if (rows.length === 0) {
    console.log("\nNothing matched. Dumping ALL ResourceRequest rows created Feb 24–25 2026 for inspection:\n");
    const dump = await pool.query(
      `SELECT rr.id, rr.status, rr."resourceName", rr."createdAt",
              rd.name AS "requestingDept", ld.name AS "lendingDept"
       FROM "ResourceRequest" rr
       JOIN "Department" rd ON rd.id = rr."requestingDeptId"
       JOIN "Department" ld ON ld.id = rr."lendingDeptId"
       WHERE rr."createdAt" >= $1 AND rr."createdAt" < $2
       ORDER BY rr."createdAt" ASC;`,
      [new Date("2026-02-24T00:00:00+05:00"), new Date("2026-02-26T00:00:00+05:00")]
    );
    for (const r of dump.rows) {
      console.log(
        `  [${r.status}] "${r.resourceName}"  ${r.requestingDept} -> ${r.lendingDept}  created=${r.createdAt.toISOString()}  id=${r.id}`
      );
    }
    return;
  }

  if (!confirm) {
    console.log("\nDry run only. Re-run with --confirm to delete the matched rows.");
    console.log("Note: RequestAuditLog cascades; Notification.requestId is set NULL.");
    return;
  }

  const ids = rows.map((r) => r.id);
  const del = await pool.query(
    `DELETE FROM "ResourceRequest" WHERE id = ANY($1::text[]) RETURNING id;`,
    [ids]
  );
  console.log(`\nDeleted ${del.rowCount} ResourceRequest row(s).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => pool.end());
