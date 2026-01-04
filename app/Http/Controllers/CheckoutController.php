<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('auth');
        }

        $cartItems = CartItem::where('user_id', $user->id)
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('products.index');
        }

        $subtotal = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });
        $shipping = 0; // Free shipping for now
        $tax = $subtotal * 0.08; // 8% tax
        $total = $subtotal + $shipping + $tax;

        return response()->json([
            'cartItems' => $cartItems->map(function ($item) {
                return [
                    'id' => (string) $item->id,
                    'product_id' => (string) $item->product_id,
                    'name' => $item->product->name,
                    'image' => $item->product->image,
                    'price' => (float) $item->product->price,
                    'quantity' => $item->quantity,
                ];
            }),
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'tax' => $tax,
            'total' => $total,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Authentication required'], 401);
        }

        $request->validate([
            'shipping_name' => 'required|string|max:255',
            'shipping_address' => 'required|string|max:255',
            'shipping_city' => 'required|string|max:255',
            'shipping_state' => 'required|string|max:255',
            'shipping_zip_code' => 'required|string|max:20',
            'shipping_country' => 'required|string|max:255',
            'shipping_phone' => 'nullable|string|max:20',
            'payment_method' => 'required|string|max:255',
        ]);

        $cartItems = CartItem::where('user_id', $user->id)
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }

        DB::beginTransaction();
        try {
            // Calculate totals
            $subtotal = $cartItems->sum(function ($item) {
                return $item->product->price * $item->quantity;
            });
            $shipping = 0;
            $tax = $subtotal * 0.08;
            $total = $subtotal + $shipping + $tax;

            // Generate order number
            $lastOrder = Order::orderBy('id', 'desc')->first();
            $orderNumber = 'ORD-' . str_pad(($lastOrder ? $lastOrder->id : 0) + 1, 3, '0', STR_PAD_LEFT);

            // Create order
            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $user->id,
                'status' => 'pending',
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'tax' => $tax,
                'total' => $total,
                'shipping_name' => $request->shipping_name,
                'shipping_address' => $request->shipping_address,
                'shipping_city' => $request->shipping_city,
                'shipping_state' => $request->shipping_state,
                'shipping_zip_code' => $request->shipping_zip_code,
                'shipping_country' => $request->shipping_country,
                'shipping_phone' => $request->shipping_phone,
                'payment_method' => $request->payment_method,
                'payment_status' => 'pending',
            ]);

            // Create order items
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'product_name' => $cartItem->product->name,
                    'product_image' => $cartItem->product->image,
                    'product_description' => $cartItem->product->description,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price,
                    'subtotal' => $cartItem->product->price * $cartItem->quantity,
                ]);
            }

            // Create initial status history
            OrderStatusHistory::create([
                'order_id' => $order->id,
                'status' => 'pending',
                'notes' => 'Order placed',
            ]);

            // Clear cart
            CartItem::where('user_id', $user->id)->delete();

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => [
                    'id' => $order->id,
                    'orderNumber' => $order->order_number,
                    'total' => $total,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create order'], 500);
        }
    }
}
