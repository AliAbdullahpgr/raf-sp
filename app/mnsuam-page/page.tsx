"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building,
  Building2,
  FlaskConical,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Users,
  Beaker,
  Landmark,
  Leaf,
} from "lucide-react";

interface EstateFacility {
  id: string;
  name: string;
  blockName?: string | null;
  facilityType?: string | null;
  capacityPersons?: number | null;
  capacityLabel?: string | null;
  imageUrl?: string | null;
  displayOrder?: number | null;
  status?: string;
  type?: string;
}

interface AgronomyEquipment {
  id: string;
  name: string;
  type: string;
  quantity?: number | null;
  focalPerson1?: string | null;
  status?: string;
  displayOrder?: number | null;
}

interface ValueAdditionEquipment {
  id: string;
  name: string;
  type: string;
  labName?: string | null;
  roomNumber?: string | null;
  blockName?: string | null;
  quantity: number;
  focalPerson?: string | null;
  status?: string;
  displayOrder?: number | null;
}

interface Department {
  id: string;
  name: string;
  location: string;
  description?: string | null;
  focalPerson?: string | null;
  designation?: string | null;
  phone?: string | null;
  email?: string | null;
}

interface MNSUAMData {
  department: Department;
  facilities: EstateFacility[];
  agronomyEquipment: AgronomyEquipment[];
  valueAdditionEquipment: ValueAdditionEquipment[];
  stats: {
    totalFacilities: number;
    totalCapacity: number;
    blockSummary: { blockName: string; rooms: number; capacity: number }[];
    equipmentSummary: {
      totalTypes: number;
      totalUnits: number;
      equipmentByType: { type: string; count: number }[];
    };
    valueAdditionSummary: {
      totalEquipment: number;
      totalUnits: number;
    };
  };
  focalPersons: { name: string; role: string; email: string }[];
  notes: string;
}

const capacityLabel = (facility: EstateFacility) => {
  if (facility.capacityLabel) return facility.capacityLabel;
  if (facility.capacityPersons) return `${facility.capacityPersons} persons`;
  return "Capacity not specified";
};

