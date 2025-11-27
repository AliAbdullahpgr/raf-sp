"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestQueryPage() {
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testQuery = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/test-equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          departmentId: "cmihhaye8000dxacmevew5glg",
        }),
      });

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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Test Equipment Query
        </h1>

        <Button onClick={testQuery} disabled={isLoading} className="mb-6">
          {isLoading ? "Testing..." : "Test Query"}
        </Button>

        {result && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Query Results</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
