import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { departmentId } = await request.json();

    console.log("🔍 Testing equipment query with departmentId:", departmentId);

    // Test 1: Check if table exists by counting all records
    const totalCount = await prisma.foodAnalysisLabEquipment.count();
    console.log("🔍 Total records in FoodAnalysisLabEquipment:", totalCount);

    // Test 2: Get all records (limit 5)
    const allRecords = await prisma.foodAnalysisLabEquipment.findMany({
      take: 5,
    });
    console.log("🔍 Sample records:", allRecords);

    // Test 3: Check records for specific department
    const deptRecords = await prisma.foodAnalysisLabEquipment.findMany({
      where: { departmentId },
      take: 5,
    });
    console.log("🔍 Department records:", deptRecords);

    // Test 4: Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });
    console.log("🔍 Department:", department);

    return NextResponse.json({
      success: true,
      totalCount,
      allRecords,
      deptRecords,
      department,
      departmentId,
    });
  } catch (error) {
    console.error("Test query error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
