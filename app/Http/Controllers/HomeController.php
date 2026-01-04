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
}
