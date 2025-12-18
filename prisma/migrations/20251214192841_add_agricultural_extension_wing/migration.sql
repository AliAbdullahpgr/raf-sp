-- CreateTable
CREATE TABLE "AgriculturalExtensionWing" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "areaSquareFeet" INTEGER,
    "remarks" TEXT,
    "status" TEXT NOT NULL,
    "functionality" TEXT,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "equipmentStatus" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "AgriculturalExtensionWing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AgriculturalExtensionWing_departmentId_idx" ON "AgriculturalExtensionWing"("departmentId");

-- CreateIndex
CREATE INDEX "AgriculturalExtensionWing_equipmentStatus_idx" ON "AgriculturalExtensionWing"("equipmentStatus");

-- AddForeignKey
ALTER TABLE "AgriculturalExtensionWing" ADD CONSTRAINT "AgriculturalExtensionWing_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
