"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Input } from "@/components/ui";
import { Sparkles, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/database";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSent(true);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-[#faf8fe] flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#2e323d] mb-2">Check your email</h1>
          <p className="text-[#5b5f6b] mb-6">
            We sent a password reset link to <strong>{email}</strong>
          </p>
          <Link
            href="/login"
            className="text-[#005cbb] hover:underline font-medium"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8fe] flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-[#5b5f6b] hover:text-[#005cbb] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#005cbb] mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#2e323d]">
              Forgot password?
            </h1>
            <p className="text-[#5b5f6b] mt-2">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-700 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={loading}
              >
                Reset Password
              </Button>
            </form>
          </Card>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#005cbb] to-[#003e81] items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-extrabold tracking-tight mb-6">
            Recover your account
          </h2>
          <p className="text-lg opacity-90">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
      </div>
    </div>
  );
}
