import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight, Calendar, Truck, CheckCircle2, Clock, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Sample orders data - in a real app, this would come from an API
const sampleOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 1999.00,
    items: [
      {
        id: "1",
        name: "Nova Pro Laptop",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
        quantity: 1,
        price: 1999.00,
      },
    ],
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "shipped",
    total: 1548.00,
    items: [
      {
        id: "2",
        name: "Quantum Phone X",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
        quantity: 1,
        price: 1199.00,
      },
      {
        id: "5",
        name: "MechKey Ultra",
        image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600",
        quantity: 1,
        price: 189.00,
      },
    ],
    trackingNumber: "TRK987654321",
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "processing",
    total: 349.00,
    items: [
      {
        id: "3",
        name: "AeroSound Pro",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
        quantity: 1,
        price: 349.00,
      },
    ],
    trackingNumber: null,
  },
  {
    id: "ORD-004",
    date: "2023-12-20",
    status: "delivered",
    total: 449.00,
    items: [
      {
        id: "6",
        name: "SmartWatch Pro",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
        quantity: 1,
        price: 449.00,
      },
    ],
    trackingNumber: "TRK456789123",
  },
];

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
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

export default function Orders() {
  const [orders] = useState(sampleOrders);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredOrders = selectedStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Account
          </p>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-4">
                Orders
              </h1>
              <p className="text-muted-foreground max-w-xl">
                View and track all your orders.
              </p>
            </div>
            <Link to="/profile">
              <Button variant="outline" className="gap-2">
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedStatus("all")}
            className={cn(
              "px-4 py-2 text-sm transition-colors border rounded-md",
              selectedStatus === "all"
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
            )}
          >
            All Orders
          </button>
          {Object.entries(statusConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedStatus(key)}
              className={cn(
                "px-4 py-2 text-sm transition-colors border rounded-md",
                selectedStatus === key
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
              )}
            >
              {config.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-24 border border-border rounded-lg">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="font-display text-2xl mb-2">No orders found</p>
            <p className="text-muted-foreground mb-8">
              {selectedStatus === "all"
                ? "You haven't placed any orders yet"
                : `You don't have any ${statusConfig[selectedStatus]?.label.toLowerCase()} orders`}
            </p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={order.id}
                  className="border border-border rounded-lg overflow-hidden hover:border-foreground/20 transition-colors"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-border bg-card">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm font-medium">
                            {order.id}
                          </span>
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5",
                              status.className
                            )}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.date)}
                          </div>
                          {order.trackingNumber && (
                            <div className="flex items-center gap-1.5">
                              <Truck className="w-4 h-4" />
                              {order.trackingNumber}
                            </div>
                          )}
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
                      <Link to={`/orders/${order.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                      </Link>
                      {order.status === "delivered" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            // In a real app, this would handle reorder
                            console.log("Reorder:", order.id);
                          }}
                        >
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

