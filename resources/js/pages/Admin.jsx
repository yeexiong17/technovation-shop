import { usePage } from "@inertiajs/react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import AdminCustomers from "./admin/AdminCustomers";
import AdminAnalytics from "./admin/AdminAnalytics";
import AdminSettings from "./admin/AdminSettings";

export default function Admin() {
  const { url } = usePage();
  
  const renderContent = () => {
    if (url === '/admin' || url === '/admin/') {
      return <AdminDashboard />;
    }
    if (url.startsWith('/admin/products')) {
      return <AdminProducts />;
    }
    if (url.startsWith('/admin/orders')) {
      return <AdminOrders />;
    }
    if (url.startsWith('/admin/customers')) {
      return <AdminCustomers />;
    }
    if (url.startsWith('/admin/analytics')) {
      return <AdminAnalytics />;
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

