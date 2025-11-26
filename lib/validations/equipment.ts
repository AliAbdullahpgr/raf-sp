import { z } from "zod";
import { EquipmentStatus } from "@prisma/client";

export const equipmentSchema = z.object({
  name: z
    .string()
    .min(1, "Equipment name is required")
    .max(255, "Name is too long"),
  type: z
    .string()
    .min(1, "Equipment type is required")
    .max(100, "Type is too long"),
  status: z.nativeEnum(EquipmentStatus, {
    message: "Invalid equipment status",
  }),
  purchaseDate: z.date({
    message: "Invalid purchase date",
  }),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  departmentId: z.string().min(1, "Department is required"),
});

export const updateEquipmentSchema = equipmentSchema.partial().extend({
  id: z.string().min(1, "Equipment ID is required"),
});

export type EquipmentInput = z.infer<typeof equipmentSchema>;
export type UpdateEquipmentInput = z.infer<typeof updateEquipmentSchema>;
