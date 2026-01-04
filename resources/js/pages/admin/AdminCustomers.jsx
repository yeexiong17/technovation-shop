import { useState } from "react";
import { Search, Mail, Phone, Calendar, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";

export default function AdminCustomers({ customers: initialCustomers, customerStats: initialStats }) {
  const { props } = usePage();
  const customers = initialCustomers || props.customers || [];
  const stats = initialStats || props.customerStats || {
    totalCustomers: 0,
    activeCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  };
  
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

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
          <h2 className="text-2xl font-bold">Customers</h2>
          <p className="text-muted-foreground">
            Manage customer accounts and view customer data
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Customers</p>
          <p className="text-2xl font-bold">{stats.totalCustomers || customers.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">Active Customers</p>
          <p className="text-2xl font-bold">
            {stats.activeCustomers || customers.filter((c) => c.status === "active").length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
          <p className="text-2xl font-bold">
            {stats.totalOrders || customers.reduce((sum, c) => sum + c.totalOrders, 0)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-2xl font-bold">
            ${(stats.totalRevenue || customers.reduce((sum, c) => sum + c.totalSpent, 0)).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search customers by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-secondary border-border"
        />
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <span>{customer.email}</span>
                      </div>
                      {customer.phone && customer.phone !== 'N/A' && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDate(customer.joinDate)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">{customer.totalOrders}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        ${customer.totalSpent.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        customer.status === "active"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-gray-500/10 text-gray-500"
                      )}
                    >
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCustomers.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No customers found</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {filteredCustomers.length} of {customers.length} customers</p>
      </div>
    </div>
  );
}

