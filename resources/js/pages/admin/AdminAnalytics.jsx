import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Total Revenue",
    value: "$124,500",
    change: "+12.5%",
    changeValue: 12450,
    icon: DollarSign,
    positive: true,
  },
  {
    label: "Total Orders",
    value: "1,234",
    change: "+8.2%",
    changeValue: 98,
    icon: ShoppingBag,
    positive: true,
  },
  {
    label: "Active Users",
    value: "5,678",
    change: "+23.1%",
    changeValue: 1065,
    icon: Users,
    positive: true,
  },
  {
    label: "Conversion Rate",
    value: "3.2%",
    change: "-0.4%",
    changeValue: -0.4,
    icon: TrendingUp,
    positive: false,
  },
];

const topProducts = [
  { name: "Nova Pro Laptop", sales: 245, revenue: 489755 },
  { name: "Quantum Phone X", sales: 189, revenue: 226611 },
  { name: "GameStation Elite", sales: 156, revenue: 93444 },
  { name: "AeroSound Pro", sales: 142, revenue: 49558 },
  { name: "SmartWatch Pro", sales: 98, revenue: 44002 },
];

const salesData = [
  { month: "Jan", sales: 45000 },
  { month: "Feb", sales: 52000 },
  { month: "Mar", sales: 48000 },
  { month: "Apr", sales: 61000 },
  { month: "May", sales: 55000 },
  { month: "Jun", sales: 67000 },
];

export default function AdminAnalytics() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-muted-foreground">
          Track your business performance and insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex items-center gap-1">
                {stat.positive ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    stat.positive ? "text-green-500" : "text-red-500"
                  )}
                >
                  {stat.change}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Revenue Overview</h3>
            <select className="text-sm bg-secondary border border-border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Last 6 months</option>
              <option>Last year</option>
              <option>All time</option>
            </select>
          </div>
          <div className="space-y-4">
            {salesData.map((data, index) => {
              const maxSales = Math.max(...salesData.map((d) => d.sales));
              const percentage = (data.sales / maxSales) * 100;
              return (
                <div key={data.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{data.month}</span>
                    <span className="text-muted-foreground">
                      ${data.sales.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="text-lg font-semibold mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.sales} sales
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${product.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Average Order Value</h4>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold mb-1">$101.23</p>
          <p className="text-sm text-muted-foreground">+5.2% from last month</p>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Customer Lifetime Value</h4>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold mb-1">$1,247</p>
          <p className="text-sm text-muted-foreground">+12.8% from last month</p>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Return Rate</h4>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold mb-1">2.3%</p>
          <p className="text-sm text-muted-foreground">-0.5% from last month</p>
        </div>
      </div>
    </div>
  );
}

