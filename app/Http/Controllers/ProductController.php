<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
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
}
