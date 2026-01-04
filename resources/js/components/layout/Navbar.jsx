import { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { ShoppingBag, Menu, X, User, Package, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { url, auth } = usePage().props;
  const user = auth?.user;

  const handleLogout = (e) => {
    e.preventDefault();
    router.post("/logout", {}, {
      onSuccess: () => {
        router.visit("/");
      },
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile menu + Nav links */}
          <div className="flex items-center gap-8">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors",
                    url === link.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <span className="font-display text-xl tracking-tight">
              TechNovation
            </span>
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <User className="w-4 h-4" />
                    {user.name}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {user?.is_admin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user?.is_admin && <DropdownMenuSeparator />}
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center gap-2 cursor-pointer">
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-500">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/auth"
                className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 text-sm"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "px-2 py-3 text-sm transition-colors",
                    url === link.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  {user.is_admin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-2 py-3 text-sm text-muted-foreground"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-2 py-3 text-sm text-muted-foreground"
                  >
                    Account
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-2 py-3 text-sm text-muted-foreground"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={(e) => {
                      setIsMenuOpen(false);
                      handleLogout(e);
                    }}
                    className="px-2 py-3 text-sm text-red-500 text-left w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-2 py-3 text-sm text-muted-foreground"
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

