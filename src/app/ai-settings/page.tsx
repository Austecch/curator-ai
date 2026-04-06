"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Button, Input } from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  Sparkles,
  Check,
  Zap,
  Cpu,
  Sliders,
  AlertCircle,
  Save,
  Link2,
  ExternalLink,
  Shield,
  CheckCircle,
  XCircle,
  RefreshCw,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Video,
  MessageCircle,
  Pin,
} from "lucide-react";
import { cn } from "@/lib/utils";

const aggregators = [
  { id: "blotato", name: "Blotato", baseUrl: "https://backend.blotato.com/v2" },
  { id: "buffer", name: "Buffer", baseUrl: "https://api.bufferapp.com/1" },
  { id: "custom", name: "Custom API", baseUrl: "" },
];

const models = [
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    description: "Best balance of intelligence and speed",
    recommended: true,
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    description: "Most powerful for complex tasks",
    recommended: false,
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    description: "Fastest responses, lower cost",
    recommended: false,
  },
];

const tones = [
  { id: "professional", label: "Professional", description: "Business-appropriate, formal" },
  { id: "casual", label: "Casual", description: "Relaxed, conversational" },
  { id: "friendly", label: "Friendly", description: "Warm, approachable" },
  { id: "formal", label: "Formal", description: "Ceremonial, precise" },
];

const contentStyles = [
  "Educational & Informative",
  "Entertaining & Fun",
  "Inspirational & Motivational",
  "Promotional & Sales",
  "Behind the Scenes",
];

