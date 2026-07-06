"use client";

import { useCallback, useEffect, useState } from "react";
import { getSuperAdminOverview } from "@/actions/super-admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, BarChart3, RefreshCw } from "lucide-react";

type SuperAdminOverview = {
  totalDepartments: number;
  publicDeptViewMap: Record<string, number>;
  recentPageViewMap: Record<string, number>;
  slugNameMap: Record<string, string>;
};

export default function DepartmentPageViewsPage() {
  const [data, setData] = useState<SuperAdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    const result = await getSuperAdminOverview();
    if (result.success) setData(result.data as SuperAdminOverview);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="py-12 text-center text-red-500">Failed to load data</div>;
  }

  const sorted = Object.entries(data.publicDeptViewMap).sort(([, a], [, b]) => b - a);
  const maxViews = Math.max(...Object.values(data.publicDeptViewMap), 1);
  const totalViews = sorted.reduce((sum, [, views]) => sum + views, 0);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-950 lg:text-3xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950">
                <Eye className="h-5 w-5 text-white" />
              </div>
              Public Department Views
            </h1>
            <p className="mt-2 text-sm text-slate-500">Views on public /departments/[slug] pages - no login required</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchData(true)} disabled={refreshing} className="w-fit gap-2">
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-950">{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Departments w/ Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-950">{sorted.length}</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-950">{data.totalDepartments}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-950">
            <BarChart3 className="h-5 w-5 text-slate-500" />
            Views by Department
          </CardTitle>
          <CardDescription>Ranked by total public page views</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sorted.map(([slug, views], index) => {
              const name = data.slugNameMap[slug] || slug;
              const percentage = (views / maxViews) * 100;
              const recentViews = data.recentPageViewMap[`/departments/${slug}`] || 0;

              return (
                <div key={slug}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="w-5 shrink-0 text-xs font-bold text-slate-400">{index + 1}</span>
                      <span className="truncate font-medium text-slate-900">{name}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-4 text-sm">
                      {recentViews > 0 && <span className="text-xs font-medium text-blue-700">+{recentViews} today</span>}
                      <span className="min-w-[72px] text-right font-semibold text-slate-700">{views.toLocaleString()} views</span>
                    </div>
                  </div>
                  <div className="ml-8 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {sorted.length === 0 && <div className="py-8 text-center text-slate-400">No public page views yet</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
