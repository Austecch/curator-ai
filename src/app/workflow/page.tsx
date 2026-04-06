"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Button, Badge } from "@/components/ui";
import {
  Workflow,
  Plus,
  ChevronRight,
  Check,
  Clock,
  Eye,
  Edit,
  X,
  Filter,
  MoreVertical,
  Briefcase,
  Camera,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowItem {
  id: string;
  title: string;
  content: string;
  platform: string;
  status: "draft" | "review" | "approved" | "rejected";
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

const workflowItems: WorkflowItem[] = [
  {
    id: "1",
    title: "Q4 Strategy Announcement",
    content: "Excited to share our Q4 strategy updates...",
    platform: "linkedin",
    status: "review",
    assignee: "Sarah Chen",
    createdAt: "2024-10-24",
    updatedAt: "2024-10-24",
  },
  {
    id: "2",
    title: "Product Launch Post",
    content: "Introducing our new product line...",
    platform: "instagram",
    status: "approved",
    assignee: "Alex Rivers",
    createdAt: "2024-10-23",
    updatedAt: "2024-10-24",
  },
  {
    id: "3",
    title: "Weekly Tip",
    content: "Here's a quick tip for better engagement...",
    platform: "twitter",
    status: "draft",
    createdAt: "2024-10-24",
    updatedAt: "2024-10-24",
  },
  {
    id: "4",
    title: "Customer Testimonial",
    content: "\"This product changed how we work...\"",
    platform: "facebook",
    status: "review",
    assignee: "Mike Johnson",
    createdAt: "2024-10-22",
    updatedAt: "2024-10-24",
  },
];

const platformIcons: Record<string, typeof Briefcase> = {
  linkedin: Briefcase,
  instagram: Camera,
  facebook: Users,
  twitter: Users,
};

const statusConfig = {
  draft: { label: "Draft", icon: Edit, color: "neutral" as const },
  review: { label: "In Review", icon: Eye, color: "warning" as const },
  approved: { label: "Approved", icon: Check, color: "success" as const },
  rejected: { label: "Rejected", icon: X, color: "error" as const },
};

export default function WorkflowPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<WorkflowItem | null>(null);

  const filteredItems = workflowItems.filter((item) => {
    if (activeFilter === "all") return true;
    return item.status === activeFilter;
  });

  const counts = {
    all: workflowItems.length,
    draft: workflowItems.filter((i) => i.status === "draft").length,
    review: workflowItems.filter((i) => i.status === "review").length,
    approved: workflowItems.filter((i) => i.status === "approved").length,
    rejected: workflowItems.filter((i) => i.status === "rejected").length,
  };

  const handleStatusChange = (id: string, newStatus: WorkflowItem["status"]) => {
    console.log(`Changing ${id} to ${newStatus}`);
  };

  return (
    <DashboardShell>
      <section className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#2e323d] mb-2">
            Approval Workflow
          </h2>
          <p className="text-[#5b5f6b] font-medium">
            Review and approve content before publishing.
          </p>
        </div>
        <Button variant="primary">
          <Plus className="w-5 h-5 mr-2" />
          New Request
        </Button>
      </section>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { id: "all", label: "All", count: counts.all },
          { id: "review", label: "Needs Review", count: counts.review },
          { id: "approved", label: "Approved", count: counts.approved },
          { id: "draft", label: "Drafts", count: counts.draft },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "p-4 rounded-xl text-left transition-all",
              activeFilter === filter.id
                ? "bg-[#005cbb] text-white"
                : "bg-white hover:bg-[#f3f3fb]"
            )}
          >
            <p className="text-2xl font-extrabold">{filter.count}</p>
            <p className={cn(
              "text-sm",
              activeFilter === filter.id ? "text-white/80" : "text-[#5b5f6b]"
            )}>
              {filter.label}
            </p>
          </button>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold flex items-center gap-2">
            <Workflow className="w-5 h-5" />
            Content Requests
          </h3>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredItems.map((item) => {
            const Icon = platformIcons[item.platform] || Briefcase;
            const status = statusConfig[item.status];
            const StatusIcon = status.icon;

            return (
              <div
                key={item.id}
                className={cn(
                  "p-4 rounded-xl transition-all cursor-pointer",
                  "bg-[#f3f3fb] hover:bg-[#e6e7f4]",
                  item.status === "review" && "border-l-4 border-amber-400",
                  item.status === "approved" && "border-l-4 border-emerald-400"
                )}
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#005cbb]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold truncate">{item.title}</h4>
                      <Badge variant={status.color} size="sm">
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#5b5f6b] truncate mt-1">
                      {item.content}
                    </p>
                  </div>

                  {item.assignee && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#d7e2ff] flex items-center justify-center text-xs font-bold text-[#005cbb]">
                        {item.assignee.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="text-sm text-[#5b5f6b]">{item.assignee}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#5b5f6b]">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </span>
                    <ChevronRight className="w-5 h-5 text-[#5b5f6b]/40" />
                  </div>
                </div>

                {item.status === "review" && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#aeb1bf]/20">
                    <Button variant="secondary" size="sm">
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button variant="primary" size="sm">
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Request Changes
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6 m-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{selectedItem.title}</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#f3f3fb] rounded-xl">
                <p className="text-sm">{selectedItem.content}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#5b5f6b] uppercase tracking-wider mb-1">Platform</p>
                  <p className="font-medium capitalize">{selectedItem.platform}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5b5f6b] uppercase tracking-wider mb-1">Status</p>
                  <Badge variant={statusConfig[selectedItem.status].color}>
                    {statusConfig[selectedItem.status].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-[#5b5f6b] uppercase tracking-wider mb-1">Created</p>
                  <p className="font-medium">{new Date(selectedItem.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5b5f6b] uppercase tracking-wider mb-1">Last Updated</p>
                  <p className="font-medium">{new Date(selectedItem.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedItem.assignee && (
                <div>
                  <p className="text-xs text-[#5b5f6b] uppercase tracking-wider mb-1">Assigned To</p>
                  <p className="font-medium">{selectedItem.assignee}</p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-[#aeb1bf]/20">
                <Button variant="secondary">Edit</Button>
                {selectedItem.status !== "approved" && (
                  <Button variant="primary">
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                )}
                {selectedItem.status === "approved" && (
                  <Button variant="primary">
                    <Clock className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}
