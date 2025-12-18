"use client";

import { useEffect, useState } from "react";
import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FlaskConical, Users, Coins, Settings, Briefcase, UserCheck, Microscope, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SoilAsset {
  id: string;
  name: string;
  type: string;
  category: string | null;
  bps: number | null;
  quantityRequired: number | null;
  budgetAllocationTotalMillion: number | null;
  justificationOrYear: string | null;
}

interface SoilData {
  department: {
    id: string;
    name: string;
    location: string;
    description: string;
    focalPerson: string;
    designation: string;
    phone: string;
    email: string;
  };
  budgetData: SoilAsset[];
  budgetDetails: SoilAsset[];
  allowances: SoilAsset[];
  contingent: SoilAsset[];
  hrOfficers: SoilAsset[];
  hrOfficials: SoilAsset[];
  machinery: SoilAsset[];
  operatingCosts: SoilAsset[];
  capitalCosts: SoilAsset[];
  grandTotals: SoilAsset[];
  statistics: {
    totalBudget: number;
    totalHR: number;
    totalOfficers: number;
    totalOfficials: number;
    totalMachinery: number;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

const HR_COLORS = ["#0ea5e9", "#38bdf8"]; // Sky Blue shades
const BUDGET_COLORS = ["#0ea5e9", "#0284c7", "#0369a1", "#075985"]; // Blue shades
const NEON_GRADIENT = "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600";
const SOFT_PANEL = "border border-cyan-100 shadow-md";

const formatMillions = (value: number | string | null | undefined) => {
  const num = Number(value ?? 0);
  return `${Number.isNaN(num) ? "0.00" : num.toFixed(2)} M`;
};

export function SoilWaterPage() {
  const [data, setData] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departments/soil-water")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Soil & Water data:", error);
        setData(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DepartmentLayout
        name="Soil & Water Testing Laboratory"
        description="Loading..."
        image="/images/soil.png.jpg"
        focalPerson={{
          name: "Loading...",
          designation: "Loading...",
          phone: "",
          email: "",
        }}
      >
        <div className="space-y-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DepartmentLayout>
    );
  }

  if (!data) {
    return (
      <DepartmentLayout
        name="Soil & Water Testing Laboratory"
        description="Comprehensive soil and water analysis services providing critical data for agricultural research and farmer support across the region."
        image="/images/soil.png.jpg"
        focalPerson={{
          name: "Ms. Fatima Bibi",
          designation: "Principal Scientist",
          phone: "061-4423568",
          email: "swt_mltn@yahoo.com",
        }}
      >
        <Card className="p-6">
          <p className="text-muted-foreground">
            No data available. Please contact the administrator.
          </p>
        </Card>
      </DepartmentLayout>
    );
  }

  // Prepare HR Chart Data
  const hrChartData = [
    { name: "Officers", value: data.statistics.totalOfficers },
    { name: "Officials", value: data.statistics.totalOfficials },
  ];

  // Prepare Budget Chart Data
  const budgetChartData = data.budgetData.map(item => ({
    name: item.category || item.name.substring(0, 10),
    fullName: item.name,
    value: Number(item.budgetAllocationTotalMillion)
  }));

  const budgetDetailRows = [...data.budgetDetails, ...data.allowances, ...data.contingent];

