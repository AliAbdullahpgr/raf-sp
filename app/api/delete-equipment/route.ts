import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    console.log("Deleting all equipment data...");

    // Delete all equipment from FoodAnalysisLabEquipment table
    const deletedCount = await prisma.foodAnalysisLabEquipment.deleteMany({});

    console.log(`Deleted ${deletedCount.count} equipment records`);

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedCount.count} equipment records`,
      deletedCount: deletedCount.count,
    });
  } catch (error) {
    console.error("Equipment deletion failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Alternative: Delete equipment for a specific department
export async function POST(request: Request) {
  try {
    const { departmentId } = await request.json();

    if (!departmentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Department ID is required",
        },
        { status: 400 }
      );
    }

    console.log(`Deleting equipment for department: ${departmentId}`);

    const deletedCount = await prisma.foodAnalysisLabEquipment.deleteMany({
      where: { departmentId },
    });

    console.log(
      `Deleted ${deletedCount.count} equipment records for department ${departmentId}`
    );

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deletedCount.count} equipment records for the department`,
      deletedCount: deletedCount.count,
      departmentId,
    });
  } catch (error) {
    console.error("Equipment deletion failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
