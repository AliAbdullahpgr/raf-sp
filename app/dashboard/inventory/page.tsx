"use client";

import { useState } from "react";

export const dynamic = "force-dynamic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { getEquipment, deleteEquipment } from "@/actions/equipment";
import { EquipmentTable } from "@/components/equipment/equipment-table";
import { EquipmentForm } from "@/components/equipment/equipment-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { EquipmentStatus } from "@prisma/client";

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: EquipmentStatus;
  purchaseDate: Date;
  imageUrl?: string | null;
  departmentId: string;
  department: {
    name: string;
  };
}

export default function InventoryPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch equipment
  const { data: equipmentResult, isLoading } = useQuery({
    queryKey: ["equipment"],
    queryFn: async () => {
      const result = await getEquipment();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch equipment");
      }
      return result.data as Equipment[];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteEquipment(id);
      if (!result.success) {
        throw new Error(result.message || "Failed to delete equipment");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      toast({
        title: "Success",
        description: "Equipment deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this equipment?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedEquipment(null);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["equipment"] });
    handleDialogClose();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading equipment...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Equipment Inventory
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your department's equipment and assets
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedEquipment(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedEquipment ? "Edit Equipment" : "Add New Equipment"}
              </DialogTitle>
              <DialogDescription>
                {selectedEquipment
                  ? "Update the equipment information below."
                  : "Fill in the details to add new equipment to your inventory."}
              </DialogDescription>
            </DialogHeader>
            <EquipmentForm
              equipment={
                selectedEquipment
                  ? {
                      id: selectedEquipment.id,
                      name: selectedEquipment.name,
                      type: selectedEquipment.type,
                      status: selectedEquipment.status,
                      purchaseDate: selectedEquipment.purchaseDate,
                      imageUrl: selectedEquipment.imageUrl,
                      departmentId: selectedEquipment.departmentId,
                    }
                  : undefined
              }
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Equipment Table */}
      {equipmentResult && equipmentResult.length > 0 ? (
        <EquipmentTable
          data={equipmentResult}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500 mb-4">No equipment found</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Equipment
          </Button>
        </div>
      )}
    </div>
  );
}
