"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { recordPageView } from "@/actions/page-view";

// Map dashboard path segments to slugs used in PageView
const dashboardSlugMap: Record<string, string> = {
  mri: "mri",
  amri: "amri",
  "food-science": "food-science",
  cri: "cri",
  floriculture: "flori",
  rari: "rari",
  mnsuam: "mnsuam",
  "soil-water": "soil-water",
  pesticide: "pest",
  "agri-engineering": "agri-eng",
  raedc: "raedc",
  "agri-extension": "ext",
  entomology: "ento",
  "adaptive-research": "arc",
  agronomy: "agronomy",
};

export function PageViewTracker({ userRole, departmentId }: { userRole?: string; departmentId?: string | null }) {
  const pathname = usePathname();
  const lastTracked = useRef("");

  useEffect(() => {
    if (pathname && pathname !== lastTracked.current) {
      lastTracked.current = pathname;

      // For dashboard dept pages, use the slug from the path
      const dashboardMatch = pathname.match(/^\/dashboard\/([^/]+)/);
      const segment = dashboardMatch?.[1];
      const slug = segment && dashboardSlugMap[segment] ? dashboardSlugMap[segment] : undefined;

      recordPageView(pathname, slug ?? departmentId ?? undefined);
    }
  }, [pathname, userRole, departmentId]);

  return null;
}
