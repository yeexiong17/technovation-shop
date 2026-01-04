<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['items' => []]);
        }

        $cartItems = CartItem::where('user_id', $user->id)
            ->with('product.category')
            ->get()
            ->map(function ($item) {
                return $this->formatCartItem($item);
            });

        return response()->json([
            'items' => $cartItems,
            'totalItems' => $cartItems->sum('quantity'),
            'totalPrice' => $cartItems->sum(function ($item) {
                return $item['price'] * $item['quantity'];
            }),
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Authentication required'], 401);
        }

        try {
            $request->validate([
                'product_id' => 'required|exists:products,id',
                'quantity' => 'nullable|integer|min:1',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        $productId = (int) $request->product_id;
        $product = Product::find($productId);
        
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        if (!$product->in_stock) {
            return response()->json(['error' => 'Product is out of stock'], 400);
        }

        // Get existing cart item or create new one
        $existingItem = CartItem::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        if ($existingItem) {
            // Update quantity by adding to existing
            $existingItem->increment('quantity', $request->quantity ?? 1);
            $cartItem = $existingItem->fresh();
        } else {
            // Create new cart item
            $cartItem = CartItem::create([
                'user_id' => $user->id,
                'product_id' => $product->id,
                'quantity' => $request->quantity ?? 1,
            ]);
        }

        return response()->json([
            'message' => 'Item added to cart',
            'item' => $this->formatCartItem($cartItem->load('product.category')),
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Authentication required'], 401);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = CartItem::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $cartItem->update(['quantity' => $request->quantity]);

        return response()->json([
            'message' => 'Cart item updated',
            'item' => $this->formatCartItem($cartItem->load('product.category')),
        ]);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Authentication required'], 401);
        }

        $cartItem = CartItem::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $cartItem->delete();

        return response()->json(['message' => 'Item removed from cart']);
    }

    private function formatCartItem($item)
    {
        $product = $item->product;
        return [
            'id' => (string) $item->id,
            'product_id' => (string) $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'price' => (float) $product->price,
            'originalPrice' => $product->original_price ? (float) $product->original_price : null,
            'image' => $product->image,
            'category' => $product->category->slug,
            'quantity' => $item->quantity,
        ];
    }
}
