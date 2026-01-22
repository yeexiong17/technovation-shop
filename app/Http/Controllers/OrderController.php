<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('auth');
        }

        $orders = Order::where('user_id', $user->id)
            ->with('orderItems.product')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return $this->formatOrder($order);
            });

        return Inertia::render('Orders', [
            'orders' => $orders,
        ]);
    }

    // Prevent IDOR in OWASP Top 10 vulnerability
    public function show(Request $request, $id)
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('auth');
        }

        // Convert ID to integer if it's numeric (handle both string and int IDs)
        $orderId = is_numeric($id) ? (int) $id : null;
        
        // Admins can view any order, regular users can only view their own
        $order = null;
        
        if ($orderId !== null) {
            // Try numeric ID first
            $query = Order::where('id', $orderId);
            if (!$user->is_admin) {
                $query->where('user_id', $user->id);
            }
            $order = $query->with(['orderItems.product', 'statusHistory', 'reviews'])->first();
        }
        
        // If not found by ID, try order number
        if (!$order && !empty($id)) {
            $query = Order::where('order_number', $id);
            if (!$user->is_admin) {
                $query->where('user_id', $user->id);
            }
            $order = $query->with(['orderItems.product', 'statusHistory', 'reviews'])->first();
        }

        if (!$order) {
            // Log for debugging (remove in production)
            \Log::warning('Order not found', [
                'user_id' => $user->id,
                'requested_id' => $id,
                'order_id_type' => gettype($orderId),
            ]);
            
            // Return a proper 404 response
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Order not found'], 404);
            }
            abort(404, 'Order not found');
        }

        return Inertia::render('OrderDetail', [
            'order' => $this->formatOrderDetail($order),
        ]);
    }

    private function formatOrder($order)
    {
        return [
            'id' => (string) $order->id, // Numeric ID for routes
            'orderNumber' => $order->order_number, // Display order number
            'date' => $order->created_at->setTimezone(config('app.timezone'))->format('Y-m-d'),
            'status' => $order->status,
            'total' => (float) $order->total,
            'items' => $order->orderItems->map(function ($item) {
                return [
                    'id' => (string) $item->product_id,
                    'name' => $item->product_name,
                    'image' => $item->product_image,
                    'quantity' => $item->quantity,
                    'price' => (float) $item->price,
                ];
            }),
            'trackingNumber' => $order->tracking_number,
        ];
    }

    private function formatOrderDetail($order)
    {
        $formatted = $this->formatOrder($order);
        
        $formatted['subtotal'] = (float) $order->subtotal;
        $formatted['shipping'] = (float) $order->shipping;
        $formatted['tax'] = (float) $order->tax;
        $formatted['shippingAddress'] = [
            'name' => $order->shipping_name,
            'address' => $order->shipping_address,
            'city' => $order->shipping_city,
            'state' => $order->shipping_state,
            'zipCode' => $order->shipping_zip_code,
            'country' => $order->shipping_country,
        ];
        $formatted['paymentMethod'] = $order->payment_method;
        $formatted['timeline'] = $order->statusHistory->map(function ($history) {
            // Explicitly convert from UTC to GMT (app timezone)
            // First ensure we're working with UTC, then convert to GMT
            $dateTime = $history->created_at->copy()->utc()->setTimezone(config('app.timezone'));
            return [
                'status' => $history->status,
                'date' => $dateTime->format('Y-m-d'),
                'time' => $dateTime->format('g:i A'),
            ];
        })->toArray();
        $formatted['items'] = $order->orderItems->map(function ($item) {
            return [
                'id' => (string) $item->product_id,
                'name' => $item->product_name,
                'image' => $item->product_image,
                'description' => $item->product_description,
                'quantity' => $item->quantity,
                'price' => (float) $item->price,
            ];
        });

        // Get review for this order (if exists)
        $user = Auth::user();
        if ($user) {
            $review = Review::where('order_id', $order->id)
                ->where('user_id', $user->id)
                ->first();
        } else {
            $review = null;
        }
        
        if ($review) {
            $formatted['review'] = [
                'id' => (string) $review->id,
                'rating' => (int) $review->rating,
                'comment' => $review->comment,
                'date' => $review->created_at->setTimezone(config('app.timezone'))->format('Y-m-d'),
            ];
        }

        return $formatted;
    }

    public function storeReview(Request $request, $id)
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect()->route('auth');
        }

        // Find order
        $order = null;
        if (is_numeric($id)) {
            $order = Order::where('id', (int) $id)
                ->where('user_id', $user->id)
                ->first();
        }
        
        if (!$order && !empty($id)) {
            $order = Order::where('order_number', $id)
                ->where('user_id', $user->id)
                ->first();
        }

        if (!$order) {
            return back()->withErrors(['order' => 'Order not found.']);
        }

        // Check if order is delivered
        if ($order->status !== 'delivered') {
            return back()->withErrors(['order' => 'You can only review delivered orders.']);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        // Get the first product from the order for the review
        $firstOrderItem = $order->orderItems->first();
        if (!$firstOrderItem) {
            return back()->withErrors(['order' => 'Order has no items.']);
        }

        $productId = $firstOrderItem->product_id;

        // Check if review already exists
        $existingReview = Review::where('order_id', $order->id)
            ->where('user_id', $user->id)
            ->first();

        DB::beginTransaction();
        try {
            if ($existingReview) {
                // Update existing review
                $existingReview->update([
                    'rating' => $validated['rating'],
                    'comment' => $validated['comment'],
                ]);
                $review = $existingReview;
            } else {
                // Create new review
                $review = Review::create([
                    'user_id' => $user->id,
                    'product_id' => $productId,
                    'order_id' => $order->id,
                    'rating' => $validated['rating'],
                    'comment' => $validated['comment'],
                ]);
            }

            // Update product rating
            $product = Product::find($productId);
            if ($product) {
                $reviews = Review::where('product_id', $productId)->get();
                $averageRating = $reviews->avg('rating');
                $reviewsCount = $reviews->count();
                
                $product->update([
                    'rating' => round($averageRating, 2),
                    'reviews_count' => $reviewsCount,
                ]);
            }

            DB::commit();

            return redirect()->route('orders.show', $order->id)->with('success', 'Thank you for your review!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['review' => 'Failed to submit review. Please try again.']);
        }
    }
}
