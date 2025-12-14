import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const departmentId = "mnsuam";
  const departmentName = "MNS University of Agriculture";

  console.log(`Seeding ${departmentName} data...`);

  const department = await prisma.department.upsert({
    where: { id: departmentId },
    update: {
      name: departmentName,
      location: "Old Shujabad Road, Multan",
      description:
        "Vibrant agricultural university providing research-driven facilities, modern labs, and collaborative spaces for South Punjab Regional Agriculture Forum.",
      focalPerson: "Dr. Mahmood Alam",
      designation: "Directorate of University Farms",
      phone: "+92-61-9210071",
      email: "mahmood.alam@mnsuam.edu.pk",
    },
    create: {
      id: departmentId,
      name: departmentName,
      location: "Old Shujabad Road, Multan",
      description:
        "Vibrant agricultural university providing research-driven facilities, modern labs, and collaborative spaces for South Punjab Regional Agriculture Forum.",
      focalPerson: "Dr. Mahmood Alam",
      designation: "Directorate of University Farms",
      phone: "+92-61-9210071",
      email: "mahmood.alam@mnsuam.edu.pk",
    },
  });

  console.log("Department upserted:", department.name);

  await prisma.mNSUAMEstateFacilities.deleteMany({
    where: { departmentId: department.id },
  });
  await prisma.agronomyLabEquipment.deleteMany({
    where: { departmentId: department.id },
  });
  await prisma.valueAdditionLabEquipment.deleteMany({
    where: { departmentId: department.id },
  });
  console.log("Cleared existing estate facilities, agronomy equipment, and value addition lab equipment.");

  const facilityData = [
    {
      blockName: "Admin Block",
      name: "Syndicate Hall for meeting",
      facilityType: "Meeting Hall",
      capacityPersons: 50,
      capacityLabel: "50 persons",
      type: "Estate Facility",
      imageUrl: null,
      displayOrder: 1,
    },
    {
      blockName: "Admin Block",
      name: "Committee Room for meeting",
      facilityType: "Meeting Room",
      capacityPersons: 20,
      capacityLabel: "20 persons",
      type: "Estate Facility",
      imageUrl: null,
      displayOrder: 2,
    },
    {
      blockName: "Academic Block",
      name: "Lecture Hall 110",
      facilityType: "Lecture Hall",
      capacityPersons: 150,
      capacityLabel: "150 persons",
      type: "Estate Facility",
      imageUrl: null,
      displayOrder: 3,
    },
    {
      blockName: "Academic Block",
      name: "Lecture Hall 132",
      facilityType: "Lecture Hall",
      capacityPersons: 96,
      capacityLabel: "96 persons",
      type: "Estate Facility",
      imageUrl: null,
      displayOrder: 4,
    },
    {
      blockName: "Academic Block",
      name: "Computer Lab",
      facilityType: "Computer Lab",
      capacityPersons: null,
      capacityLabel: "05 Labs",
      type: "Estate Facility",
      imageUrl: null,
      displayOrder: 5,
    },
    {
      blockName: "S.T.I. Library",
      name: "Training Hall",
      facilityType: "Training Hall",
      capacityPersons: 40,
      capacityLabel: "40 persons (extendable to 80)",
      type: "Estate Facility",
      imageUrl: null,
      displayOrder: 6,
    },
    {
      blockName: "Genome Centre / UNESCO Chair",
      name: "Meeting Room",
      facilityType: "Meeting Room",
      capacityPersons: 15,
      capacityLabel: "15 persons",
      type: "Estate Facility",
      imageUrl: null,
      displayOrder: 7,
    },
    {
      blockName: "Graduate Block / A block",
      name: "Sybrid Hall for training",
      facilityType: "Training Hall",
      capacityPersons: 30,
      capacityLabel: "30 persons",
      type: "Estate Facility",
      imageUrl: null,
      displayOrder: 8,
    },
    {
      blockName: "Graduate Block / A block",
      name: "Executive Hall-I",
      facilityType: "Meeting Hall",
      capacityPersons: 35,
      capacityLabel: "35 persons",
      type: "Estate Facility",
      imageUrl: null,
      displayOrder: 9,
    },
    {
      blockName: "Graduate Block / A block",
      name: "Lecture Hall",
      facilityType: "Lecture Hall",
      capacityPersons: 35,
      capacityLabel: "35 persons",
      type: "Estate Facility",
      imageUrl: null,
      displayOrder: 10,
    },
    {
      blockName: "Graduate Block / A block",
      name: "ORIC Meeting Hall",
      facilityType: "Meeting Hall",
      capacityPersons: 30,
      capacityLabel: "30 persons",
      type: "Estate Facility",
      imageUrl: null,
      displayOrder: 11,
    },
    {
      blockName: "Graduate Block / A block",
      name: "QEC Meeting Hall",
      facilityType: "Meeting Hall",
      capacityPersons: 12,
      capacityLabel: "12 persons",
      type: "Estate Facility",
      imageUrl: null,
      displayOrder: 12,
    },
  ];

  await prisma.mNSUAMEstateFacilities.createMany({
    data: facilityData.map((facility, idx) => ({
      ...facility,
      displayOrder: facility.displayOrder ?? idx + 1,
      departmentId: department.id,
    })),
  });
  console.log(`Inserted ${facilityData.length} estate facilities.`);

  const agronomyEquipment = [
    { name: "Analytical Balance", quantity: 1, type: "Balances & Scales", displayOrder: 1 },
    { name: "Digital Balance", quantity: 3, type: "Balances & Scales", displayOrder: 2 },
    { name: "Top Loading Balance", quantity: 2, type: "Balances & Scales", displayOrder: 3 },
    { name: "Leaf Area Meter", quantity: 1, type: "Meters & Sensors", displayOrder: 4 },
    { name: "Flame Photometer", quantity: 1, type: "Analytical Instruments", displayOrder: 5 },
    { name: "SPAD", quantity: 1, type: "Meters & Sensors", displayOrder: 6 },
    { name: "pH Meter", quantity: 1, type: "Meters & Sensors", displayOrder: 7 },
    { name: "EC Meter", quantity: 1, type: "Meters & Sensors", displayOrder: 8 },
    { name: "Autoclave", quantity: 1, type: "Sterilization", displayOrder: 9 },
    { name: "Cooling Incubator", quantity: 1, type: "Incubation", displayOrder: 10 },
    { name: "Oven", quantity: 2, type: "Processing Equipment", displayOrder: 11 },
    { name: "Trinocular Microscope", quantity: 1, type: "Microscopy", displayOrder: 12 },
    { name: "Hot Plate & Magnetic Stirrer", quantity: 2, type: "Processing Equipment", displayOrder: 13 },
    { name: "Moisture Meter", quantity: 1, type: "Meters & Sensors", displayOrder: 14 },
    { name: "Water Distillation Unit", quantity: 1, type: "Water Systems", displayOrder: 15 },
    { name: "Water Bath", quantity: 1, type: "Processing Equipment", displayOrder: 16 },
    { name: "Mini Centrifuge Machine", quantity: 1, type: "Separation", displayOrder: 17 },
    { name: "Spectrophotometer", quantity: 1, type: "Analytical Instruments", displayOrder: 18 },
    { name: "Seed Grinder", quantity: 1, type: "Processing Equipment", displayOrder: 19 },
    { name: "Kjeldahl Apparatus", quantity: 1, type: "Analytical Instruments", displayOrder: 20 },
    { name: "Digital Vernier Caliper", quantity: 1, type: "Measurement Tools", displayOrder: 21 },
    { name: "Aquarium Pump", quantity: 2, type: "Support Equipment", displayOrder: 22 },
  ];

  await prisma.agronomyLabEquipment.createMany({
    data: agronomyEquipment.map((item, idx) => ({
      departmentId: department.id,
      name: item.name,
      type: item.type,
      quantity: item.quantity,
      displayOrder: item.displayOrder ?? idx + 1,
      focalPerson1: "Dr. Nabeel Ahmad Ikram",
    })),
  });
  console.log(`Inserted ${agronomyEquipment.length} agronomy equipment items.`);

  const valueAdditionEquipment = [
    // Value Addition and Food Analysis Lab - Room # 127 - Academic Block
    {
      name: "Kjeldahl Apparatus (Digestion & Distillation Unit)",
      type: "Analytical Equipment",
      labName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      blockName: "Academic Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 1,
    },
    {
      name: "Water Activity Meter",
      type: "Analytical Equipment",
      labName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      blockName: "Academic Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 2,
    },
    {
      name: "Soxhlet Apparatus",
      type: "Analytical Equipment",
      labName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      blockName: "Academic Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 3,
    },
    {
      name: "Analytical Weighing Balance",
      type: "Balances & Scales",
      labName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      blockName: "Academic Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 4,
    },
    {
      name: "Autoclave",
      type: "Sterilization",
      labName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      blockName: "Academic Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 5,
    },
    {
      name: "Texture Analyzer",
      type: "Analytical Equipment",
      labName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      blockName: "Academic Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 6,
    },
    {
      name: "Freeze Dryer",
      type: "Processing Equipment",
      labName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      blockName: "Academic Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 7,
    },
    {
      name: "Pulse Electric Field",
      type: "Processing Equipment",
      labName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      blockName: "Academic Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 8,
    },
    {
      name: "Ozonation Chamber",
      type: "Processing Equipment",
      labName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      blockName: "Academic Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 9,
    },
    {
      name: "Pasteurizer",
      type: "Processing Equipment",
      labName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      blockName: "Academic Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 10,
    },
    {
      name: "Fermenter",
      type: "Processing Equipment",
      labName: "Value Addition and Food Analysis Lab",
      roomNumber: "127",
      blockName: "Academic Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 11,
    },
    // Nutrient Analytical & Food Processing Lab - Room # 114-115 - Postgraduate Block
    {
      name: "Kjeldahl Apparatus",
      type: "Analytical Equipment",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 12,
    },
    {
      name: "Digestion Unit and Distillation Unit",
      type: "Analytical Equipment",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 13,
    },
    {
      name: "Moisture Analyzer",
      type: "Analytical Equipment",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 14,
    },
    {
      name: "Soxhlet Apparatus",
      type: "Analytical Equipment",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 15,
    },
    {
      name: "Analytical Weighing Balance",
      type: "Balances & Scales",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 16,
    },
    {
      name: "Muffle Furnace",
      type: "Heating Equipment",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 17,
    },
    {
      name: "Viscometer",
      type: "Analytical Equipment",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 18,
    },
    {
      name: "Farinograph",
      type: "Analytical Equipment",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 19,
    },
    {
      name: "Fume Hood",
      type: "Safety Equipment",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 20,
    },
    {
      name: "Desiccator",
      type: "Storage Equipment",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 21,
    },
    {
      name: "Gerber Machine",
      type: "Analytical Equipment",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 22,
    },
    {
      name: "Rose Head Machine",
      type: "Processing Equipment",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 23,
    },
    {
      name: "Abrasive Peeler",
      type: "Processing Equipment",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 24,
    },
    {
      name: "Refrigerator",
      type: "Storage Equipment",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 25,
    },
    {
      name: "China Chakki",
      type: "Processing Equipment",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 26,
    },
    {
      name: "Grinder",
      type: "Processing Equipment",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 27,
    },
    {
      name: "Cheese Press",
      type: "Processing Equipment",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 28,
    },
    {
      name: "Cheese Vat",
      type: "Processing Equipment",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 29,
    },
    {
      name: "Cream Separator",
      type: "Processing Equipment",
      labName: "Nutrient Analytical & Food Processing Lab",
      roomNumber: "114-115",
      blockName: "Postgraduate Block",
      quantity: 1,
      focalPerson: "Dr. Shabbir Ahmad",
      displayOrder: 30,
    },
  ];

  await prisma.valueAdditionLabEquipment.createMany({
    data: valueAdditionEquipment.map((item, idx) => ({
      departmentId: department.id,
      name: item.name,
      type: item.type,
      labName: item.labName,
      roomNumber: item.roomNumber,
      blockName: item.blockName,
      quantity: item.quantity,
      focalPerson: item.focalPerson,
      displayOrder: item.displayOrder ?? idx + 1,
    })),
  });
  console.log(`Inserted ${valueAdditionEquipment.length} value addition lab equipment items.`);

  console.log("Seeding completed for MNSUAM.");
}

main()
  .catch((error) => {
    console.error("Error seeding MNSUAM data:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
