import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Checking equipment data...");

    // Get Food Science department
    const foodScienceDept = await prisma.department.findUnique({
      where: { name: "Food Science and Technology" },
    });

    if (!foodScienceDept) {
      return NextResponse.json({
        success: false,
        error: "Food Science department not found",
      });
    }

    // Check all equipment in FoodAnalysisLabEquipment table
    const allEquipment = await prisma.foodAnalysisLabEquipment.findMany();
    console.log("All equipment in table:", allEquipment.length);

    // Check equipment with correct departmentId
    const deptEquipment = await prisma.foodAnalysisLabEquipment.findMany({
      where: { departmentId: foodScienceDept.id },
    });
    console.log("Equipment with correct departmentId:", deptEquipment.length);

    // Check equipment with different departmentId
    const orphanEquipment = await prisma.foodAnalysisLabEquipment.findMany({
      where: {
        departmentId: { not: foodScienceDept.id },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        foodScienceDeptId: foodScienceDept.id,
        totalEquipment: allEquipment.length,
        correctDeptEquipment: deptEquipment.length,
        orphanEquipment: orphanEquipment.length,
        sampleEquipment: allEquipment.slice(0, 3).map((eq) => ({
          id: eq.id,
          name: eq.name,
          departmentId: eq.departmentId,
          type: eq.type,
          status: eq.status,
        })),
        orphanSample: orphanEquipment.slice(0, 3).map((eq) => ({
          id: eq.id,
          name: eq.name,
          departmentId: eq.departmentId,
          type: eq.type,
          status: eq.status,
        })),
      },
    });
  } catch (error) {
    console.error("Equipment check failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
