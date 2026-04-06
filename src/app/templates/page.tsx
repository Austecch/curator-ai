"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import {
  Plus,
  Search,
  FileText,
  Edit,
  Copy,
  Trash2,
  MoreVertical,
  Clock,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  content: string;
  platforms: string[];
  usageCount: number;
  createdAt: string;
}

const templates: Template[] = [
  {
    id: "1",
    name: "Product Launch",
    content: "Introducing [Product Name] - the solution you've been waiting for! [Key Feature 1]. [Key Feature 2]. Available now at [Link]. #NewProduct #[Industry]",
    platforms: ["linkedin", "twitter", "facebook"],
    usageCount: 12,
    createdAt: "2024-10-15",
  },
  {
    id: "2",
    name: "Weekly Tip",
    content: "Pro Tip: [Your actionable tip here]. This simple change can [benefit]. Have you tried it? Let us know in the comments! #[Topic] #Tips",
    platforms: ["linkedin", "instagram"],
    usageCount: 8,
    createdAt: "2024-10-10",
  },
  {
    id: "3",
    name: "Behind the Scenes",
    content: "Ever wonder how we [process/action]? Here's a sneak peek! [Description]. Stay tuned for more behind-the-scenes content. #BTS #Team #[Company]",
    platforms: ["instagram", "facebook"],
    usageCount: 5,
    createdAt: "2024-10-05",
  },
  {
    id: "4",
    name: "Customer Testimonial",
    content: "\"[Customer Quote]\" - [Customer Name], [Customer Title]. We love hearing from our customers! [Optional: Add results/benefits]. #[Brand] #Testimonial #CustomerSuccess",
    platforms: ["linkedin", "twitter"],
    usageCount: 3,
    createdAt: "2024-09-28",
  },
];

const platformColors: Record<string, string> = {
  linkedin: "#0077B5",
  instagram: "#E4405F",
  facebook: "#1877F2",
  twitter: "#000000",
  youtube: "#FF0000",
  tiktok: "#000000",
};

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUseTemplate = (template: Template) => {
    console.log("Using template:", template);
  };

  const handleDuplicateTemplate = (template: Template) => {
    console.log("Duplicating template:", template);
  };

  return (
    <DashboardShell>
      <section className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#2e323d] mb-2">
            Content Templates
          </h2>
          <p className="text-[#5b5f6b] font-medium">
            Save time with reusable post templates.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Create Template
        </Button>
      </section>

      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5b5f6b]/60" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f3f3fb] border-none rounded-full py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#005cbb]/20 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="p-6 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d7e2ff] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#005cbb]" />
                </div>
                <div>
                  <h3 className="font-bold">{template.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-[#5b5f6b]" />
                    <span className="text-xs text-[#5b5f6b]">
                      Used {template.usageCount} times
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDuplicateTemplate(template)}
                  className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors"
                >
                  <Copy className="w-4 h-4 text-[#5b5f6b]" />
                </button>
                <button className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors">
                  <Edit className="w-4 h-4 text-[#5b5f6b]" />
                </button>
                <button className="p-2 rounded-lg hover:bg-[#fe8983]/20 transition-colors">
                  <Trash2 className="w-4 h-4 text-[#9f403d]" />
                </button>
              </div>
            </div>

            <p className="text-sm text-[#5b5f6b] mb-4 line-clamp-3 bg-[#f3f3fb] p-3 rounded-lg">
              {template.content}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-[#aeb1bf]/15">
              <div className="flex items-center gap-2">
                {template.platforms.map((platform) => (
                  <div
                    key={platform}
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${platformColors[platform]}20` }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: platformColors[platform] }}
                    />
                  </div>
                ))}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleUseTemplate(template)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Use Template
              </Button>
            </div>
          </Card>
        ))}

        <Card
          className="p-6 border-2 border-dashed border-[#aeb1bf]/30 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#005cbb]/50 hover:bg-[#d7e2ff]/10 transition-all min-h-[200px]"
          onClick={() => setShowCreateModal(true)}
        >
          <div className="w-12 h-12 rounded-full bg-[#f3f3fb] flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-[#5b5f6b]" />
          </div>
          <p className="text-sm font-medium text-[#5b5f6b]">Create New Template</p>
          <p className="text-xs text-[#5b5f6b]/60 mt-1">
            Save time on repetitive content
          </p>
        </Card>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-lg p-6 m-4">
            <h3 className="text-xl font-bold mb-4">Create Template</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Product Announcement"
                  className="w-full bg-[#f3f3fb] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#005cbb]/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-2">
                  Content
                </label>
                <textarea
                  placeholder="Use [variable] for placeholders..."
                  className="w-full bg-[#f3f3fb] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#005cbb]/20 outline-none h-32 resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary">
                  <Check className="w-4 h-4 mr-2" />
                  Save Template
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}
