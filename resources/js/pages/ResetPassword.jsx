import { useState } from "react";
import Layout from "@/Layout";
import { Link, router, useForm } from "@inertiajs/react";
import { Lock, Eye, EyeOff, ArrowRight, Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ResetPassword({ token, email: initialEmail, status }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    token: token || "",
    email: initialEmail || "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    post("/reset-password", {
      onSuccess: () => {
        toast.success("Password reset successfully! You can now sign in.");
        router.visit("/auth");
      },
      onError: (errors) => {
        if (errors.email) {
          toast.error(errors.email);
        } else if (errors.password) {
          toast.error(errors.password);
        } else {
          toast.error("Failed to reset password. Please try again.");
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
              <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
              <p className="text-sm text-muted-foreground">
                Enter your new password below.
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
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  className="pl-10 pr-10 bg-secondary border-border h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={data.password_confirmation}
                  onChange={(e) => setData("password_confirmation", e.target.value)}
                  className="pl-10 pr-10 bg-secondary border-border h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2" disabled={processing}>
                {processing ? "Resetting..." : "Reset Password"}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth"
                className="text-sm text-primary hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

