"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { addDays } from "date-fns";
import {
  createResourceRequestSchema,
  approveRequestSchema,
  rejectRequestSchema,
  returnResourceSchema,
  REQUEST_EXPIRATION_DAYS,
  type CreateResourceRequestInput,
  type ApproveRequestInput,
  type RejectRequestInput,
} from "@/lib/validations/resource-request";
import { RequestStatus, NotificationType, EquipmentStatus } from "@prisma/client";

// ==========================================
// RESOURCE REQUEST OPERATIONS
// ==========================================

/**
 * Create a new resource request
 */
export async function createResourceRequest(
  data: CreateResourceRequestInput
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { id: userId, role, departmentId } = session.user;

    // Only DEPT_HEAD can create requests
    if (role !== "DEPT_HEAD" && role !== "ADMIN") {
      return { success: false, message: "Only department heads can request resources" };
    }

    if (!departmentId) {
      return { success: false, message: "You must be assigned to a department to request resources" };
    }

    // Validate input
    const validatedFields = createResourceRequestSchema.safeParse(data);
    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { resourceType, resourceId, resourceName, lendingDeptId, requestReason } =
      validatedFields.data;

    // Cannot request from own department
    if (lendingDeptId === departmentId) {
      return { success: false, message: "Cannot request resources from your own department" };
    }

    // Check if lending department exists
    const lendingDept = await prisma.department.findUnique({
      where: { id: lendingDeptId },
    });

    if (!lendingDept) {
      return { success: false, message: "Lending department not found" };
    }

    // Check if there's already a pending/approved/borrowed request for this resource
    const existingRequest = await prisma.resourceRequest.findFirst({
      where: {
        resourceType,
        resourceId,
        status: {
          in: [RequestStatus.PENDING, RequestStatus.APPROVED, RequestStatus.BORROWED],
        },
      },
    });

    if (existingRequest) {
      return {
        success: false,
        message: "This resource already has an active request or is currently borrowed",
      };
    }

    // Create the request with expiration date
    const expiresAt = addDays(new Date(), REQUEST_EXPIRATION_DAYS);

    const request = await prisma.resourceRequest.create({
      data: {
        resourceType,
        resourceId,
        resourceName,
        requestingDeptId: departmentId,
        lendingDeptId,
        requestedById: userId,
        requestReason,
        expiresAt,
      },
      include: {
        requestingDept: true,
        lendingDept: true,
        requestedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Create audit log
    await prisma.requestAuditLog.create({
      data: {
        requestId: request.id,
        action: "CREATED",
        performedById: userId,
        newStatus: RequestStatus.PENDING,
        notes: requestReason || "Request created",
      },
    });

    // Notify the DEPT_HEAD of the lending department
    const lendingDeptHead = await prisma.user.findFirst({
      where: {
        departmentId: lendingDeptId,
        role: "DEPT_HEAD",
      },
    });

    if (lendingDeptHead) {
      await prisma.notification.create({
        data: {
          userId: lendingDeptHead.id,
          type: NotificationType.REQUEST_RECEIVED,
          title: "New Resource Request",
          message: `${request.requestingDept.name} has requested "${resourceName}" from your department.`,
          requestId: request.id,
        },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/requests");

    return {
      success: true,
      message: "Resource request created successfully",
      data: request,
    };
  } catch (error) {
    console.error("Error creating resource request:", error);
    return { success: false, message: "Failed to create resource request" };
  }
}

/**
 * Approve a resource request
 */
export async function approveResourceRequest(
  data: ApproveRequestInput
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { id: userId, role, departmentId } = session.user;

    // Validate input
    const validatedFields = approveRequestSchema.safeParse(data);
    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { requestId, borrowDurationDays, borrowStartDate } = validatedFields.data;

    // Find the request
    const request = await prisma.resourceRequest.findUnique({
      where: { id: requestId },
      include: {
        requestingDept: true,
        lendingDept: true,
        requestedBy: true,
      },
    });

    if (!request) {
      return { success: false, message: "Request not found" };
    }

    // Only the lending department's DEPT_HEAD can approve
    if (role === "DEPT_HEAD" && departmentId !== request.lendingDeptId) {
      return { success: false, message: "Only the lending department head can approve this request" };
    }

    // Check if request is still pending
    if (request.status !== RequestStatus.PENDING) {
      return { success: false, message: `Cannot approve a request with status: ${request.status}` };
    }

    // Check if request has expired
    if (new Date() > request.expiresAt) {
      await prisma.resourceRequest.update({
        where: { id: requestId },
        data: { status: RequestStatus.EXPIRED },
      });
      return { success: false, message: "This request has expired" };
    }

    // Calculate end date
    const borrowEndDate = addDays(borrowStartDate, borrowDurationDays);

    // Update the request
    const updatedRequest = await prisma.resourceRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.APPROVED,
        reviewedById: userId,
        reviewedAt: new Date(),
        borrowDurationDays,
        borrowStartDate,
        borrowEndDate,
      },
      include: {
        requestingDept: true,
        lendingDept: true,
      },
    });

    // Create audit log
    await prisma.requestAuditLog.create({
      data: {
        requestId: request.id,
        action: "APPROVED",
        performedById: userId,
        previousStatus: RequestStatus.PENDING,
        newStatus: RequestStatus.APPROVED,
        notes: `Approved for ${borrowDurationDays} days starting ${borrowStartDate.toDateString()}`,
        metadata: {
          borrowDurationDays,
          borrowStartDate: borrowStartDate.toISOString(),
          borrowEndDate: borrowEndDate.toISOString(),
        },
      },
    });

    // Notify the requester
    await prisma.notification.create({
      data: {
        userId: request.requestedById,
        type: NotificationType.REQUEST_APPROVED,
        title: "Request Approved",
        message: `Your request for "${request.resourceName}" has been approved for ${borrowDurationDays} days.`,
        requestId: request.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/requests");

    return {
      success: true,
      message: "Request approved successfully",
      data: updatedRequest,
    };
  } catch (error) {
    console.error("Error approving resource request:", error);
    return { success: false, message: "Failed to approve resource request" };
  }
}

/**
 * Reject a resource request
 */
export async function rejectResourceRequest(
  data: RejectRequestInput
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { id: userId, role, departmentId } = session.user;

    // Validate input
    const validatedFields = rejectRequestSchema.safeParse(data);
    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { requestId, rejectionReason } = validatedFields.data;

    // Find the request
    const request = await prisma.resourceRequest.findUnique({
      where: { id: requestId },
      include: {
        requestingDept: true,
        lendingDept: true,
      },
    });

    if (!request) {
      return { success: false, message: "Request not found" };
    }

    // Only the lending department's DEPT_HEAD can reject
    if (role === "DEPT_HEAD" && departmentId !== request.lendingDeptId) {
      return { success: false, message: "Only the lending department head can reject this request" };
    }

    // Check if request is still pending
    if (request.status !== RequestStatus.PENDING) {
      return { success: false, message: `Cannot reject a request with status: ${request.status}` };
    }

    // Update the request
    const updatedRequest = await prisma.resourceRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.REJECTED,
        reviewedById: userId,
        reviewedAt: new Date(),
        rejectionReason,
      },
      include: {
        requestingDept: true,
        lendingDept: true,
      },
    });

    // Create audit log
    await prisma.requestAuditLog.create({
      data: {
        requestId: request.id,
        action: "REJECTED",
        performedById: userId,
        previousStatus: RequestStatus.PENDING,
        newStatus: RequestStatus.REJECTED,
        notes: rejectionReason,
      },
    });

    // Notify the requester
    await prisma.notification.create({
      data: {
        userId: request.requestedById,
        type: NotificationType.REQUEST_REJECTED,
        title: "Request Rejected",
        message: `Your request for "${request.resourceName}" was rejected. Reason: ${rejectionReason}`,
        requestId: request.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/requests");

    return {
      success: true,
      message: "Request rejected",
      data: updatedRequest,
    };
  } catch (error) {
    console.error("Error rejecting resource request:", error);
    return { success: false, message: "Failed to reject resource request" };
  }
}

/**
 * Start borrowing (mark as borrowed and update resource status)
 */
export async function startBorrowing(requestId: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { id: userId, departmentId } = session.user;

    // Find the request
    const request = await prisma.resourceRequest.findUnique({
      where: { id: requestId },
      include: {
        requestingDept: true,
        lendingDept: true,
      },
    });

    if (!request) {
      return { success: false, message: "Request not found" };
    }

    // Only the requesting department can start borrowing
    if (departmentId !== request.requestingDeptId) {
      return { success: false, message: "Only the requesting department can start borrowing" };
    }

    // Check if request is approved
    if (request.status !== RequestStatus.APPROVED) {
      return { success: false, message: "Can only start borrowing for approved requests" };
    }

    // Update request status to BORROWED
    const updatedRequest = await prisma.resourceRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.BORROWED,
        borrowStartDate: new Date(),
        borrowEndDate: addDays(new Date(), request.borrowDurationDays || 30),
      },
      include: {
        requestingDept: true,
        lendingDept: true,
      },
    });

    // Update the resource status to IN_USE
    await updateResourceStatus(request.resourceType, request.resourceId, EquipmentStatus.IN_USE);

    // Create audit log
    await prisma.requestAuditLog.create({
      data: {
        requestId: request.id,
        action: "BORROWED",
        performedById: userId,
        previousStatus: RequestStatus.APPROVED,
        newStatus: RequestStatus.BORROWED,
        notes: "Resource borrowing started",
      },
    });

    // Notify the lending department
    const lendingDeptHead = await prisma.user.findFirst({
      where: {
        departmentId: request.lendingDeptId,
        role: "DEPT_HEAD",
      },
    });

    if (lendingDeptHead) {
      await prisma.notification.create({
        data: {
          userId: lendingDeptHead.id,
          type: NotificationType.BORROW_STARTED,
          title: "Resource Borrowed",
          message: `"${request.resourceName}" has been borrowed by ${request.requestingDept.name}.`,
          requestId: request.id,
        },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/requests");

    return {
      success: true,
      message: "Borrowing started successfully",
      data: updatedRequest,
    };
  } catch (error) {
    console.error("Error starting borrowing:", error);
    return { success: false, message: "Failed to start borrowing" };
  }
}

/**
 * Return a borrowed resource
 */
export async function returnResource(requestId: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { id: userId, departmentId } = session.user;

    // Find the request
    const request = await prisma.resourceRequest.findUnique({
      where: { id: requestId },
      include: {
        requestingDept: true,
        lendingDept: true,
      },
    });

    if (!request) {
      return { success: false, message: "Request not found" };
    }

    // Only the requesting department can return
    if (departmentId !== request.requestingDeptId) {
      return { success: false, message: "Only the borrowing department can return resources" };
    }

    // Check if resource is borrowed or overdue
    if (request.status !== RequestStatus.BORROWED && request.status !== RequestStatus.OVERDUE) {
      return { success: false, message: "Can only return borrowed or overdue resources" };
    }

    const previousStatus = request.status;

    // Update request status to RETURNED
    const updatedRequest = await prisma.resourceRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.RETURNED,
        actualReturnDate: new Date(),
      },
      include: {
        requestingDept: true,
        lendingDept: true,
      },
    });

    // Update the resource status back to AVAILABLE
    await updateResourceStatus(request.resourceType, request.resourceId, EquipmentStatus.AVAILABLE);

    // Create audit log
    await prisma.requestAuditLog.create({
      data: {
        requestId: request.id,
        action: "RETURNED",
        performedById: userId,
        previousStatus,
        newStatus: RequestStatus.RETURNED,
        notes: previousStatus === RequestStatus.OVERDUE ? "Resource returned (was overdue)" : "Resource returned on time",
        metadata: {
          actualReturnDate: new Date().toISOString(),
          wasOverdue: previousStatus === RequestStatus.OVERDUE,
        },
      },
    });

    // Notify the lending department
    const lendingDeptHead = await prisma.user.findFirst({
      where: {
        departmentId: request.lendingDeptId,
        role: "DEPT_HEAD",
      },
    });

    if (lendingDeptHead) {
      await prisma.notification.create({
        data: {
          userId: lendingDeptHead.id,
          type: NotificationType.RESOURCE_RETURNED,
          title: "Resource Returned",
          message: `"${request.resourceName}" has been returned by ${request.requestingDept.name}.`,
          requestId: request.id,
        },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/requests");

    return {
      success: true,
      message: "Resource returned successfully",
      data: updatedRequest,
    };
  } catch (error) {
    console.error("Error returning resource:", error);
    return { success: false, message: "Failed to return resource" };
  }
}

// ==========================================
// FETCH OPERATIONS
// ==========================================

/**
 * Get all resource requests for the current user's department
 */
export async function getMyRequests(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { departmentId, role } = session.user;

    if (!departmentId && role !== "ADMIN") {
      return { success: false, message: "No department assigned" };
    }

    const requests = await prisma.resourceRequest.findMany({
      where: role === "ADMIN"
        ? {}
        : { requestingDeptId: departmentId! },
      include: {
        requestingDept: true,
        lendingDept: true,
        requestedBy: {
          select: { id: true, name: true, email: true },
        },
        reviewedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: requests };
  } catch (error) {
    console.error("Error fetching my requests:", error);
    return { success: false, message: "Failed to fetch requests" };
  }
}

/**
 * Get incoming requests (requests for resources from my department)
 */
export async function getIncomingRequests(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { departmentId, role } = session.user;

    if (!departmentId && role !== "ADMIN") {
      return { success: false, message: "No department assigned" };
    }

    const requests = await prisma.resourceRequest.findMany({
      where: role === "ADMIN"
        ? {}
        : { lendingDeptId: departmentId! },
      include: {
        requestingDept: true,
        lendingDept: true,
        requestedBy: {
          select: { id: true, name: true, email: true },
        },
        reviewedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: requests };
  } catch (error) {
    console.error("Error fetching incoming requests:", error);
    return { success: false, message: "Failed to fetch incoming requests" };
  }
}

/**
 * Get borrowed resources for the current department
 */
export async function getBorrowedResources(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { departmentId, role } = session.user;

    if (!departmentId && role !== "ADMIN") {
      return { success: false, message: "No department assigned" };
    }

    const requests = await prisma.resourceRequest.findMany({
      where: role === "ADMIN"
        ? { status: { in: [RequestStatus.BORROWED, RequestStatus.OVERDUE] } }
        : {
            requestingDeptId: departmentId!,
            status: { in: [RequestStatus.BORROWED, RequestStatus.OVERDUE] },
          },
      include: {
        requestingDept: true,
        lendingDept: true,
        requestedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { borrowStartDate: "desc" },
    });

    return { success: true, data: requests };
  } catch (error) {
    console.error("Error fetching borrowed resources:", error);
    return { success: false, message: "Failed to fetch borrowed resources" };
  }
}

/**
 * Get lent resources for the current department
 */
export async function getLentResources(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { departmentId, role } = session.user;

    if (!departmentId && role !== "ADMIN") {
      return { success: false, message: "No department assigned" };
    }

    const requests = await prisma.resourceRequest.findMany({
      where: role === "ADMIN"
        ? { status: { in: [RequestStatus.BORROWED, RequestStatus.OVERDUE] } }
        : {
            lendingDeptId: departmentId!,
            status: { in: [RequestStatus.BORROWED, RequestStatus.OVERDUE] },
          },
      include: {
        requestingDept: true,
        lendingDept: true,
        requestedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { borrowStartDate: "desc" },
    });

    return { success: true, data: requests };
  } catch (error) {
    console.error("Error fetching rented resources:", error);
    return { success: false, message: "Failed to fetch rented resources" };
  }
}

/**
 * Get a single request by ID with audit logs
 */
export async function getRequestById(requestId: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const request = await prisma.resourceRequest.findUnique({
      where: { id: requestId },
      include: {
        requestingDept: true,
        lendingDept: true,
        requestedBy: {
          select: { id: true, name: true, email: true },
        },
        reviewedBy: {
          select: { id: true, name: true, email: true },
        },
        auditLogs: {
          include: {
            performedBy: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!request) {
      return { success: false, message: "Request not found" };
    }

    return { success: true, data: request };
  } catch (error) {
    console.error("Error fetching request:", error);
    return { success: false, message: "Failed to fetch request" };
  }
}

/**
 * Get request counts for dashboard badges
 */
export async function getRequestCounts(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { departmentId, role } = session.user;

    if (!departmentId && role !== "ADMIN") {
      return { success: false, message: "No department assigned" };
    }

    const deptId = departmentId!;

    // Pending incoming requests (waiting for my approval)
    const pendingIncoming = await prisma.resourceRequest.count({
      where: role === "ADMIN"
        ? { status: RequestStatus.PENDING }
        : { lendingDeptId: deptId, status: RequestStatus.PENDING },
    });

    // Approved requests waiting to start borrowing
    const approvedWaiting = await prisma.resourceRequest.count({
      where: role === "ADMIN"
        ? { status: RequestStatus.APPROVED }
        : { requestingDeptId: deptId, status: RequestStatus.APPROVED },
    });

    // Currently borrowed
    const borrowed = await prisma.resourceRequest.count({
      where: role === "ADMIN"
        ? { status: RequestStatus.BORROWED }
        : { requestingDeptId: deptId, status: RequestStatus.BORROWED },
    });

    // Currently lent
    const lent = await prisma.resourceRequest.count({
      where: role === "ADMIN"
        ? { status: RequestStatus.BORROWED }
        : { lendingDeptId: deptId, status: RequestStatus.BORROWED },
    });

    // Overdue
    const overdue = await prisma.resourceRequest.count({
      where: role === "ADMIN"
        ? { status: RequestStatus.OVERDUE }
        : {
            OR: [
              { requestingDeptId: deptId, status: RequestStatus.OVERDUE },
              { lendingDeptId: deptId, status: RequestStatus.OVERDUE },
            ],
          },
    });

    return {
      success: true,
      data: {
        pendingIncoming,
        approvedWaiting,
        borrowed,
        lent,
        overdue,
        total: pendingIncoming + approvedWaiting + borrowed + overdue,
      },
    };
  } catch (error) {
    console.error("Error fetching request counts:", error);
    return { success: false, message: "Failed to fetch request counts" };
  }
}

// ==========================================
// NOTIFICATION OPERATIONS
// ==========================================

/**
 * Get notifications for the current user
 */
export async function getNotifications(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      include: {
        request: {
          select: {
            id: true,
            resourceName: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return { success: true, data: notifications };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, message: "Failed to fetch notifications" };
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const count = await prisma.notification.count({
      where: {
        userId: session.user.id,
        read: false,
      },
    });

    return { success: true, data: count };
  } catch (error) {
    console.error("Error fetching notification count:", error);
    return { success: false, message: "Failed to fetch notification count" };
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    await prisma.notification.update({
      where: { id: notificationId, userId: session.user.id },
      data: { read: true },
    });

    return { success: true, message: "Notification marked as read" };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, message: "Failed to mark notification as read" };
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    await prisma.notification.updateMany({
      where: { userId: session.user.id, read: false },
      data: { read: true },
    });

    return { success: true, message: "All notifications marked as read" };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, message: "Failed to mark all notifications as read" };
  }
}

// ==========================================
// SCHEDULED TASKS (to be called by cron)
// ==========================================

/**
 * Check for expired requests and update their status
 */
export async function processExpiredRequests(): Promise<ActionResult> {
  try {
    const expiredRequests = await prisma.resourceRequest.findMany({
      where: {
        status: RequestStatus.PENDING,
        expiresAt: { lt: new Date() },
      },
      include: {
        requestedBy: true,
      },
    });

    for (const request of expiredRequests) {
      await prisma.resourceRequest.update({
        where: { id: request.id },
        data: { status: RequestStatus.EXPIRED },
      });

      // Create audit log
      await prisma.requestAuditLog.create({
        data: {
          requestId: request.id,
          action: "EXPIRED",
          performedById: request.requestedById, // System action attributed to requester
          previousStatus: RequestStatus.PENDING,
          newStatus: RequestStatus.EXPIRED,
          notes: "Request expired after 15 days without approval",
        },
      });

      // Notify the requester
      await prisma.notification.create({
        data: {
          userId: request.requestedById,
          type: NotificationType.REQUEST_EXPIRED,
          title: "Request Expired",
          message: `Your request for "${request.resourceName}" has expired without approval.`,
          requestId: request.id,
        },
      });
    }

    return {
      success: true,
      message: `Processed ${expiredRequests.length} expired requests`,
      data: { count: expiredRequests.length },
    };
  } catch (error) {
    console.error("Error processing expired requests:", error);
    return { success: false, message: "Failed to process expired requests" };
  }
}

/**
 * Check for overdue borrowed resources and update their status
 */
export async function processOverdueResources(): Promise<ActionResult> {
  try {
    const overdueRequests = await prisma.resourceRequest.findMany({
      where: {
        status: RequestStatus.BORROWED,
        borrowEndDate: { lt: new Date() },
      },
      include: {
        requestedBy: true,
        requestingDept: true,
        lendingDept: true,
      },
    });

    for (const request of overdueRequests) {
      await prisma.resourceRequest.update({
        where: { id: request.id },
        data: { status: RequestStatus.OVERDUE },
      });

      // Create audit log
      await prisma.requestAuditLog.create({
        data: {
          requestId: request.id,
          action: "MARKED_OVERDUE",
          performedById: request.requestedById, // System action
          previousStatus: RequestStatus.BORROWED,
          newStatus: RequestStatus.OVERDUE,
          notes: "Resource is past its return date",
        },
      });

      // Notify the borrower
      await prisma.notification.create({
        data: {
          userId: request.requestedById,
          type: NotificationType.RESOURCE_OVERDUE,
          title: "Resource Overdue",
          message: `"${request.resourceName}" borrowed from ${request.lendingDept.name} is overdue. Please return it immediately.`,
          requestId: request.id,
        },
      });

      // Notify the lending department
      const lendingDeptHead = await prisma.user.findFirst({
        where: {
          departmentId: request.lendingDeptId,
          role: "DEPT_HEAD",
        },
      });

      if (lendingDeptHead) {
        await prisma.notification.create({
          data: {
            userId: lendingDeptHead.id,
            type: NotificationType.RESOURCE_OVERDUE,
            title: "Rented Resource Overdue",
            message: `"${request.resourceName}" rented to ${request.requestingDept.name} is overdue.`,
            requestId: request.id,
          },
        });
      }
    }

    return {
      success: true,
      message: `Processed ${overdueRequests.length} overdue resources`,
      data: { count: overdueRequests.length },
    };
  } catch (error) {
    console.error("Error processing overdue resources:", error);
    return { success: false, message: "Failed to process overdue resources" };
  }
}

/**
 * Send reminders for requests about to expire and resources due soon
 */
export async function sendReminders(): Promise<ActionResult> {
  try {
    const twoDaysFromNow = addDays(new Date(), 2);
    const threeDaysFromNow = addDays(new Date(), 3);

    // Requests about to expire (2 days before)
    const expiringRequests = await prisma.resourceRequest.findMany({
      where: {
        status: RequestStatus.PENDING,
        expiresAt: {
          gte: new Date(),
          lte: twoDaysFromNow,
        },
      },
      include: {
        lendingDept: true,
      },
    });

    for (const request of expiringRequests) {
      // Check if we already sent this notification
      const existingNotification = await prisma.notification.findFirst({
        where: {
          requestId: request.id,
          type: NotificationType.REQUEST_EXPIRING,
        },
      });

      if (!existingNotification) {
        const lendingDeptHead = await prisma.user.findFirst({
          where: {
            departmentId: request.lendingDeptId,
            role: "DEPT_HEAD",
          },
        });

        if (lendingDeptHead) {
          await prisma.notification.create({
            data: {
              userId: lendingDeptHead.id,
              type: NotificationType.REQUEST_EXPIRING,
              title: "Request Expiring Soon",
              message: `Request for "${request.resourceName}" will expire in 2 days. Please review.`,
              requestId: request.id,
            },
          });
        }
      }
    }

    // Resources due for return (3 days before)
    const dueSoonResources = await prisma.resourceRequest.findMany({
      where: {
        status: RequestStatus.BORROWED,
        borrowEndDate: {
          gte: new Date(),
          lte: threeDaysFromNow,
        },
      },
      include: {
        requestingDept: true,
        lendingDept: true,
      },
    });

    for (const request of dueSoonResources) {
      // Check if we already sent this notification
      const existingNotification = await prisma.notification.findFirst({
        where: {
          requestId: request.id,
          type: NotificationType.RETURN_DUE_SOON,
        },
      });

      if (!existingNotification) {
        await prisma.notification.create({
          data: {
            userId: request.requestedById,
            type: NotificationType.RETURN_DUE_SOON,
            title: "Return Due Soon",
            message: `"${request.resourceName}" is due for return in 3 days. Please return it on time.`,
            requestId: request.id,
          },
        });
      }
    }

    return {
      success: true,
      message: `Sent reminders for ${expiringRequests.length} expiring requests and ${dueSoonResources.length} due resources`,
    };
  } catch (error) {
    console.error("Error sending reminders:", error);
    return { success: false, message: "Failed to send reminders" };
  }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Update the status of a resource in its respective table
 */
async function updateResourceStatus(
  resourceType: string,
  resourceId: string,
  status: EquipmentStatus
): Promise<void> {
  try {
    switch (resourceType) {
      case "Equipment":
        await prisma.equipment.update({
          where: { id: resourceId },
          data: { status },
        });
        break;
      case "AMRIInventory":
        await prisma.aMRIInventory.update({
          where: { id: resourceId },
          data: { status },
        });
        break;
      case "FoodAnalysisLabEquipment":
        await prisma.foodAnalysisLabEquipment.update({
          where: { id: resourceId },
          data: { status },
        });
        break;
      case "MRIAssets":
        await prisma.mRIAssets.update({
          where: { id: resourceId },
          data: { status },
        });
        break;
      case "AgronomyLabEquipment":
        await prisma.agronomyLabEquipment.update({
          where: { id: resourceId },
          data: { status },
        });
        break;
      case "FloricultureStationAssets":
        await prisma.floricultureStationAssets.update({
          where: { id: resourceId },
          data: { status },
        });
        break;
      case "RARIBahawalpurAssets":
        await prisma.rARIBahawalpurAssets.update({
          where: { id: resourceId },
          data: { status },
        });
        break;
      case "MNSUAMEstateFacilities":
        await prisma.mNSUAMEstateFacilities.update({
          where: { id: resourceId },
          data: { status },
        });
        break;
      case "ValueAdditionLabEquipment":
        await prisma.valueAdditionLabEquipment.update({
          where: { id: resourceId },
          data: { status },
        });
        break;
      case "CRIMultanAssets":
        await prisma.cRIMultanAssets.update({
          where: { id: resourceId },
          data: { status },
        });
        break;
      case "SoilWaterTestingProject":
        await prisma.soilWaterTestingProject.update({
          where: { id: resourceId },
          data: { status },
        });
        break;
      case "ERSSStockRegister":
        await prisma.eRSSStockRegister.update({
          where: { id: resourceId },
          data: { status },
        });
        break;
      case "PesticideQCLabData":
        await prisma.pesticideQCLabData.update({
          where: { id: resourceId },
          data: { status },
        });
        break;
      case "AgriEngineeringMultanRegionData":
        await prisma.agriEngineeringMultanRegionData.update({
          where: { id: resourceId },
          data: { status },
        });
        break;
      case "RAEDCEquipment":
        await prisma.rAEDCEquipment.update({
          where: { id: resourceId },
          data: { status },
        });
        break;
      // AgriculturalExtensionWing uses 'equipmentStatus' field
      case "AgriculturalExtensionWing":
        await prisma.agriculturalExtensionWing.update({
          where: { id: resourceId },
          data: { equipmentStatus: status },
        });
        break;
      default:
        console.warn(`Unknown resource type: ${resourceType}`);
    }
  } catch (error) {
    console.error(`Error updating resource status for ${resourceType}:${resourceId}:`, error);
    throw error;
  }
}

/**
 * Get available resources from a department for the request dialog dropdown
 */
export async function getAvailableResourcesForDepartment(
  departmentId: string,
  resourceType: string
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    let resources: { id: string; name: string; type: string }[] = [];

    // Get available resources based on resource type
    switch (resourceType) {
      case "Equipment":
        resources = await prisma.equipment.findMany({
          where: { departmentId, status: EquipmentStatus.AVAILABLE },
          select: { id: true, name: true, type: true },
        });
        break;
      case "AMRIInventory":
        resources = await prisma.aMRIInventory.findMany({
          where: { departmentId, status: EquipmentStatus.AVAILABLE },
          select: { id: true, name: true, type: true },
        });
        break;
      case "FoodAnalysisLabEquipment":
        resources = await prisma.foodAnalysisLabEquipment.findMany({
          where: { departmentId, status: EquipmentStatus.AVAILABLE },
          select: { id: true, name: true, type: true },
        });
        break;
      case "MRIAssets":
        resources = await prisma.mRIAssets.findMany({
          where: { departmentId, status: EquipmentStatus.AVAILABLE },
          select: { id: true, name: true, type: true },
        });
        break;
      case "AgronomyLabEquipment":
        resources = await prisma.agronomyLabEquipment.findMany({
          where: { departmentId, status: EquipmentStatus.AVAILABLE },
          select: { id: true, name: true, type: true },
        });
        break;
      case "FloricultureStationAssets":
        resources = await prisma.floricultureStationAssets.findMany({
          where: { departmentId, status: EquipmentStatus.AVAILABLE },
          select: { id: true, name: true, type: true },
        });
        break;
      case "RARIBahawalpurAssets":
        resources = await prisma.rARIBahawalpurAssets.findMany({
          where: { departmentId, status: EquipmentStatus.AVAILABLE },
          select: { id: true, name: true, type: true },
        });
        break;
      case "MNSUAMEstateFacilities":
        resources = await prisma.mNSUAMEstateFacilities.findMany({
          where: { departmentId, status: EquipmentStatus.AVAILABLE },
          select: { id: true, name: true, type: true },
        });
        break;
      case "ValueAdditionLabEquipment":
        resources = await prisma.valueAdditionLabEquipment.findMany({
          where: { departmentId, status: EquipmentStatus.AVAILABLE },
          select: { id: true, name: true, type: true },
        });
        break;
      case "CRIMultanAssets":
        resources = await prisma.cRIMultanAssets.findMany({
          where: { departmentId, status: EquipmentStatus.AVAILABLE },
          select: { id: true, name: true, type: true },
        });
        break;
      case "SoilWaterTestingProject":
        resources = await prisma.soilWaterTestingProject.findMany({
          where: { departmentId, status: EquipmentStatus.AVAILABLE },
          select: { id: true, name: true, type: true },
        });
        break;
      case "ERSSStockRegister":
        resources = await prisma.eRSSStockRegister.findMany({
          where: { departmentId, status: EquipmentStatus.AVAILABLE },
          select: { id: true, name: true, type: true },
        });
        break;
      case "PesticideQCLabData":
        resources = await prisma.pesticideQCLabData.findMany({
          where: { departmentId, status: EquipmentStatus.AVAILABLE },
          select: { id: true, name: true, type: true },
        });
        break;
      case "AgriEngineeringMultanRegionData":
        resources = await prisma.agriEngineeringMultanRegionData.findMany({
          where: { departmentId, status: EquipmentStatus.AVAILABLE },
          select: { id: true, name: true, type: true },
        });
        break;
      case "RAEDCEquipment":
        resources = await prisma.rAEDCEquipment.findMany({
          where: { departmentId, status: EquipmentStatus.AVAILABLE },
          select: { id: true, name: true, type: true },
        });
        break;
      case "AgriculturalExtensionWing":
        resources = await prisma.agriculturalExtensionWing.findMany({
          where: { departmentId, equipmentStatus: EquipmentStatus.AVAILABLE },
          select: { id: true, name: true, type: true },
        });
        break;
      default:
        return { success: false, message: `Unknown resource type: ${resourceType}` };
    }

    return { success: true, data: resources };
  } catch (error) {
    console.error("Error fetching available resources:", error);
    return { success: false, message: "Failed to fetch available resources" };
  }
}
