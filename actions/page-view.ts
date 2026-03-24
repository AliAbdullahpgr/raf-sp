"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Record a page view. Called from dashboard layouts/pages.
 */
export async function recordPageView(page: string, departmentId?: string) {
  try {
    const session = await auth();
    await prisma.pageView.create({
      data: {
        page,
        departmentId: departmentId || null,
        userId: session?.user?.id || null,
      },
    });
  } catch (error) {
    // Silently fail - page view tracking shouldn't break the app
    console.error("Failed to record page view:", error);
  }
}
