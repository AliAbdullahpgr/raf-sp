"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Bar,
    BarChart,
    Cell,
    LabelList,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Activity, PieChart as PieChartIcon } from "lucide-react";
import type { ReactNode } from "react";

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
};

const RESOURCE_PALETTE: Record<string, string> = {
    Available: "#10b981",
    "In Use": "#3b82f6",
    "Needs Repair": "#f59e0b",
    Discarded: "#94a3b8",
};

const REQUEST_PALETTE: Record<string, string> = {
    Pending: "#f59e0b",
    Approved: "#3b82f6",
    Borrowed: "#6366f1",
    Overdue: "#ef4444",
    Returned: "#10b981",
    "Not approved": "#94a3b8",
};

const FLOW_GRADIENT_FROM = "#2563eb";
const FLOW_GRADIENT_TO = "#60a5fa";

const ANIMATION = {
    isAnimationActive: true,
    animationDuration: 900,
    animationEasing: "ease-out" as const,
};

function formatNumber(value: number) {
    return new Intl.NumberFormat("en").format(value);
}

type TooltipProps = {
    active?: boolean;
    payload?: Array<{
        name?: string;
        value?: number | string;
        color?: string;
    }>;
    label?: string;
};

function Panel({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg shadow-slate-900/5 backdrop-blur">
            {children}
        </div>
    );
}

function GenericTooltip({ active, payload, label }: TooltipProps) {
    if (!active || !payload?.length) return null;
    return (
        <Panel>
            <div className="text-xs font-semibold text-slate-950">{label}</div>
            <div className="mt-1.5 space-y-1">
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                        <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-slate-600">{entry.name}</span>
                        <span className="ml-auto font-semibold text-slate-950">
                            {formatNumber(Number(entry.value))}
                        </span>
                    </div>
                ))}
            </div>
        </Panel>
    );
}

export function SuperAdminAnalytics({
    resourceTotals,
    requestTotals,
}: SuperAdminAnalyticsProps) {
    const resourceData = [
        { name: "Available", value: resourceTotals.available },
        { name: "In Use", value: resourceTotals.inUse },
        { name: "Needs Repair", value: resourceTotals.needsRepair },
        { name: "Discarded", value: resourceTotals.discarded },
    ]
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value);

    const requestData = [
        { name: "Pending", value: requestTotals.pending },
        { name: "Approved", value: requestTotals.approved },
        { name: "Borrowed", value: requestTotals.borrowed },
        { name: "Overdue", value: requestTotals.overdue },
        { name: "Returned", value: requestTotals.returned },
        { name: "Not approved", value: requestTotals.rejected + requestTotals.expired },
    ].sort((a, b) => b.value - a.value);

    const availabilityShare =
        resourceTotals.total > 0 ? Math.round((resourceTotals.available / resourceTotals.total) * 100) : 0;

    const totalRequests = requestData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            {/* Resource Health donut */}
            <Card className="overflow-hidden border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base text-slate-950">
                        <PieChartIcon className="h-5 w-5 text-slate-500" />
                        Resource Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {resourceData.length === 0 ? (
                            <div className="flex h-[300px] items-center justify-center text-sm text-slate-500">
                                No resource records
                            </div>
                        ) : (
                            <div className="relative h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <defs>
                                            {resourceData.map((entry) => (
                                                <linearGradient
                                                    id={`grad-${entry.name.replace(/\s+/g, "-").toLowerCase()}`}
                                                    key={entry.name}
                                                    x1="0"
                                                    y1="0"
                                                    x2="1"
                                                    y2="1"
                                                >
                                                    <stop offset="0%" stopColor={RESOURCE_PALETTE[entry.name]} stopOpacity={0.95} />
                                                    <stop offset="100%" stopColor={RESOURCE_PALETTE[entry.name]} stopOpacity={0.7} />
                                                </linearGradient>
                                            ))}
                                        </defs>
                                        <Pie
                                            data={resourceData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={80}
                                            outerRadius={116}
                                            cornerRadius={6}
                                            paddingAngle={2}
                                            startAngle={90}
                                            endAngle={-270}
                                            {...ANIMATION}
                                        >
                                            {resourceData.map((entry) => (
                                                <Cell
                                                    key={entry.name}
                                                    fill={`url(#grad-${entry.name.replace(/\s+/g, "-").toLowerCase()})`}
                                                    stroke="#ffffff"
                                                    strokeWidth={2}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<GenericTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <div className="text-4xl font-bold tracking-tight text-slate-950">
                                        {availabilityShare}%
                                    </div>
                                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                                        Ready
                                    </div>
                                    <div className="mt-2 text-xs text-slate-400">
                                        of {formatNumber(resourceTotals.total)} assets
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Custom legend with counts */}
                        {resourceData.length > 0 && (
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3">
                                {resourceData.map((entry) => (
                                    <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                                        <span
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{ backgroundColor: RESOURCE_PALETTE[entry.name] }}
                                        />
                                        <span className="text-slate-600">{entry.name}</span>
                                        <span className="font-semibold text-slate-950">
                                            {formatNumber(entry.value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Request status horizontal bars */}
                <Card className="overflow-hidden border-slate-200 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between gap-2 text-base text-slate-950">
                            <span className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-slate-500" />
                                Request Status
                            </span>
                            <span className="text-xs font-normal text-slate-500">
                                {formatNumber(totalRequests)} total
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={requestData}
                                    layout="vertical"
                                    margin={{ left: 4, right: 28, top: 4, bottom: 4 }}
                                    barCategoryGap={8}
                                >
                                    <defs>
                                        {requestData.map((entry) => (
                                            <linearGradient
                                                id={`rgrad-${entry.name.replace(/\s+/g, "-").toLowerCase()}`}
                                                key={entry.name}
                                                x1="0"
                                                y1="0"
                                                x2="1"
                                                y2="0"
                                            >
                                                <stop offset="0%" stopColor={REQUEST_PALETTE[entry.name]} stopOpacity={0.65} />
                                                <stop offset="100%" stopColor={REQUEST_PALETTE[entry.name]} stopOpacity={1} />
                                            </linearGradient>
                                        ))}
                                    </defs>
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={92}
                                        tick={{ fill: "#475569", fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip content={<GenericTooltip />} cursor={{ fill: "#f1f5f9" }} />
                                    <Bar dataKey="value" radius={[0, 8, 8, 0]} {...ANIMATION}>
                                        {requestData.map((entry) => (
                                            <Cell
                                                key={entry.name}
                                                fill={`url(#rgrad-${entry.name.replace(/\s+/g, "-").toLowerCase()})`}
                                            />
                                        ))}
                                    </Bar>
                                    <LabelList
                                        dataKey="value"
                                        position="right"
                                        formatter={(value) => formatNumber(Number(value))}
                                        style={{ fill: "#0f172a", fontSize: 12, fontWeight: 600 }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
        </div>
    );
}
