"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { getInterDepartmentRequestDetail } from "@/actions/super-admin";
import { ArrowRight, Loader2, Network, Grid3x3 } from "lucide-react";

type Pair = {
    requestingDept: string;
    lendingDept: string;
    requestingCatalogId: string;
    lendingCatalogId: string;
    total: number;
    PENDING: number;
    APPROVED: number;
    REJECTED: number;
    EXPIRED: number;
    BORROWED: number;
    RETURNED: number;
    OVERDUE: number;
};

type Bucket = {
    key: string;
    label: string;
    color: string;
};

const BUCKETS: Bucket[] = [
    { key: "PENDING", label: "Pending", color: "#f59e0b" },
    { key: "APPROVED", label: "Approved", color: "#3b82f6" },
    { key: "BORROWED", label: "Borrowed", color: "#6366f1" },
    { key: "OVERDUE", label: "Overdue", color: "#ef4444" },
    { key: "RETURNED", label: "Returned", color: "#10b981" },
    { key: "NOT_APPROVED", label: "Not approved", color: "#94a3b8" },
];

function bucketValue(p: Pair, key: string): number {
    if (key === "NOT_APPROVED") return p.REJECTED + p.EXPIRED;
    return p[key as keyof Pair] as number;
}

function dominantBucket(p: Pair): Bucket {
    let best = BUCKETS[0];
    let bestVal = -1;
    for (const b of BUCKETS) {
        const v = bucketValue(p, b.key);
        if (v > bestVal) {
            bestVal = v;
            best = b;
        }
    }
    return best;
}

function statusBucket(status: string): Bucket {
    if (status === "REJECTED" || status === "EXPIRED") {
        return BUCKETS.find((b) => b.key === "NOT_APPROVED")!;
    }
    return BUCKETS.find((b) => b.key === status) ?? BUCKETS[0];
}

function formatNumber(value: number) {
    return new Intl.NumberFormat("en").format(value);
}

function formatDate(value: string | Date) {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

function wrapText(text: string, maxChars: number): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let cur = "";
    for (const w of words) {
        const candidate = cur ? `${cur} ${w}` : w;
        if (candidate.length <= maxChars) cur = candidate;
        else {
            if (cur) lines.push(cur);
            cur = w;
        }
    }
    if (cur) lines.push(cur);
    return lines.length ? lines : [text];
}

type Selection = {
    requestingCatalogId: string;
    lendingCatalogId: string;
    requestingDept: string;
    lendingDept: string;
};

export function SuperAdminRequestFlow({ pairs }: { pairs: Pair[] }) {
    const [view, setView] = useState<"map" | "matrix">("matrix");
    const [selection, setSelection] = useState<Selection | null>(null);

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="flex items-center gap-2 text-base text-slate-950">
                        <Network className="h-5 w-5 text-slate-500" />
                        Inter-Department Request Flow
                    </span>
                    <Tabs value={view} onValueChange={(v) => setView(v as "map" | "matrix")}>
                        <TabsList className="grid h-auto grid-cols-2 bg-slate-100 p-1">
                            <TabsTrigger value="map" className="gap-1.5 px-3 text-xs">
                                <Network className="h-3.5 w-3.5" />
                                Flow Map
                            </TabsTrigger>
                            <TabsTrigger value="matrix" className="gap-1.5 px-3 text-xs">
                                <Grid3x3 className="h-3.5 w-3.5" />
                                Matrix
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {pairs.length === 0 ? (
                    <div className="py-12 text-center text-sm text-slate-500">
                        No inter-department requests yet
                    </div>
                ) : view === "map" ? (
                    <FlowMap pairs={pairs} onSelect={setSelection} />
                ) : (
                    <Matrix pairs={pairs} onSelect={setSelection} />
                )}
            </CardContent>
            <DrillDownDialog selection={selection} onClose={() => setSelection(null)} />
        </Card>
    );
}

/* ---------------------------------- Flow Map --------------------------------- */

