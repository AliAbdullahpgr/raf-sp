"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSuperAdminOverview } from "@/actions/super-admin";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Boxes,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock,
  Download,
  Eye,
  FileText,
  History,
  Mail,
  MapPin,
  Monitor,
  MoreHorizontal,
  Package,
  PanelRightOpen,
  Phone,
  Printer,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  UserCheck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SuperAdminAnalytics } from "@/components/dashboard/super-admin-analytics";
import { SuperAdminRequestFlow } from "@/components/dashboard/super-admin-request-flow";

type DashboardData = {
  totalDepartments: number;
  totalUsers: number;
  totalPageViews: number;
  todayPageViews: number;
  resourceTotals: ResourceStats;
  requestTotals: RequestStats;
  departmentOperations: DepartmentOperation[];
  recentResourceRequests: RecentRequest[];
  interDepartmentRequests: InterDepartmentRequest[];
  publicDeptViewMap: Record<string, number>;
  adminDeptViewMap: Record<string, number>;
  slugNameMap: Record<string, string>;
};

type ResourceStats = {
  total: number;
  available: number;
  inUse: number;
  needsRepair: number;
  discarded: number;
};

type RequestStats = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  expired: number;
  borrowed: number;
  returned: number;
  overdue: number;
};

type DepartmentOperation = {
  id: string;
  name: string;
  location: string;
  focalPerson: string | null;
  designation: string | null;
  email: string | null;
  phone: string | null;
  staffUsers: number;
  knownStaffPositions: number;
  positionRecords: number;
  sanctionedPositions: number;
  vacantPositions: number;
  resources: ResourceStats;
  outgoingRequests: RequestStats;
  incomingRequests: RequestStats;
  totalRequestActivity: number;
  openRequestLoad: number;
  publicViews: number;
  adminViews: number;
};

type RecentRequest = {
  id: string;
  resourceName: string;
  resourceType: string;
  status: string;
  createdAt: string | Date;
  requestingDept: { id: string; name: string };
  lendingDept: { id: string; name: string };
  requestedBy: { id: string; name: string; email: string };
};

