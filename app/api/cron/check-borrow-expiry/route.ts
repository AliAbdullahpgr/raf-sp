import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/email";
import { NotificationType, RequestStatus } from "@prisma/client";

/**
 * Vercel Cron Job - runs once daily on free tier
 * Checks for overdue borrowed resources and sends email reminders
 */
export async function GET(request: Request) {
  // Vercel cron sends the secret in the Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    let emailsSent = 0;
    let requestsMarkedOverdue = 0;

    // 1. Find borrowed resources where borrowEndDate has passed -> mark OVERDUE + email borrower
    const overdueRequests = await prisma.resourceRequest.findMany({
      where: {
        status: RequestStatus.BORROWED,
        borrowEndDate: { lte: now },
      },
      include: {
        requestedBy: { select: { id: true, name: true, email: true } },
        requestingDept: { select: { name: true } },
        lendingDept: { select: { name: true } },
      },
    });

    for (const req of overdueRequests) {
      await prisma.resourceRequest.update({
        where: { id: req.id },
        data: { status: RequestStatus.OVERDUE },
      });
      requestsMarkedOverdue++;

      if (req.requestedBy.email) {
        await sendNotificationEmail({
          type: NotificationType.RESOURCE_OVERDUE,
          recipientName: req.requestedBy.name,
          recipientEmail: req.requestedBy.email,
          resourceName: req.resourceName,
          departmentName: req.lendingDept.name,
          message: `The borrow period for "${req.resourceName}" from ${req.lendingDept.name} has ended. Please return the resource immediately.`,
          requestId: req.id,
        });
        emailsSent++;
      }

      await prisma.notification.create({
        data: {
          userId: req.requestedBy.id,
          type: NotificationType.RESOURCE_OVERDUE,
          title: "Resource Return Overdue",
          message: `The borrow period for "${req.resourceName}" has ended. Please return it to ${req.lendingDept.name}.`,
          requestId: req.id,
          emailSent: !!req.requestedBy.email,
        },
      });
    }

    // 2. Send 3-day advance reminder for resources due soon
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    const dueSoonRequests = await prisma.resourceRequest.findMany({
      where: {
        status: RequestStatus.BORROWED,
        borrowEndDate: { gte: twoDaysFromNow, lte: threeDaysFromNow },
      },
      include: {
        requestedBy: { select: { id: true, name: true, email: true } },
        lendingDept: { select: { name: true } },
      },
    });

    for (const req of dueSoonRequests) {
      const alreadySent = await prisma.notification.findFirst({
        where: { requestId: req.id, type: NotificationType.RETURN_DUE_SOON },
      });

      if (!alreadySent) {
        if (req.requestedBy.email) {
          await sendNotificationEmail({
            type: NotificationType.RETURN_DUE_SOON,
            recipientName: req.requestedBy.name,
            recipientEmail: req.requestedBy.email,
            resourceName: req.resourceName,
            departmentName: req.lendingDept.name,
            message: `"${req.resourceName}" from ${req.lendingDept.name} is due for return in 3 days.`,
            requestId: req.id,
          });
          emailsSent++;
        }

        await prisma.notification.create({
          data: {
            userId: req.requestedBy.id,
            type: NotificationType.RETURN_DUE_SOON,
            title: "Return Due Soon",
            message: `"${req.resourceName}" is due for return in 3 days. Please return it to ${req.lendingDept.name}.`,
            requestId: req.id,
            emailSent: !!req.requestedBy.email,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      overdueProcessed: requestsMarkedOverdue,
      dueSoonReminders: dueSoonRequests.length,
      emailsSent,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Cron check-borrow-expiry error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
