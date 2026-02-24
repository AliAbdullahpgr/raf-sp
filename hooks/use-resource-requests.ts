"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  createResourceRequest,
  approveResourceRequest,
  rejectResourceRequest,
  startBorrowing,
  returnResource,
  getMyRequests,
  getIncomingRequests,
  getBorrowedResources,
  getLentResources,
  getRequestById,
  getRequestCounts,
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getAvailableResourcesForDepartment,
} from "@/actions/resource-request";
import type {
  CreateResourceRequestInput,
  ApproveRequestInput,
  RejectRequestInput,
} from "@/lib/validations/resource-request";
import { RequestStatus, NotificationType } from "@prisma/client";

// Query keys for resource requests
export const resourceRequestQueryKeys = {
  all: () => ["resource-requests"] as const,
  myRequests: () => ["resource-requests", "my-requests"] as const,
  incomingRequests: () => ["resource-requests", "incoming"] as const,
  borrowed: () => ["resource-requests", "borrowed"] as const,
  lent: () => ["resource-requests", "lent"] as const,
  byId: (id: string) => ["resource-requests", id] as const,
  counts: () => ["resource-requests", "counts"] as const,
  notifications: () => ["notifications"] as const,
  notificationCount: () => ["notifications", "count"] as const,
  availableResources: (departmentId: string, resourceType: string) =>
    ["available-resources", departmentId, resourceType] as const,
};

// Types
export interface ResourceRequest {
  id: string;
  resourceType: string;
  resourceId: string;
  resourceName: string;
  requestingDeptId: string;
  lendingDeptId: string;
  requestedById: string;
  requestReason: string | null;
  status: RequestStatus;
  reviewedById: string | null;
  reviewedAt: Date | null;
  rejectionReason: string | null;
  borrowDurationDays: number | null;
  borrowStartDate: Date | null;
  borrowEndDate: Date | null;
  actualReturnDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  requestingDept: {
    id: string;
    name: string;
  };
  lendingDept: {
    id: string;
    name: string;
  };
  requestedBy: {
    id: string;
    name: string;
    email: string;
  };
  reviewedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
  auditLogs?: RequestAuditLog[];
}

export interface RequestAuditLog {
  id: string;
  requestId: string;
  action: string;
  performedById: string;
  previousStatus: RequestStatus | null;
  newStatus: RequestStatus;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  performedBy: {
    id: string;
    name: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  requestId: string | null;
  read: boolean;
  emailSent: boolean;
  createdAt: Date;
  request?: {
    id: string;
    resourceName: string;
    status: RequestStatus;
  } | null;
}

export interface RequestCounts {
  pendingIncoming: number;
  approvedWaiting: number;
  borrowed: number;
  lent: number;
  overdue: number;
  total: number;
}

export interface AvailableResource {
  id: string;
  name: string;
  type: string;
}

// ==========================================
// QUERY HOOKS
// ==========================================

/**
 * Hook for fetching outgoing requests (requests made by my department)
 */
export function useMyRequests() {
  return useQuery({
    queryKey: resourceRequestQueryKeys.myRequests(),
    queryFn: async () => {
      const result = await getMyRequests();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch requests");
      }
      return result.data as ResourceRequest[];
    },
  });
}

/**
 * Hook for fetching incoming requests (requests for my department's resources)
 */
export function useIncomingRequests() {
  return useQuery({
    queryKey: resourceRequestQueryKeys.incomingRequests(),
    queryFn: async () => {
      const result = await getIncomingRequests();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch incoming requests");
      }
      return result.data as ResourceRequest[];
    },
  });
}

/**
 * Hook for fetching borrowed resources
 */
export function useBorrowedResources() {
  return useQuery({
    queryKey: resourceRequestQueryKeys.borrowed(),
    queryFn: async () => {
      const result = await getBorrowedResources();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch borrowed resources");
      }
      return result.data as ResourceRequest[];
    },
  });
}

/**
 * Hook for fetching lent resources
 */
export function useLentResources() {
  return useQuery({
    queryKey: resourceRequestQueryKeys.lent(),
    queryFn: async () => {
      const result = await getLentResources();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch rented resources");
      }
      return result.data as ResourceRequest[];
    },
  });
}

/**
 * Hook for fetching a single request by ID
 */
export function useRequestById(requestId: string) {
  return useQuery({
    queryKey: resourceRequestQueryKeys.byId(requestId),
    queryFn: async () => {
      const result = await getRequestById(requestId);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch request");
      }
      return result.data as ResourceRequest;
    },
    enabled: !!requestId,
  });
}