export default function MNSUAMPage() {
  const [data, setData] = useState<MNSUAMData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("estate");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/departments/mnsuam");
        if (!response.ok) throw new Error("Failed to fetch data");
        const payload = await response.json();
        setData(payload);
      } catch (error) {
        console.error("Error fetching MNSUAM data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const facilitiesByBlock = useMemo(() => {
    if (!data) return [];
    const grouped = new Map<string, EstateFacility[]>();

    data.facilities.forEach((facility) => {
      const key = facility.blockName || "Other";
      const existing = grouped.get(key) ?? [];
      grouped.set(key, [...existing, facility]);
    });

    return Array.from(grouped.entries())
      .map(([blockName, facilities]) => ({
        blockName,
        facilities: facilities.sort(
          (a, b) => (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER)
        ),
        order: Math.min(...facilities.map((f) => f.displayOrder ?? Number.MAX_SAFE_INTEGER)),
      }))
      .sort((a, b) => a.order - b.order);
  }, [data]);

  const agronomyByType = useMemo(() => {
    if (!data) return [];
    const grouped = new Map<string, AgronomyEquipment[]>();

    data.agronomyEquipment.forEach((item) => {
      const key = item.type || "Other";
      const existing = grouped.get(key) ?? [];
      grouped.set(key, [...existing, item]);
    });

    return Array.from(grouped.entries())
      .map(([type, equipment]) => ({
        type,
        equipment: equipment.sort(
          (a, b) => (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER)
        ),
        order: Math.min(...equipment.map((e) => e.displayOrder ?? Number.MAX_SAFE_INTEGER)),
      }))
      .sort((a, b) => a.order - b.order);
  }, [data]);

  const valueAdditionByLab = useMemo(() => {
    if (!data) return [];
    const grouped = new Map<string, ValueAdditionEquipment[]>();

    data.valueAdditionEquipment.forEach((item) => {
      const key = item.labName || "Other";
      const existing = grouped.get(key) ?? [];
      grouped.set(key, [...existing, item]);
    });

    return Array.from(grouped.entries())
      .map(([labName, equipment]) => ({
        labName,
        equipment: equipment.sort(
          (a, b) => (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER)
        ),
        order: Math.min(...equipment.map((e) => e.displayOrder ?? Number.MAX_SAFE_INTEGER)),
      }))
      .sort((a, b) => a.order - b.order);
  }, [data]);

  const agronomyUnits = useMemo(
    () => data?.agronomyEquipment.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0,
    [data]
  );

  const valueAdditionUnits = useMemo(
    () => data?.valueAdditionEquipment.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0,
    [data]
  );

  if (loading) {
    return <LoadingState message="Loading MNSUAM data..." />;
  }

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Department not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">{data.department.name}</h1>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {data.department.location}
            </p>
          </div>
        </div>

        {/* Department Info */}
        <Card className="border-2 border-[#2678E7]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#2678E7]" />
              Department Information
            </CardTitle>
            <CardDescription className="text-gray-700">{data.department.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                {data.department.focalPerson && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{data.department.designation}</Badge>
                    <span className="font-semibold text-gray-900">{data.department.focalPerson}</span>
                  </div>
                )}
                {data.department.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a href={`mailto:${data.department.email}`} className="text-[#2678E7] hover:underline">
                      {data.department.email}
                    </a>
                  </div>
                )}
                {data.department.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{data.department.phone}</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4 space-y-1">
                    <p className="text-xs text-gray-600">Estate Facilities</p>
                    <div className="text-2xl font-bold text-[#2678E7]">{data.stats.totalFacilities}</div>
                    <p className="text-xs text-gray-600">Across campus blocks</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4 space-y-1">
                    <p className="text-xs text-gray-600">Total Estate Capacity</p>
                    <div className="text-2xl font-bold text-green-700">{data.stats.totalCapacity}</div>
                    <p className="text-xs text-gray-600">Air-conditioned with backup</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                  <CardContent className="p-4 space-y-1">
                    <p className="text-xs text-gray-600">Agronomy Units</p>
                    <div className="text-2xl font-bold text-amber-700">{agronomyUnits}</div>
                    <p className="text-xs text-gray-600">{data.agronomyEquipment.length} equipment lines</p>
                  </CardContent>
                </Card>
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4 space-y-1">
                      <p className="text-xs text-gray-600">Value Addition Lab</p>
                      <div className="text-2xl font-bold text-purple-700">
                        {data.valueAdditionEquipment.length}
                      </div>
                      <p className="text-xs text-gray-600">
                        {valueAdditionByLab.length} labs | {valueAdditionUnits} units
                      </p>
                    </CardContent>
                  </Card>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="estate" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Estate Data
            </TabsTrigger>
            <TabsTrigger value="agronomy" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              Agronomy Department
            </TabsTrigger>
            <TabsTrigger value="valueaddition" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Value Addition & Food Analysis Lab
            </TabsTrigger>
          </TabsList>

          {/* Estate Data Tab */}
          <TabsContent value="estate" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>University Facilities</CardTitle>
                <CardDescription>
                  Following facilities available in MNSUAM can be utilized for South Punjab Regional Agriculture Forum
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {facilitiesByBlock.map(({ blockName, facilities }) => (
                    <div key={blockName} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[#2678E7]">{blockName}</p>
                          <p className="text-xs text-gray-600">
                            {facilities.length} spaces |{" "}
                            {facilities.reduce((sum, item) => sum + (item.capacityPersons || 0), 0) ||
                              "Flexible capacity"}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Estate
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {facilities.map((facility, index) => (
                          <Card
                            key={facility.id}
                            className="border border-gray-200 hover:border-[#2678E7] transition-colors"
                          >
                            <CardContent className="p-4 space-y-2">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-[#2678E7]/10 text-[#2678E7] flex items-center justify-center font-semibold">
                                  {facility.displayOrder ?? index + 1}
                                </div>
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-semibold text-sm leading-tight">{facility.name}</h4>
                                    {facility.facilityType && (
                                      <Badge variant="secondary" className="text-[11px]">
                                        {facility.facilityType}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                                    <span className="inline-flex items-center gap-1">
                                      <Users className="h-4 w-4" />
                                      {capacityLabel(facility)}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                      <Landmark className="h-4 w-4" />
                                      {facility.blockName}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-100 flex gap-3 items-start">
                  <Building className="h-5 w-5 text-[#2678E7] mt-0.5" />
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> All the halls and meeting rooms are fully air conditioned and connected with
                    back-up power supply.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agronomy Department Tab */}
          <TabsContent value="agronomy" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Agronomy Department Equipment</CardTitle>
                <CardDescription>
                  Research-grade instruments spanning balances, analyzers, incubation, and field measurement tools.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4 space-y-1">
                      <p className="text-xs text-gray-600">Equipment Lines</p>
                      <div className="text-2xl font-bold text-[#2678E7]">{data.agronomyEquipment.length}</div>
                      <p className="text-xs text-gray-600">As listed in Agronomy inventory</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4 space-y-1">
                      <p className="text-xs text-gray-600">Total Units</p>
                      <div className="text-2xl font-bold text-green-700">{agronomyUnits}</div>
                      <p className="text-xs text-gray-600">Across measurement and processing</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                    <CardContent className="p-4 space-y-1">
                      <p className="text-xs text-gray-600">Categories</p>
                      <div className="text-2xl font-bold text-amber-700">{agronomyByType.length}</div>
                      <p className="text-xs text-gray-600">Grouped by equipment purpose</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {data.focalPersons.slice(0, 2).map((person) => (
                    <Card key={person.email} className="border border-gray-200">
                      <CardContent className="p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-[#2678E7]" />
                          <p className="font-semibold">{person.name}</p>
                        </div>
                        <p className="text-sm text-gray-600">{person.role}</p>
                        <a href={`mailto:${person.email}`} className="text-sm text-[#2678E7] hover:underline flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {person.email}
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  {agronomyByType.map(({ type, equipment }) => (
                    <Card key={type} className="border border-gray-200">
                      <CardHeader className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Beaker className="h-4 w-4 text-[#2678E7]" />
                            <CardTitle className="text-base">{type}</CardTitle>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {equipment.length} items
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-gray-100">
                          {equipment.map((item, index) => (
                            <div key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-md bg-[#2678E7]/10 text-[#2678E7] flex items-center justify-center text-xs font-semibold">
                                  {item.displayOrder ?? index + 1}
                                </div>
                                <div className="space-y-0.5">
                                  <p className="font-medium text-sm">{item.name}</p>
                                  <p className="text-xs text-gray-600">Focal: {item.focalPerson1 || "Dr. Nabeel Ahmad Ikram"}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="text-xs">
                                  Qty: {item.quantity || 1}
                                </Badge>
                                <Badge
                                  variant={(item.status || "AVAILABLE") === "AVAILABLE" ? "default" : "secondary"}
                                  className={(item.status || "AVAILABLE") === "AVAILABLE" ? "bg-green-500 text-white text-[11px]" : "text-[11px]"}
                                >
                                  {(item.status || "AVAILABLE") === "AVAILABLE" ? "Functional" : item.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Value Addition Lab Tab */}
          <TabsContent value="valueaddition" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Value Addition and Food Analysis Labs</CardTitle>
                <CardDescription className="space-y-2">
                  <p>Quantity: 1 and Functional across both labs.</p>
                  <p className="text-sm">
                    Focal Person:{" "}
                    <a href="mailto:Shabbir.ahmad@mnsuam.edu.pk" className="text-[#2678E7] hover:underline">
                      Dr. Shabbir Ahmad
                    </a>
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4 space-y-1">
                      <p className="text-xs text-gray-600">Equipment Lines</p>
                      <div className="text-2xl font-bold text-purple-700">{data.valueAdditionEquipment.length}</div>
                      <p className="text-xs text-gray-600">{valueAdditionByLab.length} labs covered</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4 space-y-1">
                      <p className="text-xs text-gray-600">Total Units</p>
                      <div className="text-2xl font-bold text-[#2678E7]">{valueAdditionUnits}</div>
                      <p className="text-xs text-gray-600">All marked functional</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                    <CardContent className="p-4 space-y-1">
                      <p className="text-xs text-gray-600">Lab Coverage</p>
                      <div className="text-2xl font-bold text-emerald-700">
                        {valueAdditionByLab.map(({ equipment }) => equipment.length).reduce((a, b) => a + b, 0)}
                      </div>
                      <p className="text-xs text-gray-600">Items across both labs</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  {valueAdditionByLab.map(({ labName, equipment }) => {
                    const firstItem = equipment[0];
                    return (
                      <Card key={labName} className="border border-gray-200">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{labName}</CardTitle>
                              <p className="text-sm text-gray-600">
                                Room # {firstItem?.roomNumber} - {firstItem?.blockName}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {equipment.length} items
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {equipment.map((item, index) => (
                            <Card
                              key={item.id}
                              className="border border-gray-200 hover:border-[#2678E7] transition-colors shadow-sm"
                            >
                              <CardContent className="p-4 space-y-2">
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0 w-8 h-8 bg-[#2678E7]/10 rounded-full flex items-center justify-center text-xs font-bold text-[#2678E7]">
                                    {item.displayOrder ?? index + 1}
                                  </div>
                                  <div className="space-y-1 flex-1">
                                    <p className="font-semibold text-sm">{item.name}</p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Badge variant="outline" className="text-[11px]">
                                        {item.type}
                                      </Badge>
                                      {item.quantity > 1 && (
                                        <Badge variant="secondary" className="text-[11px]">
                                          Qty: {item.quantity}
                                        </Badge>
                                      )}
                                    </div>
                                    <Badge
                                      variant={(item.status || "AVAILABLE") === "AVAILABLE" ? "default" : "secondary"}
                                      className={(item.status || "AVAILABLE") === "AVAILABLE" ? "bg-green-500 text-white text-[11px]" : "text-[11px]"}
                                    >
                                      {(item.status || "AVAILABLE") === "AVAILABLE" ? "Functional" : item.status}
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
