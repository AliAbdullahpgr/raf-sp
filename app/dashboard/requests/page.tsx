"use client";

import { useState } from "react";
import {
  Send,
  Inbox,
  Package,
  ArrowUpRight,
  Clock,
  AlertTriangle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState } from "@/components/ui/loading-spinner";
import {
  ResourceRequestDialog,
  RequestCard,
  BorrowedResourcesList,
  LentResourcesList,
} from "@/components/resource-requests";
import {
  useMyRequests,
  useIncomingRequests,
  useRequestCounts,
} from "@/hooks/use-resource-requests";
import { useSession } from "next-auth/react";

export default function RequestsPage() {
  const { data: session } = useSession();
  const departmentId = session?.user?.departmentId || "";

  const {
    data: myRequests,
    isLoading: loadingMyRequests,
    error: myRequestsError,
    refetch: refetchMyRequests,
  } = useMyRequests();

  const {
    data: incomingRequests,
    isLoading: loadingIncoming,
    error: incomingError,
    refetch: refetchIncoming,
  } = useIncomingRequests();

  const { data: counts } = useRequestCounts();

  // Filter requests by status
  const pendingOutgoing = myRequests?.filter((r) => r.status === "PENDING") || [];
  const approvedOutgoing = myRequests?.filter((r) => r.status === "APPROVED") || [];
  const pendingIncoming = incomingRequests?.filter((r) => r.status === "PENDING") || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Resource Requests
          </h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">
            Manage resource requests between departments
          </p>
        </div>
        <ResourceRequestDialog
          currentDepartmentId={departmentId}
          trigger={
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Request Resource
            </Button>
          }
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Incoming</CardTitle>
            <Inbox className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {counts?.pendingIncoming || 0}
            </div>
            <p className="text-xs text-gray-500">Awaiting your approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready to Borrow</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {counts?.approvedWaiting || 0}
            </div>
            <p className="text-xs text-gray-500">Approved requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borrowed</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {counts?.borrowed || 0}
            </div>
            <p className="text-xs text-gray-500">Currently borrowing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rented Out</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {counts?.lent || 0}
            </div>
            <p className="text-xs text-gray-500">Currently renting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {counts?.overdue || 0}
            </div>
            <p className="text-xs text-gray-500">Past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Tabs */}
      <Tabs defaultValue="incoming" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="incoming" className="relative">
            Incoming
            {pendingIncoming.length > 0 && (
              <Badge
                variant="destructive"
                className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {pendingIncoming.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="outgoing" className="relative">
            My Requests
            {approvedOutgoing.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {approvedOutgoing.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="borrowed">Borrowed</TabsTrigger>
          <TabsTrigger value="lent">Rented</TabsTrigger>
        </TabsList>

        {/* Incoming Requests Tab */}
        <TabsContent value="incoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Inbox className="h-5 w-5" />
                Incoming Requests
              </CardTitle>
              <CardDescription>
                Requests from other departments for your resources. Review and approve or reject.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoadingState
                isLoading={loadingIncoming}
                error={incomingError}
                loadingText="Loading requests..."
                errorText="Failed to load requests"
                onRetry={() => refetchIncoming()}
              >
                {incomingRequests && incomingRequests.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {incomingRequests.map((request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        type="incoming"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Inbox className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No incoming requests</p>
                    <p className="text-sm">
                      Requests from other departments will appear here
                    </p>
                  </div>
                )}
              </LoadingState>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Outgoing Requests Tab */}
        <TabsContent value="outgoing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                My Requests
              </CardTitle>
              <CardDescription>
                Requests you&apos;ve made to other departments. Track status and start borrowing when approved.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoadingState
                isLoading={loadingMyRequests}
                error={myRequestsError}
                loadingText="Loading requests..."
                errorText="Failed to load requests"
                onRetry={() => refetchMyRequests()}
              >
                {myRequests && myRequests.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {myRequests.map((request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        type="outgoing"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Send className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No outgoing requests</p>
                    <p className="text-sm">
                      Click &quot;Request Resource&quot; to request from another department
                    </p>
                  </div>
                )}
              </LoadingState>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Borrowed Resources Tab */}
        <TabsContent value="borrowed">
          <BorrowedResourcesList />
        </TabsContent>

        {/* Rented Resources Tab */}
        <TabsContent value="lent">
          <LentResourcesList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
