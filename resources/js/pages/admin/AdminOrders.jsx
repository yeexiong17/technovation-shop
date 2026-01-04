import { useState } from "react";
import { Search, Filter, Eye, Package } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";

const statusConfig = {
  delivered: { label: "Delivered", className: "bg-green-500/10 text-green-500" },
  shipped: { label: "Shipped", className: "bg-blue-500/10 text-blue-500" },
  processing: { label: "Processing", className: "bg-yellow-500/10 text-yellow-500" },
  pending: { label: "Pending", className: "bg-orange-500/10 text-orange-500" },
  cancelled: { label: "Cancelled", className: "bg-red-500/10 text-red-500" },
};

export default function AdminOrders({ orders: initialOrders }) {
  const { props } = usePage();
  const orders = initialOrders || props.orders || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Orders</h2>
          <p className="text-muted-foreground">
            Manage and track customer orders
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by ID, customer, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 px-4 bg-secondary border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Status</option>
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status];
                return (
                  <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">{formatDate(order.date)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          status.className
                        )}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{order.items}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium">
                        ${order.total.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {order.orderId && (
                          <Link href={`/admin/orders/${order.orderId}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="View Order Details">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {filteredOrders.length} of {orders.length} orders</p>
      </div>
    </div>
  );
}

