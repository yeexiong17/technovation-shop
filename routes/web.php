<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// Public routes (only home and auth)
Route::get('/', [HomeController::class, 'index'])->name('home');

// Auth routes (public so users can log in)
Route::get('/auth', [\App\Http\Controllers\AuthController::class, 'show'])->name('auth');
Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login'])->name('login');
Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register'])->name('register');
Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout'])->name('logout');

// Redirect login GET to auth (for compatibility)
Route::get('/login', function () {
    return redirect()->route('auth');
});

// All other routes require authentication
Route::middleware('auth')->group(function () {
    // Redirect admins to admin dashboard if they try to access regular pages
    Route::middleware(\App\Http\Middleware\RedirectAdminToDashboard::class)->group(function () {
        // Product routes
        Route::get('/products', [ProductController::class, 'index'])->name('products.index');
        Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');
        Route::post('/products/{id}/review', [ProductController::class, 'storeReview'])->name('products.review');
        
        // Category route
        Route::get('/categories', function () {
            return \Inertia\Inertia::render('Categories');
        })->name('categories');
        
        // Profile routes
        Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'show'])->name('profile');
        Route::put('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
        
        // Order routes
        Route::get('/orders', [OrderController::class, 'index'])->name('orders');
        Route::get('/orders/{id}', [OrderController::class, 'show'])->name('orders.show');
        Route::post('/orders/{id}/review', [OrderController::class, 'storeReview'])->name('orders.review');
        
        // Checkout route
        Route::get('/checkout', function () {
            return \Inertia\Inertia::render('Checkout');
        })->name('checkout');
        
        // Cart API routes
        Route::prefix('api/cart')->group(function () {
            Route::get('/', [CartController::class, 'index']);
            Route::post('/', [CartController::class, 'store']);
            Route::put('/{id}', [CartController::class, 'update']);
            Route::delete('/{id}', [CartController::class, 'destroy']);
        });
        
        // Checkout API routes
        Route::prefix('api/checkout')->group(function () {
            Route::get('/', [CheckoutController::class, 'index']);
            Route::post('/', [CheckoutController::class, 'store']);
        });
    });
    
    // Admin routes (only accessible to admins)
    Route::prefix('admin')->middleware(\App\Http\Middleware\EnsureUserIsAdmin::class)->group(function () {
        Route::get('/', [\App\Http\Controllers\AdminController::class, 'dashboard'])->name('admin');
        Route::get('/products', [\App\Http\Controllers\AdminController::class, 'products'])->name('admin.products');
        Route::post('/products', [\App\Http\Controllers\AdminController::class, 'storeProduct'])->name('admin.products.store');
        Route::put('/products/{id}', [\App\Http\Controllers\AdminController::class, 'updateProduct'])->name('admin.products.update');
        Route::get('/orders', [\App\Http\Controllers\AdminController::class, 'orders'])->name('admin.orders');
        Route::get('/orders/{id}', [\App\Http\Controllers\AdminController::class, 'showOrder'])->name('admin.orders.show');
        Route::put('/orders/{id}/status', [\App\Http\Controllers\AdminController::class, 'updateOrderStatus'])->name('admin.orders.updateStatus');
        Route::put('/orders/{id}/tracking', [\App\Http\Controllers\AdminController::class, 'updateTrackingNumber'])->name('admin.orders.updateTracking');
        Route::get('/customers', [\App\Http\Controllers\AdminController::class, 'customers'])->name('admin.customers');
        Route::get('/analytics', [\App\Http\Controllers\AdminController::class, 'analytics'])->name('admin.analytics');
        Route::get('/settings', function () {
            return \Inertia\Inertia::render('Admin');
        })->name('admin.settings');
    });
});
