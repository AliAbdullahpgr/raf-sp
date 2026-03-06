"use client";

import { useEffect, useState } from "react";
import { getAllDepartmentsWithDetails } from "@/actions/super-admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Eye, BarChart3 } from "lucide-react";

export default function DepartmentPageViewsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [deptViewMap, setDeptViewMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDepartmentsWithDetails().then((result) => {
      if (result.success) {
        setDepartments(result.data.departments);
        setDeptViewMap(result.data.deptViewMap);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  const sortedDepts = [...departments].sort((a: any, b: any) => {
    return (deptViewMap[b.id] || 0) - (deptViewMap[a.id] || 0);
  });

  const maxViews = Math.max(...Object.values(deptViewMap), 1);
  const totalViews = Object.values(deptViewMap).reduce((sum, v) => sum + v, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Eye className="h-5 w-5 text-white" />
          </div>
          Dept Page Views
        </h1>
        <p className="text-gray-500 mt-1">
          Total page views tracked per department
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Departments Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Object.keys(deptViewMap).length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{departments.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Page Views by Department
          </CardTitle>
          <CardDescription>
            How many page views each department has received
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedDepts.map((dept: any, index: number) => {
              const views = deptViewMap[dept.id] || 0;
              const percentage = maxViews > 0 ? (views / maxViews) * 100 : 0;

              return (
                <div key={dept.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-5">
                        {index + 1}
                      </span>
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-800">
                        {dept.name}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-700 min-w-[60px] text-right">
                      {views.toLocaleString()} views
                    </span>
                  </div>
                  <div className="ml-8 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {sortedDepts.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No departments found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
