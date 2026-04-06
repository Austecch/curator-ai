"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout";
import { Card, Button, Textarea, Badge } from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  Sparkles,
  Send,
  Calendar,
  Image,
  Check,
  Briefcase,
  Camera,
  Users,
  X,
  Play,
  Pin,
  MessageCircle,
  Clock,
  Loader2,
  FileText,
  Eye,
  Link as LinkIcon,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const platforms = [
  { 
    id: "linkedin", 
    name: "LinkedIn", 
    icon: Briefcase, 
    color: "#0077B5", 
    maxChars: 3000,
    selected: true 
  },
  { 
    id: "instagram", 
    name: "Instagram", 
    icon: Camera, 
    color: "#E4405F", 
    maxChars: 2200,
    selected: true 
  },
  { 
    id: "facebook", 
    name: "Facebook", 
    icon: Users, 
    color: "#1877F2", 
    maxChars: 63206,
    selected: false 
  },
  { 
    id: "twitter", 
    name: "X (Twitter)", 
    icon: X, 
    color: "#000000", 
    maxChars: 280,
    selected: false 
  },
  { 
    id: "youtube", 
    name: "YouTube", 
    icon: Play, 
    color: "#FF0000", 
    maxChars: 5000,
    selected: false 
  },
  { 
    id: "pinterest", 
    name: "Pinterest", 
    icon: Pin, 
    color: "#BD081C", 
    maxChars: 500,
    selected: false 
  },
  { 
    id: "reddit", 
    name: "Reddit", 
    icon: MessageCircle, 
    color: "#FF4500", 
    maxChars: 40000,
    selected: false 
  },
];

const toneOptions = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "friendly", label: "Friendly" },
  { id: "formal", label: "Formal" },
];

const workflowSteps = [
  { id: "draft", label: "Draft", icon: FileText },
  { id: "review", label: "Review", icon: Eye },
  { id: "approved", label: "Approved", icon: Check },
];

type WorkflowStatus = "draft" | "review" | "approved";

