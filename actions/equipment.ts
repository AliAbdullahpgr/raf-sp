"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  equipmentSchema,
  type EquipmentInput,
} from "@/lib/validations/equipment";
import { ActionResult } from "@/types";
import { revalidatePath } from "next/cache";

/**
 * Server action to create a new equipment record
 * Requirements: 4.1, 4.2, 4.4
 */
export async function createEquipment(
  data: EquipmentInput
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const { role, departmentId: userDepartmentId } = session.user;

    // Validate input
    const validatedFields = equipmentSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, type, status, purchaseDate, imageUrl, departmentId } =
      validatedFields.data;

    // Authorization check: DEPT_HEAD can only create equipment for their department
    if (role === "DEPT_HEAD") {
      if (!userDepartmentId) {
        return {
          success: false,
          message: "Department head must be assigned to a department",
        };
      }

      if (departmentId !== userDepartmentId) {
        return {
          success: false,
          message: "You can only create equipment for your own department",
        };
      }
    }

    // Verify department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return {
        success: false,
        message: "Invalid department selected",
      };
    }

    // Create equipment
    const equipment = await prisma.equipment.create({
      data: {
        name,
        type,
        status,
        purchaseDate,
        imageUrl: imageUrl || null,
        departmentId,
      },
      include: {
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/inventory");

    return {
      success: true,
      message: "Equipment created successfully",
      data: equipment,
    };
  } catch (error) {
    console.error("Create equipment error:", error);
    return {
      success: false,
      message: "An error occurred while creating equipment",
    };
  }
}

/**
 * Server action to update an existing equipment record
 * Requirements: 4.2, 4.3
 */
export async function updateEquipment(
  id: string,
  data: Partial<EquipmentInput>
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const { role, departmentId: userDepartmentId } = session.user;

    // Check if equipment exists
    const existingEquipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        department: true,
      },
    });

    if (!existingEquipment) {
      return {
        success: false,
        message: "Equipment not found",
      };
    }

    // Authorization check: DEPT_HEAD can only update equipment from their department
    if (role === "DEPT_HEAD") {
      if (!userDepartmentId) {
        return {
          success: false,
          message: "Department head must be assigned to a department",
        };
      }

      if (existingEquipment.departmentId !== userDepartmentId) {
        return {
          success: false,
          message: "You can only update equipment from your own department",
        };
      }

      // DEPT_HEAD cannot change departmentId
      if (data.departmentId && data.departmentId !== userDepartmentId) {
        return {
          success: false,
          message: "You cannot transfer equipment to another department",
        };
      }
    }

    // Validate input (partial validation for updates)
    const validatedFields = equipmentSchema.partial().safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid input data",
        data: validatedFields.error.flatten().fieldErrors,
      };
    }

    // If departmentId is being changed, verify the new department exists
    if (
      validatedFields.data.departmentId &&
      validatedFields.data.departmentId !== existingEquipment.departmentId
    ) {
      const newDepartment = await prisma.department.findUnique({
        where: { id: validatedFields.data.departmentId },
      });

      if (!newDepartment) {
        return {
          success: false,
          message: "Invalid department selected",
        };
      }
    }

    // Update equipment
    const updatedEquipment = await prisma.equipment.update({
      where: { id },
      data: {
        ...validatedFields.data,
        imageUrl: validatedFields.data.imageUrl || existingEquipment.imageUrl,
      },
      include: {
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/inventory");
    revalidatePath(`/dashboard/inventory/${id}`);

    return {
      success: true,
      message: "Equipment updated successfully",
      data: updatedEquipment,
    };
  } catch (error) {
    console.error("Update equipment error:", error);
    return {
      success: false,
      message: "An error occurred while updating equipment",
    };
  }
}

/**
 * Server action to delete an equipment record
 * Requirements: 4.3
 */
export async function deleteEquipment(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const { role, departmentId: userDepartmentId } = session.user;

    // Check if equipment exists
    const existingEquipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        maintenanceLogs: true,
      },
    });

    if (!existingEquipment) {
      return {
        success: false,
        message: "Equipment not found",
      };
    }

    // Authorization check: DEPT_HEAD can only delete equipment from their department
    if (role === "DEPT_HEAD") {
      if (!userDepartmentId) {
        return {
          success: false,
          message: "Department head must be assigned to a department",
        };
      }

      if (existingEquipment.departmentId !== userDepartmentId) {
        return {
          success: false,
          message: "You can only delete equipment from your own department",
        };
      }
    }

    // Delete equipment (cascade will handle maintenance logs)
    await prisma.equipment.delete({
      where: { id },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/inventory");

    return {
      success: true,
      message: "Equipment deleted successfully",
    };
  } catch (error) {
    console.error("Delete equipment error:", error);
    return {
      success: false,
      message: "An error occurred while deleting equipment",
    };
  }
}

/**
 * Server action to get a single equipment record by ID
 */
export async function getEquipmentById(id: string): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const { role, departmentId: userDepartmentId } = session.user;

    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
        maintenanceLogs: {
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    if (!equipment) {
      return {
        success: false,
        message: "Equipment not found",
      };
    }

    // Authorization check: DEPT_HEAD can only view equipment from their department
    if (role === "DEPT_HEAD") {
      if (!userDepartmentId) {
        return {
          success: false,
          message: "Department head must be assigned to a department",
        };
      }

      if (equipment.departmentId !== userDepartmentId) {
        return {
          success: false,
          message: "You can only view equipment from your own department",
        };
      }
    }

    return {
      success: true,
      data: equipment,
    };
  } catch (error) {
    console.error("Get equipment error:", error);
    return {
      success: false,
      message: "An error occurred while fetching equipment",
    };
  }
}

/**
 * Server action to get all equipment with optional filtering
 */
export async function getEquipment(filters?: {
  status?: string;
  type?: string;
  search?: string;
}): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const { role, departmentId: userDepartmentId } = session.user;

    // Build where clause
    const whereClause: any = {};

    // Role-based filtering
    if (role === "DEPT_HEAD") {
      if (!userDepartmentId) {
        return {
          success: false,
          message: "Department head must be assigned to a department",
        };
      }
      whereClause.departmentId = userDepartmentId;
    }

    // Apply filters
    if (filters?.status) {
      whereClause.status = filters.status;
    }

    if (filters?.type) {
      whereClause.type = filters.type;
    }

    if (filters?.search) {
      whereClause.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { type: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const equipment = await prisma.equipment.findMany({
      where: whereClause,
      include: {
        department: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: equipment,
    };
  } catch (error) {
    console.error("Get equipment error:", error);
    return {
      success: false,
      message: "An error occurred while fetching equipment",
    };
  }
}
