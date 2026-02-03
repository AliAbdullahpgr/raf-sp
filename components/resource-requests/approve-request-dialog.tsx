"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays } from "date-fns";
import { Check, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useApproveRequest, type ResourceRequest } from "@/hooks/use-resource-requests";
import { BORROW_DURATION_OPTIONS } from "@/lib/validations/resource-request";

const formSchema = z.object({
  borrowDurationDays: z.number().min(10).max(90),
  borrowStartDate: z.date(),
});

type FormData = z.infer<typeof formSchema>;

interface ApproveRequestDialogProps {
  request: ResourceRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApproveRequestDialog({
  request,
  open,
  onOpenChange,
}: ApproveRequestDialogProps) {
  const approveMutation = useApproveRequest();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      borrowDurationDays: 30,
      borrowStartDate: new Date(),
    },
  });

  const selectedDuration = form.watch("borrowDurationDays");
  const selectedStartDate = form.watch("borrowStartDate");

  const onSubmit = async (data: FormData) => {
    try {
      await approveMutation.mutateAsync({
        requestId: request.id,
        borrowDurationDays: data.borrowDurationDays,
        borrowStartDate: data.borrowStartDate,
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
            <Check className="h-5 w-5 text-green-600" />
            Approve Request
          </DialogTitle>
          <DialogDescription>
            Approve the request for &quot;{request.resourceName}&quot; from {request.requestingDept.name}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="borrowStartDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Borrowing Start Date *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="borrowDurationDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Borrowing Duration *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BORROW_DURATION_OPTIONS.map((days) => (
                        <SelectItem key={days} value={days.toString()}>
                          {days} days
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Resource will be due back on{" "}
                    <strong>
                      {format(addDays(selectedStartDate, selectedDuration), "PPP")}
                    </strong>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <strong>Summary:</strong>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>Resource: {request.resourceName}</li>
                <li>Requesting: {request.requestingDept.name}</li>
                <li>Duration: {selectedDuration} days</li>
                <li>Return by: {format(addDays(selectedStartDate, selectedDuration), "PPP")}</li>
              </ul>
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
                disabled={approveMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {approveMutation.isPending ? "Approving..." : "Approve Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
