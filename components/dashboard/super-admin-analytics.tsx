"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, BarChart3, PieChart as PieChartIcon } from "lucide-react";

type ResourceTotals = {
  total: number;
  available: number;
  inUse: number;
  needsRepair: number;
  discarded: number;
};

type RequestTotals = {
  pending: number;
  approved: number;
  borrowed: number;
  overdue: number;
  returned: number;
  rejected: number;
  expired: number;
};

type SuperAdminAnalyticsProps = {
  resourceTotals: ResourceTotals;
  requestTotals: RequestTotals;
  totalPublicViews: number;
  totalAdminViews: number;
  strongestDepartments: Array<{ name: string; resources: { total: number } }>;
};

const RESOURCE_COLORS = ["#2678E7", "#10b981", "#f97316", "#ef4444"];
const REQUEST_COLORS = ["#94a3b8", "#0f172a", "#2678E7", "#f59e0b", "#10b981", "#ef4444"];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

function chartTooltipFormatter(value: number | string, name: string) {
  return [formatNumber(Number(value)), name];
}

export function SuperAdminAnalytics({
  resourceTotals,
  requestTotals,
  totalPublicViews,
  totalAdminViews,
  strongestDepartments,
}: SuperAdminAnalyticsProps) {
  const resourceData = [
    { name: "Available", value: resourceTotals.available },
    { name: "In Use", value: resourceTotals.inUse },
    { name: "Needs Repair", value: resourceTotals.needsRepair },
    { name: "Discarded", value: resourceTotals.discarded },
  ].filter((item) => item.value > 0);

  const requestData = [
    { name: "Pending", value: requestTotals.pending },
    { name: "Approved", value: requestTotals.approved },
    { name: "Borrowed", value: requestTotals.borrowed },
    { name: "Overdue", value: requestTotals.overdue },
    { name: "Returned", value: requestTotals.returned },
    { name: "Closed", value: requestTotals.rejected + requestTotals.expired },
  ];

  const departmentData = strongestDepartments.slice(0, 6).map((department) => ({
    name: department.name,
    total: department.resources.total,
  }));

  const totalTraffic = totalPublicViews + totalAdminViews;
  const availabilityShare = resourceTotals.total > 0 ? Math.round((resourceTotals.available / resourceTotals.total) * 100) : 0;

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-slate-950">
            <PieChartIcon className="h-5 w-5 text-slate-500" />
            Resource Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resourceData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={78}
                  outerRadius={112}
                  paddingAngle={3}
                >
                  {resourceData.map((entry, index) => (
                    <Cell key={entry.name} fill={RESOURCE_COLORS[index % RESOURCE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={chartTooltipFormatter} />
                <Legend verticalAlign="bottom" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-3xl font-bold text-slate-950">{availabilityShare}%</div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">Ready</div>
              <div className="mt-3 text-xs text-slate-400">{formatNumber(resourceTotals.total)} total assets</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-slate-950">
            <Activity className="h-5 w-5 text-slate-500" />
            Request Status Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestData} layout="vertical" margin={{ left: 8, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={92} tick={{ fill: "#475569", fontSize: 12 }} />
                <Tooltip formatter={chartTooltipFormatter} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                  {requestData.map((entry, index) => (
                    <Cell key={entry.name} fill={REQUEST_COLORS[index % REQUEST_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-slate-950">
            <BarChart3 className="h-5 w-5 text-slate-500" />
            Top Resource Hubs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Public views</div>
              <div className="mt-1 text-2xl font-bold text-slate-950">{formatNumber(totalPublicViews)}</div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Admin views</div>
              <div className="mt-1 text-2xl font-bold text-slate-950">{formatNumber(totalAdminViews)}</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Combined traffic</div>
              <div className="mt-1 text-2xl font-bold text-slate-950">{formatNumber(totalTraffic)}</div>
            </div>
          </div>
          <div className="h-[208px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ left: 0, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#475569", fontSize: 11 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={54}
                />
                <YAxis tick={{ fill: "#475569", fontSize: 12 }} />
                <Tooltip formatter={chartTooltipFormatter} />
                <Bar dataKey="total" fill="#2678E7" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}