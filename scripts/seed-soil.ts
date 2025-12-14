
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type AssetInput = {
  name: string;
  type: string;
  category?: string | null;
  bps?: number | null;
  quantityRequired?: number | null;
  budgetAllocationTotalMillion?: number | null;
  justificationOrYear?: string | null;
  departmentId: string;
};

const cleanText = (value: string) => value.replace(/\*\*/g, "").replace(/ƒ\?\"/g, "").trim();
const toNumber = (value: string) => parseFloat(value.replace(/[^\d.\-]/g, "")) || 0;

async function main() {
  const departmentId = "soil-water";
  const departmentName = "Soil & Water Testing Laboratory";

  console.log(`Seeding ${departmentName}...`);

  // 1. Clean up existing data
  const conflictingDept = await prisma.department.findFirst({
    where: {
      name: departmentName,
      NOT: { id: departmentId },
    },
  });

  if (conflictingDept) {
    console.log(`Found conflicting department: ${conflictingDept.name} (${conflictingDept.id}). Deleting...`);
    await prisma.department.delete({ where: { id: conflictingDept.id } });
  }

  await prisma.department.upsert({
    where: { id: departmentId },
    update: {
      name: departmentName,
      location: "Multan, Punjab",
      description:
        "Comprehensive soil and water analysis services providing critical data for agricultural research and farmer support across the region.",
      focalPerson: "Ms. Fatima Bibi",
      designation: "Principal Scientist",
      phone: "061-4423568",
      email: "swt_mltn@yahoo.com",
      logo: "/images/soil.png.jpg",
    },
    create: {
      id: departmentId,
      name: departmentName,
      location: "Multan, Punjab",
      description:
        "Comprehensive soil and water analysis services providing critical data for agricultural research and farmer support across the region.",
      focalPerson: "Ms. Fatima Bibi",
      designation: "Principal Scientist",
      phone: "061-4423568",
      email: "swt_mltn@yahoo.com",
      logo: "/images/soil.png.jpg",
    },
  });

  await prisma.soilWaterTestingProject.deleteMany({ where: { departmentId } });

  const dataPath = path.join(process.cwd(), "lib/data/soil.txt");
  const fileContent = fs.readFileSync(dataPath, "utf-8");
  const lines = fileContent.split("\n");

  let currentSection = "";
  const assetsToCreate: AssetInput[] = [];

  const isSeparator = (l: string) => l.replace(/[\|\-\s:]/g, "") === "";
  const getCells = (raw: string) =>
    raw
      .split("|")
      .map((c) => cleanText(c))
      .filter((c) => c.length > 0);

  const addAsset = (input: AssetInput) => assetsToCreate.push(input);

  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed || isSeparator(trimmed) || trimmed.startsWith("---")) continue;

    // Section detection
    if (trimmed.includes("Budget Summary of the Project")) {
      currentSection = "BUDGET";
      continue;
    }
    if (trimmed.includes("HR (Officers)")) {
      currentSection = "HR_OFFICERS";
      continue;
    }
    if (trimmed.includes("HR (Officials)")) {
      currentSection = "HR_OFFICIALS";
      continue;
    }
    if (trimmed.includes("Plant & Machinery")) {
      currentSection = "MACHINERY";
      continue;
    }
    if (trimmed.startsWith("## A011-1")) {
      currentSection = "A011-1";
      continue;
    }
    if (trimmed.startsWith("## A012-2")) {
      currentSection = "A012-2";
      continue;
    }
    if (trimmed.startsWith("## A012-1")) {
      currentSection = "A012-1";
      continue;
    }
    if (trimmed.startsWith("## A01277")) {
      currentSection = "A01277";
      continue;
    }
    if (trimmed.startsWith("## A032")) {
      currentSection = "A032";
      continue;
    }
    if (trimmed.startsWith("## A033")) {
      currentSection = "A033";
      continue;
    }
    if (trimmed.startsWith("## A034")) {
      currentSection = "A034";
      continue;
    }
    if (trimmed.startsWith("## A038")) {
      currentSection = "A038";
      continue;
    }
    if (trimmed.startsWith("## A039")) {
      currentSection = "A039";
      continue;
    }
    if (trimmed.startsWith("## A09")) {
      currentSection = "A09";
      continue;
    }
    if (trimmed.startsWith("## A12 ") || trimmed.startsWith("## A12 ƒ")) {
      currentSection = "A12";
      continue;
    }
    if (trimmed.startsWith("## A13")) {
      currentSection = "A13";
      continue;
    }
    if (trimmed.startsWith("## GRAND TOTAL")) {
      currentSection = "GRAND_TOTAL";
      continue;
    }

    if (currentSection === "") continue;
    if (trimmed.startsWith("| --")) continue;
    if (trimmed.toLowerCase().startsWith("| code") || trimmed.toLowerCase().startsWith("| description")) continue;
    if (trimmed.toLowerCase().startsWith("| #") || trimmed.toLowerCase().startsWith("| year")) continue;

    const cells = getCells(trimmed);
    if (!cells.length) continue;

    if (currentSection === "BUDGET") {
      if (cells.length >= 7) {
        addAsset({
          name: cells[1],
          type: "Budget",
          category: cells[0],
          budgetAllocationTotalMillion: toNumber(cells[6]),
          departmentId,
        });
      }
      continue;
    }

    if (currentSection === "HR_OFFICERS" || currentSection === "HR_OFFICIALS") {
      if (cells.length >= 4) {
        const name = cells[1];
        if (name.toLowerCase().startsWith("total")) continue;
        addAsset({
          name,
          type: currentSection === "HR_OFFICERS" ? "HR - Officers" : "HR - Officials",
          bps: parseInt(cells[2]),
          quantityRequired: parseInt(cells[3]),
          departmentId,
        });
      }
      continue;
    }

    if (currentSection === "MACHINERY") {
      if (cells.length >= 4) {
        addAsset({
          name: cells[1],
          type: "Machinery",
          quantityRequired: parseInt(cells[2]),
          justificationOrYear: cells[3],
          departmentId,
        });
      }
      continue;
    }

    if (currentSection === "A011-1" || currentSection === "A012-2") {
      if (cells.length >= 8) {
        const name = cells[0];
        if (name.toLowerCase().startsWith("total")) continue;
        addAsset({
          name,
          type: currentSection === "A011-1" ? "Budget Detail A011-1" : "Budget Detail A012-2",
          bps: parseInt(cells[1]) || null,
          quantityRequired: parseInt(cells[2]) || null,
          budgetAllocationTotalMillion: toNumber(cells[7]),
          departmentId,
        });
      }
      continue;
    }

    if (currentSection === "A012-1") {
      if (cells.length >= 5) {
        const code = cells[0] === "ƒ?" ? "N/A" : cells[0];
        addAsset({
          name: cells[1],
          type: "Allowance A012-1",
          category: code,
          budgetAllocationTotalMillion: toNumber(cells[cells.length - 1]),
          departmentId,
        });
      }
      continue;
    }

    if (currentSection === "A01277") {
      if (cells.length >= 4) {
        addAsset({
          name: "Contingent Paid Staff",
          type: "Contingent A01277",
          budgetAllocationTotalMillion: toNumber(cells[cells.length - 1]),
          quantityRequired: parseInt(cells[cells.length - 1]) || null,
          departmentId,
        });
      }
      continue;
    }

    if (["A032", "A033", "A034", "A038", "A039"].includes(currentSection)) {
      if (cells.length >= 5) {
        const name = cells[1];
        if (name.toLowerCase().startsWith("total")) {
          addAsset({
            name: `Total ${currentSection}`,
            type: sectionToType(currentSection),
            category: cells[0],
            budgetAllocationTotalMillion: toNumber(cells[cells.length - 1]),
            departmentId,
          });
        } else {
          addAsset({
            name,
            type: sectionToType(currentSection),
            category: cells[0],
            budgetAllocationTotalMillion: toNumber(cells[cells.length - 1]),
            departmentId,
          });
        }
      }
      continue;
    }

    if (currentSection === "A09") {
      if (cells.length >= 2) {
        addAsset({
          name: cells[0],
          type: "Physical Assets A09",
          budgetAllocationTotalMillion: toNumber(cells[1]),
          departmentId,
        });
      }
      continue;
    }

    if (currentSection === "A12") {
      if (cells.length >= 5) {
        addAsset({
          name: cells[0],
          type: "Civil Work A12",
          budgetAllocationTotalMillion: toNumber(cells[cells.length - 1]),
          departmentId,
        });
      }
      continue;
    }

    if (currentSection === "A13") {
      if (cells.length >= 5) {
        const name = cells[1] || cells[0];
        if (name.toLowerCase().startsWith("total")) {
          addAsset({
            name: "Total A13",
            type: "Repair & Maintenance A13",
            budgetAllocationTotalMillion: toNumber(cells[cells.length - 1]),
            departmentId,
          });
        } else {
          addAsset({
            name,
            type: "Repair & Maintenance A13",
            category: cells[0],
            budgetAllocationTotalMillion: toNumber(cells[cells.length - 1]),
            departmentId,
          });
        }
      }
      continue;
    }

    if (currentSection === "GRAND_TOTAL") {
      if (cells.length >= 2) {
        addAsset({
          name: cells[0],
          type: "Grand Total",
          budgetAllocationTotalMillion: toNumber(cells[1]),
          departmentId,
        });
      }
      continue;
    }
  }

  console.log(`Found ${assetsToCreate.length} items to seed.`);

  if (assetsToCreate.length > 0) {
    await prisma.soilWaterTestingProject.createMany({ data: assetsToCreate });
    console.log("Seeding completed successfully.");
  } else {
    console.log("No data found to seed.");
  }
}

function sectionToType(section: string) {
  switch (section) {
    case "A032":
      return "Communication A032";
    case "A033":
      return "Utilities A033";
    case "A034":
      return "Occupancy A034";
    case "A038":
      return "Travel A038";
    case "A039":
      return "General A039";
    default:
      return section;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
