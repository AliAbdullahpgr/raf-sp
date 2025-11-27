import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("🔍 Checking database data...");

    // Get all departments
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
        location: true,
      },
    });
    console.log("🔍 Departments found:", departments);

    // Count equipment records
    const equipmentCount = await prisma.foodAnalysisLabEquipment.count();
    console.log("🔍 Equipment count:", equipmentCount);

    // Get sample equipment
    const sampleEquipment = await prisma.foodAnalysisLabEquipment.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        type: true,
        status: true,
        departmentId: true,
        labSectionName: true,
        roomNumber: true,
      },
    });
    console.log("🔍 Sample equipment:", sampleEquipment);

    // Check if Food Science department exists and get its equipment
    const foodScienceDept = departments.find(
      (d) =>
        d.name.toLowerCase().includes("food") ||
        d.name.toLowerCase().includes("science")
    );

    let foodScienceEquipment: any[] = [];
    if (foodScienceDept) {
      foodScienceEquipment = await prisma.foodAnalysisLabEquipment.findMany({
        where: { departmentId: foodScienceDept.id },
        take: 3,
      });
    }

    return NextResponse.json({
      success: true,
      departments,
      equipmentCount,
      sampleEquipment,
      foodScienceDept,
      foodScienceEquipment,
    });
  } catch (error) {
    console.error("Check data error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
