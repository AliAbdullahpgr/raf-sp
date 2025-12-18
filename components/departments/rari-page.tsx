"use client";

import { useEffect, useState } from "react";
import { DepartmentLayout } from "./department-layout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sprout, Users, Tractor, FlaskConical, Building2, Wheat, Home } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RARIAsset {
  id: string;
  name: string;
  type: string;
  category: string | null;
  quantity: number | null;
  conditionStatus: string | null;
  useApplication: string | null;
}

interface RARIData {
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
  landData: RARIAsset[];
  buildingData: RARIAsset[];
  farmMachinery: RARIAsset[];
  labEquipment: RARIAsset[];
  hrOfficers: RARIAsset[];
  hrOfficials: RARIAsset[];
  statistics: {
    totalLandArea: number;
    totalBuildings: number;
    totalMachinery: number;
    totalLabEquipment: number;
    totalHR: number;
    totalOfficers: number;
    totalOfficials: number;
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

const HR_COLORS = ["#10b981", "#f59e0b"]; // Emerald (Officers), Amber (Officials)
const STATUS_COLORS = {
  working: "#10b981",
  notWorking: "#ef4444",
};

const normalizeStatus = (status: string | null) => status?.toLowerCase().trim() ?? "";
const isWorkingStatus = (status: string | null) => {
  const normalized = normalizeStatus(status);
  if (!normalized) return false;
  if (normalized.includes("non")) return false;
  if (normalized.includes("not")) return false;
  if (normalized.includes("out of order") || normalized.includes("out-of-order")) return false;
  return normalized.includes("working");
};

const sortFarmMachinery = (items: RARIAsset[]) =>
  [...items].sort((a, b) => {
    const aWorking = isWorkingStatus(a.conditionStatus) ? 1 : 0;
    const bWorking = isWorkingStatus(b.conditionStatus) ? 1 : 0;
    if (aWorking !== bWorking) return bWorking - aWorking;

    const aQty = a.quantity ?? 0;
    const bQty = b.quantity ?? 0;
    if (aQty !== bQty) return bQty - aQty;

    return (b.name || "").localeCompare(a.name || "");
  });

const sortLabEquipment = (items: RARIAsset[]) =>
  [...items].sort((a, b) => {
    const aWorking = isWorkingStatus(a.conditionStatus) ? 1 : 0;
    const bWorking = isWorkingStatus(b.conditionStatus) ? 1 : 0;
    if (aWorking !== bWorking) return bWorking - aWorking;

    return (b.name || "").localeCompare(a.name || "");
  });

function getStatusTotals<T extends RARIAsset>(
  list: T[],
  valueSelector: (item: T) => number
) {
  return list.reduce(
    (acc, item) => {
      const increment = valueSelector(item);
      if (isWorkingStatus(item.conditionStatus)) {
        acc.working += increment;
      } else {
        acc.notWorking += increment;
      }
      return acc;
    },
    { working: 0, notWorking: 0 }
  );
}

export function RARIPage() {
  const [data, setData] = useState<RARIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departments/rari")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching RARI data:", error);
        setData(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <DepartmentLayout
        name="Regional Agricultural Research Institute"
        description="Loading..."
        image="/images/rai.jpg.jpg"
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
        name="Regional Agricultural Research Institute"
        description="Comprehensive agricultural research focusing on crop improvement, plant protection, and sustainable farming practices for the region."
        image="/images/rai.jpg.jpg"
        focalPerson={{
          name: "",
          designation: "",
          phone: "",
          email: "",
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

  // Helper to get land data safely
  const getLandValue = (name: string) => data.landData.find(d => d.name === name)?.quantity || 0;

  // Sorted datasets: Working first, then highest quantities
  const sortedFarmMachinery = sortFarmMachinery(data.farmMachinery);
  const sortedLabEquipment = sortLabEquipment(data.labEquipment);

  const farmStatusTotals = getStatusTotals(data.farmMachinery, (item) => item.quantity ?? 0);
  const labStatusTotals = getStatusTotals(data.labEquipment, () => 1);

  const farmStatusData = [
    { name: "Working", value: farmStatusTotals.working, fill: STATUS_COLORS.working },
    { name: "Not Working", value: farmStatusTotals.notWorking, fill: STATUS_COLORS.notWorking },
  ];

  const labStatusData = [
    { name: "Working", value: labStatusTotals.working, fill: STATUS_COLORS.working },
    { name: "Out of Order", value: labStatusTotals.notWorking, fill: STATUS_COLORS.notWorking },
  ];

  const farmQuantityData = sortedFarmMachinery.map((item) => ({
    name: item.name,
    value: item.quantity ?? 0,
    status: isWorkingStatus(item.conditionStatus) ? "Working" : "Not Working",
  }));

  return (
    <DepartmentLayout
      name={data.department.name}
      description={
        data.department.description ||
        "Comprehensive agricultural research focusing on crop improvement, plant protection, and sustainable farming practices for the region."
      }
      image="/images/rai.jpg.jpg"
      focalPerson={{
        name: data.department.focalPerson || "Dr. Asif Ali",
        designation: data.department.designation || "Research Officer",
        phone: data.department.phone || "+92-61-9210073",
        email: data.department.email || "asif.ali@rari.gov.pk",
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
            <Card className="p-6 text-center border-emerald-200 shadow-lg bg-white">
              <div className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">
                Total Land Area
              </div>
              <div className="text-4xl font-black text-emerald-700">
                {getLandValue("Total Area")}{" "}
                <span className="text-lg font-medium text-gray-500">Acres</span>
              </div>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-6 text-center border-emerald-200 shadow-lg bg-white">
              <div className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">
                Total Staff
              </div>
              <div className="text-4xl font-black text-emerald-700">
                {data.statistics.totalHR}
              </div>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="p-6 text-center border-emerald-200 shadow-lg bg-white">
              <div className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">
                Farm Machinery
              </div>
              <div className="text-4xl font-black text-emerald-700">
                {data.statistics.totalMachinery}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Land & Infrastructure Section */}
        <section>
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-600">
              Land & Infrastructure
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
              <Card className="p-6 text-center h-full border-emerald-100 bg-gradient-to-b from-white to-emerald-50/50 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Wheat className="w-16 h-16 text-emerald-600" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-600 mb-2 tracking-tight">
                  {getLandValue("Cultivated Area")}
                </div>
                <div className="text-sm font-medium text-emerald-800/70 uppercase tracking-wide">
                  Cultivated Area (Acres)
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
              <Card className="p-6 text-center h-full border-emerald-100 bg-gradient-to-b from-white to-emerald-50/50 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Building2 className="w-16 h-16 text-emerald-600" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-600 mb-2 tracking-tight">
                  {getLandValue("Roads/Building Area")}
                </div>
                <div className="text-sm font-medium text-emerald-800/70 uppercase tracking-wide">
                  Roads & Buildings (Acres)
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
              <Card className="p-6 text-center h-full border-emerald-100 bg-gradient-to-b from-white to-emerald-50/50 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Home className="w-16 h-16 text-emerald-600" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-600 mb-2 tracking-tight">
                  {data.buildingData.find(
                    (b) => b.name === "Residential Quarters"
                  )?.quantity || 0}
                </div>
                <div className="text-sm font-medium text-emerald-800/70 uppercase tracking-wide">
                  Residential Quarters
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Farm Machinery Section */}
        <section>

          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
              <Tractor className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">
              Farm Machinery
            </h2>
          </motion.div>

          <div className="flex flex-col gap-6 mb-8">
            <motion.div variants={itemVariants}>
              <Card className="p-6 py-10 border-amber-100 bg-gradient-to-b from-white to-amber-50 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm font-semibold text-amber-500 uppercase tracking-wider">
                      Condition Snapshot
                    </div>
                    <div className="text-2xl font-bold text-amber-700">
                      Working vs Not Working
                    </div>
                  </div>
                </div>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={farmStatusData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={6}
                      >
                        {farmStatusData.map((entry, index) => (
                          <Cell
                            key={`farm-status-${index}`}
                            fill={entry.fill}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 text-xs text-amber-700 mt-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: STATUS_COLORS.working }}
                      ></span>
                      <span>Working ({farmStatusTotals.working})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: STATUS_COLORS.notWorking }}
                      ></span>
                      <span>Not Working ({farmStatusTotals.notWorking})</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 border-amber-100 bg-gradient-to-b from-white to-amber-50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-semibold text-amber-500 uppercase tracking-wider">
                      Inventory Spread
                    </div>
                    <div className="text-2xl font-bold text-amber-700">
                      Quantity by Machinery
                    </div>
                  </div>
                </div>
                <div className="h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={farmQuantityData} 
                      margin={{ left: 10, right: 20, top: 10, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        height={60}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        tickMargin={10}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
                        formatter={(value) => [`${value} units`, "Quantity"]}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#f59e0b">
                        {farmQuantityData.map((entry, index) => (
                          <Cell
                            key={`farm-bar-${index}`}
                            fill={
                              entry.status === "Working"
                                ? STATUS_COLORS.working
                                : STATUS_COLORS.notWorking
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

              </Card>
            </motion.div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {sortedFarmMachinery.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="p-4 flex items-center justify-between border-amber-100 bg-gradient-to-r from-white to-amber-50/50 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                      <Tractor className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-700">
                        {item.name}
                      </div>
                      <div
                        className={`text-xs font-bold ${
                          item.conditionStatus === "Working"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {item.conditionStatus}
                      </div>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-amber-600">
                    {item.quantity}
                  </span>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Lab Equipment Section */}
        <section>
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
              Lab Equipment
            </h2>
          </motion.div>

          <div className="grid gap-6 mb-6 lg:grid-cols-[minmax(0,45%)_minmax(0,55%)] items-start">
            <motion.div variants={itemVariants}>
              <Card className="p-6 pb-12 border-blue-100 bg-gradient-to-b from-white to-blue-50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-semibold text-blue-500 uppercase tracking-wider">
                      Condition Snapshot
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      Working vs Out of Order
                    </div>
                  </div>
                </div>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={labStatusData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={6}
                      >
                        {labStatusData.map((entry, index) => (
                          <Cell key={`lab-status-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 text-xs text-blue-700 mt-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: STATUS_COLORS.working }}
                      ></span>
                      <span>Working ({labStatusTotals.working})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: STATUS_COLORS.notWorking }}
                      ></span>
                      <span>Out of Order ({labStatusTotals.notWorking})</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 pb-10 border-blue-100 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm font-semibold text-blue-500 uppercase tracking-wider">
                      Availability
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      Count by Status
                    </div>
                  </div>
                </div>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={labStatusData}
                      margin={{ left: -20, right: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {labStatusData.map((entry, index) => (
                          <Cell key={`lab-bar-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {sortedLabEquipment.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <Card className="p-6 border-blue-100 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {item.useApplication}
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        item.conditionStatus === "Working"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.conditionStatus}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Human Resource Section */}
        <section>
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Human Resources
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chart */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Card className="p-6 h-full border-indigo-200 shadow-lg bg-gradient-to-b from-white to-indigo-50">
                <h3 className="text-center text-gray-700 font-medium mb-6">
                  Staff Composition
                </h3>
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
                          <Cell
                            key={`cell-${index}`}
                            fill={HR_COLORS[index % HR_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-800">
                        {data.statistics.totalHR}
                      </div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span>Officers ({data.statistics.totalOfficers})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span>Officials ({data.statistics.totalOfficials})</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Officers List */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Card className="p-6 h-full border-indigo-200 shadow-lg">
                <div className="flex items-center gap-2 mb-4 text-indigo-700 font-bold">
                  <Users className="w-5 h-5" /> Officers (BPS 17-19)
                </div>
                <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
                  {data.hrOfficers.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-indigo-50 rounded-md border border-indigo-100"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium text-sm text-gray-800">
                          {item.name}
                        </div>
                        <div className="bg-white px-2 py-0.5 rounded text-xs font-bold text-indigo-600 shadow-sm">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">{item.category}</span>
                        <span className="text-gray-600 italic">
                          {item.conditionStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Officials List */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <Card className="p-6 h-full border-indigo-200 shadow-lg">
                <div className="flex items-center gap-2 mb-4 text-indigo-700 font-bold">
                  <Users className="w-5 h-5" /> Officials (BPS 1-16)
                </div>
                <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
                  {data.hrOfficials.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-md border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium text-sm text-gray-800">
                          {item.name}
                        </div>
                        <div className="bg-white px-2 py-0.5 rounded text-xs font-bold text-gray-600 shadow-sm">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">{item.category}</span>
                        <span className="text-gray-600 italic">
                          {item.conditionStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

      </motion.div>
    </DepartmentLayout>
  );
}
