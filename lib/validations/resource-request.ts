import { z } from "zod";
import { RequestStatus } from "@prisma/client";

// Validation schema for creating a new resource request
export const createResourceRequestSchema = z.object({
  resourceType: z.string().min(1, "Resource type is required"),
  resourceId: z.string().min(1, "Resource ID is required"),
  resourceName: z.string().min(1, "Resource name is required"),
  lendingDeptId: z.string().min(1, "Lending department is required"),
  requestReason: z.string().optional(),
});

// Validation schema for approving a request
export const approveRequestSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  borrowDurationDays: z
    .number()
    .int()
    .min(10, "Minimum borrowing duration is 10 days")
    .max(90, "Maximum borrowing duration is 90 days")
    .refine((val) => val % 10 === 0, "Duration must be in increments of 10 days"),
  borrowStartDate: z.date({
    required_error: "Start date is required",
  }),
});

// Validation schema for rejecting a request
export const rejectRequestSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  rejectionReason: z.string().min(1, "Rejection reason is required"),
});

// Validation schema for returning a resource
export const returnResourceSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
});

// Validation schema for marking notifications as read
export const markNotificationReadSchema = z.object({
  notificationId: z.string().min(1, "Notification ID is required"),
});

export type CreateResourceRequestInput = z.infer<typeof createResourceRequestSchema>;
export type ApproveRequestInput = z.infer<typeof approveRequestSchema>;
export type RejectRequestInput = z.infer<typeof rejectRequestSchema>;
export type ReturnResourceInput = z.infer<typeof returnResourceSchema>;
export type MarkNotificationReadInput = z.infer<typeof markNotificationReadSchema>;

// Resource types mapping for polymorphic resources
export const RESOURCE_TYPES = {
  Equipment: "Equipment",
  AMRIInventory: "AMRIInventory",
  FoodAnalysisLabEquipment: "FoodAnalysisLabEquipment",
  MRIAssets: "MRIAssets",
  AgronomyLabEquipment: "AgronomyLabEquipment",
  FloricultureStationAssets: "FloricultureStationAssets",
  RARIBahawalpurAssets: "RARIBahawalpurAssets",
  MNSUAMEstateFacilities: "MNSUAMEstateFacilities",
  ValueAdditionLabEquipment: "ValueAdditionLabEquipment",
  CRIMultanAssets: "CRIMultanAssets",
  SoilWaterTestingProject: "SoilWaterTestingProject",
  ERSSStockRegister: "ERSSStockRegister",
  PesticideQCLabData: "PesticideQCLabData",
  AgriEngineeringMultanRegionData: "AgriEngineeringMultanRegionData",
  RAEDCEquipment: "RAEDCEquipment",
  AgriculturalExtensionWing: "AgriculturalExtensionWing",
} as const;

export type ResourceType = keyof typeof RESOURCE_TYPES;

// Borrow duration options (10-90 days in 10-day increments)
export const BORROW_DURATION_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90] as const;
export type BorrowDuration = (typeof BORROW_DURATION_OPTIONS)[number];

// Request expiration days
export const REQUEST_EXPIRATION_DAYS = 15;
