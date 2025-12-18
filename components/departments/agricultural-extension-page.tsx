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
  Building2,
  MapPin,
  Square,
  CheckCircle2,
  XCircle,
  Activity,
} from "lucide-react";

interface ExtensionOffice {
  id: string;
  name: string;
  type: string;
  location: string;
  areaSquareFeet: number | null;
  remarks: string | null;
  status: string;
  functionality: string;
}

interface ExtensionStats {
  totalOffices: number;
  totalArea: number;
  utilizedCount: number;
  unusedCount: number;
  utilizationPercentage: string;
}

interface ExtensionData {
  department: {
    name: string;
    location: string;
    description: string;
    focalPerson: string;
    email: string;
    phone: string;
    logo: string | null;
  };
  offices: ExtensionOffice[];
  stats: ExtensionStats;
  groups: Record<string, ExtensionOffice[]>;
}

const COLORS = [
  "#10b981",
  "#ef4444",
];

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

export function AgriculturalExtensionPage() {
  const [data, setData] = useState<ExtensionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/departments/agricultural-extension-wing");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch Agricultural Extension Wing data");
        }

        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
          <div className="grid gap-6 lg:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg animate-pulse" />
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
            <p className="text-red-700">{error || "Failed to load Agricultural Extension Wing data"}</p>
          </CardContent>
        </Card>
      </DepartmentLayout>
    );
  }

  const statusDistribution = [
    { name: "Utilized", value: data.stats.utilizedCount },
    { name: "Unused", value: data.stats.unusedCount },
  ];

  const areaByStatus = Object.entries(data.groups).map(([status, offices]) => ({
    name: status,
    area: offices.reduce((sum, office) => sum + (office.areaSquareFeet || 0), 0),
    count: offices.length,
  }));

  return (
    <DepartmentLayout
      name={data.department.name}
      description={data.department.description}
      image="/images/agri_ext.jpg.jpg"
      focalPerson={{
        name: data.department.focalPerson || "Deputy Director Agriculture (Ext)",
        designation: "Deputy Director",
        phone: data.department.phone || "+92-XXX-XXXXXXX",
        email: data.department.email || "ext@agripunjab.gov.pk",
      }}
    >
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Key Metrics Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Office Network
              </h2>
              <p className="text-muted-foreground mt-1">
                Overview of Agricultural Extension Wing offices and facilities
              </p>
            </div>
            <Badge variant="outline" className="px-3 py-1 text-xs font-medium border-gray-200">
              {data.stats.totalOffices} Offices
            </Badge>
          </div>

          <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" variants={itemVariants}>
            <Card className="relative overflow-hidden border border-gray-200 shadow-lg group bg-white">
              <CardContent className="relative pt-6 text-gray-900">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 font-medium text-sm">Total Offices</p>
                    <h3 className="text-4xl font-bold mt-2">{data.stats.totalOffices}</h3>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Administrative Centers</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-gray-200 shadow-lg group bg-white">
              <CardContent className="relative pt-6 text-gray-900">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 font-medium text-sm">Total Area</p>
                    <h3 className="text-3xl font-bold mt-2">
                      {(data.stats.totalArea / 1000).toFixed(0)}K
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">sq. feet</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Square className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                  <span>Infrastructure Space</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-gray-200 shadow-lg group bg-white">
              <CardContent className="relative pt-6 text-gray-900">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 font-medium text-sm">Utilized</p>
                    <h3 className="text-4xl font-bold mt-2">{data.stats.utilizedCount}</h3>
                  </div>
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-emerald-600 text-sm font-medium">
                  <span>{data.stats.utilizationPercentage}% Active</span>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-gray-200 shadow-lg group bg-white">
              <CardContent className="relative pt-6 text-gray-900">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 font-medium text-sm">Unused</p>
                    <h3 className="text-4xl font-bold mt-2">{data.stats.unusedCount}</h3>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <XCircle className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-orange-600 text-sm font-medium">
                  <span>Inactive Facilities</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Analytics & Visualization */}
        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border border-gray-200 bg-white">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-lg font-semibold">Utilization Status</CardTitle>
              <CardDescription className="text-sm">Distribution of office usage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-lg font-semibold">Area Coverage</CardTitle>
              <CardDescription className="text-sm">Infrastructure space by status (sq. ft)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={areaByStatus}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar 
                    dataKey="area" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Offices by Status */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Office Details</h2>
            <p className="text-sm text-gray-500 mt-1">Comprehensive list of extension offices</p>
          </div>
          
          <div className="space-y-8">
            {Object.entries(data.groups).map(([status, offices]) => (
              <div key={status} className="bg-gray-50/50 dark:bg-gray-900/20 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    {status === "Utilized" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{status} Offices</h3>
                    <p className="text-sm text-muted-foreground">{offices.length} location{offices.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {offices.map((office) => (
                    <motion.div
                      key={office.id}
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="h-full border-0 shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-800">
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <Badge 
                              variant={status === "Utilized" ? "default" : "secondary"}
                              className={status === "Utilized" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"}
                            >
                              {status}
                            </Badge>
                            {office.areaSquareFeet && (
                              <span className="text-xs font-medium text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                {office.areaSquareFeet.toLocaleString()} sq ft
                              </span>
                            )}
                          </div>
                          
                          <h4 className="font-semibold text-sm mb-2 line-clamp-2" title={office.name}>
                            {office.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-4">{office.type}</p>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                              <span className="text-muted-foreground">Location</span>
                              <span className="font-medium text-right text-xs">{office.location}</span>
                            </div>
                            {office.remarks && (
                              <div className="flex justify-between py-1">
                                <span className="text-muted-foreground">Remarks</span>
                                <span className="font-medium text-right text-xs">{office.remarks}</span>
                              </div>
                            )}
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

        {/* Full Details Table */}
        <section>
          <Card className="border border-gray-200 overflow-hidden bg-white">
            <CardHeader className="bg-gray-50 border-b border-gray-200 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Complete Inventory</CardTitle>
                  <CardDescription className="text-sm mt-1">All extension offices with full details</CardDescription>
                </div>
                <Badge variant="outline" className="text-xs border-gray-200">
                  {data.offices.length} Total
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
                      <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Office Name</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Type</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Location</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider text-right">Area</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.offices.map((office, index) => (
                      <TableRow 
                        key={office.id} 
                        className={`hover:bg-gray-50 transition-colors ${
                          index !== data.offices.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <TableCell className="font-medium text-sm text-gray-900 py-4">
                          {office.name}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{office.type}</TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-xs">{office.location}</TableCell>
                        <TableCell className="text-right text-sm font-mono text-gray-900">
                          {office.areaSquareFeet ? office.areaSquareFeet.toLocaleString() : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`text-xs font-normal ${
                              office.status === "Utilized" 
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700" 
                                : "border-gray-300 bg-gray-50 text-gray-600"
                            }`}
                          >
                            {office.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 max-w-md">
                          {office.remarks || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </motion.div>
    </DepartmentLayout>
  );
}
