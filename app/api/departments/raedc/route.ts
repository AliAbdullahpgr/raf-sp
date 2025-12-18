import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const department = await prisma.department.findUnique({
      where: { name: "RAEDC" },
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
        { error: "RAEDC department not found" },
        { status: 404 }
      );
    }

    const equipment = await prisma.rAEDCEquipment.findMany({
      where: { departmentId: department.id },
      orderBy: { createdAt: "asc" },
    });

    // Group by facility type
    const facilityTypeGroups = equipment.reduce(
      (acc, item) => {
        if (!acc[item.facilityType!]) {
          acc[item.facilityType!] = [];
        }
        acc[item.facilityType!].push(item);
        return acc;
      },
      {} as Record<string, typeof equipment>
    );

    // Statistics
    const totalFacilities = equipment.length;
    const totalCapacity = equipment.reduce((sum, item) => sum + (item.capacity || 0), 0);
    const operationalCount = equipment.filter(
      (item) => item.status === "AVAILABLE"
    ).length;
    const facilityTypeCount = Object.keys(facilityTypeGroups).length;

    // Prepare data for charts
    const facilityTypeDistribution = Object.entries(facilityTypeGroups).map(
      ([type, items]) => ({
        name: type,
        value: items.length,
        percentage: ((items.length / totalFacilities) * 100).toFixed(1),
      })
    );

    const capacityByFacility = Object.entries(facilityTypeGroups)
      .map(([type, items]) => ({
        name: type,
        capacity: items.reduce((sum, item) => sum + (item.capacity || 0), 0),
        count: items.length,
      }))
      .sort((a, b) => b.capacity - a.capacity);

    return NextResponse.json({
      department,
      equipment,
      stats: {
        totalFacilities,
        totalCapacity,
        operationalCount,
        facilityTypeCount,
        operationalPercentage: ((operationalCount / totalFacilities) * 100).toFixed(1),
      },
      charts: {
        facilityTypeDistribution,
        capacityByFacility,
      },
      budget: {
        year: "2024-25",
        development: {
          allocation: 64549.145,
          expenditure: 36758.311,
        },
        nonDevelopment: {
          allocation: 28770.73,
          expenditure: 25497.23,
        },
      },
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
