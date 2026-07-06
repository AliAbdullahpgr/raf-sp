"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { EquipmentStatus, RequestStatus } from "@prisma/client";

async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return null;
  }
  return session;
}

type PublicDepartmentCatalogItem = {
  id: string;
  dataIds: string[];
  trackedIds: string[];
  nameAliases: string[];
  name: string;
  location: string;
  focalPerson: string | null;
  designation: string | null;
  email: string | null;
  phone: string | null;
};

const PUBLIC_DEPARTMENT_CATALOG: PublicDepartmentCatalogItem[] = [
  {
    id: "mnsuam",
    dataIds: ["mnsuam"],
    trackedIds: ["mnsuam"],
    nameAliases: ["Muhammad Nawaz Shareef University of Agriculture"],
    name: "Muhammad Nawaz Shareef University of Agriculture",
    location: "Multan, Punjab",
    focalPerson: "Dr. Muhammad Asif",
    designation: "Director",
    email: "info@mnsuam.edu.pk",
    phone: "+92-61-9210071",
  },
  {
    id: "amri",
    dataIds: ["amri"],
    trackedIds: ["amri"],
    nameAliases: ["Agricultural Mechanization Research Institute"],
    name: "Agricultural Mechanization Research Institute",
    location: "Multan, Punjab",
    focalPerson: "Dr. Khalid Mahmood",
    designation: "Director",
    email: "khalid.mahmood@amri.gov.pk",
    phone: "+92-61-9210072",
  },
  {
    id: "rari",
    dataIds: ["rari"],
    trackedIds: ["rari"],
    nameAliases: [
      "Regional Agricultural Research Institute",
      "Regional Agricultural Research Institute (RARI), Bahawalpur",
    ],
    name: "Regional Agricultural Research Institute",
    location: "Bahawalpur, Punjab",
    focalPerson: "Dr. Asif Ali",
    designation: "Research Officer",
    email: "asif.ali@rari.gov.pk",
    phone: "+92-61-9210073",
  },
  {
    id: "flori",
    dataIds: ["flori"],
    trackedIds: ["flori"],
    nameAliases: ["Floriculture Research Institute", "Floriculture Research Sub-station"],
    name: "Floriculture Research Institute",
    location: "Multan, Punjab",
    focalPerson: "Dr. Muhammad Muzamil Ijaz",
    designation: "Assistant Research Officer",
    email: "muzamil.ijaz243@gmail.com",
    phone: "03016984364",
  },
  {
    id: "soil-water",
    dataIds: ["soil-water"],
    trackedIds: ["soil-water"],
    nameAliases: ["Soil & Water Testing Laboratory"],
    name: "Soil & Water Testing Laboratory",
    location: "Multan, Punjab",
    focalPerson: "Ms. Fatima Bibi",
    designation: "Principal Scientist",
    email: "swt_mltn@yahoo.com",
    phone: "061-4423568",
  },
  {
    id: "ento",
    dataIds: ["erss"],
    trackedIds: ["ento", "erss"],
    nameAliases: ["Entomological Research Sub Station", "Entomological Research Sub-Station", "Entomology Research Sub-Station"],
    name: "Entomological Research Sub Station",
    location: "Multan, Punjab",
    focalPerson: "Dr. Asifa Hameed",
    designation: "Principal Scientist",
    email: "asifa_hameed_sheikh@yahoo.com",
    phone: "+92-61-9210075",
  },
  {
    id: "mri",
    dataIds: ["mri"],
    trackedIds: ["mri"],
    nameAliases: ["Mango Research Institute"],
    name: "Mango Research Institute",
    location: "Multan, Punjab",
    focalPerson: "Mr. Abid Hameed Khan",
    designation: "Scientific Officer- Entomology",
    email: "abidhameedkhan@yahoo.com",
    phone: "0300-6326987",
  },
  {
    id: "ext",
    dataIds: ["agri-ext"],
    trackedIds: ["ext", "agri-ext"],
    nameAliases: ["Agriculture Extension Wing", "Agricultural Extension Wing"],
    name: "Agriculture Extension Wing",
    location: "Multan, Punjab",
    focalPerson: "Dr. Ahmad Hassan",
    designation: "Director Extension",
    email: "ahmad.hassan@ext.gov.pk",
    phone: "+92-61-9210076",
  },
  {
    id: "cotton-institute",
    dataIds: ["cri"],
    trackedIds: ["cotton-institute", "cri"],
    nameAliases: ["Cotton Research Institute"],
    name: "Cotton Research Institute",
    location: "Multan, Punjab",
    focalPerson: "Dr. Rashid Ali Hassan",
    designation: "Director",
    email: "rashid.ali@cri.gov.pk",
    phone: "+92-61-9210077",
  },
  {
    id: "pest",
    dataIds: ["pest"],
    trackedIds: ["pest"],
    nameAliases: ["Pesticide Quality Control Laboratory"],
    name: "Pesticide Quality Control Laboratory",
    location: "Multan, Punjab",
    focalPerson: "Dr. Muhammad Asif",
    designation: "Chief Scientist",
    email: "asif@pesticidelab.gov.pk",
    phone: "+92-61-9210078",
  },
  {
    id: "raedc",
    dataIds: ["raedc"],
    trackedIds: ["raedc"],
    nameAliases: ["Regional Agricultural Economic Development Centre", "RAEDC"],
    name: "Regional Agricultural Economic Development Centre",
    location: "Multan, Punjab",
    focalPerson: "Dr. Zahid Hussain",
    designation: "Director",
    email: "zahid@raedc.gov.pk",
    phone: "+92-61-9210085",
  },
  {
    id: "agri-eng",
    dataIds: ["agri-eng"],
    trackedIds: ["agri-eng"],
    nameAliases: ["Agriculture Engineering Field Wing", "Agricultural Engineering Department", "Agriculture Engineering"],
    name: "Agriculture Engineering Field Wing",
    location: "Multan, Punjab",
    focalPerson: "Engr. Muhammad Akram",
    designation: "Director Agricultural Engineering",
    email: "akram@agrieng.gov.pk",
    phone: "+92-61-9210086",
  },
  {
    id: "arc",
    dataIds: ["arc"],
    trackedIds: ["arc", "adp"],
    nameAliases: ["Adaptive Research Center"],
    name: "Adaptive Research Center",
    location: "Govt. Agri. Station Multan",
    focalPerson: "Office of Assistant Director Agriculture (Farm)",
    designation: "Govt. Agri. Station Multan",
    email: null,
    phone: null,
  },
];

