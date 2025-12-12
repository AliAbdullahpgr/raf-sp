"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  BarChart3, 
  Users, 
  Leaf, 
  Thermometer, 
  Sparkles,
  Microscope,
  Warehouse,
  Presentation,
  GraduationCap,
  Sprout,
  MapPin,
  Phone,
  Mail,
  Calendar
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { DepartmentLayout } from "./department-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Facility {
  id: string;
  name: string;
  blockName: string | null;
  facilityType: string | null;
  capacityPersons: number | null;
  imageUrl: string | null;
  type: string;
}

interface AgronomyEquipment {
  id: string;
  name: string;
  type: string;
  quantity: number | null;
  focalPerson1: string | null;
}

interface BlockSummary {
  blockName: string;
  rooms: number;
  capacity: number;
}

interface EquipmentTypeStat {
  type: string;
  count: number;
}

interface MNSUAMData {
  department: {
    id: string;
    name: string;
    location: string;
    description: string | null;
    focalPerson: string | null;
    designation: string | null;
    phone: string | null;
    email: string | null;
  };
  facilities: Facility[];
  agronomyEquipment: AgronomyEquipment[];
  stats: {
    totalFacilities: number;
    totalCapacity: number;
    blockSummary: BlockSummary[];
    equipmentSummary: {
      totalTypes: number;
      totalUnits: number;
      equipmentByType: EquipmentTypeStat[];
    };
  };
  focalPersons: { name: string; role: string; email: string }[];
  notes: string;
}

const piePalette = ["#166534", "#15803d", "#16a34a", "#22c55e", "#4ade80", "#86efac"];

const getFacilityIcon = (type: string | null, name: string) => {
  const lowerName = name.toLowerCase();
  const lowerType = type?.toLowerCase() || "";

  if (lowerName.includes("lab") || lowerType.includes("lab")) return Microscope;
  if (lowerName.includes("hall") || lowerType.includes("hall")) return Presentation;
  if (lowerName.includes("farm") || lowerType.includes("farm")) return Sprout;
  if (lowerName.includes("store") || lowerType.includes("store")) return Warehouse;
  if (lowerName.includes("class") || lowerType.includes("academic")) return GraduationCap;
  
  return Building2;
};

