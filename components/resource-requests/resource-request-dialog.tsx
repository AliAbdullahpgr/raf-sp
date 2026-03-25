"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateResourceRequest, useAvailableResources } from "@/hooks/use-resource-requests";
import { useDepartments } from "@/hooks/use-departments";
import { RESOURCE_TYPES, type ResourceType } from "@/lib/validations/resource-request";

const formSchema = z.object({
  lendingDeptId: z.string().min(1, "Please select a department"),
  resourceType: z.string().min(1, "Please select a resource type"),
  resourceId: z.string().min(1, "Please select a resource"),
  resourceName: z.string().min(1, "Resource name is required"),
  requestReason: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ResourceRequestDialogProps {
  currentDepartmentId: string;
  trigger?: React.ReactNode;
  preselectedDepartmentId?: string;
  preselectedResourceType?: string;
}

// Map department IDs to their resource types
const departmentResourceTypes: Record<string, ResourceType> = {
  amri: "AMRIInventory",
  mri: "MRIAssets",
  cri: "CRIMultanAssets",
  "food-science": "FoodAnalysisLabEquipment",
  flori: "FloricultureStationAssets",
  rari: "RARIBahawalpurAssets",
  mnsuam: "ValueAdditionLabEquipment",
  "soil-water": "SoilWaterTestingProject",
  pest: "PesticideQCLabData",
  "agri-eng": "AgriEngineeringMultanRegionData",
  erss: "EntoInventoryItems",
  agronomy: "AgronomyLabEquipment",
};

export function ResourceRequestDialog({
  currentDepartmentId,
  trigger,
  preselectedDepartmentId,
  preselectedResourceType,
}: ResourceRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState(preselectedDepartmentId || "");
  const [selectedResourceType, setSelectedResourceType] = useState(preselectedResourceType || "");

  const createMutation = useCreateResourceRequest();
  const { data: departments, isLoading: loadingDepartments } = useDepartments();
  const { data: availableResources, isLoading: loadingResources } = useAvailableResources(
    selectedDeptId,
    selectedResourceType
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lendingDeptId: preselectedDepartmentId || "",
      resourceType: preselectedResourceType || "",
      resourceId: "",
      resourceName: "",
      requestReason: "",
    },
  });

  // Filter to only show departments that have resources AND exclude current department
  const validDepartmentIds = Object.keys(departmentResourceTypes);
  const otherDepartments = departments?.filter(
    (d) => d.id !== currentDepartmentId && validDepartmentIds.includes(d.id)
  ) || [];

  // Auto-set resource type when department changes
  useEffect(() => {
    if (selectedDeptId) {
      const resourceType = departmentResourceTypes[selectedDeptId] || "Equipment";
      setSelectedResourceType(resourceType);
      form.setValue("resourceType", resourceType);
      form.setValue("resourceId", "");
      form.setValue("resourceName", "");
    }
  }, [selectedDeptId, form]);

  const onSubmit = async (data: FormData) => {
    try {
      await createMutation.mutateAsync({
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        resourceName: data.resourceName,
        lendingDeptId: data.lendingDeptId,
        requestReason: data.requestReason,
      });
      setOpen(false);
      form.reset();
      setSelectedDeptId("");
      setSelectedResourceType("");
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleResourceSelect = (resourceId: string) => {
    const resource = availableResources?.find((r) => r.id === resourceId);
    if (resource) {
      form.setValue("resourceId", resourceId);
      form.setValue("resourceName", resource.name);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Request Resource
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Resource</DialogTitle>
          <DialogDescription>
            Request a temporary movable asset from another department. The department head will review your request.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="lendingDeptId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Department *</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedDeptId(value);
                    }}
                    defaultValue={field.value}
                    disabled={loadingDepartments}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {otherDepartments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resourceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource *</FormLabel>
                  <Select
                    onValueChange={handleResourceSelect}
                    defaultValue={field.value}
                    disabled={!selectedDeptId || loadingResources}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !selectedDeptId
                              ? "Select a department first"
                              : loadingResources
                              ? "Loading resources..."
                              : availableResources?.length === 0
                              ? "No available resources"
                              : "Select a resource"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableResources?.map((resource) => (
                        <SelectItem key={resource.id} value={resource.id}>
                          {resource.name} ({resource.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Only available temporary assets are shown
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requestReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Request</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain why you need this resource..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional but recommended to increase approval chances
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              <strong>Note:</strong> The request will expire in 15 days if not approved.
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
