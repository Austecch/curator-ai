"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Badge, Button, Textarea, Input } from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
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
  X,
  Briefcase,
  Camera,
  Users,
  MessageCircle,
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

const defaultTemplates: Template[] = [
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

const platformOptions = [
  { id: "linkedin", name: "LinkedIn", icon: Briefcase, color: "#0077B5" },
  { id: "instagram", name: "Instagram", icon: Camera, color: "#E4405F" },
  { id: "facebook", name: "Facebook", icon: Users, color: "#1877F2" },
  { id: "twitter", name: "X (Twitter)", icon: MessageCircle, color: "#000000" },
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
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateContent, setNewTemplateContent] = useState("");
  const [newTemplatePlatforms, setNewTemplatePlatforms] = useState<string[]>(["linkedin"]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUseTemplate = (template: Template) => {
    const encodedContent = encodeURIComponent(template.content);
    router.push(`/create?template=${encodedContent}`);
  };

  const handleDuplicateTemplate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: `copy-${Date.now()}`,
      name: `${template.name} (Copy)`,
      usageCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTemplates((prev) => [newTemplate, ...prev]);
  };

  const handleDeleteTemplate = (id: string) => {
    if (!confirm("Delete this template?")) return;
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handleTogglePlatform = (platformId: string) => {
    setNewTemplatePlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim() || !newTemplateContent.trim()) {
      alert("Please fill in all fields");
      return;
    }

    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplate.id
            ? { ...t, name: newTemplateName, content: newTemplateContent, platforms: newTemplatePlatforms }
            : t
        )
      );
    } else {
      const newTemplate: Template = {
        id: `template-${Date.now()}`,
        name: newTemplateName,
        content: newTemplateContent,
        platforms: newTemplatePlatforms,
        usageCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTemplates((prev) => [newTemplate, ...prev]);
    }

    setShowCreateModal(false);
    setEditingTemplate(null);
    setNewTemplateName("");
    setNewTemplateContent("");
    setNewTemplatePlatforms(["linkedin"]);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setNewTemplateName(template.name);
    setNewTemplateContent(template.content);
    setNewTemplatePlatforms(template.platforms);
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingTemplate(null);
    setNewTemplateName("");
    setNewTemplateContent("");
    setNewTemplatePlatforms(["linkedin"]);
  };

  if (authLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005cbb]"></div>
        </div>
      </DashboardShell>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4 text-[#5b5f6b]" />
                </button>
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4 text-[#5b5f6b]" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="p-2 rounded-lg hover:bg-[#fe8983]/20 transition-colors"
                  title="Delete"
                >
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                {editingTemplate ? "Edit Template" : "Create Template"}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors"
              >
                <X className="w-5 h-5 text-[#5b5f6b]" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Product Announcement"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="w-full bg-[#f3f3fb] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#005cbb]/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-2">
                  Content
                </label>
                <textarea
                  placeholder="Use [variable] for placeholders..."
                  value={newTemplateContent}
                  onChange={(e) => setNewTemplateContent(e.target.value)}
                  className="w-full bg-[#f3f3fb] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#005cbb]/20 outline-none h-32 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-2">
                  Platforms
                </label>
                <div className="flex flex-wrap gap-2">
                  {platformOptions.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => handleTogglePlatform(platform.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        newTemplatePlatforms.includes(platform.id)
                          ? "bg-[#005cbb] text-white"
                          : "bg-[#f3f3fb] text-[#5b5f6b] hover:bg-[#e6e7f4]"
                      )}
                    >
                      <platform.icon className="w-4 h-4" />
                      {platform.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <Button variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveTemplate}>
                  <Check className="w-4 h-4 mr-2" />
                  {editingTemplate ? "Update Template" : "Save Template"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}