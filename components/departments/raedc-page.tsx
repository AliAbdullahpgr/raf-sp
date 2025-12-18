"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DepartmentLayout } from "@/components/departments/department-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BuildingIcon,
  Users,
  Zap,
  Building2,
  GraduationCap,
  Monitor,
  Leaf,
  ArrowUpRight,
  Activity,
} from "lucide-react";

interface RAEDCStats {
  totalFacilities: number;
  totalCapacity: number;
  operationalCount: number;
  facilityTypeCount: number;
  operationalPercentage: string;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  facilityType: string;
  capacity: number | null;
  location: string;
  functionality: string;
  status: string;
}

interface RAEDCData {
  department: {
    name: string;
    location: string;
    description: string;
    focalPerson: string;
    email: string;
    phone: string;
    logo: string | null;
  };
  equipment: Equipment[];
  stats: RAEDCStats;
  charts: {
    facilityTypeDistribution: Array<{
      name: string;
      value: number;
      percentage: string;
    }>;
    capacityByFacility: Array<{
      name: string;
      capacity: number;
      count: number;
    }>;
  };
  budget: {
    year: string;
    development: {
      allocation: number;
      expenditure: number;
    };
    nonDevelopment: {
      allocation: number;
      expenditure: number;
    };
  };
}

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#ef4444",
  "#6366f1",
];

const facilityIcons: Record<string, React.ReactNode> = {
  "Training Halls": <GraduationCap className="h-5 w-5" />,
  "Computer Lab": <Monitor className="h-5 w-5" />,
  Library: <Building2 className="h-5 w-5" />,
  Auditorium: <BuildingIcon className="h-5 w-5" />,
  "Demonstration Farm": <Leaf className="h-5 w-5" />,
};

