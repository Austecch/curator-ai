"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Button, Badge } from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  User,
  Mail,
  Bell,
  Shield,
  CreditCard,
  Users,
  Globe,
  Smartphone,
  Check,
  Camera,
  Key,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Mail },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "team", label: "Team", icon: Users },
];

const plans = [
  { id: "free", name: "Free", price: 0, features: ["3 platforms", "10 posts/month", "Basic analytics"] },
  { id: "premium", name: "Premium", price: 29, features: ["8 platforms", "Unlimited posts", "Advanced analytics", "AI content generation"] },
  { id: "enterprise", name: "Enterprise", price: 99, features: ["All platforms", "Unlimited everything", "Priority support", "Custom branding", "Team collaboration"] },
];

export default function SettingsPage() {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [fullName, setFullName] = useState(profile?.full_name || user?.email?.split("@")[0] || "");
  const [email, setEmail] = useState(user?.email || "");
  const [timezone, setTimezone] = useState("America/New_York");
  const [language, setLanguage] = useState("en");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    setSaveMessage("");
    
    try {
      const { supabase } = await import("@/lib/database");
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      
      if (error) {
        setSaveMessage("Failed to save: " + error.message);
      } else {
        setSaveMessage("Profile saved successfully!");
      }
    } catch (err) {
      setSaveMessage("Failed to save profile");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <DashboardShell>
      <section className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#2e323d] mb-2">
          Settings
        </h2>
        <p className="text-[#5b5f6b] font-medium">
          Manage your account settings and preferences.
        </p>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Card className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      activeTab === tab.id
                        ? "bg-[#d7e2ff] text-[#005cbb]"
                        : "text-[#5b5f6b] hover:bg-[#f3f3fb]"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        <div className="col-span-9">
          {activeTab === "profile" && (
            <Card className="p-6">
              <h3 className="text-lg font-bold tracking-tight mb-6">Profile Settings</h3>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-[#d7e2ff] flex items-center justify-center text-3xl font-bold text-[#005cbb]">
                    AR
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#005cbb] text-white flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h4 className="font-bold">{fullName}</h4>
                  <p className="text-sm text-[#5b5f6b]">{email}</p>
                  <p className="text-xs text-[#005cbb] font-medium mt-1">Premium Plan</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#f3f3fb] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#005cbb]/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#f3f3fb] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#005cbb]/20 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-2">
                      Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full bg-[#f3f3fb] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#005cbb]/20 outline-none"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-2">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-[#f3f3fb] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#005cbb]/20 outline-none"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>

                <Button variant="primary" onClick={handleSaveProfile} isLoading={isSaving}>
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                {saveMessage && (
                  <p className={cn("text-sm mt-2", saveMessage.includes("Failed") ? "text-red-600" : "text-green-600")}>
                    {saveMessage}
                  </p>
                )}
              </div>
            </Card>
          )}

          {activeTab === "billing" && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-bold tracking-tight mb-6">Current Plan</h3>
                <div className="flex items-center justify-between p-4 bg-[#d7e2ff]/30 rounded-xl mb-6">
                  <div>
                    <p className="font-bold text-lg">Premium Plan</p>
                    <p className="text-sm text-[#5b5f6b]">$29/month • Renews on Nov 24, 2024</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <Button variant="secondary">Manage Subscription</Button>
              </Card>

              <div className="grid grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={cn(
                      "p-6",
                      plan.id === "premium" && "ring-2 ring-[#005cbb]"
                    )}
                  >
                    {plan.id === "premium" && (
                      <Badge variant="primary" className="mb-4">Most Popular</Badge>
                    )}
                    <h4 className="font-bold text-lg">{plan.name}</h4>
                    <p className="text-3xl font-extrabold my-4">
                      ${plan.price}
                      <span className="text-sm font-normal text-[#5b5f6b]">/mo</span>
                    </p>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-emerald-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={plan.id === "premium" ? "primary" : "secondary"}
                      className="w-full"
                    >
                      {plan.id === "premium" ? "Current Plan" : "Upgrade"}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <Card className="p-6">
              <h3 className="text-lg font-bold tracking-tight mb-6">Security Settings</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#f3f3fb] rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                      <Key className="w-6 h-6 text-[#005cbb]" />
                    </div>
                    <div>
                      <p className="font-bold">Password</p>
                      <p className="text-sm text-[#5b5f6b]">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <Button variant="secondary">Change Password</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#f3f3fb] rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-[#005cbb]" />
                    </div>
                    <div>
                      <p className="font-bold">Two-Factor Authentication</p>
                      <p className="text-sm text-[#5b5f6b]">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Button variant="secondary">Enable</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#f3f3fb] rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                      <Globe className="w-6 h-6 text-[#005cbb]" />
                    </div>
                    <div>
                      <p className="font-bold">Active Sessions</p>
                      <p className="text-sm text-[#5b5f6b]">2 devices currently logged in</p>
                    </div>
                  </div>
                  <Button variant="ghost">View All</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                      <LogOut className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-bold text-red-700">Sign Out</p>
                      <p className="text-sm text-[#5b5f6b]">Sign out of your account</p>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={handleSignOut}>Sign Out</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card className="p-6">
              <h3 className="text-lg font-bold tracking-tight mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: "Post published", description: "When your post goes live" },
                  { label: "Engagement alerts", description: "New likes, comments, shares" },
                  { label: "Scheduled reminders", description: "30 minutes before scheduled posts" },
                  { label: "Weekly report", description: "Summary of your performance" },
                  { label: "Platform updates", description: "Changes to connected platforms" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-[#aeb1bf]/10 last:border-0">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-[#5b5f6b]">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-[#e6e7f4] peer-focus:ring-2 peer-focus:ring-[#005cbb]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#005cbb]"></div>
                    </label>
                  </div>
                ))}
              </div>
              <Button variant="primary" className="mt-6" onClick={handleSaveProfile} isLoading={isSaving}>
                Save Preferences
              </Button>
            </Card>
          )}

          {activeTab === "team" && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold tracking-tight">Team Members</h3>
                <Button variant="primary">
                  <Users className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>
              <div className="space-y-4">
                {[{
                  name: user?.email?.split("@")[0] || "User",
                  email: user?.email || "",
                  role: "Owner"
                }].map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#f3f3fb] rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#d7e2ff] flex items-center justify-center font-bold text-[#005cbb]">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-bold">{member.name}</p>
                        <p className="text-sm text-[#5b5f6b]">{member.email}</p>
                      </div>
                    </div>
                    <Badge variant={member.role === "Owner" ? "primary" : "neutral"}>
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
