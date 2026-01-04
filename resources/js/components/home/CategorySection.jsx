import { Link } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";

const categories = [
  { 
    name: "Laptops", 
    count: 24,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80"
  },
  { 
    name: "Audio", 
    count: 18,
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&q=80"
  },
  { 
    name: "Wearables", 
    count: 12,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80"
  },
  { 
    name: "Accessories", 
    count: 36,
    image: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=600&q=80"
  },
];

export function CategorySection() {
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
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={`/products?category=${category.name.toLowerCase()}`}
              className="group flex items-center justify-between py-6 border-t border-border hover:bg-background transition-colors"
            >
              <div className="flex items-center gap-8">
                <span className="font-mono text-xs text-muted-foreground w-8">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="w-16 h-16 overflow-hidden hidden md:block">
                  <img 
                    src={category.image}
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
                  {category.count} items
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

