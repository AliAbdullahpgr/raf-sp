-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DEPT_HEAD');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('AVAILABLE', 'IN_USE', 'NEEDS_REPAIR', 'DISCARDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'DEPT_HEAD',
    "departmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "designation" TEXT,
    "email" TEXT,
    "focalPerson" TEXT,
    "phone" TEXT,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceLog" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaintenanceLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AMRIInventory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT,
    "departmentId" TEXT NOT NULL,
    "assetCategory" TEXT,
    "itemDescription" TEXT,
    "quantityOrArea" TEXT,
    "functionalStatus" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "AMRIInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodAnalysisLabEquipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT,
    "departmentId" TEXT NOT NULL,
    "labSectionName" TEXT,
    "roomNumber" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "focalPerson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "FoodAnalysisLabEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MRIAssets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT,
    "departmentId" TEXT NOT NULL,
    "category" TEXT,
    "itemNameOrDesignation" TEXT,
    "bpsScale" INTEGER,
    "totalQuantityOrPosts" INTEGER,
    "filledOrFunctional" INTEGER,
    "vacantOrNonFunctional" INTEGER,
    "remarksOrLocation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "MRIAssets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgronomyLabEquipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT,
    "departmentId" TEXT NOT NULL,
    "quantity" INTEGER,
    "focalPerson1" TEXT,
    "displayOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "AgronomyLabEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloricultureStationAssets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT,
    "departmentId" TEXT NOT NULL,
    "category" TEXT,
    "itemNameOrPost" TEXT,
    "bpsScale" TEXT,
    "sanctionedQty" INTEGER,
    "inPositionQty" INTEGER,
    "detailsOrArea" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "FloricultureStationAssets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RARIBahawalpurAssets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT,
    "departmentId" TEXT NOT NULL,
    "category" TEXT,
    "makeModelYear" TEXT,
    "quantity" INTEGER,
    "conditionStatus" TEXT,
    "useApplication" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "RARIBahawalpurAssets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MNSUAMEstateFacilities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT,
    "departmentId" TEXT NOT NULL,
    "blockName" TEXT,
    "facilityType" TEXT,
    "capacityPersons" INTEGER,
    "capacityLabel" TEXT,
    "displayOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "MNSUAMEstateFacilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValueAdditionLabEquipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT,
    "departmentId" TEXT NOT NULL,
    "labName" TEXT,
    "roomNumber" TEXT,
    "blockName" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "focalPerson" TEXT,
    "displayOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "ValueAdditionLabEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CRIMultanAssets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT,
    "departmentId" TEXT NOT NULL,
    "makeModel" TEXT,
    "labDepartment" TEXT,
    "purposeFunction" TEXT,
    "year" TEXT,
    "location" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "operationalStatus" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "CRIMultanAssets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoilWaterTestingProject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT,
    "departmentId" TEXT NOT NULL,
    "category" TEXT,
    "bps" INTEGER,
    "quantityRequired" INTEGER,
    "budgetAllocationTotalMillion" DECIMAL(10,3),
    "justificationOrYear" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "SoilWaterTestingProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ERSSStockRegister" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT,
    "departmentId" TEXT NOT NULL,
    "quantityStr" TEXT,
    "dateReceived" TIMESTAMP(3),
    "lastVerificationDate" TEXT,
    "currentStatusRemarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "ERSSStockRegister_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PesticideQCLabData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',
    "imageUrl" TEXT,
    "departmentId" TEXT NOT NULL,
    "sectionCategory" TEXT,
    "bpsScale" INTEGER,
    "quantityOrSanctioned" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PesticideQCLabData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agri_Engineering_Multan_Region_Data" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',
    "imageUrl" TEXT,
    "departmentId" TEXT NOT NULL,
    "category" TEXT,
    "divisionOrCity" TEXT,
    "officeName" TEXT,
    "quantityOrArea" TEXT,
    "contactDetails" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agri_Engineering_Multan_Region_Data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RAEDCEquipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "imageUrl" TEXT,
    "departmentId" TEXT NOT NULL,
    "facilityType" TEXT,
    "capacity" INTEGER,
    "location" TEXT,
    "functionality" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "RAEDCEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_departmentId_idx" ON "User"("departmentId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE INDEX "Department_name_idx" ON "Department"("name");

-- CreateIndex
CREATE INDEX "Equipment_departmentId_idx" ON "Equipment"("departmentId");

-- CreateIndex
CREATE INDEX "Equipment_status_idx" ON "Equipment"("status");

-- CreateIndex
CREATE INDEX "Equipment_type_idx" ON "Equipment"("type");

-- CreateIndex
CREATE INDEX "MaintenanceLog_equipmentId_idx" ON "MaintenanceLog"("equipmentId");

-- CreateIndex
CREATE INDEX "MaintenanceLog_date_idx" ON "MaintenanceLog"("date");

-- CreateIndex
CREATE INDEX "AMRIInventory_departmentId_idx" ON "AMRIInventory"("departmentId");

-- CreateIndex
CREATE INDEX "AMRIInventory_status_idx" ON "AMRIInventory"("status");

-- CreateIndex
CREATE INDEX "FoodAnalysisLabEquipment_departmentId_idx" ON "FoodAnalysisLabEquipment"("departmentId");

-- CreateIndex
CREATE INDEX "FoodAnalysisLabEquipment_status_idx" ON "FoodAnalysisLabEquipment"("status");

-- CreateIndex
CREATE INDEX "MRIAssets_departmentId_idx" ON "MRIAssets"("departmentId");

-- CreateIndex
CREATE INDEX "MRIAssets_status_idx" ON "MRIAssets"("status");

-- CreateIndex
CREATE INDEX "AgronomyLabEquipment_departmentId_idx" ON "AgronomyLabEquipment"("departmentId");

-- CreateIndex
CREATE INDEX "AgronomyLabEquipment_status_idx" ON "AgronomyLabEquipment"("status");

-- CreateIndex
CREATE INDEX "FloricultureStationAssets_departmentId_idx" ON "FloricultureStationAssets"("departmentId");

-- CreateIndex
CREATE INDEX "FloricultureStationAssets_status_idx" ON "FloricultureStationAssets"("status");

-- CreateIndex
CREATE INDEX "RARIBahawalpurAssets_departmentId_idx" ON "RARIBahawalpurAssets"("departmentId");

-- CreateIndex
CREATE INDEX "RARIBahawalpurAssets_status_idx" ON "RARIBahawalpurAssets"("status");

-- CreateIndex
CREATE INDEX "MNSUAMEstateFacilities_departmentId_idx" ON "MNSUAMEstateFacilities"("departmentId");

-- CreateIndex
CREATE INDEX "MNSUAMEstateFacilities_status_idx" ON "MNSUAMEstateFacilities"("status");

-- CreateIndex
CREATE INDEX "ValueAdditionLabEquipment_departmentId_idx" ON "ValueAdditionLabEquipment"("departmentId");

-- CreateIndex
CREATE INDEX "ValueAdditionLabEquipment_status_idx" ON "ValueAdditionLabEquipment"("status");

-- CreateIndex
CREATE INDEX "CRIMultanAssets_departmentId_idx" ON "CRIMultanAssets"("departmentId");

-- CreateIndex
CREATE INDEX "CRIMultanAssets_status_idx" ON "CRIMultanAssets"("status");

-- CreateIndex
CREATE INDEX "CRIMultanAssets_type_idx" ON "CRIMultanAssets"("type");

-- CreateIndex
CREATE INDEX "SoilWaterTestingProject_departmentId_idx" ON "SoilWaterTestingProject"("departmentId");

-- CreateIndex
CREATE INDEX "SoilWaterTestingProject_status_idx" ON "SoilWaterTestingProject"("status");

-- CreateIndex
CREATE INDEX "ERSSStockRegister_departmentId_idx" ON "ERSSStockRegister"("departmentId");

-- CreateIndex
CREATE INDEX "ERSSStockRegister_status_idx" ON "ERSSStockRegister"("status");

-- CreateIndex
CREATE INDEX "PesticideQCLabData_departmentId_idx" ON "PesticideQCLabData"("departmentId");

-- CreateIndex
CREATE INDEX "PesticideQCLabData_status_idx" ON "PesticideQCLabData"("status");

-- CreateIndex
CREATE INDEX "Agri_Engineering_Multan_Region_Data_departmentId_idx" ON "Agri_Engineering_Multan_Region_Data"("departmentId");

-- CreateIndex
CREATE INDEX "Agri_Engineering_Multan_Region_Data_status_idx" ON "Agri_Engineering_Multan_Region_Data"("status");

-- CreateIndex
CREATE INDEX "RAEDCEquipment_departmentId_idx" ON "RAEDCEquipment"("departmentId");

-- CreateIndex
CREATE INDEX "RAEDCEquipment_status_idx" ON "RAEDCEquipment"("status");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AMRIInventory" ADD CONSTRAINT "AMRIInventory_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodAnalysisLabEquipment" ADD CONSTRAINT "FoodAnalysisLabEquipment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MRIAssets" ADD CONSTRAINT "MRIAssets_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgronomyLabEquipment" ADD CONSTRAINT "AgronomyLabEquipment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloricultureStationAssets" ADD CONSTRAINT "FloricultureStationAssets_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RARIBahawalpurAssets" ADD CONSTRAINT "RARIBahawalpurAssets_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MNSUAMEstateFacilities" ADD CONSTRAINT "MNSUAMEstateFacilities_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValueAdditionLabEquipment" ADD CONSTRAINT "ValueAdditionLabEquipment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CRIMultanAssets" ADD CONSTRAINT "CRIMultanAssets_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoilWaterTestingProject" ADD CONSTRAINT "SoilWaterTestingProject_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ERSSStockRegister" ADD CONSTRAINT "ERSSStockRegister_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PesticideQCLabData" ADD CONSTRAINT "PesticideQCLabData_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agri_Engineering_Multan_Region_Data" ADD CONSTRAINT "Agri_Engineering_Multan_Region_Data_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RAEDCEquipment" ADD CONSTRAINT "RAEDCEquipment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
