<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Laptops', 'slug' => 'laptops', 'icon' => '💻', 'description' => 'High-performance laptops for work and play'],
            ['name' => 'Smartphones', 'slug' => 'smartphones', 'icon' => '📱', 'description' => 'Latest smartphones with cutting-edge technology'],
            ['name' => 'Audio', 'slug' => 'audio', 'icon' => '🎧', 'description' => 'Premium audio devices and accessories'],
            ['name' => 'Gaming', 'slug' => 'gaming', 'icon' => '🎮', 'description' => 'Gaming consoles and accessories'],
            ['name' => 'Accessories', 'slug' => 'accessories', 'icon' => '⌨️', 'description' => 'Tech accessories and peripherals'],
            ['name' => 'Wearables', 'slug' => 'wearables', 'icon' => '⌚', 'description' => 'Smart watches and fitness trackers'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
