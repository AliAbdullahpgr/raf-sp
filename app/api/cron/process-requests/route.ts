import { NextRequest, NextResponse } from "next/server";
import {
  processExpiredRequests,
  processOverdueResources,
  sendReminders,
} from "@/actions/resource-request";

// This API route is meant to be called by a cron job (e.g., Vercel Cron, GitHub Actions, etc.)
// Set up a cron job to call this endpoint daily

export async function GET(request: NextRequest) {
  // Verify the request is from an authorized source
  // You can add a secret token check here for production
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Skip auth check in development or if no secret is set
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Process expired requests (pending > 15 days)
    const expiredResult = await processExpiredRequests();

    // Process overdue resources (borrowed past end date)
    const overdueResult = await processOverdueResources();

    // Send reminders for expiring requests and due-soon resources
    const reminderResult = await sendReminders();

    return NextResponse.json({
      success: true,
      results: {
        expired: expiredResult,
        overdue: overdueResult,
        reminders: reminderResult,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Also support POST for flexibility
export async function POST(request: NextRequest) {
  return GET(request);
}