function FlowMap({ pairs, onSelect }: { pairs: Pair[]; onSelect: (s: Selection) => void }) {
    const [hoveredEdge, setHoveredEdge] = useState<number | null>(null);
    const [focusedNode, setFocusedNode] = useState<string | null>(null);

    const nodeMap = new Map<string, { id: string; name: string; activity: number }>();
    for (const p of pairs) {
        const r = nodeMap.get(p.requestingCatalogId) ?? {
            id: p.requestingCatalogId,
            name: p.requestingDept,
            activity: 0,
        };
        r.activity += p.total;
        nodeMap.set(p.requestingCatalogId, r);
        const l = nodeMap.get(p.lendingCatalogId) ?? {
            id: p.lendingCatalogId,
            name: p.lendingDept,
            activity: 0,
        };
        l.activity += p.total;
        nodeMap.set(p.lendingCatalogId, l);
    }
    const nodes = Array.from(nodeMap.values()).sort((a, b) => b.activity - a.activity);
    const nodeIndex = new Map(nodes.map((n, i) => [n.id, i]));
    const maxActivity = nodes[0]?.activity ?? 1;

    const W = 640;
    const H = 640;
    const cx = W / 2;
    const cy = H / 2;
    const R = nodes.length === 1 ? 0 : 190;
    const nodeRadius = (activity: number) =>
        6 + (Math.sqrt(activity) / Math.sqrt(maxActivity)) * 7;

    const pointFor = (i: number) => {
        if (nodes.length === 1) return { x: cx, y: cy };
        const angle = -Math.PI / 2 + (2 * Math.PI * i) / nodes.length;
        return { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) };
    };

    const maxTotal = Math.max(...pairs.map((p) => p.total), 1);
    const edgeThickness = (total: number) =>
        1.5 + (Math.sqrt(total) / Math.sqrt(maxTotal)) * 5;

    const buildPath = (p: Pair) => {
        const a = pointFor(nodeIndex.get(p.requestingCatalogId)!)!;
        const b = pointFor(nodeIndex.get(p.lendingCatalogId)!)!;
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        let ctrl = { x: mid.x + (cx - mid.x) * 0.34, y: mid.y + (cy - mid.y) * 0.34 };
        const reciprocal = pairs.some(
            (pp) =>
                pp.requestingCatalogId === p.lendingCatalogId &&
                pp.lendingCatalogId === p.requestingCatalogId
        );
        if (reciprocal) {
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const len = Math.hypot(dx, dy) || 1;
            const nx = -dy / len;
            const ny = dx / len;
            ctrl = { x: ctrl.x + nx * 12, y: ctrl.y + ny * 12 };
        }
        const rA = nodeRadius(nodes[nodeIndex.get(p.requestingCatalogId)!]!.activity);
        const rB = nodeRadius(nodes[nodeIndex.get(p.lendingCatalogId)!]!.activity);
        const startDir = { x: ctrl.x - a.x, y: ctrl.y - a.y };
        const startLen = Math.hypot(startDir.x, startDir.y) || 1;
        const start = {
            x: a.x + (startDir.x / startLen) * (rA + 3),
            y: a.y + (startDir.y / startLen) * (rA + 3),
        };
        const endDir = { x: b.x - ctrl.x, y: b.y - ctrl.y };
        const endLen = Math.hypot(endDir.x, endDir.y) || 1;
        const end = {
            x: b.x - (endDir.x / endLen) * (rB + 6),
            y: b.y - (endDir.y / endLen) * (rB + 6),
        };
        return `M ${start.x} ${start.y} Q ${ctrl.x} ${ctrl.y} ${end.x} ${end.y}`;
    };

    const hoveredPair = hoveredEdge != null ? pairs[hoveredEdge] : null;
    const focusedActive =
        focusedNode != null ? pairs.filter((p) => p.requestingCatalogId === focusedNode || p.lendingCatalogId === focusedNode) : [];

    const isEdgeDimmed = (p: Pair, i: number) => {
        if (hoveredEdge != null && hoveredEdge !== i) return true;
        if (focusedNode != null && p.requestingCatalogId !== focusedNode && p.lendingCatalogId !== focusedNode)
            return true;
        return false;
    };

    return (
        <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative min-w-0 flex-1">
                <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Inter-department request flow map">
                    <defs>
                        {BUCKETS.map((b) => (
                            <marker
                                key={b.key}
                                id={`arrow-${b.key}`}
                                viewBox="0 0 10 10"
                                refX="8"
                                refY="5"
                                markerWidth="5"
                                markerHeight="5"
                                orient="auto"
                            >
                                <path d="M 0 0 L 10 5 L 0 10 z" fill={b.color} />
                            </marker>
                        ))}
                    </defs>

                    {pairs.map((p, i) => {
                        const d = buildPath(p);
                        const dom = dominantBucket(p);
                        const dimmed = isEdgeDimmed(p, i);
                        const isHovered = hoveredEdge === i;
                        return (
                            <g key={i} className="cursor-pointer">
                                <path
                                    d={d}
                                    fill="none"
                                    stroke="transparent"
                                    strokeWidth={Math.max(edgeThickness(p.total), 10)}
                                    onMouseEnter={() => setHoveredEdge(i)}
                                    onMouseLeave={() => setHoveredEdge(null)}
                                    onClick={() =>
                                        onSelect({
                                            requestingCatalogId: p.requestingCatalogId,
                                            lendingCatalogId: p.lendingCatalogId,
                                            requestingDept: p.requestingDept,
                                            lendingDept: p.lendingDept,
                                        })
                                    }
                                />
                                <path
                                    d={d}
                                    fill="none"
                                    stroke={dom.color}
                                    strokeWidth={edgeThickness(p.total)}
                                    strokeOpacity={dimmed ? 0.12 : isHovered ? 1 : 0.75}
                                    markerEnd={`url(#arrow-${dom.key})`}
                                    style={{ transition: "stroke-opacity 200ms ease" }}
                                    pointerEvents="none"
                                />
                            </g>
                        );
                    })}

                    {nodes.map((n, i) => {
                        const pos = pointFor(i);
                        const r = nodeRadius(n.activity);
                        const isFocused = focusedNode === n.id;
                        const dimmed =
                            focusedNode != null && !isFocused && !focusedActive.some((p) => p.requestingCatalogId === n.id || p.lendingCatalogId === n.id);
                        const angle =
                            nodes.length === 1 ? -Math.PI / 2 : -Math.PI / 2 + (2 * Math.PI * i) / nodes.length;
                        const cosA = Math.cos(angle);
                        const sinA = Math.sin(angle);
                        const labelX = cx + (R + 16) * cosA;
                        const labelY = cy + (R + 16) * sinA;
                        const anchor = cosA > 0.15 ? "start" : cosA < -0.15 ? "end" : "middle";
                        const lines = wrapText(n.name, 16);
                        const startLineY =
                            sinA < -0.5
                                ? labelY - (lines.length - 1) * 12
                                : sinA > 0.5
                                  ? labelY
                                  : labelY - ((lines.length - 1) * 12) / 2;
                        return (
                            <g
                                key={n.id}
                                className="cursor-pointer"
                                onClick={() => setFocusedNode(isFocused ? null : n.id)}
                                style={{ opacity: dimmed ? 0.35 : 1, transition: "opacity 200ms ease" }}
                            >
                                <circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r={r}
                                    fill={isFocused ? "#0f172a" : "#ffffff"}
                                    stroke={isFocused ? "#0f172a" : "#cbd5e1"}
                                    strokeWidth={isFocused ? 2 : 1.5}
                                />
                                <text
                                    textAnchor={anchor}
                                    fontSize={10}
                                    fontWeight={600}
                                    fill={isFocused ? "#0f172a" : "#475569"}
                                    pointerEvents="none"
                                >
                                    {lines.map((ln, idx) => (
                                        <tspan key={idx} x={labelX} y={startLineY + idx * 12}>
                                            {ln}
                                        </tspan>
                                    ))}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="flex shrink-0 flex-col gap-4 lg:w-60">
                <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
                        {BUCKETS.map((b) => (
                            <div key={b.key} className="flex items-center gap-1.5 text-xs">
                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: b.color }}
                                />
                                <span className="text-slate-600">{b.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
                    {hoveredPair ? (
                        <>
                            <div className="flex items-center gap-1.5 font-semibold text-slate-950">
                                <span className="truncate" title={hoveredPair.requestingDept}>{hoveredPair.requestingDept}</span>
                                <ArrowRight className="h-3 w-3 shrink-0 text-slate-400" />
                                <span className="truncate" title={hoveredPair.lendingDept}>{hoveredPair.lendingDept}</span>
                            </div>
                            <div className="mt-1 text-slate-500">
                                {formatNumber(hoveredPair.total)} request{hoveredPair.total === 1 ? "" : "s"}
                            </div>
                            <div className="mt-2 space-y-1">
                                {BUCKETS.map((b) => {
                                    const v = bucketValue(hoveredPair, b.key);
                                    if (v === 0) return null;
                                    return (
                                        <div key={b.key} className="flex items-center gap-2">
                                            <span
                                                className="h-2 w-2 rounded-full"
                                                style={{ backgroundColor: b.color }}
                                            />
                                            <span className="text-slate-600">{b.label}</span>
                                            <span className="ml-auto font-semibold text-slate-950">
                                                {formatNumber(v)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-2 text-[11px] text-slate-400">Click to view assets</div>
                        </>
                    ) : (
                        <div className="text-slate-500">
                            {focusedNode
                                ? `Showing flows for ${nodes.find((n) => n.id === focusedNode)?.name ?? ""}. Click the node again to clear.`
                                : "Hover an edge to see a pair's breakdown. Click a node to focus its flows."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------ Matrix ---------------------------------- */

function Matrix({ pairs, onSelect }: { pairs: Pair[]; onSelect: (s: Selection) => void }) {
    const [hovered, setHovered] = useState<string | null>(null);

    const activityFor = (id: string) =>
        pairs.filter((p) => p.requestingCatalogId === id || p.lendingCatalogId === id)
            .reduce((sum, p) => sum + p.total, 0);

    const rowDepts = Array.from(
        new Map(pairs.map((p) => [p.requestingCatalogId, p.requestingDept])).entries()
    )
        .map(([id, name]) => ({ id, name, activity: activityFor(id) }))
        .sort((a, b) => b.activity - a.activity);
    const colDepts = Array.from(
        new Map(pairs.map((p) => [p.lendingCatalogId, p.lendingDept])).entries()
    )
        .map(([id, name]) => ({ id, name, activity: activityFor(id) }))
        .sort((a, b) => b.activity - a.activity);

    const pairAt = (reqId: string, lendId: string) =>
        pairs.find((p) => p.requestingCatalogId === reqId && p.lendingCatalogId === lendId);

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-1 text-sm">
                <thead>
                    <tr>
                        <th className="sticky left-0 top-0 z-20 bg-white px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            From \ To
                        </th>
                        {colDepts.map((c) => (
                            <th
                                key={c.id}
                                className={`sticky top-0 z-10 whitespace-nowrap px-3 py-2 text-center text-[11px] font-semibold text-slate-600 transition-colors ${
                                    hovered?.endsWith(`::${c.id}`) ? "bg-slate-100 rounded-md" : ""
                                }`}
                            >
                                {c.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rowDepts.map((r) => (
                        <tr key={r.id}>
                            <th
                                className={`sticky left-0 z-10 whitespace-nowrap bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 transition-colors ${
                                    hovered?.startsWith(`${r.id}::`) ? "bg-slate-100 rounded-md" : ""
                                }`}
                            >
                                {r.name}
                            </th>
                            {colDepts.map((c) => {
                                const p = pairAt(r.id, c.id);
                                const cellKey = `${r.id}::${c.id}`;
                                const isHovered = hovered === cellKey;
                                return (
                                    <td key={c.id} className="p-0">
                                        {p ? (
                                            <button
                                                type="button"
                                                onMouseEnter={() => setHovered(cellKey)}
                                                onMouseLeave={() => setHovered(null)}
                                                onClick={() =>
                                                    onSelect({
                                                        requestingCatalogId: r.id,
                                                        lendingCatalogId: c.id,
                                                        requestingDept: r.name,
                                                        lendingDept: c.name,
                                                    })
                                                }
                                                className={`flex w-full flex-col items-center gap-1 rounded-lg border px-3 py-2 transition-colors ${
                                                    isHovered
                                                        ? "border-slate-400 bg-slate-50 shadow-sm"
                                                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                                }`}
                                            >
                                                <div className="flex h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                                                    {BUCKETS.map((b) => {
                                                        const v = bucketValue(p, b.key);
                                                        if (v === 0) return null;
                                                        return (
                                                            <div
                                                                key={b.key}
                                                                style={{
                                                                    width: `${(v / p.total) * 100}%`,
                                                                    backgroundColor: b.color,
                                                                }}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                                <span className="text-xs font-bold text-slate-950">
                                                    {formatNumber(p.total)}
                                                </span>
                                            </button>
                                        ) : (
                                            <div className="flex h-full min-h-[48px] items-center justify-center rounded-lg bg-slate-50/50">
                                                <span className="text-slate-300">–</span>
                                            </div>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ------------------------------ Drill-down dialog ----------------------------- */

type DetailRequest = {
    id: string;
    resourceName: string;
    status: string;
    createdAt: string | Date;
    requestedBy: { id: string; name: string };
};

function DrillDownDialog({
    selection,
    onClose,
}: {
    selection: Selection | null;
    onClose: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState<DetailRequest[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selection) {
            setRequests([]);
            setError(null);
            return;
        }
        let stale = false;
        setLoading(true);
        setError(null);
        getInterDepartmentRequestDetail(selection.requestingCatalogId, selection.lendingCatalogId)
            .then((result) => {
                if (stale) return;
                if (result.success && result.data) {
                    setRequests((result.data as { requests: DetailRequest[] }).requests);
                } else {
                    setError(result.message || "Failed to load");
                }
            })
            .catch(() => !stale && setError("Failed to load"))
            .finally(() => !stale && setLoading(false));
        return () => {
            stale = true;
        };
    }, [selection]);

    const summary = requests.reduce<Record<string, number>>((acc, r) => {
        const key = statusBucket(r.status).key;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    return (
        <Dialog open={!!selection} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex flex-wrap items-center gap-2 text-lg text-slate-950">
                        <span className="truncate">{selection?.requestingDept}</span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                        <span className="truncate">{selection?.lendingDept}</span>
                    </DialogTitle>
                    <DialogDescription>
                        Individual asset requests between these two departments and their current status.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex h-40 items-center justify-center text-slate-500">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading requests…
                    </div>
                ) : error ? (
                    <div className="py-8 text-center text-sm text-red-600">{error}</div>
                ) : (
                    <>
                        {Object.keys(summary).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {BUCKETS.map((b) => {
                                    const v = summary[b.key] || 0;
                                    if (v === 0) return null;
                                    return (
                                        <Badge
                                            key={b.key}
                                            variant="outline"
                                            className="gap-1.5 border-slate-200 bg-white text-slate-700"
                                        >
                                            <span
                                                className="h-2 w-2 rounded-full"
                                                style={{ backgroundColor: b.color }}
                                            />
                                            {b.label}
                                            <span className="font-semibold text-slate-950">{formatNumber(v)}</span>
                                        </Badge>
                                    );
                                })}
                            </div>
                        )}

                        <div className="mt-2 divide-y divide-slate-100">
                            {requests.length === 0 && (
                                <div className="py-8 text-center text-sm text-slate-500">
                                    No requests found for this pair.
                                </div>
                            )}
                            {requests.map((r) => {
                                const b = statusBucket(r.status);
                                return (
                                    <div
                                        key={r.id}
                                        className="grid grid-cols-[1fr_auto] items-center gap-3 py-3"
                                    >
                                        <div className="min-w-0">
                                            <div className="truncate font-medium text-slate-950">
                                                {r.resourceName}
                                            </div>
                                            <div className="mt-0.5 text-xs text-slate-500">
                                                {r.requestedBy?.name || "—"} · {formatDate(r.createdAt)}
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="gap-1.5 border-slate-200 bg-white text-slate-700"
                                        >
                                            <span
                                                className="h-2 w-2 rounded-full"
                                                style={{ backgroundColor: b.color }}
                                            />
                                            {b.label}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
