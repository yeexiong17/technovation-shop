import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Minus, Plus, ShoppingBag, MessageSquare, User, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/products/ProductCard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Sample reviews data - in a real app, this would come from an API
const sampleReviews = {
  "1": [
    {
      id: "rev-1",
      userName: "Alex Johnson",
      rating: 5,
      date: "2024-01-10",
      comment: "Absolutely love this laptop! The performance is outstanding and the build quality is excellent. Highly recommend!",
      verified: true,
    },
    {
      id: "rev-2",
      userName: "Sarah Chen",
      rating: 5,
      date: "2024-01-08",
      comment: "Best laptop I've ever owned. The M3 Pro chip is incredibly fast, and the display is gorgeous.",
      verified: true,
    },
    {
      id: "rev-3",
      userName: "Michael Brown",
      rating: 4,
      date: "2024-01-05",
      comment: "Great laptop overall. Battery life could be better, but performance is top-notch.",
      verified: false,
    },
    {
      id: "rev-4",
      userName: "Emily Davis",
      rating: 5,
      date: "2024-01-03",
      comment: "Perfect for my work. Fast, reliable, and beautiful design. Worth every penny!",
      verified: true,
    },
  ],
  "2": [
    {
      id: "rev-5",
      userName: "David Wilson",
      rating: 5,
      date: "2024-01-12",
      comment: "Amazing phone! The camera quality is incredible and the battery lasts all day.",
      verified: true,
    },
    {
      id: "rev-6",
      userName: "Lisa Anderson",
      rating: 4,
      date: "2024-01-09",
      comment: "Really good phone, but the price is a bit high. Still, very satisfied with the purchase.",
      verified: true,
    },
  ],
  "3": [
    {
      id: "rev-7",
      userName: "James Taylor",
      rating: 5,
      date: "2024-01-11",
      comment: "Best headphones I've ever used! The noise cancellation is incredible.",
      verified: true,
    },
  ],
};

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState(sampleReviews[id] || []);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl mb-4">Product Not Found</h1>
          <Link to="/products" className="text-primary hover:underline">
            ← Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  // Calculate rating statistics
  const ratingStats = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
    : product.rating;

  const handleSubmitReview = () => {
    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }
    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const newReview = {
        id: `rev-${Date.now()}`,
        userName: userName.trim(),
        rating: userRating,
        date: new Date().toISOString().split("T")[0],
        comment: reviewText.trim(),
        verified: false,
      };
      setReviews([newReview, ...reviews]);
      setUserRating(0);
      setReviewText("");
      setUserName("");
      setIsSubmitting(false);
      toast.success("Thank you for your review!");
    }, 1000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
          {/* Image */}
          <div className="aspect-square bg-card border border-border overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
              {product.category}
            </p>

            <h1 className="font-serif text-4xl md:text-5xl font-light mb-6">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-serif text-3xl">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.originalPrice && (
                <span className="font-mono text-xs bg-primary text-primary-foreground px-2 py-1">
                  SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Stock Status */}
            <p className="font-mono text-xs uppercase tracking-widest mb-8">
              {product.inStock ? (
                <span className="text-green-600">In Stock</span>
              ) : (
                <span className="text-destructive">Out of Stock</span>
              )}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-muted transition-colors"
                  disabled={!product.inStock}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-muted transition-colors"
                  disabled={!product.inStock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1"
                size="lg"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-border pt-8 space-y-4">
              <div className="flex justify-between font-mono text-xs uppercase tracking-widest">
                <span className="text-muted-foreground">SKU</span>
                <span>{product.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between font-mono text-xs uppercase tracking-widest">
                <span className="text-muted-foreground">Category</span>
                <Link to={`/products?category=${product.category}`} className="hover:text-primary">
                  {product.category}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Rating and Reviews Section */}
        <section className="mb-24">
          <div className="border-t border-border pt-12">
            <h2 className="font-display text-3xl mb-8">Ratings & Reviews</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Rating Summary */}
              <div className="lg:col-span-1">
                <div className="border border-border rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-6 h-6",
                            i < Math.floor(averageRating)
                              ? "fill-primary text-primary"
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                    <p className="font-display text-4xl font-semibold mb-1">
                      {averageRating.toFixed(1)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                    </p>
                  </div>

                  {/* Rating Distribution */}
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = ratingStats[rating] || 0;
                      const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <div className="flex items-center gap-1 w-16">
                            <span className="text-sm font-medium">{rating}</span>
                            <Star className="w-3 h-3 fill-primary text-primary" />
                          </div>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Write Review Form */}
              <div className="lg:col-span-2">
                <div className="border border-border rounded-lg p-6">
                  <h3 className="font-display text-xl mb-6 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Write a Review
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-3 block">Your Name</label>
                      <Input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name"
                        className="bg-transparent border-border"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-3 block">Your Rating</label>
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => {
                          const starValue = i + 1;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setUserRating(starValue)}
                              onMouseEnter={() => setHoveredRating(starValue)}
                              onMouseLeave={() => setHoveredRating(0)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={cn(
                                  "w-8 h-8 transition-colors",
                                  starValue <= (hoveredRating || userRating)
                                    ? "fill-primary text-primary"
                                    : "text-muted-foreground/30"
                                )}
                              />
                            </button>
                          );
                        })}
                        {userRating > 0 && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            {userRating} {userRating === 1 ? "star" : "stars"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-3 block">Your Review</label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience with this product..."
                        className="w-full min-h-[120px] px-4 py-3 rounded-md border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleSubmitReview}
                      disabled={isSubmitting || userRating === 0 || !reviewText.trim() || !userName.trim()}
                      className="w-full"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl">
                    Customer Reviews ({reviews.length})
                  </h3>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border border-border rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{review.userName}</p>
                              {review.verified && (
                                <span className="flex items-center gap-1 text-xs text-primary">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(review.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-4 h-4",
                                i < review.rating
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground/30"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border border-border rounded-lg">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="font-display text-xl mb-2">No reviews yet</p>
                <p className="text-muted-foreground">
                  Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl">Related Products</h2>
              <Link
                to={`/products?category=${product.category}`}
                className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;

