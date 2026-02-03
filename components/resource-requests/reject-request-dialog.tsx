"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRejectRequest, type ResourceRequest } from "@/hooks/use-resource-requests";

const formSchema = z.object({
  rejectionReason: z.string().min(1, "Please provide a reason for rejection"),
});

type FormData = z.infer<typeof formSchema>;

interface RejectRequestDialogProps {
  request: ResourceRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RejectRequestDialog({
  request,
  open,
  onOpenChange,
}: RejectRequestDialogProps) {
  const rejectMutation = useRejectRequest();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rejectionReason: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await rejectMutation.mutateAsync({
        requestId: request.id,
        rejectionReason: data.rejectionReason,
      });
      onOpenChange(false);
      form.reset();
    } catch {
      // Error is handled by the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <X className="h-5 w-5 text-red-600" />
            Reject Request
          </DialogTitle>
          <DialogDescription>
            Reject the request for &quot;{request.resourceName}&quot; from {request.requestingDept.name}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rejectionReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Rejection *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain why you are rejecting this request..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
              <strong>Note:</strong> The requesting department will be notified of your rejection with the reason provided.
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={rejectMutation.isPending}
                variant="destructive"
              >
                {rejectMutation.isPending ? "Rejecting..." : "Reject Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
