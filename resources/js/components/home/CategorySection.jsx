import { Link } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";

const categoryImages = {
  laptops: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80",
  audio: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&q=80",
  wearables: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80",
  accessories: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=600&q=80",
  smartphones: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
  gaming: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80",
};

export function CategorySection({ categories = [] }) {
  if (categories.length === 0) {
    return null;
  }

  // Show top 4 categories by product count
  const topCategories = [...categories]
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 4);

  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Browse By
          </p>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight">
            Categories
          </h2>
        </div>

        <div className="space-y-px">
          {topCategories.map((category, index) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group flex items-center justify-between py-6 border-t border-border hover:bg-background transition-colors"
            >
              <div className="flex items-center gap-8">
                <span className="font-mono text-xs text-muted-foreground w-8">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="w-16 h-16 overflow-hidden hidden md:block">
                  <img 
                    src={categoryImages[category.id] || categoryImages.laptops}
                    alt={category.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <span className="font-display text-2xl md:text-3xl group-hover:italic transition-all">
                  {category.name}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-mono text-sm text-muted-foreground">
                  {category.count || 0} items
                </span>
                <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
