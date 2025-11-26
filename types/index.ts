import { EquipmentStatus } from "@prisma/client";

export interface DashboardStats {
  totalEquipment: number;
  availableCount: number;
  inUseCount: number;
  needsRepairCount: number;
  discardedCount: number;
  equipmentByType: { type: string; count: number }[];
  recentEquipment: RecentEquipment[];
  totalMaintenanceCost: number;
}

export interface RecentEquipment {
  id: string;
  name: string;
  type: string;
  status: EquipmentStatus;
  purchaseDate: Date;
  department: {
    name: string;
  };
}

export interface BulkImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: { row: number; message: string }[];
}

export interface ActionResult<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface EquipmentFormData {
  name: string;
  type: string;
  status: EquipmentStatus;
  purchaseDate: Date;
  imageUrl?: string;
  departmentId: string;
}

export interface MaintenanceLogData {
  equipmentId: string;
  date: Date;
  cost: number;
  description: string;
}

export interface DepartmentFormData {
  name: string;
  location: string;
  logo?: string;
}