export function MNSUAMPage() {
  const [data, setData] = useState<MNSUAMData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departments/mnsuam")
      .then((res) => res.json())
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching MNSUAM data:", error);
        setLoading(false);
      });
  }, []);

  const facilityDistribution = useMemo(() => {
    if (!data) return [];
    return data.stats.blockSummary.map((block, idx) => ({
      ...block,
      fill: piePalette[idx % piePalette.length],
    }));
  }, [data]);

  const equipmentDistribution = useMemo(() => {
    if (!data) return [];
    return data.stats.equipmentSummary.equipmentByType.map((item, idx) => ({
      ...item,
      fill: piePalette[idx % piePalette.length],
    }));
  }, [data]);

  if (loading) {
    return (
      <DepartmentLayout
        name="MNS University of Agriculture"
        description="Vibrant agricultural university offering collaborative facilities and research-grade equipment."
        image="/images/mns.png.jpg"
        focalPerson={{
          name: "Loading...",
          designation: "Loading...",
          phone: "",
          email: "",
        }}
      >
        <div className="space-y-6">
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
        name="MNS University of Agriculture"
        description="Vibrant agricultural university offering collaborative facilities and research-grade equipment."
        image="/images/mns.png.jpg"
        focalPerson={{
          name: "Dr. Mahmood Alam",
          designation: "Directorate of University Farms",
          phone: "+92-61-9210071",
          email: "mahmood.alam@mnsuam.edu.pk",
        }}
      >
        <Card className="p-6">
          <p className="text-muted-foreground">No data available. Please try again later.</p>
        </Card>
      </DepartmentLayout>
    );
  }

  return (
    <DepartmentLayout
      name={data.department.name}
      description={
        data.department.description ||
        "Vibrant agricultural university providing research-driven facilities, modern labs, and collaborative spaces for South Punjab Regional Agriculture Forum."
      }
      image="/images/mns.png.jpg"
      focalPerson={{
        name: data.department.focalPerson || "Dr. Mahmood Alam",
        designation: data.department.designation || "Directorate of University Farms",
        phone: data.department.phone || "+92-61-9210071",
        email: data.department.email || "mahmood.alam@mnsuam.edu.pk",
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
        }}
        className="space-y-12"
      >
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <Card className="relative overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Building2 className="w-24 h-24 text-primary" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2 text-primary font-medium">
                  <Building2 className="w-4 h-4" />
                  <span>Estate Facilities</span>
                </div>
                <div className="text-4xl font-bold text-foreground">{data.stats.totalFacilities}</div>
                <p className="text-sm text-muted-foreground mt-1">Research & training spaces</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <Card className="relative overflow-hidden border-l-4 border-l-secondary shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Users className="w-24 h-24 text-secondary" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2 text-secondary font-medium">
                  <Users className="w-4 h-4" />
                  <span>Total Capacity</span>
                </div>
                <div className="text-4xl font-bold text-foreground">{data.stats.totalCapacity}</div>
                <p className="text-sm text-muted-foreground mt-1">Person capacity with backup power</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <Card className="relative overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Leaf className="w-24 h-24 text-primary" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2 text-primary font-medium">
                  <Leaf className="w-4 h-4" />
                  <span>Agronomy Toolkit</span>
                </div>
                <div className="text-4xl font-bold text-foreground">
                  {data.stats.equipmentSummary.totalUnits}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Units across {data.stats.equipmentSummary.totalTypes} specialized instruments
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <motion.div
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-primary" />
                Capacity by Block
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={facilityDistribution} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="blockName" 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: "8px", 
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--card))",
                      color: "hsl(var(--foreground))"
                    }} 
                  />
                  <Bar dataKey="capacity" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-sm pb-5 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Thermometer className="w-5 h-5 text-secondary" />
                Equipment Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={equipmentDistribution}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {equipmentDistribution.map((item, idx) => (
                      <Cell key={item.type} fill={item.fill} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: "8px", 
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--card))",
                      color: "hsl(var(--foreground))"
                    }} 
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-sm text-muted-foreground ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Facilities Grid */}
        <motion.section
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold tracking-tight">Estate Facilities</h3>
              <p className="text-muted-foreground">Comprehensive infrastructure for research and academic activities</p>
            </div>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Calendar className="w-4 h-4 mr-2" />
              Check Availability
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {data.facilities.map((facility, idx) => {
              const Icon = getFacilityIcon(facility.facilityType, facility.name);
              return (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Card className="h-full hover:shadow-md transition-all duration-300 border-border/50 group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                          <Icon className="w-6 h-6" />
                        </div>
                        <Badge variant="secondary" className="font-normal">
                          {facility.type}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {facility.blockName}
                        </p>
                        <h4 className="text-lg font-semibold text-foreground line-clamp-2 min-h-[3.5rem]">
                          {facility.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/50">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            <span>{facility.capacityPersons || "N/A"} Capacity</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4" />
                            <span>{facility.facilityType}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          
          {data.notes && (
            <div className="bg-muted/30 border border-border rounded-lg p-4 flex gap-3 items-start">
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{data.notes}</p>
            </div>
          )}
        </motion.section>

        {/* Equipment Table */}
        <motion.section
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="space-y-6"
        >
          <div className="space-y-1">
            <h3 className="text-2xl font-bold tracking-tight">Agronomy Equipment</h3>
            <p className="text-muted-foreground">Specialized tools and machinery for agricultural research</p>
          </div>

          <Card className="overflow-hidden border-border/50 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium">
                  <tr>
                    <th className="py-4 px-6">Equipment Name</th>
                    <th className="py-4 px-6">Type / Category</th>
                    <th className="py-4 px-6 text-center">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {data.agronomyEquipment.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                            <Microscope className="w-4 h-4" />
                          </div>
                          {item.name}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        <Badge variant="outline" className="font-normal">
                          {item.type}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center min-w-[2rem] h-8 rounded-full bg-secondary/10 text-secondary-foreground font-medium px-2">
                          {item.quantity}
                        </span>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold tracking-tight">Key Contacts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.focalPersons.map((person, idx) => (
              <Card
                key={person.email}
                className="overflow-hidden border-border/50 hover:border-primary/50 transition-colors"
              >
                <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={idx === 0 ? "default" : "secondary"}>
                        {idx === 0 ? "University Farms" : "Agronomy Department"}
                      </Badge>
                    </div>
                    <h4 className="text-xl font-bold">{person.name}</h4>
                    <p className="text-muted-foreground font-medium">{person.role}</p>
                    
                    <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-border/50">
                      <a href={`mailto:${person.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="w-4 h-4" />
                        {person.email}
                      </a>
                      {idx === 0 && (
                        <a href={`tel:${data.department.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                          <Phone className="w-4 h-4" />
                          {data.department.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </DepartmentLayout>
  );
}
