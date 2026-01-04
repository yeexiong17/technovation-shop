<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        // Filter by category
        if ($request->has('category') && $request->category !== 'all') {
            $category = Category::where('slug', $request->category)->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $products = $query->get()->map(function ($product) {
            return $this->formatProduct($product);
        });

        $categories = Category::all()->map(function ($category) {
            return [
                'id' => $category->slug,
                'name' => $category->name,
                'icon' => $category->icon,
            ];
        });

        return Inertia::render('Products', [
            'products' => $products,
            'categories' => $categories,
            'category' => $request->category,
        ]);
    }

    public function show($id)
    {
        $product = Product::with(['category', 'reviews.user', 'images'])
            ->findOrFail($id);

        // Get related products from the same category
        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get()
            ->map(function ($p) {
                return $this->formatProduct($p);
            });

        return Inertia::render('ProductDetail', [
            'product' => $this->formatProductDetail($product),
            'relatedProducts' => $relatedProducts,
        ]);
    }

    private function formatProduct($product)
    {
        return [
            'id' => (string) $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'price' => (float) $product->price,
            'originalPrice' => $product->original_price ? (float) $product->original_price : null,
            'image' => $product->image,
            'category' => $product->category->slug,
            'rating' => $product->rating ? (float) $product->rating : null,
            'reviews' => $product->reviews_count,
            'inStock' => $product->in_stock,
            'featured' => $product->featured,
            'badge' => $product->badge,
        ];
    }

    private function formatProductDetail($product)
    {
        $formatted = $this->formatProduct($product);
        
        // Add additional detail fields
        $formatted['slug'] = $product->slug;
        $formatted['stockQuantity'] = $product->stock_quantity;
        // Format reviews properly - ensure it's always an array
        $reviews = [];
        if ($product->relationLoaded('reviews') && $product->reviews) {
            $reviewsCollection = $product->reviews;
            if (is_countable($reviewsCollection) && count($reviewsCollection) > 0) {
                foreach ($reviewsCollection as $review) {
                    if ($review && is_object($review)) {
                        $reviews[] = [
                            'id' => (string) ($review->id ?? ''),
                            'userId' => ($review->user && isset($review->user->id)) ? (string) $review->user->id : null,
                            'userName' => ($review->user && isset($review->user->name)) ? (string) $review->user->name : 'Anonymous',
                            'rating' => isset($review->rating) ? (int) $review->rating : 0,
                            'comment' => isset($review->comment) ? (string) $review->comment : '',
                            'date' => ($review->created_at && method_exists($review->created_at, 'format')) 
                                ? $review->created_at->format('Y-m-d') 
                                : (isset($review->created_at) ? (string) $review->created_at : date('Y-m-d')),
                            'verified' => isset($review->order_id) && $review->order_id !== null && $review->order_id !== '',
                        ];
                    }
                }
            }
        }
        $formatted['reviews'] = $reviews;
        $formatted['images'] = $product->images->map(function ($image) {
            return $image->image_path;
        })->toArray();

        return $formatted;
    }

    public function storeReview(Request $request, $id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        // Check if review already exists for this user and product (without order_id)
        $existingReview = Review::where('product_id', $product->id)
            ->where('user_id', $user->id)
            ->whereNull('order_id')
            ->first();

        DB::beginTransaction();
        try {
            if ($existingReview) {
                // Update existing review
                $existingReview->update([
                    'rating' => $validated['rating'],
                    'comment' => $validated['comment'],
                ]);
            } else {
                // Create new review
                Review::create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'order_id' => null, // Product reviews don't require an order
                    'rating' => $validated['rating'],
                    'comment' => $validated['comment'],
                ]);
            }

            // Update product rating
            $reviews = Review::where('product_id', $product->id)->get();
            $averageRating = $reviews->avg('rating');
            $reviewsCount = $reviews->count();
            
            $product->update([
                'rating' => round($averageRating, 2),
                'reviews_count' => $reviewsCount,
            ]);

            DB::commit();

            // Reload product with reviews for the response
            $product->refresh();
            $product->load(['category', 'reviews.user', 'images']);

            // Get related products
            $relatedProducts = Product::where('category_id', $product->category_id)
                ->where('id', '!=', $product->id)
                ->limit(4)
                ->get()
                ->map(function ($p) {
                    return $this->formatProduct($p);
                });

            return redirect()->route('products.show', $product->id)
                ->with('success', 'Thank you for your review!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['review' => 'Failed to submit review. Please try again.']);
        }
    }
}
