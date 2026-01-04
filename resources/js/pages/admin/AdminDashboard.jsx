import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";

const iconMap = {
  "Total Revenue": DollarSign,
  "Total Orders": ShoppingBag,
  "Active Users": Users,
  "Conversion Rate": TrendingUp,
};

export default function AdminDashboard() {
  const { props } = usePage();
  const dashboard = props.dashboard || {};
  const stats = dashboard.stats || [];
  const recentOrders = dashboard.recentOrders || [];
  const topProducts = dashboard.topProducts || [];

  // Add icons to stats
  const statsWithIcons = stats.map(stat => ({
    ...stat,
    icon: iconMap[stat.label] || TrendingUp,
  }));
  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsWithIcons.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  stat.positive ? "text-green-500" : "text-red-500"
                )}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-primary">
                        {order.id}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          (order.status === "Completed" || order.status === "Delivered") &&
                            "bg-green-500/10 text-green-500",
                          order.status === "Processing" &&
                            "bg-blue-500/10 text-blue-500",
                          order.status === "Shipped" &&
                            "bg-purple-500/10 text-purple-500",
                          (order.status === "Pending" || order.status === "pending") &&
                            "bg-yellow-500/10 text-yellow-500"
                        )}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.customer} • {order.product}
                    </p>
                  </div>
                  <span className="font-semibold">{order.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-2xl bg-card border border-border">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top Products</h2>
            <Link href="/admin/products">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="p-6 space-y-4">
            {topProducts.length > 0 ? topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${product.price.toLocaleString()}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {product.sold} sold
                </span>
              </div>
            )) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No products sold yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

