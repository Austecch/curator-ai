"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
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

const notifications = [
  {
    id: "1",
    title: "Post Published Successfully",
    message: "Your 'Q3 Strategy Update' post has been published on LinkedIn and Twitter.",
    type: "success",
    time: "2024-10-24T14:30:00",
    read: false,
    icon: Share,
  },
  {
    id: "2",
    title: "New Follower Milestone",
    message: "Congratulations! You've reached 45,000 followers on Instagram.",
    type: "info",
    time: "2024-10-24T10:00:00",
    read: false,
    icon: Camera,
  },
  {
    id: "3",
    title: "Schedule Reminder",
    message: "Your 'New Collection Reel' is scheduled for tomorrow at 10:00 AM.",
    type: "warning",
    time: "2024-10-23T16:00:00",
    read: false,
    icon: Calendar,
  },
  {
    id: "4",
    title: "AI Generation Complete",
    message: "Your content variations for the product launch are ready for review.",
    type: "info",
    time: "2024-10-23T12:00:00",
    read: true,
    icon: MessageCircle,
  },
  {
    id: "5",
    title: "Platform Connection Expired",
    message: "Your X (Twitter) connection needs to be reauthorized to continue posting.",
    type: "error",
    time: "2024-10-22T09:00:00",
    read: true,
    icon: AlertCircle,
  },
  {
    id: "6",
    title: "Weekly Analytics Report",
    message: "Your weekly performance report is ready. You had a 12% increase in reach.",
    type: "info",
    time: "2024-10-21T08:00:00",
    read: true,
    icon: Bell,
  },
];

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
  const [notifs, setNotifs] = useState(notifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifs([]);
  };

  const filteredNotifs = filter === "unread" ? notifs.filter((n) => !n.read) : notifs;

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
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}

          {notifs.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
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
                            !notification.read && "text-[#2e323d]"
                          )}
                        >
                          {notification.title}
                        </h4>
                        <span className="text-[10px] text-[#5b5f6b] whitespace-nowrap">
                          {formatRelativeTime(notification.time)}
                        </span>
                      </div>
                      <p className="text-sm text-[#5b5f6b] mt-1">
                        {notification.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4 text-[#5b5f6b]" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
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
