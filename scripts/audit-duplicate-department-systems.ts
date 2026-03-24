import "dotenv/config";
import { Pool } from "pg";
import type { PoolClient } from "pg";

type DepartmentRow = {
  id: string;
  name: string;
  location: string | null;
  focalPerson: string | null;
  designation: string | null;
  email: string | null;
};

type HeadRow = {
  id: string;
  name: string;
  email: string;
  departmentId: string | null;
};

type TableSource = {
  label: string;
  tableName: string;
  departmentColumn: string;
  family: "generic" | "specialized";
};

type RawEntoProfile = {
  department_id: string;
  department_name: string;
  location: string | null;
  focal_person: string | null;
  designation: string | null;
  email: string | null;
};

type TableUsage = {
  source: TableSource;
  countsByDepartment: Map<string, number>;
};

const TABLE_SOURCES: TableSource[] = [
  {
    label: "Equipment",
    tableName: "Equipment",
    departmentColumn: "departmentId",
    family: "generic",
  },
  {
    label: "AMRIInventory",
    tableName: "AMRIInventory",
    departmentColumn: "departmentId",
    family: "specialized",
  },
  {
    label: "FoodAnalysisLabEquipment",
    tableName: "FoodAnalysisLabEquipment",
    departmentColumn: "departmentId",
    family: "specialized",
  },
  {
    label: "MRIAssets",
    tableName: "MRIAssets",
    departmentColumn: "departmentId",
    family: "specialized",
  },
  {
    label: "AgronomyLabEquipment",
    tableName: "AgronomyLabEquipment",
    departmentColumn: "departmentId",
    family: "specialized",
  },
  {
    label: "FloricultureStationAssets",
    tableName: "FloricultureStationAssets",
    departmentColumn: "departmentId",
    family: "specialized",
  },
  {
    label: "RARIBahawalpurAssets",
    tableName: "RARIBahawalpurAssets",
    departmentColumn: "departmentId",
    family: "specialized",
  },
  {
    label: "MNSUAMEstateFacilities",
    tableName: "MNSUAMEstateFacilities",
    departmentColumn: "departmentId",
    family: "specialized",
  },
  {
    label: "ValueAdditionLabEquipment",
    tableName: "ValueAdditionLabEquipment",
    departmentColumn: "departmentId",
    family: "specialized",
  },
  {
    label: "CRIMultanAssets",
    tableName: "CRIMultanAssets",
    departmentColumn: "departmentId",
    family: "specialized",
  },
  {
    label: "SoilWaterTestingProject",
    tableName: "SoilWaterTestingProject",
    departmentColumn: "departmentId",
    family: "specialized",
  },
  {
    label: "ERSSStockRegister",
    tableName: "ERSSStockRegister",
    departmentColumn: "departmentId",
    family: "specialized",
  },
  {
    label: "PesticideQCLabData",
    tableName: "PesticideQCLabData",
    departmentColumn: "departmentId",
    family: "specialized",
  },
  {
    label: "AgriEngineeringMultanRegionData",
    tableName: "Agri_Engineering_Multan_Region_Data",
    departmentColumn: "departmentId",
    family: "specialized",
  },
  {
    label: "RAEDCEquipment",
    tableName: "RAEDCEquipment",
    departmentColumn: "departmentId",
    family: "specialized",
  },
  {
    label: "AgriculturalExtensionWing",
    tableName: "AgriculturalExtensionWing",
    departmentColumn: "departmentId",
    family: "specialized",
  },
  {
    label: "AdaptiveResearchPosition",
    tableName: "AdaptiveResearchPosition",
    departmentColumn: "departmentId",
    family: "specialized",
  },
];

