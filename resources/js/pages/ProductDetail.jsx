import { Link, usePage, router } from "@inertiajs/react";
import { ArrowLeft, Star, Minus, Plus, ShoppingBag, MessageSquare, User, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/products/ProductCard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Layout from "@/Layout";

const ProductDetailContent = ({ product: initialProduct, relatedProducts = [] }) => {
  const { addToCart } = useCart();
  const { props } = usePage();
  const auth = props?.auth;
  const user = auth?.user;
  const [product, setProduct] = useState(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Update product when initialProduct changes
  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  // Ensure reviews is always an array
  const formatReviews = (reviewsData) => {
    if (!reviewsData) {
      return [];
    }

    // If it's already an array, return it as is (backend already formats it correctly)
    if (Array.isArray(reviewsData)) {
      return reviewsData.filter(review =>
        review &&
        typeof review === 'object' &&
        !Array.isArray(review) &&
        review.id !== undefined
      );
    }

    // If it's not an array, try to convert it
    if (reviewsData && typeof reviewsData[Symbol.iterator] === 'function') {
      return Array.from(reviewsData).filter(review =>
        review &&
        typeof review === 'object' &&
        !Array.isArray(review) &&
        review.id !== undefined
      );
    }

    return [];
  };

  const [reviews, setReviews] = useState(formatReviews(product?.reviews));

  // Find user's existing review (if any) - match by user ID
  const userReview = user && reviews.find(review =>
    review && review.userId && review.userId === String(user.id)
  );

  // Update reviews when product changes
  useEffect(() => {
    if (product?.reviews) {
      setReviews(formatReviews(product.reviews));
    } else {
      setReviews([]);
    }
  }, [product]);

  // Pre-populate form if user has already reviewed
  useEffect(() => {
    if (userReview && user) {
      setUserRating(userReview.rating || 0);
      setReviewText(userReview.comment || "");
    } else {
      setUserRating(0);
      setReviewText("");
    }
  }, [userReview, user]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  // Calculate rating statistics from actual reviews
  const ratingStats = (reviews || []).reduce((acc, review) => {
    if (review && typeof review === 'object' && 'rating' in review) {
      const rating = parseInt(review.rating) || 0;
      acc[rating] = (acc[rating] || 0) + 1;
    }
    return acc;
  }, {});

  const totalReviews = (reviews || []).length;

  // Calculate average rating from actual reviews, fallback to product.rating if no reviews
  const averageRating = totalReviews > 0
    ? (reviews || []).reduce((sum, review) => {
      if (review && typeof review === 'object' && 'rating' in review) {
        return sum + (parseInt(review.rating) || 0);
      }
      return sum;
    }, 0) / totalReviews
    : (parseFloat(product?.reviews?.average_rating) || 0);

  // Use calculated average rating for display (more accurate than stored rating)
  const displayRating = averageRating;

  const handleSubmitReview = () => {
    if (!user) {
      toast.error("Please log in to submit a review");
      return;
    }
    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);

    router.post(
      `/products/${product.id}/review`,
      {
        rating: userRating,
        comment: reviewText.trim(),
      },
      {
        onSuccess: (page) => {
          // Product data will be refreshed automatically via Inertia
          // The page will reload with updated product data
          setUserRating(0);
          setReviewText("");
          setIsSubmitting(false);
          toast.success("Thank you for your review!");
        },
        onError: (errors) => {
          setIsSubmitting(false);
          if (errors.rating) {
            toast.error(errors.rating);
          } else if (errors.comment) {
            toast.error(errors.comment);
          } else if (errors.review) {
            toast.error(errors.review);
          } else {
            toast.error("Failed to submit review. Please try again.");
          }
        },
      }
    );
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
            href="/products"
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
                {[...Array(5)].map((_, i) => {
                  // Use averageRating calculated from reviews, or fallback to product.rating
                  const ratingToShow = totalReviews > 0 ? averageRating : (parseFloat(product?.rating) || 0);
                  return (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(ratingToShow)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/30"
                        }`}
                    />
                  );
                })}
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                ({totalReviews || product?.reviews_count || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-serif text-3xl">${(product.price || 0).toFixed(2)}</span>
              {(product.originalPrice || product.original_price) && (
                <span className="text-lg text-muted-foreground line-through">
                  ${((product.originalPrice || product.original_price) || 0).toFixed(2)}
                </span>
              )}
              {(product.originalPrice || product.original_price) && (
                <span className="font-mono text-xs bg-primary text-primary-foreground px-2 py-1">
                  SAVE {Math.round((((product.originalPrice || product.original_price) - product.price) / (product.originalPrice || product.original_price)) * 100)}%
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
                <Link href={`/products?category=${product.category}`} className="hover:text-primary">
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
                      {[...Array(5)].map((_, i) => {
                        const ratingToShow = totalReviews > 0 ? averageRating : (parseFloat(product?.rating) || 0);
                        return (
                          <Star
                            key={i}
                            className={cn(
                              "w-6 h-6",
                              i < Math.floor(ratingToShow)
                                ? "fill-primary text-primary"
                                : "text-muted-foreground/30"
                            )}
                          />
                        );
                      })}
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
                    {userReview ? "Edit Your Review" : "Write a Review"}
                  </h3>
                  {!user ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Please log in to write a review
                      </p>
                      <Link href="/auth">
                        <Button>Log In</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {userReview && (
                        <div className="bg-muted/50 border border-border rounded-lg p-4 mb-4">
                          <p className="text-sm text-muted-foreground">
                            You've already reviewed this product. You can update your review below.
                          </p>
                        </div>
                      )}
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
                        disabled={isSubmitting || userRating === 0 || !reviewText.trim()}
                        className="w-full"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews List */}
            {reviews && Array.isArray(reviews) && reviews.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl">
                    Customer Reviews ({reviews.length})
                  </h3>
                </div>

                <div className="space-y-6">
                  {reviews.filter(review => review && typeof review === 'object').map((review) => (
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
                              {review.date ? formatDate(review.date) : 'N/A'}
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
                <p p className="font-display text-xl mb-2" > No reviews yet</p>
                <p className="text-muted-foreground">
                  Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        </section>

        Related Products
        {relatedProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl">Related Products</h2>
              <Link
                href={`/products?category=${product.category}`}
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

const ProductDetail = ({ product, relatedProducts = [] }) => {
  if (!product) {
    return (
      <Layout>
        <main className="min-h-screen bg-background pt-24 pb-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-serif text-4xl mb-4">Product Not Found</h1>
            <Link href="/products" className="text-primary hover:underline">
              ← Back to Products
            </Link>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <ProductDetailContent product={product} relatedProducts={relatedProducts} />
    </Layout>
  );
};

export default ProductDetail;