type InterDepartmentRequest = {
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

type FocusFilter = "all" | "attention" | "requests" | "repairs" | "contacts";
type MainDashboardTab = "overview" | "departments" | "requests" | "activity";
type FlowItem = [label: string, value: number, icon: LucideIcon, className: string];

type DerivedDepartment = DepartmentOperation & {
  availability: number;
  openIncoming: number;
  openOutgoing: number;
  attention: boolean;
  contactIncomplete: boolean;
  issueCount: number;
};

type TimelineItem = {
  id: string;
  title: string;
  detail: string;
  date: string | Date;
  status: string;
};

type DashboardSettings = {
  defaultFocus?: FocusFilter;
  showTimeline?: boolean;
  showTrafficCards?: boolean;
};

const settingsStorageKey = "raf-sp-super-admin-settings";

const statusStyles: Record<string, string> = {
  PENDING: "border-slate-200 bg-slate-50 text-slate-700",
  APPROVED: "border-slate-200 bg-slate-50 text-slate-700",
  BORROWED: "border-slate-200 bg-slate-50 text-slate-700",
  OVERDUE: "border-slate-200 bg-slate-50 text-slate-700",
  REJECTED: "border-slate-200 bg-slate-50 text-slate-700",
  RETURNED: "border-slate-200 bg-slate-50 text-slate-700",
  EXPIRED: "border-slate-200 bg-slate-50 text-slate-700",
};

const focusLabels: Record<FocusFilter, string> = {
  all: "All",
  attention: "Attention",
  requests: "Requests",
  repairs: "Repairs",
  contacts: "Contacts",
};

function formatNumber(value = 0) {
  return value.toLocaleString();
}

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function availabilityPercent(resources: ResourceStats) {
  if (!resources.total) return 0;
  return Math.round((resources.available / resources.total) * 100);
}

function openRequests(requests: RequestStats) {
  return requests.pending + requests.approved + requests.borrowed + requests.overdue;
}

function isContactIncomplete(department: DepartmentOperation) {
  return !department.focalPerson || !department.email || !department.phone;
}

function needsAttention(department: DepartmentOperation) {
  return (
    department.resources.needsRepair > 0 ||
    department.vacantPositions > 0 ||
    department.incomingRequests.pending > 0 ||
    department.outgoingRequests.pending > 0 ||
    department.incomingRequests.overdue > 0 ||
    department.outgoingRequests.overdue > 0 ||
    isContactIncomplete(department)
  );
}

function getIssueCount(department: DepartmentOperation) {
  return (
    department.resources.needsRepair +
    department.vacantPositions +
    department.incomingRequests.pending +
    department.outgoingRequests.pending +
    department.incomingRequests.overdue +
    department.outgoingRequests.overdue +
    (isContactIncomplete(department) ? 1 : 0)
  );
}

function csvEscape(value: string | number | null | undefined) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportDepartmentsCsv(departments: DerivedDepartment[]) {
  const headers = [
    "Department",
    "Location",
    "Users",
    "Sanctioned Posts",
    "Filled Posts",
    "Vacant Posts",
    "Resources Total",
    "Resources Ready",
    "Resources Repair",
    "Incoming Open",
    "Outgoing Open",
    "Pending Requests",
    "Overdue Requests",
    "Public Views",
    "Admin Views",
    "Focal Person",
    "Email",
    "Phone",
  ];
  const rows = departments.map((department) => [
    department.name,
    department.location,
    department.staffUsers,
    department.sanctionedPositions,
    department.knownStaffPositions,
    department.vacantPositions,
    department.resources.total,
    department.resources.available,
    department.resources.needsRepair,
    department.openIncoming,
    department.openOutgoing,
    department.incomingRequests.pending + department.outgoingRequests.pending,
    department.incomingRequests.overdue + department.outgoingRequests.overdue,
    department.publicViews,
    department.adminViews,
    department.focalPerson,
    department.email,
    department.phone,
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
  downloadFile("super-admin-departments.csv", csv, "text/csv;charset=utf-8");
}

function exportRequestsCsv(requests: RecentRequest[]) {
  const headers = ["Resource", "Type", "Status", "Requested At", "Requesting Department", "Lending Department", "Requested By"];
  const rows = requests.map((request) => [
    request.resourceName,
    request.resourceType,
    request.status,
    new Date(request.createdAt).toISOString(),
    request.requestingDept.name,
    request.lendingDept.name,
    request.requestedBy.name,
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
  downloadFile("super-admin-resource-requests.csv", csv, "text/csv;charset=utf-8");
}

function exportOverviewJson(data: DashboardData) {
  downloadFile(
    "super-admin-overview.json",
    JSON.stringify(data, null, 2),
    "application/json;charset=utf-8"
  );
}

const dashboardRouteByDepartmentId: Record<string, string> = {
  mnsuam: "/dashboard/mnsuam",
  amri: "/dashboard/amri",
  rari: "/dashboard/rari",
  flori: "/dashboard/floriculture",
  "soil-water": "/dashboard/soil-water",
  ento: "/dashboard/entomology",
  mri: "/dashboard/mri",
  ext: "/dashboard/agri-extension",
  "cotton-institute": "/dashboard/cri",
  pest: "/dashboard/pesticide",
  raedc: "/dashboard/raedc",
  "agri-eng": "/dashboard/agri-engineering",
  arc: "/dashboard/adaptive-research",
};

function getDepartmentDashboardRoute(departmentId: string) {
  return dashboardRouteByDepartmentId[departmentId] || "/dashboard";
}

function KpiCard({
  title,
  value,
  detail,
  icon: Icon,
  className,
}: {
  title: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  className: string;
}) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</div>
            <div className="mt-2 text-2xl font-bold text-slate-950">{value}</div>
            <div className="mt-1 text-xs text-slate-500">{detail}</div>
          </div>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${className}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionTitle({
  number,
  title,
  caption,
}: {
  number: string;
  title: string;
  caption: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
        {number}
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{caption}</p>
      </div>
    </div>
  );
}

export default function SuperAdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState<FocusFilter>("all");
  const [mainTab, setMainTab] = useState<MainDashboardTab>("overview");
  const [selectedDepartment, setSelectedDepartment] = useState<DerivedDepartment | null>(null);
  const [dashboardSettings, setDashboardSettings] = useState<DashboardSettings>({
    showTimeline: true,
    showTrafficCards: true,
  });

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const result = await getSuperAdminOverview();
      if (result.success) {
        setData(result.data);
        setErrorMessage(null);
      } else {
        setErrorMessage(result.message ?? "Failed to load overview");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const raw = window.localStorage.getItem(settingsStorageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as DashboardSettings;
      setDashboardSettings((current) => ({ ...current, ...parsed }));
      if (parsed.defaultFocus && parsed.defaultFocus !== focus) {
        setFocus(parsed.defaultFocus);
      }
    } catch {
      window.localStorage.removeItem(settingsStorageKey);
    }
  }, []);

  const derived = useMemo(() => {
    if (!data) return null;

    const totalPublicViews = Object.values(data.publicDeptViewMap).reduce((sum, views) => sum + views, 0);
    const totalAdminViews = Object.values(data.adminDeptViewMap).reduce((sum, views) => sum + views, 0);
    const departments = data.departmentOperations.map((department) => ({
      ...department,
      availability: availabilityPercent(department.resources),
      openIncoming: openRequests(department.incomingRequests),
      openOutgoing: openRequests(department.outgoingRequests),
      attention: needsAttention(department),
      contactIncomplete: isContactIncomplete(department),
      issueCount: getIssueCount(department),
    }));

    const requestDepartments = departments.filter(
      (department) => department.openIncoming > 0 || department.openOutgoing > 0
    );
    const repairDepartments = departments.filter((department) => department.resources.needsRepair > 0);
    const contactDepartments = departments.filter((department) => department.contactIncomplete);
    const search = query.trim().toLowerCase();

    const filteredDepartments = departments
      .filter((department) => {
        if (focus === "attention" && !department.attention) return false;
        if (focus === "requests" && department.openIncoming + department.openOutgoing === 0) return false;
        if (focus === "repairs" && department.resources.needsRepair === 0) return false;
        if (focus === "contacts" && !department.contactIncomplete) return false;
        if (!search) return true;

        return [department.name, department.location, department.focalPerson, department.email, department.phone]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search));
      })
      .sort((a, b) => {
        if (a.attention !== b.attention) return Number(b.attention) - Number(a.attention);
        const aOpenIssues = a.issueCount;
        const bOpenIssues = b.issueCount;
        if (aOpenIssues !== bOpenIssues) return bOpenIssues - aOpenIssues;
        return b.resources.total - a.resources.total;
      });

    const strongestDepartments = [...departments]
      .sort((a, b) => b.resources.total - a.resources.total)
      .slice(0, 6);

    const timelineItems: TimelineItem[] = data.recentResourceRequests.slice(0, 8).map((request) => ({
      id: request.id,
      title: `${request.status.toLowerCase().replace("_", " ")} request`,
      detail: `${request.requestingDept.name} requested ${request.resourceName} from ${request.lendingDept.name}`,
      date: request.createdAt,
      status: request.status,
    }));

    return {
      departments,
      requestDepartments,
      repairDepartments,
      contactDepartments,
      filteredDepartments,
      strongestDepartments,
      timelineItems,
      totalPublicViews,
      totalAdminViews,
      openRequests:
        data.requestTotals.pending +
        data.requestTotals.approved +
        data.requestTotals.borrowed +
        data.requestTotals.overdue,
    };
  }, [data, focus, query]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading super admin overview...</div>
      </div>
    );
  }

  if (!data || !derived) {
    return (
      <div className="py-12 text-center text-red-500">
        Failed to load data
        {errorMessage && <div className="mt-2 text-sm text-red-400">{errorMessage}</div>}
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="border-b border-slate-200 p-5 lg:border-b-0 lg:border-r lg:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-950 lg:text-3xl">Super Admin Command Center</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    A structured view of department capacity, resource health, pending movement, repairs, and contact coverage.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchData(true)}
                  disabled={refreshing}
                  className="w-fit gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                  {refreshing ? "Refreshing..." : "Refresh"}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 w-9 p-0" aria-label="Dashboard actions">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem onClick={() => exportDepartmentsCsv(derived.departments)}>
                      <Download className="h-4 w-4" />
                      Departments CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportRequestsCsv(data.recentResourceRequests)}>
                      <FileText className="h-4 w-4" />
                      Requests CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportOverviewJson(data)}>
                      <Download className="h-4 w-4" />
                      Full JSON export
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.print()}>
                      <Printer className="h-4 w-4" />
                      Print dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/super-admin/settings">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-y divide-slate-200 sm:grid-cols-4 lg:grid-cols-2">
            <div className="p-4">
              <div className="text-xs font-medium text-slate-500">Departments</div>
              <div className="mt-1 text-2xl font-bold text-slate-950">{data.totalDepartments}</div>
            </div>
            <div className="p-4">
              <div className="text-xs font-medium text-slate-500">Users</div>
              <div className="mt-1 text-2xl font-bold text-slate-950">{formatNumber(data.totalUsers)}</div>
            </div>
            <div className="p-4">
              <div className="text-xs font-medium text-slate-500">Resources</div>
              <div className="mt-1 text-2xl font-bold text-slate-950">{formatNumber(data.resourceTotals.total)}</div>
            </div>
            <div className="p-4">
              <div className="text-xs font-medium text-slate-500">Open Items</div>
              <div className="mt-1 text-2xl font-bold text-slate-950">{formatNumber(derived.openRequests)}</div>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Dashboard Graphs</h2>
            <p className="mt-1 text-sm text-slate-500">
              Resource status and request movement stay visible while you switch between detail tabs.
            </p>
          </div>
          <Badge variant="outline" className="w-fit border-slate-200 bg-white text-slate-700">
            {formatNumber(data.todayPageViews)} views today
          </Badge>
        </div>
        <SuperAdminAnalytics
          resourceTotals={data.resourceTotals}
          requestTotals={data.requestTotals}
        />
      </section>

      <section className="space-y-4">
        <SectionTitle
          number="1"
          title="Inter-Department Request Flow"
          caption="Which department requested resources from which department, and the current status of those requests."
        />
        <SuperAdminRequestFlow pairs={data.interDepartmentRequests} />
      </section>

      <Tabs value={mainTab} onValueChange={(value) => setMainTab(value as MainDashboardTab)}>
        <div className="sticky top-0 z-20 -mx-1 bg-background/95 px-1 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <TabsList className="grid h-auto w-full grid-cols-4 bg-slate-100 p-1">
            <TabsTrigger value="overview" className="gap-2 px-2 text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="departments" className="gap-2 px-2 text-xs sm:text-sm">
              <Building2 className="h-4 w-4" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-2 px-2 text-xs sm:text-sm">
              <ClipboardList className="h-4 w-4" />
              Request Status
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2 px-2 text-xs sm:text-sm">
              <History className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>
        </div>

      <TabsContent value="overview" className="mt-0 space-y-4">
      <section className="space-y-4">
        <SectionTitle
          number="1"
          title="Executive Snapshot"
          caption="High level operating position across departments, inventory, requests, and traffic."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <KpiCard
            title="Available Resources"
            value={formatNumber(data.resourceTotals.available)}
            detail={`${availabilityPercent(data.resourceTotals)}% of all tracked resources`}
            icon={CheckCircle2}
            className="bg-blue-50 text-blue-700"
          />
          <KpiCard
            title="Request Pipeline"
            value={formatNumber(data.requestTotals.total)}
            detail={`${data.requestTotals.pending} pending, ${data.requestTotals.overdue} overdue`}
            icon={ClipboardList}
            className="bg-blue-50 text-blue-700"
          />
          <KpiCard
            title="Department Views"
            value={formatNumber(derived.totalPublicViews + derived.totalAdminViews)}
            detail={`${formatNumber(data.todayPageViews)} views in the last 24 hours`}
            icon={Eye}
            className="bg-blue-50 text-blue-700"
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle
          number="2"
          title="Priority Review"
          caption="A clean view of request movement across pending, approved, borrowed, returned, and not approved states."
        />
        <div className="grid gap-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-slate-950">
                <Activity className="h-5 w-5 text-slate-500" />
                Request Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {([
                  ["Pending", data.requestTotals.pending, Clock, "border-slate-200 bg-white text-slate-800"],
                  ["Approved", data.requestTotals.approved, CheckCircle2, "border-slate-200 bg-white text-slate-800"],
                  ["Borrowed", data.requestTotals.borrowed, ArrowUpRight, "border-slate-200 bg-white text-slate-800"],
                  ["Overdue", data.requestTotals.overdue, AlertTriangle, "border-slate-200 bg-white text-slate-800"],
                  ["Returned", data.requestTotals.returned, Package, "border-slate-200 bg-white text-slate-800"],
                  ["Not approved", data.requestTotals.rejected + data.requestTotals.expired, ClipboardList, "border-slate-200 bg-white text-slate-800"],
                ] satisfies FlowItem[]).map(([label, value, Icon, style]) => (
                  <div key={label} className={`rounded-lg border p-3 ${style}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{label}</span>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-2xl font-bold">{formatNumber(value)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      </TabsContent>

      <TabsContent value="departments" className="mt-0 space-y-4">
      <section className="space-y-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <SectionTitle
            number="4"
            title="Department Operations Matrix"
            caption="Search, filter, and compare department capacity, machinery, requests, contact coverage, and traffic."
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-[260px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search departments..."
                className="pl-9"
              />
            </div>
            <Tabs value={focus} onValueChange={(value) => setFocus(value as FocusFilter)}>
              <TabsList className="flex h-auto w-full justify-start overflow-x-auto bg-slate-100 p-1 sm:w-auto">
                {(Object.keys(focusLabels) as FocusFilter[]).map((key) => (
                  <TabsTrigger key={key} value={key} className="min-w-fit px-3 text-xs">
                    {focusLabels[key]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <Badge variant="outline" className="justify-center rounded-lg border-slate-200 bg-white py-2 text-slate-700">
            {derived.departments.length} total
          </Badge>
          <Badge variant="outline" className="justify-center rounded-lg border-slate-200 bg-white py-2 text-slate-700">
            {derived.requestDepartments.length} requests
          </Badge>
          <Badge variant="outline" className="justify-center rounded-lg border-slate-200 bg-white py-2 text-slate-700">
            {derived.repairDepartments.length} repairs
          </Badge>
          <Badge variant="outline" className="justify-center rounded-lg border-slate-200 bg-white py-2 text-slate-700">
            {derived.contactDepartments.length} contacts
          </Badge>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="w-[34%] px-4 py-3 font-semibold">Department</th>
                    <th className="w-[18%] px-4 py-3 font-semibold">Capacity</th>
                    <th className="w-[18%] px-4 py-3 font-semibold">Requests</th>
                    <th className="w-[22%] px-4 py-3 font-semibold">Coverage</th>
                    <th className="w-[8%] px-4 py-3 text-right font-semibold">Menu</th>
                  </tr>
                </thead>
                <tbody>
                  {derived.filteredDepartments.map((department) => {
                    const pendingRequests = department.incomingRequests.pending + department.outgoingRequests.pending;
                    const overdueRequests = department.incomingRequests.overdue + department.outgoingRequests.overdue;
                    const openTotal = department.openIncoming + department.openOutgoing;
                    const contactItems = [
                      { label: "Focal", ready: Boolean(department.focalPerson) },
                      { label: "Email", ready: Boolean(department.email) },
                      { label: "Phone", ready: Boolean(department.phone) },
                    ];

                    return (
                      <tr key={department.id} className="border-b border-slate-100 align-middle last:border-0 hover:bg-slate-50/70">
                        <td className="px-4 py-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
                              <Building2 className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-semibold text-slate-950">{department.name}</div>
                              <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{department.location}</span>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                <Badge variant="outline" className="border-slate-200 bg-white text-[11px] text-slate-600">
                                  <Users className="h-3 w-3" />
                                  {department.staffUsers} users
                                </Badge>
                                <Badge variant="outline" className="border-slate-200 bg-white text-[11px] text-slate-600">
                                  <Eye className="h-3 w-3" />
                                  {formatNumber(department.publicViews + department.adminViews)} views
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {department.resources.total > 0 ? (
                            <div className="space-y-2">
                              <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold text-slate-950">{formatNumber(department.resources.available)}</span>
                                <span className="text-xs text-slate-500">ready of {formatNumber(department.resources.total)}</span>
                              </div>
                              <div className="h-1.5 w-full max-w-[150px] overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-blue-600" style={{ width: `${department.availability}%` }} />
                              </div>
                              <div className="text-xs text-slate-500">{department.resources.needsRepair} repair</div>
                            </div>
                          ) : department.sanctionedPositions > 0 ? (
                            <div className="space-y-1">
                              <div className="text-lg font-bold text-slate-950">{formatNumber(department.knownStaffPositions)}</div>
                              <div className="text-xs text-slate-500">
                                filled of {formatNumber(department.sanctionedPositions)} posts
                              </div>
                              {department.vacantPositions > 0 && (
                                <div className="text-xs font-medium text-blue-700">{formatNumber(department.vacantPositions)} vacant</div>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-slate-500">No resource records</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="rounded-md border border-slate-100 bg-white px-2 py-1.5">
                              <div className="font-bold text-slate-950">{openTotal}</div>
                              <div className="text-[10px] text-slate-500">open</div>
                            </div>
                            <div className="rounded-md border border-slate-100 bg-white px-2 py-1.5">
                              <div className="font-bold text-slate-950">{pendingRequests}</div>
                              <div className="text-[10px] text-slate-500">pending</div>
                            </div>
                            <div className="rounded-md border border-slate-100 bg-white px-2 py-1.5">
                              <div className="font-bold text-slate-950">{overdueRequests}</div>
                              <div className="text-[10px] text-slate-500">overdue</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="min-w-0">
                            <div className="truncate text-xs font-medium text-slate-700">
                              {department.focalPerson || "Missing focal person"}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {contactItems.map((item) => (
                                <Badge
                                  key={item.label}
                                  variant="outline"
                                  className={`border-slate-200 text-[11px] ${
                                    item.ready ? "bg-white text-slate-600" : "bg-slate-100 text-slate-500"
                                  }`}
                                >
                                  {item.label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0" aria-label={`${department.name} actions`}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => setSelectedDepartment(department)}>
                                <PanelRightOpen className="h-4 w-4" />
                                Details
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={getDepartmentDashboardRoute(department.id)}>
                                  <ArrowUpRight className="h-4 w-4" />
                                  Dashboard
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/departments/${department.id}`}>
                                  <Eye className="h-4 w-4" />
                                  Public page
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {derived.filteredDepartments.length === 0 && (
              <div className="py-10 text-center text-sm text-slate-500">No departments match the current filter.</div>
            )}
          </CardContent>
        </Card>
      </section>

      </TabsContent>
      <TabsContent value="requests" className="mt-0 space-y-4">
        <section className="space-y-4">
          <SectionTitle
            number="4"
            title="Request Status Detail"
            caption="Compact counts for each request status. The full department-to-department flow stays visible above the tabs."
          />
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {([
                  ["Pending", data.requestTotals.pending, Clock, "requests waiting for action"],
                  ["Approved", data.requestTotals.approved, CheckCircle2, "approved but not necessarily borrowed"],
                  ["Borrowed", data.requestTotals.borrowed, ArrowUpRight, "currently with requesting department"],
                  ["Overdue", data.requestTotals.overdue, AlertTriangle, "needs follow-up"],
                  ["Returned", data.requestTotals.returned, Package, "completed movement"],
                  ["Not approved", data.requestTotals.rejected + data.requestTotals.expired, ClipboardList, "rejected or expired"],
                ] satisfies [string, number, LucideIcon, string][]).map(([label, value, Icon, detail]) => (
                  <div key={label} className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-950">{label}</span>
                      <Icon className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="mt-2 text-2xl font-bold text-slate-950">{formatNumber(value)}</div>
                    <div className="mt-1 text-xs text-slate-500">{detail}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

      </TabsContent>
      <TabsContent value="activity" className="mt-0 space-y-4">
      <section className="space-y-4">
        <SectionTitle
          number="6"
          title="Resource And Movement Detail"
          caption="Inventory concentration, latest resource requests, and quick links into traffic analytics."
        />
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-slate-950">
                <Boxes className="h-5 w-5 text-slate-500" />
                Largest Resource Pools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {derived.strongestDepartments.map((department) => {
                const maxResources = Math.max(...derived.strongestDepartments.map((item) => item.resources.total), 1);
                return (
                  <div key={department.id}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span className="truncate font-medium text-slate-900">{department.name}</span>
                      <span className="font-semibold text-slate-950">{formatNumber(department.resources.total)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-900"
                        style={{ width: `${Math.max((department.resources.total / maxResources) * 100, 3)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-slate-950">
                <Send className="h-5 w-5 text-slate-500" />
                Recent Resource Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.recentResourceRequests.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-500">No resource requests yet</div>
              )}
              {data.recentResourceRequests.map((request) => (
                <div key={request.id} className="grid grid-cols-[1fr_auto] gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-950">{request.resourceName}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {request.requestingDept.name} requested from {request.lendingDept.name}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">{formatDate(request.createdAt)}</div>
                  </div>
                  <Badge variant="outline" className={statusStyles[request.status] || "border-slate-200"}>
                    {request.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className={`grid gap-4 ${dashboardSettings.showTrafficCards !== false ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2"}`}>
          {dashboardSettings.showTrafficCards !== false && (
            <>
              <Link href="/dashboard/super-admin/department-views" className="block">
                <Card className="h-full border-slate-200 shadow-sm transition-colors hover:border-slate-400">
                  <CardContent className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">Public Department Views</div>
                      <div className="mt-1 text-2xl font-bold text-slate-950">{formatNumber(derived.totalPublicViews)}</div>
                    </div>
                    <BarChart3 className="h-5 w-5 text-slate-600" />
                  </CardContent>
                </Card>
              </Link>
              <Link href="/dashboard/super-admin/admin-views" className="block">
                <Card className="h-full border-slate-200 shadow-sm transition-colors hover:border-slate-400">
                  <CardContent className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">Admin Dashboard Views</div>
                      <div className="mt-1 text-2xl font-bold text-slate-950">{formatNumber(derived.totalAdminViews)}</div>
                    </div>
                    <Monitor className="h-5 w-5 text-slate-600" />
                  </CardContent>
                </Card>
              </Link>
            </>
          )}
          <Card className="border-slate-200 shadow-sm transition-colors hover:border-slate-400">
            <CardContent className="p-0">
              <button
                type="button"
                onClick={() => exportOverviewJson(data)}
                className="flex h-full w-full items-center justify-between gap-3 p-4 text-left"
              >
                <span>
                  <span className="block text-sm font-semibold text-slate-950">Full Data Export</span>
                  <span className="mt-1 block text-2xl font-bold text-slate-950">JSON</span>
                </span>
                <Download className="h-5 w-5 text-slate-600" />
              </button>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div>
                <div className="text-sm font-semibold text-slate-950">Repair Queue</div>
                <div className="mt-1 text-2xl font-bold text-slate-950">{formatNumber(data.resourceTotals.needsRepair)}</div>
              </div>
              <Wrench className="h-5 w-5 text-slate-600" />
            </CardContent>
          </Card>
        </div>
      </section>

      {dashboardSettings.showTimeline !== false && (
        <section className="space-y-4">
          <SectionTitle
            number="7"
            title="Super Admin Timeline"
            caption="A simple log of the latest resource movement so the command center shows what changed recently."
          />
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-0">
              {derived.timelineItems.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-500">No timeline activity yet</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {derived.timelineItems.map((item, index) => (
                    <div key={item.id} className="grid gap-3 p-4 sm:grid-cols-[32px_1fr_auto] sm:items-start">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        <History className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold capitalize text-slate-950">{item.title}</span>
                          <Badge variant="outline" className={statusStyles[item.status] || "border-slate-200"}>
                            {item.status}
                          </Badge>
                        </div>
                        <div className="mt-1 text-sm text-slate-500">{item.detail}</div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <CalendarClock className="h-4 w-4" />
                        {index === 0 ? "Latest" : formatDate(item.date)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}
      </TabsContent>
      </Tabs>

      <Dialog open={!!selectedDepartment} onOpenChange={(open) => !open && setSelectedDepartment(null)}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          {selectedDepartment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl text-slate-950">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
                    <Building2 className="h-5 w-5" />
                  </div>
                  {selectedDepartment.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedDepartment.location} - detailed operating view for resources, posts, requests, traffic, and contact coverage.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-3 md:grid-cols-4">
                <KpiCard
                  title="Open Issues"
                  value={selectedDepartment.issueCount}
                  detail="direct count of repair, vacancy, request, and contact gaps"
                  icon={AlertTriangle}
                  className="bg-blue-50 text-blue-700"
                />
                <KpiCard
                  title="Ready Resources"
                  value={formatNumber(selectedDepartment.resources.available)}
                  detail={`${selectedDepartment.availability}% of tracked resources`}
                  icon={CheckCircle2}
                  className="bg-blue-50 text-blue-700"
                />
                <KpiCard
                  title="Vacant Posts"
                  value={formatNumber(selectedDepartment.vacantPositions)}
                  detail={`${formatNumber(selectedDepartment.knownStaffPositions)} filled positions`}
                  icon={Users}
                  className="bg-blue-50 text-blue-700"
                />
                <KpiCard
                  title="Views"
                  value={formatNumber(selectedDepartment.publicViews + selectedDepartment.adminViews)}
                  detail={`${selectedDepartment.publicViews} public, ${selectedDepartment.adminViews} admin`}
                  icon={Eye}
                  className="bg-blue-50 text-blue-700"
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-slate-950">Resource And Post Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="font-bold text-slate-950">{formatNumber(selectedDepartment.resources.total)}</div>
                        <div className="text-xs text-slate-500">resource total</div>
                      </div>
                      <div className="rounded-lg bg-blue-50 p-3">
                        <div className="font-bold text-blue-700">{formatNumber(selectedDepartment.resources.available)}</div>
                        <div className="text-xs text-slate-500">ready</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="font-bold text-slate-950">{formatNumber(selectedDepartment.resources.needsRepair)}</div>
                        <div className="text-xs text-slate-500">repair</div>
                      </div>
                      <div className="rounded-lg bg-zinc-50 p-3">
                        <div className="font-bold text-zinc-700">{formatNumber(selectedDepartment.resources.discarded)}</div>
                        <div className="text-xs text-slate-500">discarded</div>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-blue-600" style={{ width: `${selectedDepartment.availability}%` }} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                      <div>
                        <div className="font-bold text-slate-950">{formatNumber(selectedDepartment.positionRecords)}</div>
                        <div className="text-xs text-slate-500">position records</div>
                      </div>
                      <div>
                        <div className="font-bold text-slate-950">{formatNumber(selectedDepartment.sanctionedPositions)}</div>
                        <div className="text-xs text-slate-500">sanctioned</div>
                      </div>
                      <div>
                        <div className="font-bold text-blue-700">{formatNumber(selectedDepartment.knownStaffPositions)}</div>
                        <div className="text-xs text-slate-500">filled</div>
                      </div>
                      <div>
                        <div className="font-bold text-slate-950">{formatNumber(selectedDepartment.vacantPositions)}</div>
                        <div className="text-xs text-slate-500">vacant</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-slate-950">Request Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-100 p-3">
                      <div className="font-semibold text-slate-950">Incoming</div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                        <span>{selectedDepartment.incomingRequests.pending} pending</span>
                        <span>{selectedDepartment.incomingRequests.approved} approved</span>
                        <span>{selectedDepartment.incomingRequests.borrowed} borrowed</span>
                        <span>{selectedDepartment.incomingRequests.overdue} overdue</span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-100 p-3">
                      <div className="font-semibold text-slate-950">Outgoing</div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                        <span>{selectedDepartment.outgoingRequests.pending} pending</span>
                        <span>{selectedDepartment.outgoingRequests.approved} approved</span>
                        <span>{selectedDepartment.outgoingRequests.borrowed} borrowed</span>
                        <span>{selectedDepartment.outgoingRequests.overdue} overdue</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-slate-950">Contact Coverage</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                      <UserCheck className="h-4 w-4 text-slate-400" />
                      <span className="min-w-0 truncate">{selectedDepartment.focalPerson || "Missing focal person"}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="min-w-0 truncate">{selectedDepartment.email || "Missing email"}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="min-w-0 truncate">{selectedDepartment.phone || "Missing phone"}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-slate-950">Open This Department</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Link href={getDepartmentDashboardRoute(selectedDepartment.id)}>
                      <Button className="gap-2">
                        <ArrowUpRight className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href={`/departments/${selectedDepartment.id}`}>
                      <Button variant="outline" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Public Page
                      </Button>
                    </Link>
                    <Link href="/dashboard/requests">
                      <Button variant="outline" className="gap-2">
                        <Send className="h-4 w-4" />
                        Requests
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
