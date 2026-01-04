<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Products', [
            'category' => request('category'),
        ]);
    }

    public function show($id)
    {
        // Convert string ID to match product ID format (products use string IDs like "1", "2", etc.)
        return Inertia::render('ProductDetail', [
            'id' => (string) $id,
        ]);
    }
}

