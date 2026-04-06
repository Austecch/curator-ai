"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Button, Badge } from "@/components/ui";
import {
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Video,
  FileText,
  ChevronRight,
  ExternalLink,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  {
    id: "getting-started",
    name: "Getting Started",
    icon: Book,
    articles: 12,
  },
  {
    id: "content-creation",
    name: "Content Creation",
    icon: FileText,
    articles: 18,
  },
  {
    id: "scheduling",
    name: "Scheduling & Queue",
    icon: FileText,
    articles: 8,
  },
  {
    id: "analytics",
    name: "Analytics & Reports",
    icon: FileText,
    articles: 15,
  },
  {
    id: "platforms",
    name: "Platform Management",
    icon: FileText,
    articles: 24,
  },
  {
    id: "ai-features",
    name: "AI Features",
    icon: FileText,
    articles: 10,
  },
];

const popularArticles = [
  {
    title: "How to connect your first social media platform",
    category: "Getting Started",
    views: 12500,
  },
  {
    title: "Best practices for AI-generated content",
    category: "AI Features",
    views: 8900,
  },
  {
    title: "Understanding your analytics dashboard",
    category: "Analytics",
    views: 7600,
  },
  {
    title: "How to schedule posts for optimal engagement",
    category: "Scheduling",
    views: 6400,
  },
];

const faqs = [
  {
    question: "How do I connect a new social media account?",
    answer: "Go to Platforms page, click 'Connect New', and follow the OAuth flow for your chosen platform. We support LinkedIn, Facebook, Instagram, Twitter, YouTube, and more.",
  },
  {
    question: "What's included in the AI content generation?",
    answer: "Our AI can generate post ideas, create full posts, suggest hashtags, recommend optimal posting times, and adapt content for different platforms.",
  },
  {
    question: "Can I schedule posts for multiple platforms at once?",
    answer: "Yes! When creating a post, select multiple platforms and we'll optimize the content for each. The post will be published to all selected platforms at your chosen time.",
  },
  {
    question: "What's the difference between Queue and Scheduler?",
    answer: "Queue is for sequential posting where you control the order. Scheduler is for calendar-based scheduling where you pick specific dates and times.",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell>
      <section className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#2e323d] mb-2">
          Help Center
        </h2>
        <p className="text-[#5b5f6b] font-medium">
          Find answers, tutorials, and support.
        </p>
      </section>

      <div className="max-w-3xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#5b5f6b]/60" />
          <input
            type="text"
            placeholder="Search for help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-none rounded-2xl py-5 pl-16 pr-6 text-lg shadow-[0_10px_30px_rgba(46,50,61,0.08)] focus:ring-2 focus:ring-[#005cbb]/20 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-8">
          <Card className="p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Popular Articles</h3>
            <div className="space-y-3">
              {popularArticles.map((article, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center justify-between p-4 rounded-xl bg-[#f3f3fb] hover:bg-[#e6e7f4] transition-colors group"
                >
                  <div>
                    <p className="font-medium">{article.title}</p>
                    <p className="text-sm text-[#5b5f6b]">{article.category}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#5b5f6b] group-hover:text-[#005cbb] transition-colors" />
                </a>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Browse by Category</h3>
            <div className="grid grid-cols-2 gap-4">
              {filteredCategories.map((category) => (
                <a
                  key={category.id}
                  href="#"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#f3f3fb] hover:bg-[#e6e7f4] transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#d7e2ff] flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-[#005cbb]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-[#5b5f6b]">{category.articles} articles</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#5b5f6b] group-hover:text-[#005cbb] transition-colors" />
                </a>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-[#aeb1bf]/20 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-[#f3f3fb] transition-colors"
                  >
                    <span className="font-medium pr-4">{faq.question}</span>
                    <ChevronRight
                      className={cn(
                        "w-5 h-5 text-[#5b5f6b] transition-transform",
                        expandedFaq === index && "rotate-90"
                      )}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4 pt-0">
                      <p className="text-sm text-[#5b5f6b] leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-4 space-y-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { label: "Video Tutorials", icon: Video },
                { label: "API Documentation", icon: FileText },
                { label: "Community Forum", icon: MessageCircle },
              ].map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#f3f3fb] hover:bg-[#e6e7f4] transition-colors"
                >
                  <link.icon className="w-5 h-5 text-[#005cbb]" />
                  <span className="text-sm font-medium">{link.label}</span>
                  <ExternalLink className="w-4 h-4 text-[#5b5f6b] ml-auto" />
                </a>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#005cbb] to-[#003e81] text-white">
            <HelpCircle className="w-8 h-8 mb-4" />
            <h3 className="font-bold text-lg mb-2">Need More Help?</h3>
            <p className="text-sm opacity-90 mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Button variant="secondary" className="w-full bg-white text-[#005cbb] hover:bg-white/90">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-2">System Status</h3>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-[#5b5f6b]">All systems operational</span>
            </div>
            <p className="text-xs text-[#5b5f6b] mt-2">Last checked: Just now</p>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
