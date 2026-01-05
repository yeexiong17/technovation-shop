<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Redirect admins to admin dashboard
        $user = auth()->user();
        if ($user && $user->is_admin) {
            return redirect()->route('admin');
        }

        $featuredProducts = Product::where('featured', true)
            ->with('category')
            ->limit(4)
            ->get()
            ->map(function ($product) {
                return $this->formatProduct($product);
            });

        $categories = Category::all()->map(function ($category) {
            return [
                'id' => $category->slug,
                'name' => $category->name,
                'icon' => $category->icon,
                'count' => $category->products()->count(),
            ];
        });

        return Inertia::render('Index', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
        ]);
    }

    private function formatProduct($product)
    {
        // Format image URL - if it's already a full URL (external), use it as is
        // Otherwise, convert storage path to public URL
        $imageUrl = $product->image;
        if ($imageUrl && !str_starts_with($imageUrl, 'http')) {
            $imageUrl = asset('storage/' . $imageUrl);
        }
        
        return [
            'id' => (string) $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'price' => (float) $product->price,
            'originalPrice' => $product->original_price ? (float) $product->original_price : null,
            'image' => $imageUrl,
            'category' => $product->category->slug,
            'rating' => $product->rating ? (float) $product->rating : null,
            'reviews' => $product->reviews_count,
            'inStock' => $product->in_stock,
            'featured' => $product->featured,
            'badge' => $product->badge,
        ];
    }
}