export function RAEDCPage() {
  const [data, setData] = useState<RAEDCData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/departments/raedc");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch RAEDC data");
        }

        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const groupedEquipment = useMemo(() => {
    if (!data) return {};
    return data.equipment.reduce(
      (acc, item) => {
        if (!acc[item.facilityType]) {
          acc[item.facilityType] = [];
        }
        acc[item.facilityType].push(item);
        return acc;
      },
      {} as Record<string, Equipment[]>
    );
  }, [data]);

  if (loading) {
    return (
      <DepartmentLayout>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </DepartmentLayout>
    );
  }

  if (error || !data) {
    return (
      <DepartmentLayout>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error || "Failed to load RAEDC data"}</p>
          </CardContent>
        </Card>
      </DepartmentLayout>
    );
  }

  return (
    <DepartmentLayout
      name={data.department.name}
      description="RAEDC Vehari functions under the Agriculture Department Punjab as a specialized training and capacity-building institution for farmers, agriculture field staff, women beneficiaries, and departmental officers. Established in 1991, it plays an essential role in strengthening human capital and improving agricultural skills."
      image="/images/raedc.jpg.jpg"
      focalPerson={{
        name: data.department.focalPerson || "Director, RAEDC",
        designation: "Director",
        phone: data.department.phone || "+92-XXX-XXXXXXX",
        email: data.department.email || "raedc@agripunjab.gov.pk",
      }}
    >
      <motion.div
        className="space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Budget Section */}
        {data.budget && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold">Budget Allocation ({data.budget.year})</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-800" />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border border-gray-200">
                <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                  <CardTitle className="text-lg">Development Budget (PKR Million)</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b">
                      <span className="text-muted-foreground">Allocation</span>
                      <span className="text-2xl font-bold text-green-600">PKR {data.budget.development.allocation.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Expenditure</span>
                      <span className="text-2xl font-bold text-blue-600">PKR {data.budget.development.expenditure.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                  <CardTitle className="text-lg">Non-Development Budget (PKR Million)</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b">
                      <span className="text-muted-foreground">Allocation</span>
                      <span className="text-2xl font-bold text-green-600">PKR {data.budget.nonDevelopment.allocation.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Expenditure</span>
                      <span className="text-2xl font-bold text-blue-600">PKR {data.budget.nonDevelopment.expenditure.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Key Metrics Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Operational Overview
              </h2>
              <p className="text-muted-foreground mt-1">
                Real-time insights into facility status and capacity
              </p>
            </div>
            <Badge variant="outline" className="px-4 py-1 h-8 border-primary/20 bg-primary/5 text-primary">
              <Activity className="w-3 h-3 mr-2" />
              Live Monitoring
            </Badge>
          </div>

          <motion.div 
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" 
            variants={itemVariants}
          >
            <Card className="relative overflow-hidden border border-gray-200 shadow-lg group bg-white">
              <CardContent className="relative pt-6 text-gray-900">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 font-medium text-sm">Total Facilities</p>
                    <h3 className="text-4xl font-bold mt-2">{data.stats.totalFacilities}</h3>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BuildingIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>Active Campus Assets</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-gray-200 shadow-lg group bg-white">
              <CardContent className="relative pt-6 text-gray-900">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 font-medium text-sm">Operational Status</p>
                    <h3 className="text-4xl font-bold mt-2">
                      {data.stats.operationalPercentage}%
                    </h3>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                  <span className="font-semibold mr-1">{data.stats.operationalCount}</span>
                  <span>Functional Units</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-gray-200 shadow-lg group bg-white">
              <CardContent className="relative pt-6 text-gray-900">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 font-medium text-sm">Total Capacity</p>
                    <h3 className="text-4xl font-bold mt-2">{data.stats.totalCapacity}</h3>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>Person Capacity</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-gray-200 shadow-lg group bg-white">
              <CardContent className="relative pt-6 text-gray-900">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 font-medium text-sm">Facility Types</p>
                    <h3 className="text-4xl font-bold mt-2">{data.stats.facilityTypeCount}</h3>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                  <span>Diverse Infrastructure</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Analytics & Visualization */}
        <section className="grid gap-8 lg:grid-cols-2">
          <Card className="border-0 shadow-xl bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
            <CardHeader>
              <CardTitle>Facility Distribution</CardTitle>
              <CardDescription>Infrastructure breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.charts.facilityTypeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.charts.facilityTypeDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
            <CardHeader>
              <CardTitle>Capacity Analysis</CardTitle>
              <CardDescription>Seating/Accommodation capacity by facility type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.charts.capacityByFacility}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="capacity" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Detailed Facility Breakdown */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold">Facilities Overview</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-800" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(groupedEquipment).map(([facilityType, items]) => (
              <div key={facilityType} className=" bg-gray-50/50 dark:bg-gray-900/20 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="w-full flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    {facilityIcons[facilityType] || <Building2 className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{facilityType}</h3>
                    <p className="text-sm text-muted-foreground">{items.length} facility</p>
                  </div>
                </div>
                
                <div className=" gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="h-full border-0 shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-800">
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <Badge 
                              variant={item.status === "AVAILABLE" ? "default" : "secondary"}
                              className={item.status === "AVAILABLE" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : ""}
                            >
                              {item.status}
                            </Badge>
                            {item.capacity && (
                              <span className="text-xs font-medium text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                Cap: {item.capacity}
                              </span>
                            )}
                          </div>
                          
                          <h4 className="font-semibold text-lg mb-1 line-clamp-1" title={item.name}>
                            {item.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-4">{item.type}</p>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                              <span className="text-muted-foreground">Location</span>
                              <span className="font-medium">{item.location}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="text-muted-foreground">Condition</span>
                              <span className={`font-medium ${
                                item.functionality === "Functional" ? "text-emerald-600" : "text-orange-600"
                              }`}>
                                {item.functionality}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Full Inventory Table */}
        <section>
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Facilities</CardTitle>
                  <CardDescription>Complete list of RAEDC facilities</CardDescription>
                </div>
                <Badge variant="outline" className="bg-white">
                  {data.equipment.length} Facilities
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="w-[400px]">Facility Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Capacity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Condition</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.equipment.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{item.name}</span>
                          <span className="text-xs text-muted-foreground md:hidden">{item.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{item.type}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {item.facilityType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.capacity ? (
                          <span className="font-mono font-medium">{item.capacity}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                            item.status === "AVAILABLE" ? "bg-emerald-500" : "bg-gray-400"
                          }`} />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {item.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.functionality === "Functional" 
                            ? "bg-emerald-100 text-emerald-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {item.functionality}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </motion.div>
    </DepartmentLayout>
  );
}