function normalizeName(value: string | null | undefined): string {
  return (value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[()]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function formatHeads(heads: HeadRow[]): string {
  if (!heads.length) return "none";
  return heads.map((head) => `${head.name} <${head.email}>`).join(", ");
}

function formatCounts(entries: Array<[string, number]>): string {
  if (!entries.length) return "none";
  return entries.map(([label, count]) => `${label}:${count}`).join(", ");
}

async function tableExists(client: PoolClient, tableName: string): Promise<boolean> {
  const result = await client.query<{ exists: boolean }>(
    `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = $1
      ) AS exists
    `,
    [tableName]
  );

  return Boolean(result.rows[0]?.exists);
}

async function fetchDepartments(client: PoolClient): Promise<DepartmentRow[]> {
  const result = await client.query<DepartmentRow>(`
    SELECT
      id,
      name,
      location,
      "focalPerson",
      designation,
      email
    FROM "Department"
    ORDER BY name ASC
  `);

  return result.rows;
}

async function fetchDepartmentHeads(client: PoolClient): Promise<HeadRow[]> {
  const result = await client.query<HeadRow>(`
    SELECT
      id,
      name,
      email,
      "departmentId" AS "departmentId"
    FROM "User"
    WHERE role = 'DEPT_HEAD'
    ORDER BY "departmentId" ASC NULLS LAST, email ASC
  `);

  return result.rows;
}

async function fetchCountsByDepartment(
  client: PoolClient,
  source: TableSource
): Promise<Map<string, number>> {
  if (!(await tableExists(client, source.tableName))) {
    return new Map<string, number>();
  }

  const result = await client.query<{ departmentId: string; rowCount: string }>(`
    SELECT
      "${source.departmentColumn}"::text AS "departmentId",
      COUNT(*)::text AS "rowCount"
    FROM "${source.tableName}"
    GROUP BY "${source.departmentColumn}"
    ORDER BY "${source.departmentColumn}"::text ASC
  `);

  return new Map(
    result.rows.map((row) => [row.departmentId, Number(row.rowCount)])
  );
}

async function fetchRawEntoProfiles(client: PoolClient): Promise<RawEntoProfile[]> {
  if (!(await tableExists(client, "ento_profile"))) {
    return [];
  }

  const result = await client.query<RawEntoProfile>(`
    SELECT
      department_id,
      department_name,
      location,
      focal_person,
      designation,
      email
    FROM ento_profile
    ORDER BY department_id ASC
  `);

  return result.rows;
}

async function fetchRawEntoItemCount(client: PoolClient): Promise<number> {
  if (!(await tableExists(client, "ento_inventory_items"))) {
    return 0;
  }

  const result = await client.query<{ rowCount: string }>(`
    SELECT COUNT(*)::text AS "rowCount"
    FROM ento_inventory_items
  `);

  return Number(result.rows[0]?.rowCount || 0);
}

function findClosestDepartment(
  profile: RawEntoProfile,
  departments: DepartmentRow[]
): DepartmentRow | null {
  const profileId = profile.department_id;
  const exactId = departments.find((department) => department.id === profileId);
  if (exactId) return exactId;

  const profileName = normalizeName(profile.department_name);

  const exactName = departments.find(
    (department) => normalizeName(department.name) === profileName
  );
  if (exactName) return exactName;

  return (
    departments.find((department) => {
      const departmentName = normalizeName(department.name);
      return (
        departmentName.includes(profileName) || profileName.includes(departmentName)
      );
    }) || null
  );
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();

  try {
    await client.query("BEGIN READ ONLY");

    const [departments, heads, rawEntoProfiles, rawEntoItemCount] =
      await Promise.all([
        fetchDepartments(client),
        fetchDepartmentHeads(client),
        fetchRawEntoProfiles(client),
        fetchRawEntoItemCount(client),
      ]);

    const tableUsages: TableUsage[] = await Promise.all(
      TABLE_SOURCES.map(async (source) => ({
        source,
        countsByDepartment: await fetchCountsByDepartment(client, source),
      }))
    );

    const headsByDepartment = new Map<string, HeadRow[]>();
    for (const head of heads) {
      if (!head.departmentId) continue;
      const list = headsByDepartment.get(head.departmentId) || [];
      list.push(head);
      headsByDepartment.set(head.departmentId, list);
    }

    const departmentMap = new Map(
      departments.map((department) => [department.id, department])
    );

    const findings: string[] = [];

    for (const department of departments) {
      const departmentHeads = headsByDepartment.get(department.id) || [];

      if (departmentHeads.length > 1) {
        findings.push(
          `[MULTIPLE_DEPT_HEADS] ${department.id} (${department.name}) has ${departmentHeads.length} DEPT_HEAD users: ${formatHeads(
            departmentHeads
          )}`
        );
      }

      const genericEntries: Array<[string, number]> = [];
      const specializedEntries: Array<[string, number]> = [];

      for (const usage of tableUsages) {
        const count = usage.countsByDepartment.get(department.id) || 0;
        if (!count) continue;

        if (usage.source.family === "generic") {
          genericEntries.push([usage.source.label, count]);
        } else {
          specializedEntries.push([usage.source.label, count]);
        }
      }

      if (genericEntries.length > 0 && specializedEntries.length > 0) {
        findings.push(
          `[GENERIC_AND_SPECIALIZED] ${department.id} (${department.name}) has data in both generic and specialized systems. generic=${formatCounts(
            genericEntries
          )}; specialized=${formatCounts(specializedEntries)}; heads=${formatHeads(
            departmentHeads
          )}`
        );
      }

      if (departmentHeads.length === 0 && specializedEntries.length > 0) {
        findings.push(
          `[SPECIALIZED_WITHOUT_HEAD] ${department.id} (${department.name}) has specialized data but no DEPT_HEAD. specialized=${formatCounts(
            specializedEntries
          )}`
        );
      }
    }

    for (const usage of tableUsages.filter(
      (entry) => entry.source.family === "specialized"
    )) {
      const departmentsUsingTable = Array.from(usage.countsByDepartment.entries())
        .filter(([, count]) => count > 0)
        .map(([departmentId, count]) => {
          const department = departmentMap.get(departmentId);
          const departmentHeads = headsByDepartment.get(departmentId) || [];
          return {
            departmentId,
            departmentName: department?.name || "Unknown Department",
            count,
            headCount: departmentHeads.length,
            headSummary: formatHeads(departmentHeads),
          };
        });

      const departmentsWithHeads = departmentsUsingTable.filter(
        (entry) => entry.headCount > 0
      );

      if (departmentsWithHeads.length > 1) {
        findings.push(
          `[SHARED_SPECIALIZED_TABLE] ${usage.source.label} is used by multiple departments that have their own DEPT_HEADs: ${departmentsWithHeads
            .map(
              (entry) =>
                `${entry.departmentId} (${entry.departmentName}) rows=${entry.count} heads=${entry.headSummary}`
            )
            .join(" | ")}`
        );
      }
    }

    const normalizedNameMap = new Map<string, DepartmentRow[]>();
    for (const department of departments) {
      const key = normalizeName(department.name);
      const list = normalizedNameMap.get(key) || [];
      list.push(department);
      normalizedNameMap.set(key, list);
    }

    for (const [, matches] of normalizedNameMap) {
      if (matches.length > 1) {
        findings.push(
          `[SIMILAR_DEPARTMENT_NAMES] ${matches
            .map((department) => `${department.id} (${department.name})`)
            .join(" | ")}`
        );
      }
    }

    if (rawEntoProfiles.length > 0) {
      for (const profile of rawEntoProfiles) {
        const matchedDepartment = findClosestDepartment(profile, departments);
        const matchedHeads = matchedDepartment
          ? headsByDepartment.get(matchedDepartment.id) || []
          : [];
        const erssUsage = tableUsages.find(
          (usage) => usage.source.label === "ERSSStockRegister"
        );
        const erssCount =
          matchedDepartment && erssUsage
            ? erssUsage.countsByDepartment.get(matchedDepartment.id) || 0
            : 0;

        if (!matchedDepartment) {
          findings.push(
            `[RAW_PROFILE_WITHOUT_DEPARTMENT] ento_profile department_id=${profile.department_id} name="${profile.department_name}" has no matching Department row`
          );
          continue;
        }

        if (profile.department_id !== matchedDepartment.id) {
          findings.push(
            `[RAW_PROFILE_ALIAS_MISMATCH] ento_profile department_id=${profile.department_id} name="${profile.department_name}" appears to match Department.id=${matchedDepartment.id} (${matchedDepartment.name}); heads=${formatHeads(
              matchedHeads
            )}`
          );
        }

        if (rawEntoItemCount > 0 && erssCount > 0) {
          findings.push(
            `[RAW_AND_SPECIALIZED_ENTO] ento_inventory_items rows=${rawEntoItemCount} and ERSSStockRegister rows=${erssCount} both exist for Department.id=${matchedDepartment.id} (${matchedDepartment.name}); heads=${formatHeads(
              matchedHeads
            )}`
          );
        }
      }
    }

    console.log("Duplicate Department/Table Audit");
    console.log("===============================");
    console.log(`Departments: ${departments.length}`);
    console.log(`DEPT_HEAD users: ${heads.length}`);
    console.log("");

    console.log("Potential Findings");
    console.log("------------------");
    if (findings.length === 0) {
      console.log("No duplicate patterns were detected by the current checks.");
    } else {
      for (const finding of findings) {
        console.log(`- ${finding}`);
      }
    }

    console.log("");
    console.log("Department Coverage");
    console.log("-------------------");
    for (const department of departments) {
      const departmentHeads = headsByDepartment.get(department.id) || [];
      const tableEntries = tableUsages
        .map((usage) => [usage.source.label, usage.countsByDepartment.get(department.id) || 0] as const)
        .filter(([, count]) => count > 0);

      console.log(
        `- ${department.id} | ${department.name} | heads=${departmentHeads.length} | ${formatHeads(
          departmentHeads
        )}`
      );
      console.log(`  tables=${formatCounts(tableEntries.map(([label, count]) => [label, count]))}`);
    }

    console.log("");
    console.log("Shared Table Usage");
    console.log("------------------");
    for (const usage of tableUsages) {
      const departmentsUsingTable = Array.from(usage.countsByDepartment.entries())
        .filter(([, count]) => count > 0)
        .map(([departmentId, count]) => {
          const department = departmentMap.get(departmentId);
          const departmentHeads = headsByDepartment.get(departmentId) || [];
          return `${departmentId} (${department?.name || "Unknown Department"}, rows=${count}, heads=${departmentHeads.length})`;
        });

      if (!departmentsUsingTable.length) continue;

      console.log(`- ${usage.source.label} [${usage.source.family}]`);
      console.log(`  ${departmentsUsingTable.join(" | ")}`);
    }

    if (rawEntoProfiles.length > 0 || rawEntoItemCount > 0) {
      console.log("");
      console.log("Raw Entomology Tables");
      console.log("---------------------");
      for (const profile of rawEntoProfiles) {
        const matchedDepartment = findClosestDepartment(profile, departments);
        console.log(
          `- ento_profile department_id=${profile.department_id} name="${profile.department_name}" matchedDepartment=${
            matchedDepartment
              ? `${matchedDepartment.id} (${matchedDepartment.name})`
              : "none"
          }`
        );
      }
      console.log(`- ento_inventory_items rows=${rawEntoItemCount}`);
    }

    await client.query("ROLLBACK");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Audit failed:", error);
  process.exit(1);
});
