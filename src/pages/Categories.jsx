import { useMemo } from "react";
import { Link } from "react-router-dom";
import { categories, products } from "@/data/products";

const Categories = () => {
  // Calculate actual product counts for each category
  const categoriesWithCounts = useMemo(() => {
    return categories.map((category) => {
      const count = products.filter(
        (product) => product.category.toLowerCase() === category.id.toLowerCase()
      ).length;
      return { ...category, count };
    });
  }, []);

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="mb-16">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
            Browse by
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light">
            Categories
          </h1>
        </header>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoriesWithCounts.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.name}`}
              className="group block"
            >
              <div className="aspect-[4/3] bg-card border border-border overflow-hidden mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl opacity-20 group-hover:opacity-30 transition-opacity">
                    {category.icon}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/80 to-transparent">
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                    {category.count} {category.count === 1 ? "product" : "products"}
                  </span>
                </div>
              </div>
              <h2 className="font-serif text-2xl group-hover:text-primary transition-colors">
                {category.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Categories;

