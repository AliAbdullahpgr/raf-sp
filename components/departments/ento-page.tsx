"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BadgeCheck,
  Bug,
  Calendar,
  ClipboardList,
  Clock3,
  Compass,
  Building2,
  Factory,
  Globe2,
  Layers,
  Microscope,
  Search,
  MapPin,
  Users,
} from "lucide-react";

import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

interface EntoProfile {
  departmentId: string;
  departmentName: string;
  location: string | null;
  focalPerson: string | null;
  designation: string | null;
  email: string | null;
  officers: number | null;
  officials: number | null;
  landAcres: number | null;
  rooms: number | null;
  registerTitle: string | null;
  registerNote: string | null;
  compiledOn: string | null;
}

interface EntoInventoryItem {
  id: number;
  itemNo: number;
  name: string;
  quantityLabel: string | null;
  dateReceived: string | null;
  lastVerified: string | null;
  lastVerificationLabel: string | null;
  registerLabel: string | null;
}

interface EntoApiResponse {
  profile: EntoProfile;
  items: EntoInventoryItem[];
  verificationBuckets: Record<string, number>;
  statistics: {
    totalItems: number;
    uniqueItems: number;
    itemsByYear: Record<string, number>;
  };
}

const PIE_COLORS = ["#0ea5e9", "#22c55e", "#f97316", "#a855f7", "#64748b"];

const parseQuantityValue = (value?: string | null) => {
  if (!value) return 0;
  const match = value.match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
};

