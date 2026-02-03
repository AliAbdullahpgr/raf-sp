"use client";

import { format, formatDistanceToNow, isPast } from "date-fns";
import {
  Package,
  Calendar,
  Building2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-spinner";
import { useLentResources, type ResourceRequest } from "@/hooks/use-resource-requests";
import { cn } from "@/lib/utils";

export function LentResourcesList() {
  const { data: lentResources, isLoading, error, refetch } = useLentResources();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpRight className="h-5 w-5 text-orange-600" />
          Lent Resources
          <Badge variant="outline" className="ml-2 text-orange-600 border-orange-300">
            Currently Unavailable
          </Badge>
        </CardTitle>
        <CardDescription>
          Resources from your department that are currently lent to other departments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoadingState
          isLoading={isLoading}
          error={error}
          loadingText="Loading lent resources..."
          errorText="Failed to load lent resources"
          onRetry={() => refetch()}
        >
          {lentResources && lentResources.length > 0 ? (
            <div className="space-y-3">
              {lentResources.map((resource) => (
                <LentResourceItem key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ArrowUpRight className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No lent resources</p>
              <p className="text-sm">
                Resources you lend to other departments will appear here
              </p>
            </div>
          )}
        </LoadingState>
      </CardContent>
    </Card>
  );
}

interface LentResourceItemProps {
  resource: ResourceRequest;
}

function LentResourceItem({ resource }: LentResourceItemProps) {
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
          : "bg-orange-50 border-orange-200"
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
            Lent to {resource.requestingDept.name}
          </span>
          {dueDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {isOverdue || resource.status === "OVERDUE" ? (
                <span className="text-red-600">
                  Was due {format(dueDate, "MMM d")}
                </span>
              ) : (
                <>Expected return {formatDistanceToNow(dueDate, { addSuffix: true })}</>
              )}
            </span>
          )}
        </div>
        {resource.borrowStartDate && (
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            Borrowed since {format(new Date(resource.borrowStartDate), "MMM d, yyyy")}
          </div>
        )}
      </div>
      <Badge
        variant="outline"
        className={cn(
          "ml-2",
          isOverdue || resource.status === "OVERDUE"
            ? "text-red-600 border-red-300"
            : "text-orange-600 border-orange-300"
        )}
      >
        {isOverdue || resource.status === "OVERDUE" ? "Overdue" : "In Use"}
      </Badge>
    </div>
  );
}
