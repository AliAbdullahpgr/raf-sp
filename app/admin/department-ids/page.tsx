"use client";

import { useState, useEffect } from "react";
import { getDepartments } from "@/actions/department";

export default function DepartmentIdsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const result = await getDepartments();
        if (result.success && result.data) {
          setDepartments(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Department IDs
          </h1>
          <p>Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Department IDs
        </h1>
        <p className="text-gray-600 mb-6">
          Use these IDs when importing CSV data to Supabase:
        </p>

        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dept.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {dept.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dept.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {departments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No departments found.</p>
            <p className="text-sm text-gray-400">
              Create departments first by visiting{" "}
              <a
                href="/admin/seed-departments"
                className="text-blue-600 hover:underline"
              >
                /admin/seed-departments
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