export function EntoPage() {
  const [data, setData] = useState<EntoApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/departments/ento")
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.error) {
          setError(payload.error);
        } else {
          setData(payload);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Ento data:", error);
        setError("Unable to load ERSS data.");
        setData(null);
        setLoading(false);
      });
  }, []);

  const yearData = useMemo(() => {
    if (!data?.statistics?.itemsByYear) return [];
    return Object.entries(data.statistics.itemsByYear)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => (a.year === "Unknown" ? 1 : b.year === "Unknown" ? -1 : a.year.localeCompare(b.year)));
  }, [data]);

  const verificationChartData = useMemo(() => {
    if (!data?.verificationBuckets) return [];
    return Object.entries(data.verificationBuckets)
      .map(([label, value]) => ({ name: label, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const topQuantities = useMemo(() => {
    if (!data?.items) return [];
    return [...data.items]
      .map((item) => ({
        name: item.name,
        value: parseQuantityValue(item.quantityLabel),
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [data]);

  const filteredItems = useMemo(() => {
    if (!data?.items) return [];
    return data.items
      .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((item) => {
        if (yearFilter === "all") return true;
        if (yearFilter === "unknown") return !item.dateReceived;
        if (!item.dateReceived) return false;
        const year = new Date(item.dateReceived).getFullYear().toString();
        return year === yearFilter;
      })
      .sort((a, b) => a.itemNo - b.itemNo);
  }, [data, searchTerm, yearFilter]);

  const latestVerification = useMemo(() => {
    if (!data?.items?.length) return "-";
    const candidates = data.items
      .map((item) => ({
        year: item.lastVerified ? new Date(item.lastVerified).getFullYear() : null,
        label: item.lastVerificationLabel,
      }))
      .filter((entry) => entry.year || entry.label);

    if (!candidates.length) return "-";
    const withYear = candidates.filter((c) => c.year);
    if (withYear.length) {
      const maxYear = Math.max(...withYear.map((c) => c.year || 0));
      return maxYear.toString();
    }
    return candidates[0]?.label || "-";
  }, [data]);

  const earliestReceipt = useMemo(() => {
    if (!data?.items?.length) return null;
    const years = data.items
      .filter((item) => item.dateReceived)
      .map((item) => new Date(item.dateReceived as string).getFullYear());
    if (!years.length) return null;
    return Math.min(...years);
  }, [data]);

  const compiledOn = useMemo(() => formatDate(data?.profile?.compiledOn), [data]);
  const registerLabel = useMemo(() => {
    if (!data) return "Non-consumable items";
    return data.profile.registerTitle || data.items[0]?.registerLabel || "Non-consumable items";
  }, [data]);

  if (loading) {
    return (
      <DepartmentLayout
        name="Entomological Research Sub Station"
        description="Loading ERSS Multan inventory..."
        image="/images/ent.jpg.jpg"
        focalPerson={{
          name: "Loading...",
          designation: "Loading...",
          phone: "",
          email: "",
        }}
      >
        <div className="space-y-6">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DepartmentLayout>
    );
  }

  if (!data) {
    return (
      <DepartmentLayout
        name="Entomological Research Sub Station"
        description="Advanced research on insect pests, beneficial insects, and integrated pest management strategies for sustainable agriculture."
        image="/images/ent.jpg.jpg"
        focalPerson={{
          name: "Dr. Asifa Hameed",
          designation: "Principal Scientist",
          phone: "+92-61-9210075",
          email: "asifa_hameed_sheikh@yahoo.com",
        }}
      >
        <Card className="p-6">
          <p className="text-muted-foreground">
            {error ? error : "Entomology data is not available. Run the ento seed and refresh."}
          </p>
        </Card>
      </DepartmentLayout>
    );
  }

  return (
    <DepartmentLayout
      name={data.profile.departmentName || "Entomological Research Sub Station"}
      description={
        data.profile.registerNote ||
        "Advanced research on insect pests, beneficial insects, and integrated pest management strategies for sustainable agriculture."
      }
      image="/images/ent.jpg.jpg"
      focalPerson={{
        name: data.profile.focalPerson || "Dr. Asifa Hameed",
        designation: data.profile.designation || "Principal Scientist",
        phone: "+92-61-9210075",
        email: data.profile.email || "asifa_hameed_sheikh@yahoo.com",
      }}
    >
      <div className="space-y-10">
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700 border border-amber-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-amber-600">
                Campus & people
              </p>
              <h3 className="text-xl font-semibold text-slate-900">
                Land, team, and inventory snapshot
              </h3>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-7 border border-slate-100 bg-white shadow-lg shadow-amber-50/70">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Land
                  </p>
                  <p className="text-3xl font-extrabold text-slate-900">
                    {data.profile.landAcres
                      ? `${data.profile.landAcres} ac`
                      : "-"}
                  </p>
                </div>
                <MapPin className="w-7 h-7 text-amber-600" />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Footprint dedicated to entomology
              </p>
            </Card>

            <Card className="p-7 border border-slate-100 bg-white shadow-lg shadow-amber-50/70">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Human resources
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {data.profile.officers ?? 0} officers
                  </p>
                </div>
                <Users className="w-7 h-7 text-amber-700" />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                On-ground scientific and support team
              </p>
            </Card>
            <Card className="p-7 border border-slate-100 bg-white shadow-lg shadow-amber-50/70">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Human resources
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {data.profile.officials ?? 0} officials
                  </p>
                </div>
                <Users className="w-7 h-7 text-amber-700" />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                On-ground scientific and support team
              </p>
            </Card>

            <Card className="p-7 border border-amber-100 bg-gradient-to-br from-amber-500 to-orange-400 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/80">
                    Total items
                  </p>
                  <p className="text-3xl font-black">
                    {data.statistics.totalItems}
                  </p>
                </div>
                <Factory className="w-8 h-8 text-white/90" />
              </div>
              <p className="text-xs text-white/80 mt-2">
                All non-consumable assets on record
              </p>
            </Card>

            <Card className="p-7 border border-cyan-100 bg-gradient-to-br from-cyan-500 to-sky-500 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/80">
                    Unique items
                  </p>
                  <p className="text-3xl font-black">
                    {data.statistics.uniqueItems}
                  </p>
                </div>
                <Microscope className="w-8 h-8 text-white/90" />
              </div>
              <p className="text-xs text-white/80 mt-2">
                Distinct equipment lines in the register
              </p>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-100 text-cyan-700 border border-cyan-200">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-cyan-600">
                Inventory insights
              </p>
              <h3 className="text-xl font-semibold text-slate-900">
                Receipts, verification, and volume
              </h3>
            </div>
          </div>

          <div className="grid lg:grid-cols-1 gap-6">
            <Card className="lg:col-span-2 p-8 border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-700" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    Receipts over time
                  </h3>
                </div>
                <Badge
                  variant="outline"
                  className="border-cyan-100 text-cyan-700"
                >
                  Year-by-year arrivals
                </Badge>
              </div>
              <div className="h-[260px]  w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={yearData}
                    margin={{ top: 10, right: 20, left: 0, bottom: -10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#1f2937" />
                    <YAxis stroke="#1f2937" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 10,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {yearData.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.year}-${index}`}
                          fill={
                            ["#0ea5e9", "#22c55e", "#f97316", "#6366f1"][
                              index % 4
                            ]
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="p-6 border-emerald-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <BadgeCheck className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    Verification cadence
                  </h3>
                </div>
                <div className="h-64 w-full min-w-0">
                  {verificationChartData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={verificationChartData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                          label={({ name, value }) => `${name} (${value})`}
                        >
                          {verificationChartData.map((entry, index) => (
                            <Cell
                              key={`verify-${index}`}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-slate-500">
                      No verification history available
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-600 mt-3">
                  {verificationChartData.map((bucket, idx) => (
                    <span
                      key={bucket.name}
                      className="px-2.5 py-1 rounded-full border"
                      style={{
                        borderColor: PIE_COLORS[idx % PIE_COLORS.length],
                        backgroundColor: `${
                          PIE_COLORS[idx % PIE_COLORS.length]
                        }15`,
                      }}
                    >
                      {bucket.name}: {bucket.value}
                    </span>
                  ))}
                </div>
              </Card>

              <Card className="p-6 border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Compass className="w-5 h-5 text-slate-700" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    High-volume pieces
                  </h3>
                </div>
                <div className="h-64 w-full min-w-0">
                  {topQuantities.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={topQuantities}
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" stroke="#1f2937" />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={140}
                          tick={{ fontSize: 11 }}
                        />
                        <Tooltip />
                        <Bar
                          dataKey="value"
                          radius={[0, 6, 6, 0]}
                          fill="#0ea5e9"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-slate-500">
                      No quantity information captured
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </section>

        <Card className="p-6 border-slate-100 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <ClipboardList className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Full inventory register
                </h3>
                <p className="text-sm text-slate-600">{registerLabel}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by item name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-60"
                />
              </div>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="border border-slate-200 rounded-lg text-sm px-3 py-2 text-slate-700"
              >
                <option value="all">All years</option>
                <option value="unknown">Unknown year</option>
                {yearData
                  .filter((entry) => entry.year !== "Unknown")
                  .map((entry) => (
                    <option key={entry.year} value={entry.year}>
                      {entry.year}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Item name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Date received
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Last verification
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.length ? (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-emerald-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-700 font-semibold">
                        {item.itemNo}
                      </td>
                      <td className="px-4 py-3 text-slate-900 font-medium">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {item.quantityLabel || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {formatDate(item.dateReceived)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="border-emerald-200 text-emerald-700"
                        >
                          {item.lastVerificationLabel ||
                            formatDate(item.lastVerified)}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      No items match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DepartmentLayout>
  );
}
