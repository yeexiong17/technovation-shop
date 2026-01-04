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
import { usePage } from "@inertiajs/react";

const iconMap = {
  "Total Revenue": DollarSign,
  "Total Orders": ShoppingBag,
  "Active Users": Users,
  "Conversion Rate": TrendingUp,
};

export default function AdminAnalytics({ analytics: initialAnalytics }) {
  const { props } = usePage();
  const analytics = initialAnalytics || props.analytics || {};
  
  const stats = (analytics.stats || []).map(stat => ({
    ...stat,
    icon: iconMap[stat.label] || TrendingUp,
  }));
  
  const salesData = analytics.salesData || [];
  const topProducts = analytics.topProducts || [];
  const metrics = analytics.metrics || [];
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
        {stats.length > 0 ? stats.map((stat) => (
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
        )) : (
          <div className="col-span-4 text-center py-8 text-muted-foreground">
            <p>No analytics data available</p>
          </div>
        )}
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
            {salesData.length > 0 ? salesData.map((data, index) => {
              const maxSales = Math.max(...salesData.map((d) => d.sales || 0), 1);
              const percentage = maxSales > 0 ? ((data.sales || 0) / maxSales) * 100 : 0;
              return (
                <div key={data.month || index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{data.month}</span>
                    <span className="text-muted-foreground">
                      ${(data.sales || 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
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
            }) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No sales data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="text-lg font-semibold mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.length > 0 ? topProducts.map((product, index) => (
              <div key={product.name || index} className="flex items-center gap-4">
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
                    ${(product.revenue || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No products sold yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.length > 0 ? metrics.map((metric, index) => {
          const metricLabels = ['Average Order Value', 'Customer Lifetime Value', 'Return Rate'];
          const metricIcons = [TrendingUp, TrendingUp, TrendingDown];
          const Icon = metricIcons[index] || TrendingUp;
          
          return (
            <div key={metric.label || index} className="rounded-2xl bg-card border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">{metric.label || metricLabels[index]}</h4>
                <Icon className={cn(
                  "w-5 h-5",
                  metric.positive !== false ? "text-green-500" : "text-red-500"
                )} />
              </div>
              <p className="text-3xl font-bold mb-1">{metric.value || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">
                {metric.change || '0%'} from last month
              </p>
            </div>
          );
        }) : (
          <>
            <div className="rounded-2xl bg-card border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Average Order Value</h4>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold mb-1">$0.00</p>
              <p className="text-sm text-muted-foreground">No data available</p>
            </div>
            <div className="rounded-2xl bg-card border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Customer Lifetime Value</h4>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold mb-1">$0.00</p>
              <p className="text-sm text-muted-foreground">No data available</p>
            </div>
            <div className="rounded-2xl bg-card border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Return Rate</h4>
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-3xl font-bold mb-1">0%</p>
              <p className="text-sm text-muted-foreground">No data available</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