function catalogForTrackedId(departmentId: string | null) {
  if (!departmentId) return null;
  return PUBLIC_DEPARTMENT_CATALOG.find((item) => item.trackedIds.includes(departmentId)) || null;
}

export async function getSuperAdminOverview(): Promise<ActionResult> {
  try {
    const session = await requireSuperAdmin();
    if (!session) return { success: false, message: "Access denied. Super Admin only." };

    // Get departments with page view counts
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { equipment: true, users: true, outgoingRequests: true, incomingRequests: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const catalogDepartments = PUBLIC_DEPARTMENT_CATALOG.map((catalogItem) => {
      const matchedDepartments = departments.filter(
        (department) =>
          catalogItem.dataIds.includes(department.id) ||
          catalogItem.nameAliases.includes(department.name)
      );

      return { catalogItem, matchedDepartments };
    });
    const displayedDepartmentIds = Array.from(
      new Set(catalogDepartments.flatMap((entry) => entry.matchedDepartments.map((department) => department.id)))
    );

    const [
      resourceStatsByDepartment,
      outgoingRequestStatsByDepartment,
      incomingRequestStatsByDepartment,
      adaptivePositionStatsByDepartment,
      entomologyStaffStatsByDepartment,
      recentResourceRequests,
    ] = await Promise.all([
      getResourceStatsByDepartment(),
      getRequestStatsByDepartment("requestingDeptId"),
      getRequestStatsByDepartment("lendingDeptId"),
      getAdaptivePositionStatsByDepartment(),
      getEntomologyStaffStatsByDepartment(),
      prisma.resourceRequest.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        include: {
          requestingDept: { select: { id: true, name: true } },
          lendingDept: { select: { id: true, name: true } },
          requestedBy: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    // Get page view counts per department page
    const pageViews = await prisma.pageView.groupBy({
      by: ["page"],
      _count: { id: true },
    });

    // Get page views from last 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentPageViews = await prisma.pageView.groupBy({
      by: ["page"],
      where: { createdAt: { gte: oneDayAgo } },
      _count: { id: true },
    });

    // Get total page views
    const totalPageViews = await prisma.pageView.count();
    const todayPageViews = await prisma.pageView.count({
      where: { createdAt: { gte: oneDayAgo } },
    });

    // Get admin page views (pages starting with /dashboard/admin)
    const adminPageViews = await prisma.pageView.count({
      where: { page: { startsWith: "/dashboard/admin" } },
    });

    // Slug -> display name mapping for public department pages
    const slugNameMap: Record<string, string> = Object.fromEntries(
      PUBLIC_DEPARTMENT_CATALOG.map((department) => [department.id, department.name])
    );

    // Public department page views: /departments/[slug]
    const publicDeptPageViews = await prisma.pageView.groupBy({
      by: ["departmentId"],
      where: {
        departmentId: { not: null },
        page: { startsWith: "/departments/" },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    // Admin dashboard page views: /dashboard/[dept] (exclude super-admin and admin pages)
    const adminDeptPageViews = await prisma.pageView.groupBy({
      by: ["departmentId"],
      where: {
        departmentId: { not: null },
        page: { startsWith: "/dashboard/" },
        NOT: [
          { page: { startsWith: "/dashboard/super-admin" } },
          { page: { startsWith: "/dashboard/admin" } },
        ],
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    // Build public page views map: slug -> count
    const publicDeptViewMap: Record<string, number> = Object.fromEntries(
      PUBLIC_DEPARTMENT_CATALOG.map((department) => [department.id, 0])
    );
    for (const d of publicDeptPageViews) {
      const catalogDepartment = catalogForTrackedId(d.departmentId);
      if (catalogDepartment) {
        publicDeptViewMap[catalogDepartment.id] = (publicDeptViewMap[catalogDepartment.id] || 0) + d._count.id;
      }
    }

    // Build admin dashboard views map: slug -> count
    const adminDeptViewMap: Record<string, number> = Object.fromEntries(
      PUBLIC_DEPARTMENT_CATALOG.map((department) => [department.id, 0])
    );
    for (const d of adminDeptPageViews) {
      const catalogDepartment = catalogForTrackedId(d.departmentId);
      if (catalogDepartment) {
        adminDeptViewMap[catalogDepartment.id] = (adminDeptViewMap[catalogDepartment.id] || 0) + d._count.id;
      }
    }

    // Combined deptViewMap for backward compat (total of both)
    const deptViewMap: Record<string, number> = { ...publicDeptViewMap };
    for (const [slug, count] of Object.entries(adminDeptViewMap)) {
      deptViewMap[slug] = (deptViewMap[slug] || 0) + count;
    }

    // Build page view map
    const pageViewMap: Record<string, number> = {};
    for (const pv of pageViews) {
      pageViewMap[pv.page] = pv._count.id;
    }
    const recentPageViewMap: Record<string, number> = {};
    for (const pv of recentPageViews) {
      recentPageViewMap[pv.page] = pv._count.id;
    }

    const departmentOperations = catalogDepartments.map(({ catalogItem, matchedDepartments }) => {
      const matchedDepartmentIds = matchedDepartments.map((department) => department.id);
      const primaryDepartment =
        matchedDepartments.find((department) => catalogItem.dataIds.includes(department.id)) ||
        matchedDepartments[0];
      const resources = mergeResourceStatsForDepartmentIds(resourceStatsByDepartment, matchedDepartmentIds);
      const outgoingRequests = mergeRequestStatsForDepartmentIds(outgoingRequestStatsByDepartment, matchedDepartmentIds);
      const incomingRequests = mergeRequestStatsForDepartmentIds(incomingRequestStatsByDepartment, matchedDepartmentIds);
      const adaptivePositions = mergePositionStatsForDepartmentIds(adaptivePositionStatsByDepartment, matchedDepartmentIds);
      const entomologyStaff = mergeEntomologyStaffStatsForDepartmentIds(entomologyStaffStatsByDepartment, matchedDepartmentIds);
      const knownStaffPositions = adaptivePositions.filled + entomologyStaff.officers + entomologyStaff.officials;
      const staffUsers = matchedDepartments.reduce((sum, department) => sum + department._count.users, 0);

      return {
        id: catalogItem.id,
        name: catalogItem.name,
        location: catalogItem.location || primaryDepartment?.location || "",
        focalPerson: primaryDepartment?.focalPerson || catalogItem.focalPerson,
        designation: primaryDepartment?.designation || catalogItem.designation,
        email: primaryDepartment?.email || catalogItem.email,
        phone: primaryDepartment?.phone || catalogItem.phone,
        staffUsers,
        knownStaffPositions,
        positionRecords: adaptivePositions.records,
        sanctionedPositions: adaptivePositions.sanctioned,
        vacantPositions: adaptivePositions.vacant,
        resources,
        outgoingRequests,
        incomingRequests,
        totalRequestActivity: outgoingRequests.total + incomingRequests.total,
        openRequestLoad:
          outgoingRequests.pending +
          outgoingRequests.approved +
          outgoingRequests.borrowed +
          outgoingRequests.overdue +
          incomingRequests.pending +
          incomingRequests.approved +
          incomingRequests.borrowed +
          incomingRequests.overdue,
        publicViews: publicDeptViewMap[catalogItem.id] || 0,
        adminViews: adminDeptViewMap[catalogItem.id] || 0,
      };
    });

    const requestTotals = displayedDepartmentIds.length
      ? await getRequestTotalsForDepartmentIds(displayedDepartmentIds)
      : emptyRequestStats();

    const resourceTotals = departmentOperations.reduce(
      (total, department) => ({
        total: total.total + department.resources.total,
        available: total.available + department.resources.available,
        inUse: total.inUse + department.resources.inUse,
        needsRepair: total.needsRepair + department.resources.needsRepair,
        discarded: total.discarded + department.resources.discarded,
      }),
      emptyResourceStats()
    );

    const displayDepartmentByDataId = new Map<string, PublicDepartmentCatalogItem>();
    for (const { catalogItem, matchedDepartments } of catalogDepartments) {
      for (const department of matchedDepartments) {
        displayDepartmentByDataId.set(department.id, catalogItem);
      }
    }

    const displayedRecentResourceRequests = recentResourceRequests
      .filter(
        (request) =>
          displayDepartmentByDataId.has(request.requestingDeptId) ||
          displayDepartmentByDataId.has(request.lendingDeptId)
      )
      .slice(0, 8)
      .map((request) => {
        const requestingCatalogDepartment = displayDepartmentByDataId.get(request.requestingDeptId);
        const lendingCatalogDepartment = displayDepartmentByDataId.get(request.lendingDeptId);

        return {
          ...request,
          requestingDept: {
            ...request.requestingDept,
            name: requestingCatalogDepartment?.name || request.requestingDept.name,
          },
          lendingDept: {
            ...request.lendingDept,
            name: lendingCatalogDepartment?.name || request.lendingDept.name,
          },
        };
      });

    return {
      success: true,
      data: {
        totalDepartments: PUBLIC_DEPARTMENT_CATALOG.length,
        totalUsers: departmentOperations.reduce((sum, department) => sum + department.staffUsers, 0),
        resourceTotals,
        requestTotals,
        totalPageViews,
        todayPageViews,
        adminPageViews,
        departments: departmentOperations,
        departmentOperations,
        recentResourceRequests: displayedRecentResourceRequests,
        deptViewMap,
        publicDeptViewMap,
        adminDeptViewMap,
        slugNameMap,
        pageViewMap,
        recentPageViewMap,
      },
    };
  } catch (error) {
    console.error("Super admin overview error:", error);
    return { success: false, message: "Failed to load overview" };
  }
}

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

function emptyResourceStats(): ResourceStats {
  return { total: 0, available: 0, inUse: 0, needsRepair: 0, discarded: 0 };
}

function emptyRequestStats(): RequestStats {
  return {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    expired: 0,
    borrowed: 0,
    returned: 0,
    overdue: 0,
  };
}

function mergeResourceStatsForDepartmentIds(
  statsByDepartment: Record<string, ResourceStats>,
  departmentIds: string[]
): ResourceStats {
  return departmentIds.reduce((total, departmentId) => {
    const stats = statsByDepartment[departmentId] || emptyResourceStats();
    return {
      total: total.total + stats.total,
      available: total.available + stats.available,
      inUse: total.inUse + stats.inUse,
      needsRepair: total.needsRepair + stats.needsRepair,
      discarded: total.discarded + stats.discarded,
    };
  }, emptyResourceStats());
}

function mergeRequestStatsForDepartmentIds(
  statsByDepartment: Record<string, RequestStats>,
  departmentIds: string[]
): RequestStats {
  return departmentIds.reduce((total, departmentId) => {
    const stats = statsByDepartment[departmentId] || emptyRequestStats();
    return {
      total: total.total + stats.total,
      pending: total.pending + stats.pending,
      approved: total.approved + stats.approved,
      rejected: total.rejected + stats.rejected,
      expired: total.expired + stats.expired,
      borrowed: total.borrowed + stats.borrowed,
      returned: total.returned + stats.returned,
      overdue: total.overdue + stats.overdue,
    };
  }, emptyRequestStats());
}

function mergePositionStatsForDepartmentIds(
  statsByDepartment: Record<string, { records: number; sanctioned: number; filled: number; vacant: number }>,
  departmentIds: string[]
) {
  return departmentIds.reduce(
    (total, departmentId) => {
      const stats = statsByDepartment[departmentId] || { records: 0, sanctioned: 0, filled: 0, vacant: 0 };
      return {
        records: total.records + stats.records,
        sanctioned: total.sanctioned + stats.sanctioned,
        filled: total.filled + stats.filled,
        vacant: total.vacant + stats.vacant,
      };
    },
    { records: 0, sanctioned: 0, filled: 0, vacant: 0 }
  );
}

function mergeEntomologyStaffStatsForDepartmentIds(
  statsByDepartment: Record<string, { officers: number; officials: number }>,
  departmentIds: string[]
) {
  return departmentIds.reduce(
    (total, departmentId) => {
      const stats = statsByDepartment[departmentId] || { officers: 0, officials: 0 };
      return {
        officers: total.officers + stats.officers,
        officials: total.officials + stats.officials,
      };
    },
    { officers: 0, officials: 0 }
  );
}

async function getRequestTotalsForDepartmentIds(departmentIds: string[]): Promise<RequestStats> {
  const groups = await prisma.resourceRequest.groupBy({
    by: ["status"],
    where: {
      OR: [
        { requestingDeptId: { in: departmentIds } },
        { lendingDeptId: { in: departmentIds } },
      ],
    },
    _count: { _all: true },
  });

  const totals = emptyRequestStats();
  for (const group of groups) {
    const count = group._count?._all || 0;
    totals.total += count;

    switch (group.status) {
      case RequestStatus.PENDING:
        totals.pending += count;
        break;
      case RequestStatus.APPROVED:
        totals.approved += count;
        break;
      case RequestStatus.REJECTED:
        totals.rejected += count;
        break;
      case RequestStatus.EXPIRED:
        totals.expired += count;
        break;
      case RequestStatus.BORROWED:
        totals.borrowed += count;
        break;
      case RequestStatus.RETURNED:
        totals.returned += count;
        break;
      case RequestStatus.OVERDUE:
        totals.overdue += count;
        break;
    }
  }

  return totals;
}

function ensureResourceStats(
  statsByDepartment: Record<string, ResourceStats>,
  departmentId: string
) {
  statsByDepartment[departmentId] ||= emptyResourceStats();
  return statsByDepartment[departmentId];
}

function ensureRequestStats(
  statsByDepartment: Record<string, RequestStats>,
  departmentId: string
) {
  statsByDepartment[departmentId] ||= emptyRequestStats();
  return statsByDepartment[departmentId];
}

function addResourceStatus(
  statsByDepartment: Record<string, ResourceStats>,
  departmentId: string | null | undefined,
  status: EquipmentStatus | null | undefined,
  count: number
) {
  if (!departmentId) return;

  const stats = ensureResourceStats(statsByDepartment, departmentId);
  stats.total += count;

  switch (status) {
    case EquipmentStatus.IN_USE:
      stats.inUse += count;
      break;
    case EquipmentStatus.NEEDS_REPAIR:
      stats.needsRepair += count;
      break;
    case EquipmentStatus.DISCARDED:
      stats.discarded += count;
      break;
    case EquipmentStatus.AVAILABLE:
    default:
      stats.available += count;
      break;
  }
}

async function addStatusGroupsFromModel(
  statsByDepartment: Record<string, ResourceStats>,
  model: any,
  departmentField = "departmentId",
  statusField = "status"
) {
  const groups = await model.groupBy({
    by: [departmentField, statusField],
    _count: { _all: true },
  });

  for (const group of groups) {
    addResourceStatus(
      statsByDepartment,
      group[departmentField],
      group[statusField],
      group._count?._all || 0
    );
  }
}

async function getResourceStatsByDepartment(): Promise<Record<string, ResourceStats>> {
  const statsByDepartment: Record<string, ResourceStats> = {};

  await Promise.all([
    addStatusGroupsFromModel(statsByDepartment, prisma.equipment),
    addStatusGroupsFromModel(statsByDepartment, prisma.foodAnalysisLabEquipment),
    addStatusGroupsFromModel(statsByDepartment, prisma.agronomyLabEquipment),
    addStatusGroupsFromModel(statsByDepartment, prisma.mRIAssets),
    addStatusGroupsFromModel(statsByDepartment, prisma.aMRIInventory),
    addStatusGroupsFromModel(statsByDepartment, prisma.floricultureStationAssets),
    addStatusGroupsFromModel(statsByDepartment, prisma.soilWaterTestingProject),
    addStatusGroupsFromModel(statsByDepartment, prisma.eRSSStockRegister),
    addStatusGroupsFromModel(statsByDepartment, prisma.mNSUAMEstateFacilities),
    addStatusGroupsFromModel(statsByDepartment, prisma.cRIMultanAssets),
    addStatusGroupsFromModel(statsByDepartment, prisma.rARIBahawalpurAssets),
    addStatusGroupsFromModel(statsByDepartment, prisma.pesticideQCLabData),
    addStatusGroupsFromModel(statsByDepartment, prisma.agriEngineeringMultanRegionData),
    addStatusGroupsFromModel(statsByDepartment, prisma.valueAdditionLabEquipment),
    addStatusGroupsFromModel(statsByDepartment, prisma.rAEDCEquipment),
    addStatusGroupsFromModel(statsByDepartment, prisma.agriculturalExtensionWing, "departmentId", "equipmentStatus"),
    addStatusGroupsFromModel(statsByDepartment, prisma.ento_inventory_items, "department_id", "status"),
  ]);

  return statsByDepartment;
}

async function getRequestStatsByDepartment(
  departmentField: "requestingDeptId" | "lendingDeptId"
): Promise<Record<string, RequestStats>> {
  const statsByDepartment: Record<string, RequestStats> = {};

  const groups = await prisma.resourceRequest.groupBy({
    by: [departmentField, "status"],
    _count: { _all: true },
  });

  for (const group of groups) {
    const departmentId = group[departmentField];
    const count = group._count?._all || 0;
    const stats = ensureRequestStats(statsByDepartment, departmentId);

    stats.total += count;

    switch (group.status) {
      case RequestStatus.PENDING:
        stats.pending += count;
        break;
      case RequestStatus.APPROVED:
        stats.approved += count;
        break;
      case RequestStatus.REJECTED:
        stats.rejected += count;
        break;
      case RequestStatus.EXPIRED:
        stats.expired += count;
        break;
      case RequestStatus.BORROWED:
        stats.borrowed += count;
        break;
      case RequestStatus.RETURNED:
        stats.returned += count;
        break;
      case RequestStatus.OVERDUE:
        stats.overdue += count;
        break;
    }
  }

  return statsByDepartment;
}

function mergeRequestStats(...statsLists: RequestStats[][]): RequestStats {
  return statsLists.flat().reduce((total, stats) => ({
    total: total.total + stats.total,
    pending: total.pending + stats.pending,
    approved: total.approved + stats.approved,
    rejected: total.rejected + stats.rejected,
    expired: total.expired + stats.expired,
    borrowed: total.borrowed + stats.borrowed,
    returned: total.returned + stats.returned,
    overdue: total.overdue + stats.overdue,
  }), emptyRequestStats());
}

async function getAdaptivePositionStatsByDepartment() {
  const groups = await prisma.adaptiveResearchPosition.groupBy({
    by: ["departmentId"],
    _count: { _all: true },
    _sum: {
      sanctionedPosts: true,
      filledPosts: true,
      vacantPosts: true,
    },
  });

  return groups.reduce((acc, group) => {
    acc[group.departmentId] = {
      records: group._count._all,
      sanctioned: group._sum.sanctionedPosts || 0,
      filled: group._sum.filledPosts || 0,
      vacant: group._sum.vacantPosts || 0,
    };
    return acc;
  }, {} as Record<string, { records: number; sanctioned: number; filled: number; vacant: number }>);
}

async function getEntomologyStaffStatsByDepartment() {
  const profiles = await prisma.ento_profile.findMany({
    select: {
      department_id: true,
      officers: true,
      officials: true,
    },
  });

  return profiles.reduce((acc, profile) => {
    acc[profile.department_id] = {
      officers: profile.officers || 0,
      officials: profile.officials || 0,
    };
    return acc;
  }, {} as Record<string, { officers: number; officials: number }>);
}

export async function getAllDepartmentsWithDetails(): Promise<ActionResult> {
  try {
    const session = await requireSuperAdmin();
    if (!session) return { success: false, message: "Access denied. Super Admin only." };

    const departments = await prisma.department.findMany({
      include: {
        users: {
          select: { id: true, name: true, email: true, role: true },
        },
        _count: {
          select: {
            equipment: true,
            users: true,
            outgoingRequests: true,
            incomingRequests: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // Get page views per department
    const deptPageViews = await prisma.pageView.groupBy({
      by: ["departmentId"],
      where: { departmentId: { not: null } },
      _count: { id: true },
    });

    const deptViewMap: Record<string, number> = {};
    for (const d of deptPageViews) {
      if (d.departmentId) deptViewMap[d.departmentId] = d._count.id;
    }

    return { success: true, data: { departments, deptViewMap } };
  } catch (error) {
    console.error("Get all departments error:", error);
    return { success: false, message: "Failed to load departments" };
  }
}

export async function getDepartmentPageViews(departmentId: string): Promise<ActionResult> {
  try {
    const session = await requireSuperAdmin();
    if (!session) return { success: false, message: "Access denied. Super Admin only." };

    // Get daily page views for the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const views = await prisma.pageView.findMany({
      where: {
        departmentId,
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true, page: true },
    });

    // Group by day
    const dailyViews: Record<string, number> = {};
    for (const v of views) {
      const day = v.createdAt.toISOString().split("T")[0];
      dailyViews[day] = (dailyViews[day] || 0) + 1;
    }

    const totalViews = await prisma.pageView.count({ where: { departmentId } });

    return {
      success: true,
      data: { dailyViews, totalViews, recentViews: views.length },
    };
  } catch (error) {
    console.error("Get department page views error:", error);
    return { success: false, message: "Failed to load page views" };
  }
}
