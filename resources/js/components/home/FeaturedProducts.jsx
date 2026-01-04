import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { Link } from "@inertiajs/react";

export function FeaturedProducts({ products = [] }) {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-24 border-t border-rule">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Curated Selection
            </p>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight">
              Featured
            </h2>
          </div>
          <Link 
            href="/products"
            className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors group"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-background p-6">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile link */}
        <Link 
          href="/products"
          className="flex md:hidden items-center justify-center gap-2 mt-8 text-sm font-medium hover:text-primary transition-colors"
        >
          View All Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
