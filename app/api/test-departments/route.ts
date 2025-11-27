import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Testing database connection...");

    // Check departments
    const departments = await prisma.department.findMany();
    console.log("Found departments:", departments.length);

    // Check for Food Science and Technology specifically
    const foodScienceDept = await prisma.department.findUnique({
      where: { name: "Food Science and Technology" },
    });

    let equipmentCount = 0;
    if (foodScienceDept) {
      console.log("Food Science department found:", foodScienceDept.id);

      // Check for equipment in this department
      const equipment = await prisma.foodAnalysisLabEquipment.findMany({
        where: { departmentId: foodScienceDept.id },
      });
      equipmentCount = equipment.length;
      console.log("Equipment in Food Science dept:", equipmentCount);
    }

    return NextResponse.json({
      success: true,
      data: {
        totalDepartments: departments.length,
        departments: departments.map((d) => ({ id: d.id, name: d.name })),
        foodScienceDept: foodScienceDept
          ? {
              id: foodScienceDept.id,
              name: foodScienceDept.name,
              equipmentCount,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Database test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
