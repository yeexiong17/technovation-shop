import { usePage } from "@inertiajs/react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import AdminOrderDetail from "./admin/AdminOrderDetail";
import AdminCustomers from "./admin/AdminCustomers";
import AdminAnalytics from "./admin/AdminAnalytics";
import AdminSettings from "./admin/AdminSettings";

export default function Admin({ orders, dashboard, customers, customerStats, order }) {
  const { url, props: pageProps } = usePage();
  
  const renderContent = () => {
    if (url === '/admin' || url === '/admin/') {
      return <AdminDashboard dashboard={dashboard || pageProps.dashboard} />;
    }
    if (url.startsWith('/admin/products')) {
      return <AdminProducts products={pageProps.products} categories={pageProps.categories} />;
    }
    // Check for order detail page first (more specific route)
    if (url.match(/^\/admin\/orders\/\d+$/)) {
      return <AdminOrderDetail order={order || pageProps.order} />;
    }
    if (url.startsWith('/admin/orders')) {
      return <AdminOrders orders={orders || pageProps.orders} />;
    }
    if (url.startsWith('/admin/customers')) {
      return <AdminCustomers customers={customers || pageProps.customers} customerStats={customerStats || pageProps.customerStats} />;
    }
    if (url.startsWith('/admin/analytics')) {
      return <AdminAnalytics analytics={pageProps.analytics} />;
    }
    if (url.startsWith('/admin/settings')) {
      return <AdminSettings />;
    }
    return <AdminDashboard />;
  };

  return (
    <AdminLayout>
      {renderContent()}
    </AdminLayout>
  );
}