  const operatingTotals = data.operatingCosts.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + (Number(item.budgetAllocationTotalMillion) || 0);
    return acc;
  }, {});

  const capitalTotals = data.capitalCosts.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + (Number(item.budgetAllocationTotalMillion) || 0);
    return acc;
  }, {});

  const grandTotalValue = data.grandTotals.reduce((sum, item) => sum + (Number(item.budgetAllocationTotalMillion) || 0), 0);

  const budgetDetailMap = budgetDetailRows.reduce<Record<string, number>>((acc, row) => {
    const key = row.type || row.name || "Other";
    acc[key] = (acc[key] || 0) + (Number(row.budgetAllocationTotalMillion) || 0);
    return acc;
  }, {});

  const budgetDetailChart = Object.entries(budgetDetailMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const machineryChartData = [...data.machinery]
    .map((item) => ({ name: item.name, value: item.quantityRequired || 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const opCapitalShare = [
    { name: "Operating", value: Object.values(operatingTotals).reduce((sum, val) => sum + val, 0) },
    { name: "Capital", value: Object.values(capitalTotals).reduce((sum, val) => sum + val, 0) },
    { name: "Allowances", value: data.allowances.reduce((sum, row) => sum + (Number(row.budgetAllocationTotalMillion) || 0), 0) },
  ];

  return (
    <DepartmentLayout
      name={data.department.name}
      description={data.department.description || "Comprehensive soil and water analysis services providing critical data for agricultural research and farmer support across the region."}
      image="/images/soil.png.jpg"
      focalPerson={{
        name: data.department.focalPerson || "Ms. Fatima Bibi",
        designation: data.department.designation || "Principal Scientist",
        phone: data.department.phone || "061-4423568",
        email: data.department.email || "swt_mltn@yahoo.com",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-6 text-center border-cyan-200 shadow-lg bg-white">
              <div className="text-sm font-bold text-cyan-600 uppercase tracking-wider mb-2">
                Total Budget
              </div>
              <div className="text-4xl font-black text-cyan-700">
                {data.statistics.totalBudget} <span className="text-lg font-medium text-gray-500">M</span>
              </div>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-6 text-center border-cyan-200 shadow-lg bg-white">
              <div className="text-sm font-bold text-cyan-600 uppercase tracking-wider mb-2">
                Total Staff
              </div>
              <div className="text-4xl font-black text-cyan-700">
                {data.statistics.totalHR}
              </div>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-6 text-center border-cyan-200 shadow-lg bg-white">
              <div className="text-sm font-bold text-cyan-600 uppercase tracking-wider mb-2">
                Machinery Items
              </div>
              <div className="text-4xl font-black text-cyan-700">
                {data.statistics.totalMachinery}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Budget Section */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600">
              Budget Allocation (2025-2029)
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
            <motion.div variants={itemVariants}>
              <Card className={`p-6 h-full ${SOFT_PANEL}`}>
                <h3 className="text-center text-lg font-semibold text-cyan-700 mb-1">Budget Distribution (Million PKR)</h3>
                <p className="text-center text-xs text-gray-500 mb-4">Allocation values by category for 2025-2029.</p>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetChartData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12}} />
                      <Tooltip 
                        cursor={{fill: 'transparent'}}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border border-cyan-200 shadow-lg rounded-lg">
                                <p className="font-bold text-cyan-800">{data.fullName}</p>
                                <p className="text-cyan-600">{data.value} Million</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                        {budgetChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={BUDGET_COLORS[index % BUDGET_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 gap-4">
                {data.budgetData.map((item, index) => (
                  <Card key={index} className="p-4 border-cyan-100 bg-gradient-to-br from-white to-cyan-50/70 hover:shadow-lg transition-all flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-cyan-100 p-2 rounded-lg text-cyan-700 font-bold text-xs">
                        {item.category}
                      </div>
                      <div className="font-medium text-gray-800">{item.name}</div>
                    </div>
                    <div className="text-xl font-black text-cyan-700">
                      {formatMillions(item.budgetAllocationTotalMillion)}
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Detailed Pay & Allowances */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 via-cyan-500 to-sky-500 shadow-lg">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-cyan-600 to-sky-500">
              Pay, Allowances & Headcount
            </h2>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-0 overflow-hidden border-indigo-100 shadow-xl">
              <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 border-b border-indigo-100 px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-indigo-500 font-semibold">Compensation Grid</p>
                  <p className="text-lg font-bold text-indigo-800">Officers, Officials & allowances in one view</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-indigo-500">Grand Total (calc)</p>
                  <p className="text-2xl font-black text-indigo-700">{formatMillions(budgetDetailRows.reduce((sum, row) => sum + (Number(row.budgetAllocationTotalMillion) || 0), 0))}</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white">
                    <tr className="border-b border-indigo-100">
                      <th className="text-left py-3 px-4 font-semibold text-indigo-700">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-indigo-700">BPS</th>
                      <th className="text-left py-3 px-4 font-semibold text-indigo-700">Posts</th>
                      <th className="text-left py-3 px-4 font-semibold text-indigo-700">Code</th>
                      <th className="text-left py-3 px-4 font-semibold text-indigo-700">Total (M)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-50">
                    {budgetDetailRows.map((row, idx) => (
                      <tr key={`${row.type}-${row.name}-${idx}`} className="hover:bg-indigo-50/40">
                        <td className="py-3 px-4 text-gray-900 font-medium">
                          <span className="inline-flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400" />
                            {row.name}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{row.bps ?? "-"}</td>
                        <td className="py-3 px-4 text-gray-800 font-semibold">{row.quantityRequired ?? "-"}</td>
                        <td className="py-3 px-4 text-gray-600">{row.category || "-"}</td>
                        <td className="py-3 px-4 text-indigo-700 font-bold">{formatMillions(row.budgetAllocationTotalMillion)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Analytical Highlights */}
        <section>
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-800">
              Analytical Highlights
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <motion.div variants={itemVariants}>
              <Card className="p-5 h-full border-cyan-100 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-cyan-500 uppercase tracking-[0.3em]">Budget Composition</p>
                    <p className="text-lg font-bold text-cyan-700">Detail Share</p>
                  </div>
                  <span className="text-xs text-gray-500">Top six contributors</span>
                </div>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={budgetDetailChart}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={5}
                      >
                        {budgetDetailChart.map((entry, index) => (
                          <Cell key={`detail-${index}`} fill={BUDGET_COLORS[index % BUDGET_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${Number(value ?? 0).toFixed(2)} M`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 text-xs text-neutral-700">
                  {budgetDetailChart.map((entry) => (
                    <span key={entry.name} className="bg-white px-3 py-1 rounded-full border border-cyan-100 text-cyan-700 font-semibold">
                      {entry.name}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-5 h-full border-indigo-100 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-[0.3em]">Funds Balance</p>
                    <p className="text-lg font-semibold text-indigo-800">Operating vs Capital</p>
                  </div>
                  <span className="text-xs text-gray-500">FY 2026-29</span>
                </div>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={opCapitalShare}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label={(entry) => `${entry.name}: ${Number(entry.value ?? 0).toFixed(1)}M`}
                      >
                        {opCapitalShare.map((entry, index) => (
                          <Cell key={`share-${index}`} fill={["#06b6d4", "#f97316", "#a855f7"][index]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${Number(value ?? 0).toFixed(2)} M`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          </div>

          <div className="w-full">
            <motion.div variants={itemVariants}>
              <Card className="p-5 h-full border-emerald-100 bg-gradient-to-br from-white to-emerald-50 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-emerald-500 uppercase tracking-[0.3em]">Machinery</p>
                    <p className="text-lg font-bold text-emerald-800">Top Quantities</p>
                  </div>
                  <span className="text-xs text-emerald-600">Qty</span>
                </div>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={machineryChartData} layout="horizontal" margin={{ top: 5, right: 15, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={60} />
                      <YAxis allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#22c55e" }} />
                      <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]}>
                        {machineryChartData.map((entry, index) => (
                          <Cell key={`mach-${index}`} fill={`rgba(16,185,129,${0.6 + (index * 0.1)})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Operating Costs */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
              Operating Costs Pulse
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(operatingTotals).map(([label, value]) => (
              <motion.div key={label} variants={itemVariants} whileHover={{ scale: 1.02 }}>
                <Card className="p-5 h-full bg-gradient-to-br from-white to-emerald-50 border-emerald-100 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">{label}</span>
                    <span className="text-xs px-2 py-1 bg-white rounded-full text-emerald-700 border border-emerald-100">Ops</span>
                  </div>
                  <div className="text-3xl font-black text-emerald-700">{formatMillions(value)}</div>
                  <p className="text-xs text-emerald-700/70 mt-1">FY 2026-29 total</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Capital & Maintenance */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-lg">
              <Microscope className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-rose-500">
              Capital & Maintenance
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(capitalTotals).map(([label, value]) => (
              <motion.div key={label} variants={itemVariants} whileHover={{ scale: 1.02 }}>
                <Card className="p-5 h-full bg-gradient-to-br from-white to-amber-50 border-amber-100 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">{label}</span>
                    <span className="text-xs px-2 py-1 bg-white rounded-full text-amber-700 border border-amber-100">Infra</span>
                  </div>
                  <div className="text-3xl font-black text-amber-700">{formatMillions(value)}</div>
                  <p className="text-xs text-amber-700/70 mt-1">Long-term investment</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Grand Totals */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-fuchsia-500">
              Grand Totals
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.grandTotals.map((item, idx) => (
              <motion.div key={idx} variants={itemVariants} whileHover={{ scale: 1.02 }}>
                <Card className="p-5 h-full bg-gradient-to-br from-white to-purple-50 border-purple-100 shadow-lg">
                  <div className="text-xs font-semibold text-purple-500 uppercase tracking-widest mb-1">{item.name}</div>
                  <div className="text-3xl font-black text-purple-700">{formatMillions(item.budgetAllocationTotalMillion)}</div>
                </Card>
              </motion.div>
            ))}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card className="p-5 h-full bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-lg border border-white/20">
                <div className="text-xs uppercase tracking-[0.2em] text-white/80 mb-1">Overall Total</div>
                <div className="text-4xl font-black">{formatMillions(grandTotalValue)}</div>
                <p className="text-xs text-white/80 mt-1">All years combined</p>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Human Resource Section */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-indigo-600">
              Human Resources
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chart */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Card className="p-6 h-full border-sky-200 shadow-lg bg-gradient-to-b from-white to-sky-50">
                <h3 className="text-center text-gray-700 font-medium mb-6">Staff Composition</h3>
                <div className="h-[200px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={hrChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {hrChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={HR_COLORS[index % HR_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-800">{data.statistics.totalHR}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
                    <span>Officers ({data.statistics.totalOfficers})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-sky-300 rounded-full"></div>
                    <span>Officials ({data.statistics.totalOfficials})</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Officers List */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Card className="p-6 h-full border-sky-200 shadow-lg">
                <div className="flex items-center gap-2 mb-4 text-sky-700 font-bold">
                  <Briefcase className="w-5 h-5" /> Officers (BPS 16-17)
                </div>
                <div className="space-y-3">
                  {data.hrOfficers.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-sky-50 rounded-md">
                      <div>
                        <div className="font-medium text-sm text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-500">BPS-{item.bps}</div>
                      </div>
                      <div className="bg-white px-2 py-1 rounded text-xs font-bold text-sky-600 shadow-sm">
                        {item.quantityRequired} Post{item.quantityRequired !== 1 && 's'}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Officials List */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Card className="p-6 h-full border-sky-200 shadow-lg">
                <div className="flex items-center gap-2 mb-4 text-sky-700 font-bold">
                  <UserCheck className="w-5 h-5" /> Officials (BPS 1-16)
                </div>
                <div className="space-y-2 overflow-y-auto max-h-[300px] pr-2">
                  {data.hrOfficials.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md border border-gray-100">
                      <div>
                        <div className="font-medium text-sm text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-500">BPS-{item.bps}</div>
                      </div>
                      <div className="bg-white px-2 py-1 rounded text-xs font-bold text-gray-600 shadow-sm">
                        {item.quantityRequired}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Machinery Section */}
        <section>
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg">
              <Microscope className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
              Lab Equipment & Machinery
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.machinery.map((item, index) => (
              <motion.div key={item.id} variants={itemVariants} whileHover={{ scale: 1.02 }}>
                <Card className="p-4 h-full flex flex-col justify-between border-teal-100 bg-gradient-to-br from-white to-teal-50/30 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                      Qty: {item.quantityRequired}
                    </div>
                  </div>
                  {item.justificationOrYear && (
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {item.justificationOrYear}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="mt-8">
            <Card className="p-4 border-teal-100 shadow-lg overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-semibold text-teal-500 uppercase tracking-wider">Detailed Requirements</div>
                  <div className="text-2xl font-bold text-teal-800">Plant & Machinery Table</div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-teal-50 border-b border-teal-100">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-teal-700">#</th>
                      <th className="text-left py-3 px-4 font-semibold text-teal-700">Plant & Machinery</th>
                      <th className="text-left py-3 px-4 font-semibold text-teal-700">Quantity</th>
                      <th className="text-left py-3 px-4 font-semibold text-teal-700">Justification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-teal-50">
                    {data.machinery.map((item, index) => (
                      <tr key={item.id} className="hover:bg-teal-50/50">
                        <td className="py-3 px-4 text-teal-700">{index + 1}</td>
                        <td className="py-3 px-4 font-medium text-gray-800">{item.name}</td>
                        <td className="py-3 px-4 text-teal-800 font-semibold">
                          {item.quantityRequired ?? 0}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {item.justificationOrYear || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </section>
      </motion.div>
    </DepartmentLayout>
  );
}
