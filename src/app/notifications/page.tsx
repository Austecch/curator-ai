"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";
import { useNotifications } from "@/lib/hooks/useNotifications";
import {
  Bell,
  Check,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  Calendar,
  Share,
  Camera,
  MessageCircle,
  Clock,
  Settings,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";

const typeIcons = {
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  info: Info,
};

const typeColors = {
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
};

export default function NotificationsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications(user?.id || null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  if (authLoading || loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005cbb] mx-auto mb-4"></div>
            <p className="text-[#5b5f6b]">Loading notifications...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (id: string) => {
    await deleteNotification(id);
  };

  const handleClearAll = async () => {
    for (const notif of notifications) {
      await deleteNotification(notif.id);
    }
  };

  const filteredNotifs = filter === "unread" 
    ? notifications.filter((n) => !n.is_read) 
    : notifications;

  return (
    <DashboardShell>
      <section className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#2e323d] mb-2">
            Notifications
          </h2>
          <p className="text-[#5b5f6b] font-medium">
            {unreadCount > 0 ? (
              <>
                You have <span className="text-[#005cbb] font-bold">{unreadCount}</span> unread notification
                {unreadCount !== 1 ? "s" : ""}
              </>
            ) : (
              "You're all caught up!"
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#f3f3fb] rounded-xl p-1">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                filter === "all"
                  ? "bg-white shadow-sm text-[#2e323d]"
                  : "text-[#5b5f6b] hover:text-[#2e323d]"
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                filter === "unread"
                  ? "bg-white shadow-sm text-[#2e323d]"
                  : "text-[#5b5f6b] hover:text-[#2e323d]"
              )}
            >
              Unread
            </button>
          </div>

          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}

          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearAll}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </section>

      <div className="max-w-3xl">
        {filteredNotifs.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#f3f3fb] flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-[#5b5f6b]" />
            </div>
            <h3 className="text-lg font-bold mb-2">
              {filter === "unread" ? "No unread notifications" : "No notifications"}
            </h3>
            <p className="text-sm text-[#5b5f6b]">
              {filter === "unread"
                ? "You've read all your notifications."
                : "You're all caught up!"}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifs.map((notification) => {
              const Icon = typeIcons[notification.type as keyof typeof typeIcons] || Info;
              const color = typeColors[notification.type as keyof typeof typeColors] || "#3b82f6";

              return (
                <Card
                  key={notification.id}
                  className={cn(
                    "p-5 transition-all",
                    !notification.read && "border-l-4"
                  )}
                  style={{
                    borderLeftColor: !notification.read ? color : undefined,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <h4
                          className={cn(
                            "font-bold",
                            !notification.is_read && "text-[#2e323d]"
                          )}
                        >
                          {notification.title}
                        </h4>
                        <span className="text-[10px] text-[#5b5f6b] whitespace-nowrap">
                          {formatRelativeTime(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-[#5b5f6b] mt-1">
                        {notification.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4 text-[#5b5f6b]" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="p-2 rounded-lg hover:bg-[#fe8983]/20 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-[#9f403d]" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
