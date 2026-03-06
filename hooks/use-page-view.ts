"use client";

import { useEffect, useRef } from "react";
import { recordPageView } from "@/actions/page-view";

export function usePageView(page: string, departmentId?: string) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      recordPageView(page, departmentId);
    }
  }, [page, departmentId]);
}
