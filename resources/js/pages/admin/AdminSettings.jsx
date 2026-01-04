import { useState } from "react";
import { Save, Bell, Mail, Globe, Shield, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: "TechNovation",
    storeEmail: "admin@technovation.com",
    storePhone: "+1 (555) 123-4567",
    storeAddress: "123 Tech Street, San Francisco, CA 94102",
    currency: "USD",
    taxRate: "8.0",
    shippingCost: "0.00",
    freeShippingThreshold: "100.00",
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">
          Manage your store settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Store Information */}
          <div className="rounded-2xl bg-card border border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Store Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Store Name
                </label>
                <Input
                  name="storeName"
                  value={settings.storeName}
                  onChange={handleInputChange}
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Store Email
                </label>
                <Input
                  name="storeEmail"
                  type="email"
                  value={settings.storeEmail}
                  onChange={handleInputChange}
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Store Phone
                </label>
                <Input
                  name="storePhone"
                  value={settings.storePhone}
                  onChange={handleInputChange}
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Store Address
                </label>
                <Input
                  name="storeAddress"
                  value={settings.storeAddress}
                  onChange={handleInputChange}
                  className="bg-secondary border-border"
                />
              </div>
            </div>
          </div>

          {/* Payment & Shipping */}
          <div className="rounded-2xl bg-card border border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Payment & Shipping</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Currency
                </label>
                <select
                  name="currency"
                  value={settings.currency}
                  onChange={handleInputChange}
                  className="w-full h-10 px-4 bg-secondary border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Tax Rate (%)
                </label>
                <Input
                  name="taxRate"
                  type="number"
                  step="0.1"
                  value={settings.taxRate}
                  onChange={handleInputChange}
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Shipping Cost ($)
                </label>
                <Input
                  name="shippingCost"
                  type="number"
                  step="0.01"
                  value={settings.shippingCost}
                  onChange={handleInputChange}
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Free Shipping Threshold ($)
                </label>
                <Input
                  name="freeShippingThreshold"
                  type="number"
                  step="0.01"
                  value={settings.freeShippingThreshold}
                  onChange={handleInputChange}
                  className="bg-secondary border-border"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-2xl bg-card border border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Notifications</h3>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your store
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-border"
                />
              </label>
              <label className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium">Order Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new orders are placed
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="orderNotifications"
                  checked={settings.orderNotifications}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-border"
                />
              </label>
              <label className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when products are running low
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="lowStockAlerts"
                  checked={settings.lowStockAlerts}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-border"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-card border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Security</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your account security settings
            </p>
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </div>

          <div className="rounded-2xl bg-card border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Export Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Backup Settings
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                Reset to Defaults
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2" size="lg">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

