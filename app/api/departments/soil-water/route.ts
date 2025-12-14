import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const department = await prisma.department.findUnique({
      where: { id: "soil-water" },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    const assets = await prisma.soilWaterTestingProject.findMany({
      where: { departmentId: "soil-water" },
    });

    // Categorize data
    const budgetData = assets.filter((item) => item.type === "Budget");
    const budgetDetails = assets.filter((item) => item.type.startsWith("Budget Detail"));
    const allowances = assets.filter((item) => item.type === "Allowance A012-1");
    const contingent = assets.filter((item) => item.type === "Contingent A01277");
    const hrOfficers = assets.filter((item) => item.type === "HR - Officers");
    const hrOfficials = assets.filter((item) => item.type === "HR - Officials");
    const machinery = assets.filter((item) => item.type === "Machinery");
    const operatingCosts = assets.filter((item) =>
      ["Communication A032", "Utilities A033", "Occupancy A034", "Travel A038", "General A039"].includes(item.type)
    );
    const capitalCosts = assets.filter((item) =>
      ["Physical Assets A09", "Civil Work A12", "Repair & Maintenance A13"].includes(item.type)
    );
    const grandTotals = assets.filter((item) => item.type === "Grand Total");

    // Calculate statistics
    const totalBudget = budgetData.reduce((sum, item) => sum + (Number(item.budgetAllocationTotalMillion) || 0), 0);
    
    const totalOfficers = hrOfficers.reduce((sum, item) => sum + (item.quantityRequired || 0), 0);
    const totalOfficials = hrOfficials.reduce((sum, item) => sum + (item.quantityRequired || 0), 0);
    const totalHR = totalOfficers + totalOfficials;

    const totalMachinery = machinery.reduce((sum, item) => sum + (item.quantityRequired || 0), 0);

    return NextResponse.json({
      department,
      budgetData,
      budgetDetails,
      allowances,
      contingent,
      hrOfficers,
      hrOfficials,
      machinery,
      operatingCosts,
      capitalCosts,
      grandTotals,
      statistics: {
        totalBudget,
        totalHR,
        totalOfficers,
        totalOfficials,
        totalMachinery,
      },
    });
  } catch (error) {
    console.error("Error fetching Soil & Water data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
