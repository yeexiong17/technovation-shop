import { useState, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  CreditCard,
  User,
  Mail,
  Phone,
  XCircle,
  Save,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  },
  processing: {
    label: "Processing",
    icon: Package,
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    className: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

export default function AdminOrderDetail({ order: initialOrder }) {
  const [order, setOrder] = useState(initialOrder);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(initialOrder?.status || "pending");
  const [statusNotes, setStatusNotes] = useState("");
  const [trackingNumber, setTrackingNumber] = useState(initialOrder?.trackingNumber || "");
  const [isEditingTracking, setIsEditingTracking] = useState(false);

  // Update state when order prop changes
  useEffect(() => {
    if (initialOrder) {
      setOrder(initialOrder);
      setNewStatus(initialOrder.status || "pending");
      setTrackingNumber(initialOrder.trackingNumber || "");
    }
  }, [initialOrder]);

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Order not found</p>
          <Link href="/admin/orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </div>
      </div>
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
    const date = new Date(dateString);
    return `${formatDate(dateString)} at ${timeString}`;
  };

  const handleStatusUpdate = () => {
    if (newStatus === order.status) {
      toast.error("Please select a different status");
      return;
    }

    setIsUpdatingStatus(true);

    router.put(
      `/admin/orders/${order.id}/status`,
      {
        status: newStatus,
        notes: statusNotes,
        trackingNumber: trackingNumber || null,
      },
      {
        onSuccess: () => {
          setStatusNotes("");
          setIsUpdatingStatus(false);
          toast.success("Order status updated successfully!");
          // Reload the page to get updated order data
          router.reload({ only: ['order'] });
        },
        onError: (errors) => {
          setIsUpdatingStatus(false);
          if (errors.status) {
            toast.error(errors.status);
          } else {
            toast.error("Failed to update order status");
          }
        },
      }
    );
  };

  const handleTrackingUpdate = () => {
    router.put(
      `/admin/orders/${order.id}/tracking`,
      {
        trackingNumber: trackingNumber || null,
      },
      {
        onSuccess: () => {
          setIsEditingTracking(false);
          toast.success("Tracking number updated successfully!");
          // Reload the page to get updated order data
          router.reload({ only: ['order'] });
        },
        onError: () => {
          toast.error("Failed to update tracking number");
        },
      }
    );
  };

  const currentStatusConfig = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = currentStatusConfig.icon;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-10">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="font-display text-2xl md:text-3xl tracking-tight">
              {order.orderNumber || order.id}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Placed on {formatDate(order.date)}
            </p>
          </div>
        </div>
        <div
          className={cn(
            "px-4 py-2 rounded-lg border flex items-center gap-2 w-fit",
            currentStatusConfig.className
          )}
        >
          <StatusIcon className="w-5 h-5" />
          <span className="font-medium capitalize">{currentStatusConfig.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Update Section */}
          <div className="rounded-lg bg-card border border-border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Update Order Status
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full h-10 px-4 bg-secondary border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Status Notes (Optional)
                </label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Add notes about this status change..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-md border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <Button
                onClick={handleStatusUpdate}
                disabled={isUpdatingStatus || newStatus === order.status}
                className="w-full gap-2"
              >
                <Save className="w-4 h-4" />
                {isUpdatingStatus ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="rounded-lg bg-card border border-border p-6">
            <h2 className="text-lg font-semibold mb-6">Status History</h2>
            <div className="relative">
              {order.timeline && order.timeline.length > 0 ? (
                order.timeline.map((step, index) => {
                  const config = statusConfig[step.status] || statusConfig.pending;
                  const StepIcon = config.icon;
                  const isLast = index === order.timeline.length - 1;

                  return (
                    <div key={index} className="relative pb-8 last:pb-0">
                      {!isLast && (
                        <div className="absolute left-5 top-10 w-0.5 h-full bg-border" />
                      )}
                      <div className="flex gap-4">
                        <div
                          className={cn(
                            "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                            isLast
                              ? "bg-primary border-primary text-primary-foreground"
                              : "bg-background border-border text-muted-foreground"
                          )}
                        >
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium">{config.label}</h3>
                            <span className="text-xs text-muted-foreground">
                              {formatDateTime(step.date, step.time)}
                            </span>
                          </div>
                          {step.notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {step.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground">No status history available</p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-lg bg-card border border-border p-6">
            <h2 className="text-lg font-semibold mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 last:pb-0 border-b last:border-0 border-border"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover border border-border"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-medium">
                        $
                        {(item.price * item.quantity).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="rounded-lg bg-card border border-border p-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Name</p>
                <p className="font-medium">{order.customer?.name || order.shippingAddress?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Email
                </p>
                <p className="font-medium">{order.customer?.email || "N/A"}</p>
              </div>
              {order.customer?.phone && (
                <div>
                  <p className="text-muted-foreground mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Phone
                  </p>
                  <p className="font-medium">{order.customer.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-lg bg-card border border-border p-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
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
          </div>

          {/* Tracking Number */}
          <div className="rounded-lg bg-card border border-border p-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Tracking Number
            </h3>
            {isEditingTracking ? (
              <div className="space-y-3">
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="bg-secondary border-border"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleTrackingUpdate}
                    size="sm"
                    className="flex-1"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditingTracking(false);
                      setTrackingNumber(order.trackingNumber || "");
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-mono">
                  {order.trackingNumber || "Not set"}
                </p>
                <Button
                  onClick={() => setIsEditingTracking(true)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {order.trackingNumber ? "Update" : "Add"} Tracking
                </Button>
              </div>
            )}
          </div>

          {/* Payment Information */}
          <div className="rounded-lg bg-card border border-border p-6">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize">{order.paymentStatus || "Pending"}</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-lg bg-card border border-border p-6">
            <h3 className="text-base font-semibold mb-4">Order Summary</h3>
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
                  {order.shipping === 0
                    ? "Free"
                    : `$${order.shipping.toFixed(2)}`}
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
          </div>
        </div>
      </div>
    </div>
  );
}

