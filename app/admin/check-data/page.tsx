"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CheckDataPage() {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/check-data");
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Check Database Data
        </h1>

        <Button onClick={checkData} disabled={isLoading} className="mb-6">
          {isLoading ? "Checking..." : "Check Data"}
        </Button>

        {result && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Database Contents</h2>
            <div className="space-y-4">
              {result.departments && (
                <div>
                  <h3 className="font-semibold mb-2">Departments:</h3>
                  <div className="bg-gray-100 p-4 rounded text-sm">
                    {result.departments.map((dept: any) => (
                      <div key={dept.id} className="mb-2">
                        <strong>{dept.name}</strong> (ID: {dept.id})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.equipmentCount !== undefined && (
                <div>
                  <h3 className="font-semibold mb-2">Equipment Count:</h3>
                  <div className="bg-gray-100 p-4 rounded text-sm">
                    Total FoodAnalysisLabEquipment records:{" "}
                    {result.equipmentCount}
                  </div>
                </div>
              )}

              {result.sampleEquipment && (
                <div>
                  <h3 className="font-semibold mb-2">Sample Equipment:</h3>
                  <div className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    <pre>{JSON.stringify(result.sampleEquipment, null, 2)}</pre>
                  </div>
                </div>
              )}

              {result.error && (
                <div>
                  <h3 className="font-semibold mb-2 text-red-600">Error:</h3>
                  <div className="bg-red-100 p-4 rounded text-sm">
                    {result.error}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