export default function CreatePostPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["linkedin", "instagram"]);
  const [tone, setTone] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [generatedVariations, setGeneratedVariations] = useState<{ platform: string; content: string }[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>("draft");
  const [includeLink, setIncludeLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkShortened, setLinkShortened] = useState("");
  const [error, setError] = useState("");

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const getCharacterLimit = () => {
    if (selectedPlatforms.length === 0) return 2200;
    const limits = selectedPlatforms.map(p => platforms.find(pl => pl.id === p)?.maxChars || 2200);
    return Math.min(...limits);
  };

  const getCharacterCount = () => {
    let count = content.length;
    if (includeLink && linkUrl) {
      count += linkShortened ? linkShortened.length + 1 : linkUrl.length + 1;
    }
    return count;
  };

  const isOverLimit = () => {
    const limit = getCharacterLimit();
    return getCharacterCount() > limit;
  };

  const handleShortenLink = () => {
    if (linkUrl) {
      const shortCode = Math.random().toString(36).substring(2, 8);
      setLinkShortened(`curator.ai/l/${shortCode}`);
    }
  };

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError("Please enter a topic first");
      return;
    }
    setError("");
    setIsGenerating(true);
    try {
      const response = await fetch("/api/anthropic/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: content,
          platforms: selectedPlatforms,
          tone,
          includeHashtags: true,
        }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setIsGenerating(false);
        return;
      }
      if (data.main) {
        setContent(data.main);
      }
      if (data.variations) {
        setGeneratedVariations(data.variations);
      }
      if (data.hashtags) {
        setHashtags(data.hashtags);
      }
    } catch (err) {
      console.error("Generation failed:", err);
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateHashtags = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/anthropic/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          platform: selectedPlatforms[0],
          count: 8,
        }),
      });
      const data = await response.json();
      if (data.hashtags) {
        setHashtags(data.hashtags);
      }
    } catch (error) {
      console.error("Hashtag generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (isOverLimit() || !user?.id) return;
    
    setError("");
    
    const scheduledAt = isScheduled && scheduledDate && scheduledTime
      ? `${scheduledDate}T${scheduledTime}`
      : null;

    if (workflowStatus === "approved" && !scheduledAt) {
      const aggregatorApiKey = localStorage.getItem("aggregator_api_key");
      const aggregatorApiUrl = localStorage.getItem("aggregator_api_url");
      const savedAccounts = localStorage.getItem("aggregator_accounts");
      const savedPlatformOptions = localStorage.getItem("platform_options");
      
      if (aggregatorApiKey && aggregatorApiUrl) {
        let accountIds: any[] = [];
        let platformOptions: Record<string, any> = {};
        
        if (savedAccounts) {
          try {
            accountIds = JSON.parse(savedAccounts);
          } catch {}
        }
        
        if (savedPlatformOptions) {
          try {
            platformOptions = JSON.parse(savedPlatformOptions);
          } catch {}
        }
        
        const publishResponse = await fetch("/api/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            content,
            platforms: selectedPlatforms,
            scheduled_at: null,
            aggregator_settings: {
              api_key: aggregatorApiKey,
              api_url: aggregatorApiUrl,
            },
            account_ids: accountIds.length > 0 ? accountIds : undefined,
            platform_options: Object.keys(platformOptions).length > 0 ? platformOptions : undefined,
          }),
        });
        
        const publishData = await publishResponse.json();
        
        if (publishData.error && !publishData.post) {
          setError(publishData.error);
          return;
        }
        
        if (publishData.errors && publishData.errors.length > 0) {
          setError("Some posts failed: " + publishData.errors.map((e: any) => e.error).join(", "));
          return;
        }
        
        setContent("");
        setSelectedPlatforms([]);
        setHashtags([]);
        setGeneratedVariations([]);
        setWorkflowStatus("draft");
        router.push("/dashboard");
        return;
      }
    }

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        content,
        platforms: selectedPlatforms,
        status: workflowStatus,
        scheduled_at: scheduledAt,
      }),
    });
    const data = await response.json();
    
    if (data.error) {
      setError(data.error);
      return;
    }
    
    setContent("");
    setSelectedPlatforms([]);
    setHashtags([]);
    setGeneratedVariations([]);
    setWorkflowStatus("draft");
    setIsScheduled(false);
    setScheduledDate("");
    setScheduledTime("");
    
    router.push("/dashboard");
  };

  const charCount = getCharacterCount();
  const charLimit = getCharacterLimit();
  const charPercentage = (charCount / charLimit) * 100;

  return (
    <DashboardShell>
      <section className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#2e323d] mb-2">
          Create Post
        </h2>
        <p className="text-[#5b5f6b] font-medium">
          Craft and schedule content with AI assistance.
        </p>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold tracking-tight">Content</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-bold",
                    isOverLimit() ? "text-red-500" : charPercentage > 90 ? "text-amber-500" : "text-[#5b5f6b]"
                  )}>
                    {charCount}
                  </span>
                  <span className="text-sm text-[#5b5f6b]">/</span>
                  <span className="text-sm text-[#5b5f6b]">{charLimit}</span>
                </div>
                {isOverLimit() && (
                  <Badge variant="error">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Over limit
                  </Badge>
                )}
                {selectedPlatforms.length > 0 && (
                  <Badge variant="primary">
                    {selectedPlatforms.length} Platform{selectedPlatforms.length > 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
            </div>

            <div className="mb-2">
              <div className="h-1 bg-[#f3f3fb] rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    isOverLimit() ? "bg-red-500" : charPercentage > 90 ? "bg-amber-500" : "bg-[#005cbb]"
                  )}
                  style={{ width: `${Math.min(charPercentage, 100)}%` }}
                />
              </div>
            </div>

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What would you like to share? Describe your topic and our AI will help craft the perfect post..."
              className="min-h-[200px] text-base"
            />

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="mt-4 p-3 bg-[#f3f3fb] rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => setIncludeLink(!includeLink)}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors",
                    includeLink ? "text-[#005cbb]" : "text-[#5b5f6b]"
                  )}
                >
                  <LinkIcon className="w-4 h-4" />
                  Add Link
                </button>
              </div>
              {includeLink && (
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="Paste your URL here..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="flex-1 bg-white border-none rounded-lg py-2 px-3 text-sm outline-none"
                  />
                  <Button variant="secondary" size="sm" onClick={handleShortenLink}>
                    Shorten
                  </Button>
                </div>
              )}
              {linkShortened && (
                <p className="text-xs text-[#005cbb] mt-2">
                  Shortened: <span className="font-bold">{linkShortened}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateHashtags}
                  disabled={!content || isGenerating}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Hashtags
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  disabled={!content}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
              <Button
                variant="primary"
                onClick={handleGenerate}
                disabled={!content || isGenerating}
                isLoading={isGenerating}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Assist
              </Button>
            </div>

            {hashtags.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#aeb1bf]/15">
                <p className="text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-2">
                  Suggested Hashtags
                </p>
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="primary"
                      className="cursor-pointer hover:bg-[#005cbb] hover:text-white transition-colors"
                      onClick={() => setContent((prev) => prev + ` ${tag}`)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {generatedVariations.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold tracking-tight mb-4">Platform Variations</h3>
              <div className="space-y-4">
                {generatedVariations.map((variation, index) => (
                  <div
                    key={index}
                    className="p-4 bg-[#f3f3fb] rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="neutral" size="sm">
                        {variation.platform}
                      </Badge>
                      <button
                        className="text-[10px] text-[#005cbb] hover:underline"
                        onClick={() => setContent(variation.content)}
                      >
                        Use this version
                      </button>
                    </div>
                    <p className="text-sm text-[#2e323d]">{variation.content}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Approval Workflow</h3>
            <div className="flex items-center gap-4">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = workflowStatus === step.id;
                const isPast = workflowSteps.findIndex(s => s.id === workflowStatus) > index;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => setWorkflowStatus(step.id as WorkflowStatus)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                        isActive && "bg-[#005cbb] text-white",
                        !isActive && isPast && "bg-emerald-100 text-emerald-700",
                        !isActive && !isPast && "bg-[#f3f3fb] text-[#5b5f6b] hover:bg-[#e6e7f4]"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {step.label}
                      {isPast && <Check className="w-3 h-3" />}
                    </button>
                    {index < workflowSteps.length - 1 && (
                      <div className="w-8 h-[2px] bg-[#aeb1bf]/30 mx-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-[#005cbb]" />
              <h3 className="text-lg font-bold tracking-tight">Schedule</h3>
            </div>

            <div className="flex items-center gap-4">
              <button
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                  !isScheduled
                    ? "bg-[#005cbb] text-white shadow-[0_10px_30px_rgba(0,92,187,0.2)]"
                    : "bg-[#f3f3fb] text-[#5b5f6b] hover:bg-[#e6e7f4]"
                )}
                onClick={() => setIsScheduled(false)}
              >
                Publish Now
              </button>
              <button
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                  isScheduled
                    ? "bg-[#005cbb] text-white shadow-[0_10px_30px_rgba(0,92,187,0.2)]"
                    : "bg-[#f3f3fb] text-[#5b5f6b] hover:bg-[#e6e7f4]"
                )}
                onClick={() => setIsScheduled(true)}
              >
                Schedule
              </button>
            </div>

            {isScheduled && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-[#f3f3fb] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#005cbb]/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full bg-[#f3f3fb] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#005cbb]/20 outline-none"
                  />
                </div>
              </div>
            )}

            {isScheduled && scheduledDate && scheduledTime && (
              <div className="mt-4 flex items-center gap-2 text-sm text-[#5b5f6b]">
                <Clock className="w-4 h-4" />
                <span>
                  Will be published on{" "}
                  <span className="font-bold text-[#2e323d]">
                    {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()}
                  </span>
                </span>
              </div>
            )}
          </Card>
        </div>

        <div className="col-span-4 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Target Platforms</h3>
            <div className="space-y-3">
              {platforms.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={cn(
                      "w-full p-3 rounded-xl flex items-center gap-3 transition-all",
                      isSelected
                        ? "bg-[#f3f3fb] border-2 border-[#005cbb]/20"
                        : "bg-white hover:bg-[#f3f3fb]"
                    )}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${platform.color}20` }}
                    >
                      <platform.icon
                        className="w-4 h-4"
                        style={{ color: platform.color }}
                      />
                    </div>
                    <span className="flex-1 text-left text-sm font-medium">
                      {platform.name}
                    </span>
                    <span className="text-xs text-[#5b5f6b]">
                      {platform.maxChars.toLocaleString()}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#005cbb]" />
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Content Tone</h3>
            <div className="grid grid-cols-2 gap-3">
              {toneOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setTone(option.id)}
                  className={cn(
                    "p-3 rounded-xl text-sm font-medium transition-all",
                    tone === option.id
                      ? "bg-[#005cbb] text-white shadow-[0_10px_30px_rgba(0,92,187,0.2)]"
                      : "bg-[#f3f3fb] text-[#5b5f6b] hover:bg-[#e6e7f4]"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-[#d7e2ff]/30 border border-[#005cbb]/5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#005cbb]" />
              <h3 className="text-sm font-bold text-[#005cbb]">AI Tip</h3>
            </div>
            <p className="text-xs text-[#0050a3] leading-relaxed">
              {selectedPlatforms.includes("twitter") 
                ? "X (Twitter) posts perform best with 100-200 characters. Keep it concise!"
                : selectedPlatforms.includes("linkedin")
                ? "LinkedIn posts with 1300-1500 characters get the most engagement."
                : "Include a question or call-to-action to boost engagement by up to 50%."}
            </p>
          </Card>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={!content || selectedPlatforms.length === 0 || isOverLimit()}
          >
            <Send className="w-5 h-5 mr-2" />
            {workflowStatus === "draft" 
              ? "Save as Draft" 
              : workflowStatus === "review" 
              ? "Submit for Review" 
              : isScheduled 
              ? "Schedule Post" 
              : "Publish Now"}
          </Button>
        </div>
      </div>
    </DashboardShell>
  );
}
