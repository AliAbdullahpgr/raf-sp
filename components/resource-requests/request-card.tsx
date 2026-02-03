"use client";

import { useState } from "react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import {
  Clock,
  Check,
  X,
  AlertTriangle,
  ArrowRight,
  Calendar,
  User,
  Building2,
  Package,
  RotateCcw,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ApproveRequestDialog } from "./approve-request-dialog";
import { RejectRequestDialog } from "./reject-request-dialog";
import {
  useStartBorrowing,
  useReturnResource,
  type ResourceRequest,
} from "@/hooks/use-resource-requests";
import { RequestStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

interface RequestCardProps {
  request: ResourceRequest;
  type: "incoming" | "outgoing";
  showActions?: boolean;
}

const statusConfig: Record<
  RequestStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: Clock,
  },
  APPROVED: {
    label: "Approved",
    color: "bg-green-100 text-green-800 border-green-300",
    icon: Check,
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 border-red-300",
    icon: X,
  },
  EXPIRED: {
    label: "Expired",
    color: "bg-gray-100 text-gray-800 border-gray-300",
    icon: Clock,
  },
  BORROWED: {
    label: "Borrowed",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: Package,
  },
  RETURNED: {
    label: "Returned",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    icon: Check,
  },
  OVERDUE: {
    label: "Overdue",
    color: "bg-red-100 text-red-800 border-red-300",
    icon: AlertTriangle,
  },
};

export function RequestCard({ request, type, showActions = true }: RequestCardProps) {
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const startBorrowingMutation = useStartBorrowing();
  const returnResourceMutation = useReturnResource();

  const status = statusConfig[request.status];
  const StatusIcon = status.icon;

  const isExpiringSoon =
    request.status === "PENDING" &&
    new Date(request.expiresAt) > new Date() &&
    new Date(request.expiresAt).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000;

  const isOverdue =
    request.status === "BORROWED" &&
    request.borrowEndDate &&
    isPast(new Date(request.borrowEndDate));

  const handleStartBorrowing = () => {
    startBorrowingMutation.mutate(request.id);
  };

  const handleReturnResource = () => {
    returnResourceMutation.mutate(request.id);
  };

  return (
    <>
      <Card
        className={cn(
          "transition-all hover:shadow-md",
          request.status === "OVERDUE" && "border-red-300 bg-red-50/30",
          isExpiringSoon && "border-yellow-300 bg-yellow-50/30"
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                {request.resourceName}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Building2 className="h-3 w-3" />
                {type === "incoming" ? (
                  <>
                    Requested by <strong>{request.requestingDept.name}</strong>
                  </>
                ) : (
                  <>
                    From <strong>{request.lendingDept.name}</strong>
                  </>
                )}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={cn("flex items-center gap-1", status.color)}
            >
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-2 space-y-2">
          {request.requestReason && (
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              &quot;{request.requestReason}&quot;
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {request.requestedBy.name}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(request.createdAt), "MMM d, yyyy")}
            </div>
          </div>

          {request.status === "PENDING" && (
            <div
              className={cn(
                "text-xs p-2 rounded flex items-center gap-1",
                isExpiringSoon
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-600"
              )}
            >
              <Clock className="h-3 w-3" />
              Expires {formatDistanceToNow(new Date(request.expiresAt), { addSuffix: true })}
            </div>
          )}

          {(request.status === "BORROWED" || request.status === "OVERDUE") &&
            request.borrowEndDate && (
              <div
                className={cn(
                  "text-xs p-2 rounded flex items-center gap-1",
                  isOverdue || request.status === "OVERDUE"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                )}
              >
                <Calendar className="h-3 w-3" />
                {isOverdue || request.status === "OVERDUE" ? (
                  <>
                    <AlertTriangle className="h-3 w-3" />
                    Overdue! Was due {format(new Date(request.borrowEndDate), "MMM d, yyyy")}
                  </>
                ) : (
                  <>Due back {format(new Date(request.borrowEndDate), "MMM d, yyyy")}</>
                )}
              </div>
            )}

          {request.status === "APPROVED" && request.borrowDurationDays && (
            <div className="text-xs p-2 rounded bg-green-100 text-green-800 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Approved for {request.borrowDurationDays} days
              {request.borrowStartDate && (
                <> starting {format(new Date(request.borrowStartDate), "MMM d")}</>
              )}
            </div>
          )}

          {request.status === "REJECTED" && request.rejectionReason && (
            <div className="text-xs p-2 rounded bg-red-100 text-red-800">
              <strong>Reason:</strong> {request.rejectionReason}
            </div>
          )}
        </CardContent>

        {showActions && (
          <CardFooter className="pt-2 flex gap-2 flex-wrap">
            {/* Incoming request actions (for lending department) */}
            {type === "incoming" && request.status === "PENDING" && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => setApproveDialogOpen(true)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Approve and set borrowing terms</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setRejectDialogOpen(true)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reject this request</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}

            {/* Outgoing request actions (for requesting department) */}
            {type === "outgoing" && request.status === "APPROVED" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      onClick={handleStartBorrowing}
                      disabled={startBorrowingMutation.isPending}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      {startBorrowingMutation.isPending
                        ? "Starting..."
                        : "Start Borrowing"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Begin using this resource</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {type === "outgoing" &&
              (request.status === "BORROWED" || request.status === "OVERDUE") && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant={request.status === "OVERDUE" ? "destructive" : "outline"}
                        onClick={handleReturnResource}
                        disabled={returnResourceMutation.isPending}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        {returnResourceMutation.isPending
                          ? "Returning..."
                          : "Return Resource"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Return this resource to the lending department</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
          </CardFooter>
        )}
      </Card>

      {/* Dialogs */}
      <ApproveRequestDialog
        request={request}
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
      />
      <RejectRequestDialog
        request={request}
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
      />
    </>
  );
}
