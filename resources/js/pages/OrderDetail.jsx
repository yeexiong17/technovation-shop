import { useState, useEffect } from "react";
import Layout from "@/Layout";
import { usePage, Link, router } from "@inertiajs/react";
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  CreditCard,
  Star,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";


const timelineConfig = {
  ordered: {
    label: "Order Placed",
    icon: Package,
    className: "text-blue-500",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-orange-500",
  },
  processing: {
    label: "Processing",
    icon: Clock,
    className: "text-yellow-500",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    className: "text-purple-500",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    className: "text-green-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "text-red-500",
  },
};

export default function OrderDetail({ order: initialOrder }) {
  const { props } = usePage();
  const order = initialOrder || props.order;
  const [rating, setRating] = useState(order?.review?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState(order?.review?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Update state when order prop changes
  useEffect(() => {
    if (order?.review) {
      setRating(order.review.rating);
      setReviewText(order.review.comment);
      setIsEditing(false);
    } else {
      setRating(0);
      setReviewText("");
      setIsEditing(false);
    }
  }, [order]);

  if (!order) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-3xl mb-4">Order Not Found</h1>
            <Link href="/orders">
              <Button variant="outline">Back to Orders</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString || !timeString) return '';
    const date = new Date(dateString);
    return `${formatDate(dateString)} at ${timeString}`;
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);

    router.post(
      `/orders/${order.id}/review`,
      {
        rating: rating,
        comment: reviewText,
      },
      {
        onSuccess: () => {
          toast.success(order.review ? "Review updated successfully!" : "Thank you for your review!");
          setIsSubmitting(false);
          setIsEditing(false);
          // Reload the page to get updated review data
          router.reload({ only: ['order'] });
        },
        onError: (errors) => {
          setIsSubmitting(false);
          if (errors.rating) {
            toast.error(errors.rating);
          } else if (errors.comment) {
            toast.error(errors.comment);
          } else if (errors.order) {
            toast.error(errors.order);
          } else if (errors.review) {
            toast.error(errors.review);
          } else {
            toast.error("Failed to submit review. Please try again.");
          }
        },
      }
    );
  };

  const currentStatusIndex = order.timeline && order.timeline.length > 0 ? order.timeline.length - 1 : 0;

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  Order Details
                </p>
                <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-2">
                  {order.orderNumber || order.id}
                </h1>
                <p className="text-muted-foreground">
                  Placed on {formatDate(order.date)}
                </p>
              </div>
              {order.trackingNumber && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                  <p className="font-mono text-lg font-medium">{order.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Timeline */}
              <section className="border border-border rounded-lg p-6">
                <h2 className="font-display text-2xl mb-6">Order Timeline</h2>
                <div className="relative">
                  {order.timeline && order.timeline.length > 0 ? order.timeline.map((step, index) => {
                    const config = timelineConfig[step.status] || timelineConfig.pending;
                    const Icon = config?.icon || Clock;
                    const isCompleted = index <= currentStatusIndex;
                    const isLast = index === order.timeline.length - 1;

                    return (
                      <div key={index} className="relative pb-8 last:pb-0">
                        {!isLast && (
                          <div
                            className={cn(
                              "absolute left-5 top-10 w-0.5 h-full",
                              isCompleted ? "bg-primary" : "bg-border"
                            )}
                          />
                        )}
                        <div className="flex gap-4">
                          <div
                            className={cn(
                              "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                              isCompleted
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-background border-border text-muted-foreground"
                            )}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3
                                className={cn(
                                  "font-medium",
                                  isCompleted ? "text-foreground" : "text-muted-foreground"
                                )}
                              >
                                {config.label}
                              </h3>
                              <span className="text-xs text-muted-foreground">
                                {formatDateTime(step.date, step.time)}
                              </span>
                            </div>
                            {step.status === "shipped" && order.trackingNumber && (
                              <p className="text-sm text-muted-foreground">
                                Tracking: {order.trackingNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No timeline data available</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Order Items */}
              <section className="border border-border rounded-lg p-6">
                <h2 className="font-display text-2xl mb-6">Order Items</h2>
                <div className="space-y-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-6 last:pb-0 border-b last:border-0 border-border">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 rounded-lg object-cover border border-border"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                          <p className="font-medium">
                            ${(item.price * item.quantity).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Rating and Review */}
              {order.status === "delivered" && (
                <section className="border border-border rounded-lg p-6">
                  <h2 className="font-display text-2xl mb-6">Rate Your Order</h2>
                  {order.review && !isEditing ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-5 h-5",
                              i < order.review.rating
                                ? "fill-primary text-primary"
                                : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground">
                          Reviewed on {formatDate(order.review.date)}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{order.review.comment}</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setRating(order.review.rating);
                          setReviewText(order.review.comment);
                          setIsEditing(true);
                          // Scroll to review form
                          setTimeout(() => {
                            const reviewSection = document.getElementById('review-form');
                            if (reviewSection) {
                              reviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }, 100);
                        }}
                      >
                        Edit Review
                      </Button>
                    </div>
                  ) : (
                    <div id="review-form" className="space-y-6">
                      <div>
                        <p className="text-sm font-medium mb-3">Your Rating</p>
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, i) => {
                            const starValue = i + 1;
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setRating(starValue)}
                                onMouseEnter={() => setHoveredRating(starValue)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={cn(
                                    "w-8 h-8 transition-colors",
                                    starValue <= (hoveredRating || rating)
                                      ? "fill-primary text-primary"
                                      : "text-muted-foreground/30"
                                  )}
                                />
                              </button>
                            );
                          })}
                          {rating > 0 && (
                            <span className="ml-2 text-sm text-muted-foreground">
                              {rating} {rating === 1 ? "star" : "stars"}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-3 block">
                          Your Review
                        </label>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Share your experience with this order..."
                          className="w-full min-h-[120px] px-4 py-3 rounded-md border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                        />
                      </div>

                      <div className="flex gap-2">
                        {order.review && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false);
                              setRating(order.review.rating);
                              setReviewText(order.review.comment);
                            }}
                            disabled={isSubmitting}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          onClick={handleSubmitReview}
                          disabled={isSubmitting || rating === 0 || !reviewText.trim()}
                          className={order.review ? "flex-1" : "w-full"}
                        >
                          {isSubmitting ? "Submitting..." : order.review ? "Update Review" : "Submit Review"}
                        </Button>
                      </div>
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <section className="border border-border rounded-lg p-6">
                <h3 className="font-display text-xl mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      ${order.subtotal.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">
                      ${order.tax.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-display text-xl font-semibold">
                        ${order.total.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="border border-border rounded-lg p-6">
                <h3 className="font-display text-xl mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                </div>
              </section>

              {/* Payment Method */}
              <section className="border border-border rounded-lg p-6">
                <h3 className="font-display text-xl mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h3>
                <p className="text-sm">{order.paymentMethod}</p>
              </section>

              {/* Actions */}
              {order.status === "delivered" && (
                <Button variant="outline" className="w-full">
                  Reorder Items
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

