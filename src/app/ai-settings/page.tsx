"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Button, Input } from "@/components/ui";
import {
  Sparkles,
  Check,
  Zap,
  Cpu,
  Sliders,
  AlertCircle,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [selectedModel, setSelectedModel] = useState("claude-3-5-sonnet");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [maxTokens, setMaxTokens] = useState(1024);
  const [temperature, setTemperature] = useState(0.7);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["Educational & Informative"]);
  const [bannedWords, setBannedWords] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
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
        </div>

        <div className="col-span-4">
          <Card className="p-6 sticky top-32">
            <h3 className="text-lg font-bold tracking-tight mb-4">Save Settings</h3>
            <p className="text-sm text-[#5b5f6b] mb-6">
              Your AI settings will be saved and applied to all future content generation.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#5b5f6b]">Model</span>
                <span className="font-medium">
                  {models.find((m) => m.id === selectedModel)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#5b5f6b]">Tone</span>
                <span className="font-medium capitalize">{selectedTone}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#5b5f6b]">Max Tokens</span>
                <span className="font-medium">{maxTokens}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#5b5f6b]">Temperature</span>
                <span className="font-medium">{temperature.toFixed(1)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={handleSave}
              isLoading={isSaving}
            >
              <Save className="w-5 h-5 mr-2" />
              Save Settings
            </Button>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
