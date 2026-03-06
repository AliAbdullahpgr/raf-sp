"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { recordPageView } from "@/actions/page-view";

// Map path prefixes to department IDs
const pathToDeptId: Record<string, string> = {
  "/dashboard/mri": "mri",
  "/dashboard/amri": "amri",
  "/dashboard/food-science": "food-science",
  "/dashboard/cri": "cri",
  "/dashboard/floriculture": "flori",
  "/dashboard/rari": "rari",
  "/dashboard/mnsuam": "mnsuam",
  "/dashboard/soil-water": "soil-water",
  "/dashboard/pesticide": "pest",
  "/dashboard/agri-engineering": "agri-eng",
  "/dashboard/raedc": "raedc",
  "/dashboard/agri-extension": "agri-ext",
  "/dashboard/entomology": "erss",
  "/dashboard/adaptive-research": "arc",
  "/dashboard/agronomy": "agronomy",
};

export function PageViewTracker({ userRole }: { userRole?: string }) {
  const pathname = usePathname();
  const lastTracked = useRef("");

  useEffect(() => {
    // Don't track super admin visits
    if (userRole === "SUPER_ADMIN") return;

    if (pathname && pathname !== lastTracked.current) {
      lastTracked.current = pathname;

      // Find matching department
      const deptId = Object.entries(pathToDeptId).find(([prefix]) =>
        pathname.startsWith(prefix)
      )?.[1];

      recordPageView(pathname, deptId);
    }
  }, [pathname, userRole]);

  return null;
}
