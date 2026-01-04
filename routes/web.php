<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');
Route::get('/categories', function () {
    return \Inertia\Inertia::render('Categories');
})->name('categories');
Route::get('/auth', function () {
    return \Inertia\Inertia::render('Auth');
})->name('auth');
Route::get('/profile', function () {
    return \Inertia\Inertia::render('Profile');
})->name('profile');
Route::get('/orders', function () {
    return \Inertia\Inertia::render('Orders');
})->name('orders');
Route::get('/orders/{id}', function ($id) {
    return \Inertia\Inertia::render('OrderDetail', ['id' => $id]);
})->name('orders.show');
Route::get('/checkout', function () {
    return \Inertia\Inertia::render('Checkout');
})->name('checkout');
Route::prefix('admin')->group(function () {
    Route::get('/', function () {
        return \Inertia\Inertia::render('Admin');
    })->name('admin');
    Route::get('/products', function () {
        return \Inertia\Inertia::render('Admin');
    })->name('admin.products');
    Route::get('/orders', function () {
        return \Inertia\Inertia::render('Admin');
    })->name('admin.orders');
    Route::get('/customers', function () {
        return \Inertia\Inertia::render('Admin');
    })->name('admin.customers');
    Route::get('/analytics', function () {
        return \Inertia\Inertia::render('Admin');
    })->name('admin.analytics');
    Route::get('/settings', function () {
        return \Inertia\Inertia::render('Admin');
    })->name('admin.settings');
});
