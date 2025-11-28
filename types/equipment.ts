// Equipment status type - matches Prisma schema
export type EquipmentStatus =
  | "AVAILABLE"
  | "IN_USE"
  | "NEEDS_REPAIR"
  | "DISCARDED";

// Equipment status enum for client-side use (same name for convenience)
export const EquipmentStatus = {
  AVAILABLE: "AVAILABLE" as const,
  IN_USE: "IN_USE" as const,
  NEEDS_REPAIR: "NEEDS_REPAIR" as const,
  DISCARDED: "DISCARDED" as const,
} as const;
