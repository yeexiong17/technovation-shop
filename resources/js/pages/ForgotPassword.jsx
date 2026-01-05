import { useState } from "react";
import Layout from "@/Layout";
import { Link, router, useForm } from "@inertiajs/react";
import { Mail, ArrowRight, Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    post("/forgot-password", {
      onSuccess: () => {
        toast.success("Password reset link has been sent to your email!");
      },
      onError: (errors) => {
        if (errors.email) {
          toast.error(errors.email);
        } else {
          toast.error("Failed to send reset link. Please try again.");
        }
      },
    });
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center pt-16 px-4">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 gradient-glow animate-pulse-glow" />

        <div className="relative z-10 w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">TechNovation</span>
          </Link>

          {/* Card */}
          <div className="glass rounded-2xl p-8 shadow-elevated">
            <div className="mb-6">
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
              <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
              <p className="text-sm text-muted-foreground">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {status && (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-500">{status}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  className="pl-10 bg-secondary border-border h-12"
                  required
                  autoFocus
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full gap-2" disabled={processing}>
                {processing ? "Sending..." : "Send Reset Link"}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth"
                className="text-sm text-primary hover:underline"
              >
                Remember your password? Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

