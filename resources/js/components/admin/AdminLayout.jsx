import { Link, usePage, router } from "@inertiajs/react";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  BarChart3,
  Bell,
  Search,
  Zap,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminLayout({ children }) {
  const page = usePage();
  const url = page?.url || '';
  const auth = page?.props?.auth;
  const user = auth?.user;

  const handleLogout = (e) => {
    e.preventDefault();
    router.post("/logout", {}, {
      onSuccess: () => {
        router.visit("/auth");
      },
    });
  };

  // Check if current path matches any sidebar link (including sub-paths)
  const getCurrentPageTitle = () => {
    if (!url) return "Admin";
    
    // Check if we're on an order detail page
    if (url.match(/^\/admin\/orders\/\d+$/)) {
      return "Order Details";
    }
    
    const matchedLink = sidebarLinks.find((link) => {
      if (link.href === "/admin") {
        return url === "/admin" || url === "/admin/";
      }
      return url.startsWith(link.href);
    });
    return matchedLink?.label || "Admin";
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-border flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = url
              ? link.href === "/admin"
                ? url === "/admin" || url === "/admin/"
                : url.startsWith(link.href)
              : false;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-border flex-shrink-0 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || 'admin@technovation.com'}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-card/80 backdrop-blur-xl border-b border-border p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">{getCurrentPageTitle()}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-9 w-64 bg-secondary border-border"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full gradient-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                  3
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

