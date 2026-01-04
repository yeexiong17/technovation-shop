import { useState, useMemo } from "react";
import { router, usePage } from "@inertiajs/react";
import { Search, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/products/ProductCard";
import { cn } from "@/lib/utils";
import Layout from "@/Layout";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function Products({ products: initialProducts = [], categories: initialCategories = [], category: initialCategory }) {
  const { url } = usePage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory?.toLowerCase() || "all"
  );
  const [sortBy, setSortBy] = useState("featured");

  // Build categories list with "All" option
  const categories = [
    { id: "all", name: "All", count: initialProducts.length },
    ...initialCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      count: initialProducts.filter(p => p.category === cat.id).length
    }))
  ];

  const filteredProducts = useMemo(() => {
    let filtered = [...initialProducts];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category.toLowerCase() === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return filtered;
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    router.get("/products", category === "all" ? {} : { category }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="border-b border-border pb-8 mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Collection
            </p>
            <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-4">
              Shop
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Thoughtfully curated technology for the discerning individual.
            </p>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={cn(
                    "px-4 py-2 text-sm transition-colors border",
                    selectedCategory === category.id
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search & Sort */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48 bg-transparent border-border h-10"
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none h-10 pl-4 pr-10 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-8">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 border-t border-border">
              <p className="font-display text-2xl mb-4">No products found</p>
              <p className="text-muted-foreground mb-8">
                Try adjusting your search or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  handleCategoryChange("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-background p-6">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
