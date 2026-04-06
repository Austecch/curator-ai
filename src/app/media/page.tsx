"use client";

import { useState, useRef } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import {
  Upload,
  Search,
  Image,
  Film,
  FolderOpen,
  Grid3x3,
  List,
  Download,
  Trash2,
  Copy,
  Check,
  X,
  MoreVertical,
  Filter,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";

interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video";
  size: string;
  url: string;
  dimensions?: string;
  usedIn: number;
  createdAt: string;
}

const mediaItems: MediaItem[] = [
  {
    id: "1",
    name: "product-launch-hero.jpg",
    type: "image",
    size: "2.4 MB",
    url: "https://picsum.photos/800/600",
    dimensions: "800 x 600",
    usedIn: 3,
    createdAt: "2024-10-24",
  },
  {
    id: "2",
    name: "team-photo.jpg",
    type: "image",
    size: "1.8 MB",
    url: "https://picsum.photos/800/601",
    dimensions: "800 x 600",
    usedIn: 5,
    createdAt: "2024-10-22",
  },
  {
    id: "3",
    name: "behind-scenes-reel.mp4",
    type: "video",
    size: "24.6 MB",
    url: "#",
    usedIn: 1,
    createdAt: "2024-10-20",
  },
  {
    id: "4",
    name: "infographic.png",
    type: "image",
    size: "890 KB",
    url: "https://picsum.photos/800/602",
    dimensions: "1200 x 800",
    usedIn: 8,
    createdAt: "2024-10-18",
  },
  {
    id: "5",
    name: "testimonial-video.mp4",
    type: "video",
    size: "45.2 MB",
    url: "#",
    usedIn: 2,
    createdAt: "2024-10-15",
  },
  {
    id: "6",
    name: "logo-white.png",
    type: "image",
    size: "45 KB",
    url: "https://picsum.photos/800/603",
    dimensions: "400 x 400",
    usedIn: 12,
    createdAt: "2024-10-10",
  },
];

const folders = [
  { name: "Product Images", count: 24 },
  { name: "Team Photos", count: 18 },
  { name: "Promo Videos", count: 6 },
  { name: "Brand Assets", count: 9 },
];

export default function MediaLibraryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = mediaItems.filter((item) => {
    if (filter !== "all" && item.type !== filter) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((i) => i.id));
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <DashboardShell>
      <section className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#2e323d] mb-2">
            Media Library
          </h2>
          <p className="text-[#5b5f6b] font-medium">
            Manage your images and videos.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload Media
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => console.log(e.target.files)}
        />
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Card className="p-4">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Folders
            </h3>
            <div className="space-y-1">
              <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#d7e2ff] text-[#005cbb] font-medium text-sm">
                <span>All Media</span>
                <span className="text-xs">{mediaItems.length}</span>
              </button>
              {folders.map((folder) => (
                <button
                  key={folder.name}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#f3f3fb] text-sm text-[#5b5f6b] transition-colors"
                >
                  <span>{folder.name}</span>
                  <span className="text-xs">{folder.count}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4 mt-4">
            <h3 className="font-bold mb-4 text-sm">Storage</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#5b5f6b]">Used</span>
                <span className="font-medium">2.4 GB</span>
              </div>
              <div className="h-2 bg-[#f3f3fb] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#005cbb] rounded-full"
                  style={{ width: "24%" }}
                />
              </div>
              <p className="text-xs text-[#5b5f6b]">2.4 GB of 10 GB used</p>
            </div>
          </Card>
        </div>

        <div className="col-span-9">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5b5f6b]/60" />
                <input
                  type="text"
                  placeholder="Search media..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#f3f3fb] border-none rounded-full py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#005cbb]/20 outline-none"
                />
              </div>
              <div className="flex bg-[#f3f3fb] rounded-xl p-1">
                {(["all", "image", "video"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all",
                      filter === f
                        ? "bg-white shadow-sm text-[#2e323d]"
                        : "text-[#5b5f6b] hover:text-[#2e323d]"
                    )}
                  >
                    {f === "all" ? "All" : f + "s"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2 mr-4">
                  <span className="text-sm text-[#5b5f6b]">
                    {selectedItems.length} selected
                  </span>
                  <button className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors">
                    <Trash2 className="w-4 h-4 text-[#9f403d]" />
                  </button>
                </div>
              )}
              <button
                onClick={selectAll}
                className="text-sm text-[#005cbb] font-medium hover:underline"
              >
                {selectedItems.length === filteredItems.length ? "Deselect All" : "Select All"}
              </button>
              <div className="flex bg-[#f3f3fb] rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    viewMode === "grid" ? "bg-white shadow-sm" : ""
                  )}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    viewMode === "list" ? "bg-white shadow-sm" : ""
                  )}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className={cn(
                    "overflow-hidden group relative",
                    selectedItems.includes(item.id) && "ring-2 ring-[#005cbb]"
                  )}
                >
                  <button
                    onClick={() => toggleSelection(item.id)}
                    className="absolute top-2 left-2 z-10 w-6 h-6 rounded-lg bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {selectedItems.includes(item.id) ? (
                      <Check className="w-4 h-4 text-[#005cbb]" />
                    ) : (
                      <div className="w-4 h-4 rounded border-2 border-[#5b5f6b]/30" />
                    )}
                  </button>

                  <div className="aspect-square bg-[#f3f3fb] relative">
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-12 h-12 text-[#5b5f6b]" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1">
                      <button
                        onClick={() => copyUrl(item.url, item.id)}
                        className="p-1.5 rounded-lg bg-white/90 hover:bg-white transition-colors"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-[#5b5f6b]" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-[#5b5f6b]">{item.size}</span>
                      <span className="text-xs text-[#5b5f6b]">
                        Used {item.usedIn}x
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className={cn(
                    "p-4 flex items-center gap-4",
                    selectedItems.includes(item.id) && "ring-2 ring-[#005cbb]"
                  )}
                >
                  <button
                    onClick={() => toggleSelection(item.id)}
                    className="w-6 h-6 rounded-lg border-2 flex items-center justify-center"
                  >
                    {selectedItems.includes(item.id) ? (
                      <Check className="w-4 h-4 text-[#005cbb]" />
                    ) : (
                      <div className="w-4 h-4 rounded border-2 border-[#5b5f6b]/30" />
                    )}
                  </button>

                  <div className="w-16 h-16 rounded-lg bg-[#f3f3fb] overflow-hidden flex-shrink-0">
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-6 h-6 text-[#5b5f6b]" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-[#5b5f6b]">
                      <span>{item.size}</span>
                      {item.dimensions && <span>{item.dimensions}</span>}
                      <span>Used {item.usedIn}x</span>
                      <span>{formatRelativeTime(item.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyUrl(item.url, item.id)}
                      className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-[#5b5f6b]" />
                      )}
                    </button>
                    <button className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors">
                      <Download className="w-4 h-4 text-[#5b5f6b]" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-[#fe8983]/20 transition-colors">
                      <Trash2 className="w-4 h-4 text-[#9f403d]" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
