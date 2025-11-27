"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getDepartmentBySlug,
  getDepartmentEquipment,
} from "@/actions/department-equipment";

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDebug = async () => {
    setIsLoading(true);
    try {
      // Step 1: Get department info
      console.log("🔍 Step 1: Getting department by slug...");
      const deptResult = await getDepartmentBySlug("food-science-technology");
      console.log("Department result:", deptResult);

      if (!deptResult.success) {
        setDebugInfo({
          error: "Failed to get department",
          departmentResult: deptResult,
        });
        return;
      }

      const departmentId = deptResult.data.id;
      console.log("🔍 Step 2: Department ID found:", departmentId);

      // Step 2: Get equipment
      console.log("🔍 Step 3: Getting equipment...");
      const equipmentResult = await getDepartmentEquipment(
        departmentId,
        "FoodAnalysisLabEquipment"
      );
      console.log("Equipment result:", equipmentResult);

      setDebugInfo({
        department: deptResult.data,
        equipment: equipmentResult,
        departmentId: departmentId,
        tableType: "FoodAnalysisLabEquipment",
      });
    } catch (error) {
      console.error("Debug error:", error);
      setDebugInfo({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Debug Food Science Equipment
        </h1>

        <Button onClick={handleDebug} disabled={isLoading} className="mb-6">
          {isLoading ? "Debugging..." : "Run Debug"}
        </Button>

        {debugInfo && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Debug Results</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
