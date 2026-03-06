import { z } from "zod";

export const departmentSchema = z.object({
  name: z
    .string()
    .min(1, "Department name is required")
    .max(255, "Name is too long"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(255, "Location is too long"),
  logo: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  secondaryEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  focalPerson: z.string().max(255).optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
});

export const updateDepartmentSchema = departmentSchema.partial().extend({
  id: z.string().min(1, "Department ID is required"),
});

export type DepartmentInput = z.infer<typeof departmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
