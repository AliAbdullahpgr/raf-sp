"use client";

import { format, formatDistanceToNow, isPast } from "date-fns";
import {
  Package,
  Calendar,
  Building2,
  AlertTriangle,
  RotateCcw,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-spinner";
import {
  useBorrowedResources,
  useReturnResource,
  type ResourceRequest,
} from "@/hooks/use-resource-requests";
import { cn } from "@/lib/utils";

export function BorrowedResourcesList() {
  const { data: borrowedResources, isLoading, error, refetch } = useBorrowedResources();
  const returnMutation = useReturnResource();

  const handleReturn = (requestId: string) => {
    returnMutation.mutate(requestId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-600" />
          Borrowed Resources
        </CardTitle>
        <CardDescription>
          Resources your department is currently borrowing from other departments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoadingState
          isLoading={isLoading}
          error={error}
          loadingText="Loading borrowed resources..."
          errorText="Failed to load borrowed resources"
          onRetry={() => refetch()}
        >
          {borrowedResources && borrowedResources.length > 0 ? (
            <div className="space-y-3">
              {borrowedResources.map((resource) => (
                <BorrowedResourceItem
                  key={resource.id}
                  resource={resource}
                  onReturn={handleReturn}
                  isReturning={returnMutation.isPending}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No borrowed resources</p>
              <p className="text-sm">
                Resources you borrow from other departments will appear here
              </p>
            </div>
          )}
        </LoadingState>
      </CardContent>
    </Card>
  );
}

interface BorrowedResourceItemProps {
  resource: ResourceRequest;
  onReturn: (requestId: string) => void;
  isReturning: boolean;
}

function BorrowedResourceItem({
  resource,
  onReturn,
  isReturning,
}: BorrowedResourceItemProps) {
  const isOverdue =
    resource.borrowEndDate && isPast(new Date(resource.borrowEndDate));
  const dueDate = resource.borrowEndDate
    ? new Date(resource.borrowEndDate)
    : null;

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border",
        isOverdue || resource.status === "OVERDUE"
          ? "bg-red-50 border-red-200"
          : "bg-blue-50 border-blue-200"
      )}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{resource.resourceName}</span>
          {(isOverdue || resource.status === "OVERDUE") && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Overdue
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            From {resource.lendingDept.name}
          </span>
          {dueDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {isOverdue || resource.status === "OVERDUE" ? (
                <span className="text-red-600">
                  Was due {format(dueDate, "MMM d")}
                </span>
              ) : (
                <>Due {formatDistanceToNow(dueDate, { addSuffix: true })}</>
              )}
            </span>
          )}
        </div>
      </div>
      <Button
        size="sm"
        variant={isOverdue || resource.status === "OVERDUE" ? "destructive" : "outline"}
        onClick={() => onReturn(resource.id)}
        disabled={isReturning}
      >
        <RotateCcw className="h-4 w-4 mr-1" />
        Return
      </Button>
    </div>
  );
}
