import { useState, useEffect } from "react";
import Layout from "@/Layout";
import { Link, router } from "@inertiajs/react";
import { ArrowLeft, CreditCard, Lock, Truck, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { getCsrfToken } from "@/lib/csrf";

function CheckoutContent() {
  const { items, totalPrice, refreshCart } = useCart();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    shipping_name: "",
    shipping_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_zip_code: "",
    shipping_country: "",
    shipping_phone: "",
    cardholder_name: "",
    card_number: "",
    card_expiry: "",
    card_cvc: "",
  });

  // Load checkout summary
  useEffect(() => {
    loadCheckoutSummary();
  }, []);

  const loadCheckoutSummary = async () => {
    try {
      const csrfToken = getCsrfToken();
      const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };
      
      if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken;
      }

      const response = await fetch('/api/checkout', {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setCheckoutData(data);
      } else if (response.status === 401) {
        toast.error('Please log in to checkout');
        router.visit('/auth');
      }
    } catch (error) {
      console.error('Failed to load checkout:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Final step - submit order
    setIsLoading(true);
    
    try {
      // Format payment method
      const last4 = formData.card_number.slice(-4);
      const paymentMethod = `Card •••• ${last4}`;

      const csrfToken = getCsrfToken();
      const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };
      
      if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          shipping_name: formData.shipping_name,
          shipping_address: formData.shipping_address,
          shipping_city: formData.shipping_city,
          shipping_state: formData.shipping_state,
          shipping_zip_code: formData.shipping_zip_code,
          shipping_country: formData.shipping_country || "United States",
          shipping_phone: formData.shipping_phone,
          payment_method: paymentMethod,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Order placed successfully! Thank you for your purchase.");
        await refreshCart();
        router.visit(`/orders/${data.order.id}`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = checkoutData?.subtotal || totalPrice;
  const shipping = checkoutData?.shipping || 0;
  const tax = checkoutData?.tax || Math.round(totalPrice * 0.08);
  const total = checkoutData?.total || Math.round(totalPrice * 1.08);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center gap-4 mb-8">
              {["Shipping", "Payment", "Review"].map((label, index) => (
                <div key={label} className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      step > index + 1
                        ? "gradient-primary text-primary-foreground"
                        : step === index + 1
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {step > index + 1 ? "✓" : index + 1}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      step >= index + 1
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                  {index < 2 && (
                    <div className="flex-1 h-px bg-border min-w-[40px]" />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Shipping */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="shipping_name"
                      placeholder="Full Name"
                      value={formData.shipping_name}
                      onChange={handleInputChange}
                      className="bg-card border-border h-12"
                      required
                    />
                    <Input
                      name="shipping_phone"
                      placeholder="Phone Number"
                      value={formData.shipping_phone}
                      onChange={handleInputChange}
                      className="bg-card border-border h-12"
                    />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    className="bg-card border-border h-12"
                    required
                  />
                  <Input
                    name="shipping_address"
                    placeholder="Address"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    className="bg-card border-border h-12"
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      name="shipping_city"
                      placeholder="City"
                      value={formData.shipping_city}
                      onChange={handleInputChange}
                      className="bg-card border-border h-12"
                      required
                    />
                    <Input
                      name="shipping_state"
                      placeholder="State"
                      value={formData.shipping_state}
                      onChange={handleInputChange}
                      className="bg-card border-border h-12"
                      required
                    />
                    <Input
                      name="shipping_zip_code"
                      placeholder="ZIP Code"
                      value={formData.shipping_zip_code}
                      onChange={handleInputChange}
                      className="bg-card border-border h-12"
                      required
                    />
                  </div>
                  <Input
                    name="shipping_country"
                    placeholder="Country"
                    value={formData.shipping_country}
                    onChange={handleInputChange}
                    className="bg-card border-border h-12"
                    defaultValue="United States"
                  />
                </div>
              )}

              {/* Payment */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Payment Details
                  </h2>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
                    <Lock className="w-5 h-5 text-primary" />
                    <span className="text-sm">
                      Your payment information is secure and encrypted
                    </span>
                  </div>
                  <Input
                    name="cardholder_name"
                    placeholder="Cardholder Name"
                    value={formData.cardholder_name}
                    onChange={handleInputChange}
                    className="bg-card border-border h-12"
                    required
                  />
                  <Input
                    name="card_number"
                    placeholder="Card Number"
                    value={formData.card_number}
                    onChange={handleInputChange}
                    className="bg-card border-border h-12"
                    required
                    maxLength={19}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="card_expiry"
                      placeholder="MM/YY"
                      value={formData.card_expiry}
                      onChange={handleInputChange}
                      className="bg-card border-border h-12"
                      required
                      maxLength={5}
                    />
                    <Input
                      name="card_cvc"
                      placeholder="CVC"
                      value={formData.card_cvc}
                      onChange={handleInputChange}
                      className="bg-card border-border h-12"
                      required
                      maxLength={4}
                    />
                  </div>
                </div>
              )}

              {/* Review */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Review Order
                  </h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 rounded-xl bg-card border border-border"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="font-semibold">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-4 mt-8">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setStep(step - 1)}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                )}
                <Button type="submit" size="lg" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Processing..." : step === 3 ? "Place Order" : "Continue"}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-card border border-border p-6 space-y-6">
              <h3 className="text-lg font-semibold">Order Summary</h3>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-primary">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-gradient">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-4 h-4" />
                Secure checkout powered by TechNovation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Layout>
      <CheckoutContent />
    </Layout>
  );
}