/**
 * Hook for fetching request counts for badges
 */
export function useRequestCounts() {
  return useQuery({
    queryKey: resourceRequestQueryKeys.counts(),
    queryFn: async () => {
      const result = await getRequestCounts();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch request counts");
      }
      return result.data as RequestCounts;
    },
    refetchInterval: 60000, // Refetch every minute
  });
}

/**
 * Hook for fetching notifications
 */
export function useNotifications() {
  return useQuery({
    queryKey: resourceRequestQueryKeys.notifications(),
    queryFn: async () => {
      const result = await getNotifications();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch notifications");
      }
      return result.data as Notification[];
    },
  });
}

/**
 * Hook for fetching unread notification count
 */
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: resourceRequestQueryKeys.notificationCount(),
    queryFn: async () => {
      const result = await getUnreadNotificationCount();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch notification count");
      }
      return result.data as number;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Hook for fetching available resources for a department
 */
export function useAvailableResources(departmentId: string, resourceType: string) {
  return useQuery({
    queryKey: resourceRequestQueryKeys.availableResources(departmentId, resourceType),
    queryFn: async () => {
      const result = await getAvailableResourcesForDepartment(departmentId, resourceType);
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch available resources");
      }
      return result.data as AvailableResource[];
    },
    enabled: !!departmentId && !!resourceType,
  });
}

// ==========================================
// MUTATION HOOKS
// ==========================================

/**
 * Hook for creating a resource request
 */
export function useCreateResourceRequest() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: CreateResourceRequestInput) => {
      const result = await createResourceRequest(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to create request");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to create request");
    },
    onSuccess: () => {
      success("Resource request submitted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: resourceRequestQueryKeys.all() });
      queryClient.invalidateQueries({ queryKey: resourceRequestQueryKeys.counts() });
    },
  });
}

/**
 * Hook for approving a resource request
 */
export function useApproveRequest() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: ApproveRequestInput) => {
      const result = await approveResourceRequest(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to approve request");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to approve request");
    },
    onSuccess: () => {
      success("Request approved successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: resourceRequestQueryKeys.all() });
      queryClient.invalidateQueries({ queryKey: resourceRequestQueryKeys.counts() });
      queryClient.invalidateQueries({ queryKey: resourceRequestQueryKeys.notificationCount() });
    },
  });
}

/**
 * Hook for rejecting a resource request
 */
export function useRejectRequest() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: RejectRequestInput) => {
      const result = await rejectResourceRequest(data);
      if (!result.success) {
        throw new Error(result.message || "Failed to reject request");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to reject request");
    },
    onSuccess: () => {
      success("Request rejected");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: resourceRequestQueryKeys.all() });
      queryClient.invalidateQueries({ queryKey: resourceRequestQueryKeys.counts() });
    },
  });
}

/**
 * Hook for starting borrowing
 */
export function useStartBorrowing() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const result = await startBorrowing(requestId);
      if (!result.success) {
        throw new Error(result.message || "Failed to start borrowing");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to start borrowing");
    },
    onSuccess: () => {
      success("Borrowing started successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: resourceRequestQueryKeys.all() });
      queryClient.invalidateQueries({ queryKey: resourceRequestQueryKeys.counts() });
    },
  });
}

/**
 * Hook for returning a resource
 */
export function useReturnResource() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const result = await returnResource(requestId);
      if (!result.success) {
        throw new Error(result.message || "Failed to return resource");
      }
      return result.data;
    },
    onError: (err) => {
      error(err instanceof Error ? err.message : "Failed to return resource");
    },
    onSuccess: () => {
      success("Resource returned successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: resourceRequestQueryKeys.all() });
      queryClient.invalidateQueries({ queryKey: resourceRequestQueryKeys.counts() });
    },
  });
}

/**
 * Hook for marking a notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const result = await markNotificationAsRead(notificationId);
      if (!result.success) {
        throw new Error(result.message || "Failed to mark notification as read");
      }
      return result;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: resourceRequestQueryKeys.notifications() });
      queryClient.invalidateQueries({ queryKey: resourceRequestQueryKeys.notificationCount() });
    },
  });
}

/**
 * Hook for marking all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await markAllNotificationsAsRead();
      if (!result.success) {
        throw new Error(result.message || "Failed to mark all notifications as read");
      }
      return result;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: resourceRequestQueryKeys.notifications() });
      queryClient.invalidateQueries({ queryKey: resourceRequestQueryKeys.notificationCount() });
    },
  });
}
