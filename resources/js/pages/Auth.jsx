import { useState } from "react";
import Layout from "@/Layout";
import { Link, router, useForm } from "@inertiajs/react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      post("/login", {
        onSuccess: () => {
          toast.success("Welcome back!");
          router.visit("/");
        },
        onError: (errors) => {
          if (errors.email) {
            toast.error(errors.email);
          } else {
            toast.error("Invalid credentials. Please try again.");
          }
        },
      });
    } else {
      post("/register", {
        onSuccess: () => {
          toast.success("Account created successfully!");
          router.visit("/");
        },
        onError: (errors) => {
          if (errors.email) {
            toast.error(errors.email);
          } else if (errors.password) {
            toast.error(errors.password);
          } else {
            toast.error("Registration failed. Please check your information.");
          }
        },
      });
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
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
            {/* Tabs */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={switchMode}
                className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${isLogin
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={switchMode}
                className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors ${!isLogin
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className="pl-10 bg-secondary border-border h-12"
                    required
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  className="pl-10 bg-secondary border-border h-12"
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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

              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
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
              )}

              {isLogin && (
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full gap-2" disabled={processing}>
                {processing
                  ? "Processing..."
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form>

            {/* Terms */}
            <p className="text-xs text-muted-foreground text-center mt-6">
              By continuing, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
