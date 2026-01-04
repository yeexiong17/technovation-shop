import { useState, useEffect } from "react";
import Layout from "@/Layout";
import { Link, router, usePage } from "@inertiajs/react";
import { User, Mail, Phone, MapPin, Package, Settings, LogOut, Edit2, Save, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Profile({ user: initialUser, stats: initialStats }) {
  const { auth } = usePage().props;
  const currentUser = initialUser || auth?.user;
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
    city: currentUser?.city || "",
    state: currentUser?.state || "",
    zipCode: currentUser?.zip_code || currentUser?.zipCode || "",
    country: currentUser?.country || "",
  });

  // Update form data when user data changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        city: currentUser.city || "",
        state: currentUser.state || "",
        zipCode: currentUser.zip_code || currentUser.zipCode || "",
        country: currentUser.country || "",
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    router.put("/profile", formData, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      },
      onError: (errors) => {
        if (errors.email) {
          toast.error(errors.email);
        } else {
          toast.error("Failed to update profile. Please check your information.");
        }
      },
    });
  };

  const handleCancel = () => {
    // Reset form data to original user data
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        city: currentUser.city || "",
        state: currentUser.state || "",
        zipCode: currentUser.zip_code || currentUser.zipCode || "",
        country: currentUser.country || "",
      });
    }
    toast.info("Changes discarded");
    setIsEditing(false);
  };

  const handleLogout = () => {
    router.post("/logout", {}, {
      onSuccess: () => {
        router.visit("/");
      },
    });
  };

  if (!currentUser) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please log in</h2>
            <Link href="/auth">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const stats = initialStats || {
    totalOrders: 0,
    totalSpent: 0,
  };

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Account
            </p>
            <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-4">
              Profile
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Manage your account settings and preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information */}
              <section className="border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl">Personal Information</h2>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        className="gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10 bg-transparent border-border"
                      placeholder="Full Name"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10 bg-transparent border-border"
                      placeholder="Email Address"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="pl-10 bg-transparent border-border"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl">Shipping Address</h2>
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="bg-transparent border-border"
                      placeholder="Street Address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="bg-transparent border-border"
                      placeholder="City"
                    />
                    <Input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="bg-transparent border-border"
                      placeholder="State"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="bg-transparent border-border"
                      placeholder="ZIP Code"
                    />
                    <Input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="bg-transparent border-border"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </section>

              {/* Order History */}
              <section className="border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl">Order History</h2>
                  <Package className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-2">View all your orders</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Track shipments and view order details
                  </p>
                  <Link href="/orders">
                    <Button variant="outline" className="gap-2">
                      View Orders
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Actions */}
              <section className="border border-border rounded-lg p-6">
                <h3 className="font-display text-xl mb-4">Account</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => toast.info("Settings feature coming soon")}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </Button>
                </div>
              </section>

              {/* Account Summary */}
              <section className="border border-border rounded-lg p-6">
                <h3 className="font-display text-xl mb-4">Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since</span>
                    <span className="font-medium">
                      {currentUser.memberSince || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total orders</span>
                    <span className="font-medium">{stats.totalOrders || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total spent</span>
                    <span className="font-medium">
                      ${(stats.totalSpent || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
