"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema for ERSS Stock Register item
const erssStockSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  quantityStr: z.string().optional().nullable(),
  dateReceived: z.date().optional().nullable(),
  lastVerificationDate: z.string().optional().nullable(),
  currentStatusRemarks: z.string().optional().nullable(),
  status: z.enum(["AVAILABLE", "IN_USE", "NEEDS_REPAIR", "DISCARDED"]).default("AVAILABLE"),
  imageUrl: z.string().optional().nullable(),
});

export type ERSSStockInput = z.infer<typeof erssStockSchema>;

/**
 * Get all ERSS Stock Register items for the Entomology department
 */
export async function getERSSStockItems(): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find ERSS department
    const erssDepartment = await prisma.department.findFirst({
      where: { id: "erss" },
    });

    if (!erssDepartment) {
      return { success: false, message: "Entomology Research Sub-Station department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== erssDepartment.id) {
      return { success: false, message: "Not authorized to view ERSS stock items" };
    }

    const items = await prisma.eRSSStockRegister.findMany({
      where: { departmentId: erssDepartment.id },
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: items };
  } catch (error) {
    console.error("Error fetching ERSS stock items:", error);
    return { success: false, message: "Failed to fetch ERSS stock items" };
  }
}

/**
 * Get a single ERSS Stock Register item by ID
 */
export async function getERSSStockItemById(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const item = await prisma.eRSSStockRegister.findUnique({
      where: { id },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    if (!item) {
      return { success: false, message: "Stock item not found" };
    }

    return { success: true, data: item };
  } catch (error) {
    console.error("Error fetching ERSS stock item:", error);
    return { success: false, message: "Failed to fetch ERSS stock item" };
  }
}

/**
 * Create a new ERSS Stock Register item
 */
export async function createERSSStockItem(data: ERSSStockInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find ERSS department
    const erssDepartment = await prisma.department.findFirst({
      where: { id: "erss" },
    });

    if (!erssDepartment) {
      return { success: false, message: "Entomology Research Sub-Station department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== erssDepartment.id) {
      return { success: false, message: "Not authorized to create ERSS stock items" };
    }

    // Validate input
    const validatedFields = erssStockSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const item = await prisma.eRSSStockRegister.create({
      data: {
        ...validatedFields.data,
        departmentId: erssDepartment.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/entomology");
    revalidatePath("/dashboard");

    return { success: true, message: "Stock item created successfully", data: item };
  } catch (error) {
    console.error("Error creating ERSS stock item:", error);
    return { success: false, message: "Failed to create ERSS stock item" };
  }
}

/**
 * Update an ERSS Stock Register item
 */
export async function updateERSSStockItem(id: string, data: ERSSStockInput): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find ERSS department
    const erssDepartment = await prisma.department.findFirst({
      where: { id: "erss" },
    });

    if (!erssDepartment) {
      return { success: false, message: "Entomology Research Sub-Station department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== erssDepartment.id) {
      return { success: false, message: "Not authorized to update ERSS stock items" };
    }

    // Check if item exists
    const existingItem = await prisma.eRSSStockRegister.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return { success: false, message: "Stock item not found" };
    }

    // Validate input
    const validatedFields = erssStockSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const item = await prisma.eRSSStockRegister.update({
      where: { id },
      data: validatedFields.data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/entomology");
    revalidatePath("/dashboard");

    return { success: true, message: "Stock item updated successfully", data: item };
  } catch (error) {
    console.error("Error updating ERSS stock item:", error);
    return { success: false, message: "Failed to update ERSS stock item" };
  }
}

/**
 * Delete an ERSS Stock Register item
 */
export async function deleteERSSStockItem(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { role, departmentId } = session.user;

    // Find ERSS department
    const erssDepartment = await prisma.department.findFirst({
      where: { id: "erss" },
    });

    if (!erssDepartment) {
      return { success: false, message: "Entomology Research Sub-Station department not found" };
    }

    // Check authorization
    if (role === "DEPT_HEAD" && departmentId !== erssDepartment.id) {
      return { success: false, message: "Not authorized to delete ERSS stock items" };
    }

    // Check if item exists
    const existingItem = await prisma.eRSSStockRegister.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return { success: false, message: "Stock item not found" };
    }

    await prisma.eRSSStockRegister.delete({
      where: { id },
    });

    revalidatePath("/dashboard/entomology");
    revalidatePath("/dashboard");

    return { success: true, message: "Stock item deleted successfully" };
  } catch (error) {
    console.error("Error deleting ERSS stock item:", error);
    return { success: false, message: "Failed to delete ERSS stock item" };
  }
}
