"use client";

import { useEffect, useState } from "react";
import { Card, Badge } from "@/components/ui";
import { Keyboard, X } from "lucide-react";

interface Shortcut {
  keys: string[];
  description: string;
  action?: () => void;
}

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts: Shortcut[] = [
    { keys: ["Ctrl", "N"], description: "Create new post" },
    { keys: ["Ctrl", "S"], description: "Save current post" },
    { keys: ["Ctrl", "K"], description: "Open AI assistant" },
    { keys: ["Ctrl", "/"], description: "Show keyboard shortcuts" },
    { keys: ["Ctrl", "P"], description: "Preview post" },
    { keys: ["Ctrl", "Enter"], description: "Publish now" },
    { keys: ["Esc"], description: "Close modal/dialog" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 left-10 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all z-40 group"
        title="Keyboard Shortcuts (Ctrl+/)"
      >
        <Keyboard className="w-5 h-5 text-[#5b5f6b] group-hover:text-[#005cbb] transition-colors" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
          <Card className="w-full max-w-lg p-6 m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Keyboard className="w-6 h-6 text-[#005cbb]" />
                <h3 className="text-xl font-bold">Keyboard Shortcuts</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-[#aeb1bf]/10 last:border-0"
                >
                  <span className="text-sm text-[#5b5f6b]">{shortcut.description}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <Badge key={keyIndex} variant="neutral">
                        {key}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-[#5b5f6b] text-center">
              Press <Badge variant="neutral" className="mx-1">Esc</Badge> to close
            </p>
          </Card>
        </div>
      )}
    </>
  );
}
