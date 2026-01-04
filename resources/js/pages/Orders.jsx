import { useState } from "react";
import Layout from "@/Layout";
import { Link } from "@inertiajs/react";
import { Package, ArrowRight, Calendar, Truck, CheckCircle2, Clock, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusConfig = {
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    className: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  processing: {
    label: "Processing",
    icon: Clock,
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

export default function Orders({ orders: initialOrders = [] }) {
  const orders = initialOrders;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-24">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="font-display text-2xl mb-4">No orders yet</h2>
              <p className="text-muted-foreground mb-8">
                Start shopping to see your orders here
              </p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="border-b border-border pb-8 mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Account
            </p>
            <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-4">
              Orders
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Track and manage your orders
            </p>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="border border-border rounded-lg overflow-hidden hover:border-foreground/20 transition-colors"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-border bg-card">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-2",
                            statusInfo.className
                          )}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </div>
                        <div>
                          <p className="font-mono text-xs text-muted-foreground mb-1">
                            Order #{order.orderNumber || order.id}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.date)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Total</p>
                        <p className="font-display text-2xl font-semibold">
                          ${order.total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 items-center"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover border border-border"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium mb-1">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${(item.price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Actions */}
                    <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-border">
                      {order.trackingNumber && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Truck className="w-4 h-4" />
                          <span>Tracking: {order.trackingNumber}</span>
                        </div>
                      )}
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