export default function AISettingsPage() {
  const { user } = useAuth();
  const [selectedModel, setSelectedModel] = useState("claude-3-5-sonnet");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [maxTokens, setMaxTokens] = useState(1024);
  const [temperature, setTemperature] = useState(0.7);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["Educational & Informative"]);
  const [bannedWords, setBannedWords] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [selectedAggregator, setSelectedAggregator] = useState("blotato");
  const [aggregatorApiKey, setAggregatorApiKey] = useState("");
  const [aggregatorApiUrl, setAggregatorApiUrl] = useState("https://backend.blotato.com/v2");
  const [aggregatorAccounts, setAggregatorAccounts] = useState<any[]>([]);
  const [aggregatorConnected, setAggregatorConnected] = useState(false);
  const [testingAggregator, setTestingAggregator] = useState(false);
  const [showPlatformOptions, setShowPlatformOptions] = useState(false);
  const [platformOptions, setPlatformOptions] = useState<Record<string, any>>({});

  useEffect(() => {
    const savedKey = localStorage.getItem("aggregator_api_key");
    const savedUrl = localStorage.getItem("aggregator_api_url");
    const savedAccounts = localStorage.getItem("aggregator_accounts");
    if (savedKey) setAggregatorApiKey(savedKey);
    if (savedUrl) {
      setAggregatorApiUrl(savedUrl);
      if (savedUrl.includes("blotato")) setSelectedAggregator("blotato");
      else if (savedUrl.includes("buffer")) setSelectedAggregator("buffer");
      else setSelectedAggregator("custom");
    }
    if (savedAccounts) {
      try {
        setAggregatorAccounts(JSON.parse(savedAccounts));
        setAggregatorConnected(true);
      } catch {}
    }
  }, []);

  const updatePlatformOption = (platform: string, key: string, value: any) => {
    setPlatformOptions(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [key]: value,
      }
    }));
  };

  const handleAggregatorChange = (aggId: string) => {
    const agg = aggregators.find(a => a.id === aggId);
    setSelectedAggregator(aggId);
    if (agg?.baseUrl) {
      setAggregatorApiUrl(agg.baseUrl);
    }
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const testAggregatorConnection = async () => {
    if (!aggregatorApiKey || !aggregatorApiUrl) return;

    setTestingAggregator(true);
    setAggregatorConnected(false);
    setAggregatorAccounts([]);
    
    try {
      let endpoint = "";
      let headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (selectedAggregator === "blotato") {
        endpoint = `${aggregatorApiUrl}/users/me/accounts`;
        headers["blotato-api-key"] = aggregatorApiKey;
      } else if (selectedAggregator === "buffer") {
        endpoint = `${aggregatorApiUrl}/profiles.json`;
        headers["Authorization"] = `Bearer ${aggregatorApiKey}`;
      } else {
        endpoint = `${aggregatorApiUrl}/profiles`;
      }

      const response = await fetch(endpoint, { headers });
      
      if (response.ok) {
        const data = await response.json();
        
        if (selectedAggregator === "blotato") {
          const accounts = data.accounts || [];
          setAggregatorAccounts(accounts);
        } else if (selectedAggregator === "buffer") {
          const accounts = data.map((p: any) => ({
            id: p.id,
            platform: p.service,
            formatted_username: p.formatted_username,
          }));
          setAggregatorAccounts(accounts);
        }
        
        setAggregatorConnected(true);
      } else {
        alert(`Failed to connect. Status: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Aggregator test failed:", error);
      alert("Failed to connect. Please check your API key and URL.");
    } finally {
      setTestingAggregator(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      if (user?.id) {
        const { supabase } = await import("@/lib/database");
        await supabase
          .from("ai_settings")
          .upsert({
            user_id: user.id,
            model: selectedModel,
            tone: selectedTone,
            max_tokens: maxTokens,
            temperature: temperature,
            content_style: selectedStyles,
            banned_words: bannedWords.split(",").map(w => w.trim()).filter(Boolean),
            updated_at: new Date().toISOString(),
          });
      }
      
      if (aggregatorApiKey) {
        localStorage.setItem("aggregator_api_key", aggregatorApiKey);
        localStorage.setItem("aggregator_api_url", aggregatorApiUrl);
        localStorage.setItem("aggregator_accounts", JSON.stringify(aggregatorAccounts));
        localStorage.setItem("platform_options", JSON.stringify(platformOptions));
      }
    } catch (error) {
      console.error("Failed to save AI settings:", error);
    }
    
    setIsSaving(false);
  };

  return (
    <DashboardShell>
      <section className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#2e323d] mb-2">
          AI Settings
        </h2>
        <p className="text-[#5b5f6b] font-medium">
          Customize how AI assists you with content creation.
        </p>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="w-6 h-6 text-[#005cbb]" />
              <div>
                <h3 className="text-lg font-bold tracking-tight">AI Model</h3>
                <p className="text-sm text-[#5b5f6b]">Choose the AI model for content generation</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all relative",
                    selectedModel === model.id
                      ? "border-[#005cbb] bg-[#d7e2ff]/30"
                      : "border-[#aeb1bf]/30 hover:border-[#aeb1bf]/50"
                  )}
                >
                  {model.recommended && (
                    <span className="absolute -top-2 right-3 px-2 py-0.5 bg-[#005cbb] text-white text-[10px] font-bold rounded-full">
                      Recommended
                    </span>
                  )}
                  <h4 className="font-bold mb-1">{model.name}</h4>
                  <p className="text-xs text-[#5b5f6b]">{model.description}</p>
                  {selectedModel === model.id && (
                    <Check className="absolute top-3 right-3 w-5 h-5 text-[#005cbb]" />
                  )}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Sliders className="w-6 h-6 text-[#005cbb]" />
              <div>
                <h3 className="text-lg font-bold tracking-tight">Generation Settings</h3>
                <p className="text-sm text-[#5b5f6b]">Fine-tune content generation parameters</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-3">
                  Response Length (Max Tokens)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="256"
                    max="2048"
                    step="256"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(Number(e.target.value))}
                    className="flex-1 h-2 bg-[#f3f3fb] rounded-full appearance-none cursor-pointer accent-[#005cbb]"
                  />
                  <span className="w-20 text-center text-sm font-bold">{maxTokens}</span>
                </div>
                <p className="text-xs text-[#5b5f6b] mt-2">
                  Higher values generate longer responses but use more tokens.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-3">
                  Creativity (Temperature)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="flex-1 h-2 bg-[#f3f3fb] rounded-full appearance-none cursor-pointer accent-[#005cbb]"
                  />
                  <span className="w-20 text-center text-sm font-bold">{temperature.toFixed(1)}</span>
                </div>
                <p className="text-xs text-[#5b5f6b] mt-2">
                  Lower values are more focused, higher values are more creative.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-[#005cbb]" />
              <div>
                <h3 className="text-lg font-bold tracking-tight">Content Tone</h3>
                <p className="text-sm text-[#5b5f6b]">Set the default tone for AI-generated content</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {tones.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    selectedTone === tone.id
                      ? "border-[#005cbb] bg-[#d7e2ff]/30"
                      : "border-[#aeb1bf]/30 hover:border-[#aeb1bf]/50"
                  )}
                >
                  <h4 className="font-bold mb-1">{tone.label}</h4>
                  <p className="text-xs text-[#5b5f6b]">{tone.description}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-[#005cbb]" />
              <div>
                <h3 className="text-lg font-bold tracking-tight">Content Style Preferences</h3>
                <p className="text-sm text-[#5b5f6b]">Select your preferred content styles</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {contentStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    selectedStyles.includes(style)
                      ? "bg-[#005cbb] text-white"
                      : "bg-[#f3f3fb] text-[#5b5f6b] hover:bg-[#e6e7f4]"
                  )}
                >
                  {style}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-[#9f403d]" />
              <div>
                <h3 className="text-lg font-bold tracking-tight">Banned Words</h3>
                <p className="text-sm text-[#5b5f6b]">Words the AI should never use in your content</p>
              </div>
            </div>

            <textarea
              value={bannedWords}
              onChange={(e) => setBannedWords(e.target.value)}
              placeholder="Enter words separated by commas..."
              className="w-full bg-[#f3f3fb] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#005cbb]/20 transition-all outline-none resize-none h-24"
            />
            <p className="text-xs text-[#5b5f6b] mt-2">
              The AI will avoid these words when generating content.
            </p>
          </Card>

          <Card className="p-6 border-2 border-[#005cbb]/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Link2 className="w-6 h-6 text-[#005cbb]" />
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Publishing Aggregator</h3>
                  <p className="text-sm text-[#5b5f6b]">Connect Blotato to post to all platforms safely</p>
                </div>
              </div>
              <a
                href="https://blotato.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[#005cbb] hover:underline"
              >
                Get Blotato <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-2">
                  Select Aggregator
                </label>
                <div className="flex gap-3">
                  {aggregators.map((agg) => (
                    <button
                      key={agg.id}
                      onClick={() => handleAggregatorChange(agg.id)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                        selectedAggregator === agg.id
                          ? "bg-[#005cbb] text-white"
                          : "bg-[#f3f3fb] text-[#5b5f6b] hover:bg-[#e6e7f4]"
                      )}
                    >
                      {agg.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-2">
                  {selectedAggregator === "blotato" ? "Blotato" : selectedAggregator === "buffer" ? "Buffer" : ""} API Key
                </label>
                <Input
                  type="password"
                  placeholder={selectedAggregator === "blotato" ? "Enter your Blotato API key..." : "Enter your API key..."}
                  value={aggregatorApiKey}
                  onChange={(e) => setAggregatorApiKey(e.target.value)}
                />
                {selectedAggregator === "blotato" && (
                  <p className="text-xs text-[#5b5f6b] mt-2">
                    Get your key from <a href="https://my.blotato.com/settings" target="_blank" rel="noopener noreferrer" className="text-[#005cbb] hover:underline">Blotato Settings</a> → API → Generate API Key
                  </p>
                )}
              </div>

              {selectedAggregator === "custom" && (
                <div>
                  <label className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-2">
                    Custom API URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://api.your-aggregator.com/v1..."
                    value={aggregatorApiUrl}
                    onChange={(e) => setAggregatorApiUrl(e.target.value)}
                  />
                </div>
              )}

              <div className="flex items-center gap-3 p-4 bg-[#f3f3fb] rounded-xl">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  aggregatorConnected ? "bg-green-100" : "bg-[#e6e7f4]"
                )}>
                  {aggregatorConnected ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : testingAggregator ? (
                    <RefreshCw className="w-5 h-5 text-[#005cbb] animate-spin" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[#5b5f6b]" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {aggregatorConnected ? `${aggregatorAccounts.length} Accounts Connected` : "Not Connected"}
                  </p>
                  <p className="text-xs text-[#5b5f6b]">
                    {aggregatorConnected
                      ? `${aggregatorAccounts.length} social accounts ready for posting`
                      : "Add API key to connect your accounts"}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={testAggregatorConnection}
                  isLoading={testingAggregator}
                  disabled={!aggregatorApiKey}
                >
                  {aggregatorConnected ? "Reconnect" : "Connect"}
                </Button>
              </div>

              {aggregatorAccounts.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-2">
                    Connected Accounts
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {aggregatorAccounts.map((account: any) => {
                      const platformIcons: Record<string, typeof Instagram> = {
                        instagram: Instagram,
                        facebook: Facebook,
                        twitter: X,
                        linkedin: Linkedin,
                        youtube: Youtube,
                        tiktok: Video,
                        threads: MessageCircle,
                        pinterest: Pin,
                        bluesky: Link2,
                      };
                      const Icon = platformIcons[account.platform] || Link2;
                      return (
                        <div key={account.id} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-medium">{account.formatted_username || account.platform}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {aggregatorConnected && aggregatorAccounts.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowPlatformOptions(!showPlatformOptions)}
                    className="text-xs font-bold text-[#005cbb] hover:underline flex items-center gap-1"
                  >
                    {showPlatformOptions ? "Hide" : "Show"} Platform Options
                  </button>
                  
                  {showPlatformOptions && (
                    <div className="mt-3 space-y-4">
                      <p className="text-xs text-[#5b5f6b]">
                        Configure platform-specific settings for your posts.
                      </p>
                      
                      {aggregatorAccounts.map((account: any) => {
                        const platform = account.platform;
                        return (
                          <div key={account.id} className="p-3 bg-white rounded-xl border border-[#aeb1bf]/20">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-bold capitalize">{platform}</span>
                              <span className="text-xs text-[#5b5f6b]">({account.formatted_username})</span>
                            </div>
                            
                            {platform === "tiktok" && (
                              <div className="space-y-2 text-xs">
                                <select
                                  className="w-full bg-[#f3f3fb] rounded-lg py-2 px-2"
                                  value={platformOptions[platform]?.privacyLevel || "PUBLIC_TO_EVERYONE"}
                                  onChange={(e) => updatePlatformOption(platform, "privacyLevel", e.target.value)}
                                >
                                  <option value="PUBLIC_TO_EVERYONE">Public</option>
                                  <option value="SELF_ONLY">Private</option>
                                  <option value="FOLLOWER_OF_CREATOR">Followers</option>
                                </select>
                                <div className="flex gap-2 flex-wrap">
                                  <label className="flex items-center gap-1">
                                    <input
                                      type="checkbox"
                                      checked={platformOptions[platform]?.disabledComments || false}
                                      onChange={(e) => updatePlatformOption(platform, "disabledComments", e.target.checked)}
                                    />
                                    No Comments
                                  </label>
                                  <label className="flex items-center gap-1">
                                    <input
                                      type="checkbox"
                                      checked={platformOptions[platform]?.isAiGenerated || true}
                                      onChange={(e) => updatePlatformOption(platform, "isAiGenerated", e.target.checked)}
                                    />
                                    AI Generated
                                  </label>
                                </div>
                              </div>
                            )}
                            
                            {platform === "youtube" && (
                              <div className="space-y-2 text-xs">
                                <input
                                  type="text"
                                  placeholder="Video title..."
                                  className="w-full bg-[#f3f3fb] rounded-lg py-2 px-2"
                                  value={platformOptions[platform]?.title || ""}
                                  onChange={(e) => updatePlatformOption(platform, "title", e.target.value)}
                                />
                                <select
                                  className="w-full bg-[#f3f3fb] rounded-lg py-2 px-2"
                                  value={platformOptions[platform]?.privacyStatus || "public"}
                                  onChange={(e) => updatePlatformOption(platform, "privacyStatus", e.target.value)}
                                >
                                  <option value="public">Public</option>
                                  <option value="unlisted">Unlisted</option>
                                  <option value="private">Private</option>
                                </select>
                                <label className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    checked={platformOptions[platform]?.shouldNotifySubscribers || true}
                                    onChange={(e) => updatePlatformOption(platform, "shouldNotifySubscribers", e.target.checked)}
                                  />
                                  Notify Subscribers
                                </label>
                              </div>
                            )}
                            
                            {platform === "instagram" && (
                              <div className="space-y-2 text-xs">
                                <select
                                  className="w-full bg-[#f3f3fb] rounded-lg py-2 px-2"
                                  value={platformOptions[platform]?.mediaType || "reel"}
                                  onChange={(e) => updatePlatformOption(platform, "mediaType", e.target.value)}
                                >
                                  <option value="reel">Reel</option>
                                  <option value="story">Story</option>
                                </select>
                                <input
                                  type="text"
                                  placeholder="Alt text for images..."
                                  className="w-full bg-[#f3f3fb] rounded-lg py-2 px-2"
                                  value={platformOptions[platform]?.altText || ""}
                                  onChange={(e) => updatePlatformOption(platform, "altText", e.target.value)}
                                />
                              </div>
                            )}
                            
                            {platform === "facebook" && (
                              <div className="space-y-2 text-xs">
                                <input
                                  type="text"
                                  placeholder="Page ID (if using a Page)..."
                                  className="w-full bg-[#f3f3fb] rounded-lg py-2 px-2"
                                  value={platformOptions[platform]?.pageId || ""}
                                  onChange={(e) => updatePlatformOption(platform, "pageId", e.target.value)}
                                />
                              </div>
                            )}
                            
                            {platform === "linkedin" && (
                              <div className="space-y-2 text-xs">
                                <input
                                  type="text"
                                  placeholder="Company Page ID (optional)..."
                                  className="w-full bg-[#f3f3fb] rounded-lg py-2 px-2"
                                  value={platformOptions[platform]?.pageId || ""}
                                  onChange={(e) => updatePlatformOption(platform, "pageId", e.target.value)}
                                />
                              </div>
                            )}
                            
                            {platform === "pinterest" && (
                              <div className="space-y-2 text-xs">
                                <input
                                  type="text"
                                  placeholder="Board ID (required)..."
                                  className="w-full bg-[#f3f3fb] rounded-lg py-2 px-2"
                                  value={platformOptions[platform]?.boardId || ""}
                                  onChange={(e) => updatePlatformOption(platform, "boardId", e.target.value)}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
