import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const department = await prisma.department.findUnique({
      where: { name: "Agricultural Extension Wing" },
      select: {
        id: true,
        name: true,
        location: true,
        description: true,
        focalPerson: true,
        designation: true,
        email: true,
        phone: true,
        logo: true,
      },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Agricultural Extension Wing department not found" },
        { status: 404 }
      );
    }

    const offices = await prisma.agriculturalExtensionWing.findMany({
      where: { departmentId: department.id },
      orderBy: { createdAt: "asc" },
    });

    // Group by status
    const statusGroups = offices.reduce(
      (acc, item) => {
        if (!acc[item.status]) {
          acc[item.status] = [];
        }
        acc[item.status].push(item);
        return acc;
      },
      {} as Record<string, typeof offices>
    );

    // Statistics
    const totalOffices = offices.length;
    const totalArea = offices.reduce((sum, item) => sum + (item.areaSquareFeet || 0), 0);
    const utilizedCount = offices.filter((item) => item.status === "Utilized").length;
    const unusedCount = offices.filter((item) => item.status === "Un used").length;

    return NextResponse.json({
      department,
      offices,
      stats: {
        totalOffices,
        totalArea,
        utilizedCount,
        unusedCount,
        utilizationPercentage: totalOffices > 0 
          ? ((utilizedCount / totalOffices) * 100).toFixed(1) 
          : "0",
      },
      groups: statusGroups,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: errorMessage, details: "Check server logs for more information" },
      { status: 500 }
    );
  }
}
