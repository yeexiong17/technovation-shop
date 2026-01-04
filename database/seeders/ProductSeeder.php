<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Nova Pro Laptop',
                'description' => '16-inch M3 Pro chip, 18GB RAM, 512GB SSD. Perfect for professionals.',
                'price' => 1999,
                'original_price' => 2299,
                'image' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
                'category' => 'laptops',
                'rating' => 4.9,
                'reviews_count' => 2847,
                'in_stock' => true,
                'featured' => true,
                'badge' => 'Best Seller',
            ],
            [
                'name' => 'Quantum Phone X',
                'description' => '6.7-inch OLED, 256GB, 5G enabled. The future in your pocket.',
                'price' => 1199,
                'original_price' => 1399,
                'image' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
                'category' => 'smartphones',
                'rating' => 4.8,
                'reviews_count' => 5621,
                'in_stock' => true,
                'featured' => true,
                'badge' => 'New',
            ],
            [
                'name' => 'AeroSound Pro',
                'description' => 'Active noise cancellation, 40hr battery, premium audio experience.',
                'price' => 349,
                'original_price' => null,
                'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
                'category' => 'audio',
                'rating' => 4.7,
                'reviews_count' => 3892,
                'in_stock' => true,
                'featured' => true,
                'badge' => null,
            ],
            [
                'name' => 'GameStation Elite',
                'description' => '4K gaming console with 2TB storage and next-gen graphics.',
                'price' => 599,
                'original_price' => 699,
                'image' => 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600',
                'category' => 'gaming',
                'rating' => 4.9,
                'reviews_count' => 8234,
                'in_stock' => true,
                'featured' => true,
                'badge' => 'Hot',
            ],
            [
                'name' => 'MechKey Ultra',
                'description' => 'RGB mechanical keyboard with custom switches and aluminum frame.',
                'price' => 189,
                'original_price' => null,
                'image' => 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600',
                'category' => 'accessories',
                'rating' => 4.6,
                'reviews_count' => 1567,
                'in_stock' => true,
                'featured' => false,
                'badge' => null,
            ],
            [
                'name' => 'SmartWatch Pro',
                'description' => 'Health tracking, GPS, 7-day battery. Your health companion.',
                'price' => 449,
                'original_price' => 499,
                'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
                'category' => 'wearables',
                'rating' => 4.5,
                'reviews_count' => 2341,
                'in_stock' => true,
                'featured' => false,
                'badge' => 'Popular',
            ],
            [
                'name' => 'UltraBook Air',
                'description' => '13-inch, ultra-light design, all-day battery life.',
                'price' => 1299,
                'original_price' => null,
                'image' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
                'category' => 'laptops',
                'rating' => 4.7,
                'reviews_count' => 1823,
                'in_stock' => true,
                'featured' => false,
                'badge' => null,
            ],
            [
                'name' => 'BudsPro Wireless',
                'description' => 'True wireless earbuds with spatial audio and transparency mode.',
                'price' => 249,
                'original_price' => 279,
                'image' => 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600',
                'category' => 'audio',
                'rating' => 4.4,
                'reviews_count' => 4521,
                'in_stock' => true,
                'featured' => false,
                'badge' => null,
            ],
        ];

        foreach ($products as $productData) {
            $category = Category::where('slug', $productData['category'])->first();
            
            if ($category) {
                Product::updateOrCreate(
                    ['slug' => Str::slug($productData['name'])],
                    [
                        'name' => $productData['name'],
                        'slug' => Str::slug($productData['name']),
                        'description' => $productData['description'],
                        'price' => $productData['price'],
                        'original_price' => $productData['original_price'],
                        'image' => $productData['image'],
                        'category_id' => $category->id,
                        'rating' => $productData['rating'],
                        'reviews_count' => $productData['reviews_count'],
                        'in_stock' => $productData['in_stock'],
                        'stock_quantity' => $productData['in_stock'] ? 100 : 0,
                        'featured' => $productData['featured'],
                        'badge' => $productData['badge'],
                    ]
                );
            }
        }
    }
}
