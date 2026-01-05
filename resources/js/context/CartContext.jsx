import React, { createContext, useContext, useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { getCsrfToken } from "@/lib/csrf";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from API on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      } else if (response.status === 401) {
        // Not authenticated, use empty cart
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product) => {
    try {
      const csrfToken = getCsrfToken();
      console.log('CSRF Token:', csrfToken ? 'Found' : 'Not found');
      
      const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
      };
      
      // Include CSRF token if available (though routes should be excluded)
      if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken;
        headers['X-CSRF-TOKEN'] = csrfToken; // Try both header names
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await loadCart(); // Reload cart to get updated data
      toast.success(`Added ${product.name} to cart`);
      } else if (response.status === 401) {
        toast.error('Please log in to add items to cart');
        router.visit('/auth');
      } else {
        let errorMessage = 'Failed to add item to cart';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
          if (errorData.errors) {
            // Handle validation errors
            const firstError = Object.values(errorData.errors)[0];
            errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
          }
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        console.error('Cart error:', errorMessage, response.status);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const item = items.find((i) => i.id === cartItemId);
      const csrfToken = getCsrfToken();
      const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };
      
      if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken;
      }

      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        await loadCart();
      if (item) {
        toast.info(`Removed ${item.name} from cart`);
      }
      } else {
        toast.error('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    try {
      const csrfToken = getCsrfToken();
      const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };
      
      if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken;
      }

      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        await loadCart();
      } else {
        toast.error('Failed to update quantity');
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    // Clear all items one by one (or implement a clear endpoint)
    try {
      const csrfToken = getCsrfToken();
      const headers = {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      };
      
      if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken;
      }

      for (const item of items) {
        await fetch(`/api/cart/${item.id}`, {
          method: 'DELETE',
          headers,
          credentials: 'include',
        });
      }
    setItems([]);
    toast.info("Cart cleared");
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        isLoading,
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
