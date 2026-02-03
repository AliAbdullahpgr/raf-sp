"use client";

import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Bell,
  Check,
  CheckCheck,
  Package,
  Clock,
  AlertTriangle,
  X,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  type Notification,
} from "@/hooks/use-resource-requests";
import { NotificationType } from "@prisma/client";
import { cn } from "@/lib/utils";
import Link from "next/link";

const notificationConfig: Record<
  NotificationType,
  { icon: React.ElementType; color: string }
> = {
  REQUEST_RECEIVED: { icon: Package, color: "text-blue-600" },
  REQUEST_APPROVED: { icon: Check, color: "text-green-600" },
  REQUEST_REJECTED: { icon: X, color: "text-red-600" },
  REQUEST_EXPIRING: { icon: Clock, color: "text-yellow-600" },
  REQUEST_EXPIRED: { icon: Clock, color: "text-gray-600" },
  BORROW_STARTED: { icon: ArrowRight, color: "text-blue-600" },
  RETURN_DUE_SOON: { icon: AlertTriangle, color: "text-yellow-600" },
  RESOURCE_OVERDUE: { icon: AlertTriangle, color: "text-red-600" },
  RESOURCE_RETURNED: { icon: RotateCcw, color: "text-green-600" },
};

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const { data: notifications, isLoading } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : notifications && notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onClose={() => setOpen(false)}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>No notifications</p>
            </div>
          )}
        </ScrollArea>

        <div className="p-2 border-t">
          <Link href="/dashboard/requests" onClick={() => setOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full">
              View all requests
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onClose: () => void;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onClose,
}: NotificationItemProps) {
  const config = notificationConfig[notification.type];
  const Icon = config.icon;

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    onClose();
  };

  return (
    <div
      className={cn(
        "p-3 hover:bg-gray-50 cursor-pointer transition-colors",
        !notification.read && "bg-blue-50/50"
      )}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            notification.read ? "bg-gray-100" : "bg-blue-100"
          )}
        >
          <Icon className={cn("h-4 w-4", config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm",
              !notification.read && "font-medium"
            )}
          >
            {notification.title}
          </p>
          <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
        {!notification.read && (
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
