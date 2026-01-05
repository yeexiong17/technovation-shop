<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\OrderItem;
use App\Models\Category;
use App\Models\OrderStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        
        // Check if user is admin
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized access');
        }

        // Calculate statistics
        $totalRevenue = Order::sum('total');
        $totalOrders = Order::count();
        $activeUsers = User::where('is_admin', false)->count();
        
        // Calculate conversion rate (users with orders / total users)
        $usersWithOrders = User::whereHas('orders')->where('is_admin', false)->count();
        $conversionRate = $activeUsers > 0 ? ($usersWithOrders / $activeUsers) * 100 : 0;

        // Get recent orders (last 5)
        $recentOrders = Order::with(['user', 'orderItems.product'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                $firstItem = $order->orderItems->first();
                return [
                    'id' => '#' . $order->order_number,
                    'customer' => $order->user->name ?? $order->shipping_name,
                    'product' => $firstItem ? $firstItem->product_name : 'N/A',
                    'amount' => '$' . number_format($order->total, 2),
                    'status' => ucfirst($order->status),
                ];
            });

        // Get top products (by quantity sold)
        $topProducts = OrderItem::select('product_id', 'product_name', 'product_image', DB::raw('SUM(quantity) as total_sold'), DB::raw('SUM(subtotal) as total_revenue'))
            ->groupBy('product_id', 'product_name', 'product_image')
            ->orderBy('total_sold', 'desc')
            ->limit(4)
            ->get()
            ->map(function ($item) {
                // Get current price from product if available
                $product = Product::find($item->product_id);
                return [
                    'id' => (string) $item->product_id,
                    'name' => $item->product_name,
                    'image' => $item->product_image,
                    'price' => $product ? (float) $product->price : 0,
                    'sold' => (int) $item->total_sold,
                ];
            });

        // Calculate percentage changes (comparing last 30 days to previous 30 days)
        $now = now();
        $last30Days = $now->copy()->subDays(30);
        $previous30Days = $last30Days->copy()->subDays(30);

        $revenueLast30 = Order::where('created_at', '>=', $last30Days)->sum('total');
        $revenuePrevious30 = Order::whereBetween('created_at', [$previous30Days, $last30Days])->sum('total');
        $revenueChange = $revenuePrevious30 > 0 ? (($revenueLast30 - $revenuePrevious30) / $revenuePrevious30) * 100 : 0;

        $ordersLast30 = Order::where('created_at', '>=', $last30Days)->count();
        $ordersPrevious30 = Order::whereBetween('created_at', [$previous30Days, $last30Days])->count();
        $ordersChange = $ordersPrevious30 > 0 ? (($ordersLast30 - $ordersPrevious30) / $ordersPrevious30) * 100 : 0;

        $usersLast30 = User::where('created_at', '>=', $last30Days)->where('is_admin', false)->count();
        $usersPrevious30 = User::whereBetween('created_at', [$previous30Days, $last30Days])->where('is_admin', false)->count();
        $usersChange = $usersPrevious30 > 0 ? (($usersLast30 - $usersPrevious30) / $usersPrevious30) * 100 : 0;

        // Conversion rate change (simplified - could be improved)
        $conversionLast30 = $usersLast30 > 0 ? (User::whereHas('orders', function($q) use ($last30Days) {
            $q->where('created_at', '>=', $last30Days);
        })->where('is_admin', false)->count() / $usersLast30) * 100 : 0;
        $conversionPrevious30 = $usersPrevious30 > 0 ? (User::whereHas('orders', function($q) use ($previous30Days, $last30Days) {
            $q->whereBetween('created_at', [$previous30Days, $last30Days]);
        })->where('is_admin', false)->count() / $usersPrevious30) * 100 : 0;
        $conversionChange = $conversionPrevious30 > 0 ? $conversionLast30 - $conversionPrevious30 : 0;

        return Inertia::render('Admin', [
            'dashboard' => [
                'stats' => [
                    [
                        'label' => 'Total Revenue',
                        'value' => '$' . number_format($totalRevenue, 2),
                        'change' => ($revenueChange >= 0 ? '+' : '') . number_format($revenueChange, 1) . '%',
                        'positive' => $revenueChange >= 0,
                    ],
                    [
                        'label' => 'Total Orders',
                        'value' => number_format($totalOrders),
                        'change' => ($ordersChange >= 0 ? '+' : '') . number_format($ordersChange, 1) . '%',
                        'positive' => $ordersChange >= 0,
                    ],
                    [
                        'label' => 'Active Users',
                        'value' => number_format($activeUsers),
                        'change' => ($usersChange >= 0 ? '+' : '') . number_format($usersChange, 1) . '%',
                        'positive' => $usersChange >= 0,
                    ],
                    [
                        'label' => 'Conversion Rate',
                        'value' => number_format($conversionRate, 1) . '%',
                        'change' => ($conversionChange >= 0 ? '+' : '') . number_format($conversionChange, 1) . '%',
                        'positive' => $conversionChange >= 0,
                    ],
                ],
                'recentOrders' => $recentOrders,
                'topProducts' => $topProducts,
            ],
        ]);
    }

    public function orders()
    {
        $user = Auth::user();
        
        // Check if user is admin
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized access');
        }

        // Get all orders with user and order items
        $orders = Order::with(['user', 'orderItems'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->order_number,
                    'customer' => $order->user->name ?? $order->shipping_name,
                    'email' => $order->user->email ?? '',
                    'date' => $order->created_at->setTimezone(config('app.timezone'))->format('Y-m-d'),
                    'status' => $order->status,
                    'total' => (float) $order->total,
                    'items' => $order->orderItems->sum('quantity'),
                    'orderId' => $order->id, // Numeric ID for linking
                ];
            });

        return Inertia::render('Admin', [
            'orders' => $orders,
        ]);
    }

    public function showOrder($id)
    {
        $user = Auth::user();
        
        // Check if user is admin
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized access');
        }

        // Find order by ID or order number
        $order = null;
        if (is_numeric($id)) {
            $order = Order::where('id', (int) $id)
                ->with(['user', 'orderItems', 'statusHistory'])
                ->first();
        }
        
        if (!$order && !empty($id)) {
            $order = Order::where('order_number', $id)
                ->with(['user', 'orderItems', 'statusHistory'])
                ->first();
        }

        if (!$order) {
            abort(404, 'Order not found');
        }

        return Inertia::render('Admin', [
            'order' => $this->formatAdminOrderDetail($order),
        ]);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $user = Auth::user();
        
        // Check if user is admin
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized access');
        }

        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'notes' => 'nullable|string|max:500',
            'trackingNumber' => 'nullable|string|max:100',
        ]);

        // Update order status
        $order->status = $validated['status'];
        if (isset($validated['trackingNumber']) && $validated['trackingNumber']) {
            $order->tracking_number = $validated['trackingNumber'];
        }
        $order->save();

        // Create status history entry
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? null,
        ]);

        // Reload order with relationships
        $order->load(['user', 'orderItems', 'statusHistory']);

        return redirect()->route('admin.orders.show', $order->id);
    }

    public function updateTrackingNumber(Request $request, $id)
    {
        $user = Auth::user();
        
        // Check if user is admin
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized access');
        }

        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'trackingNumber' => 'nullable|string|max:100',
        ]);

        $order->tracking_number = $validated['trackingNumber'] ?? null;
        $order->save();

        // Reload order with relationships
        $order->load(['user', 'orderItems', 'statusHistory']);

        return redirect()->route('admin.orders.show', $order->id);
    }

    private function formatAdminOrderDetail($order)
    {
        return [
            'id' => (string) $order->id,
            'orderNumber' => $order->order_number,
            'date' => $order->created_at->setTimezone(config('app.timezone'))->format('Y-m-d'),
            'status' => $order->status,
            'total' => (float) $order->total,
            'subtotal' => (float) $order->subtotal,
            'shipping' => (float) $order->shipping,
            'tax' => (float) $order->tax,
            'trackingNumber' => $order->tracking_number,
            'paymentMethod' => $order->payment_method,
            'paymentStatus' => $order->payment_status,
            'customer' => $order->user ? [
                'name' => $order->user->name,
                'email' => $order->user->email,
                'phone' => $order->user->phone,
            ] : null,
            'shippingAddress' => [
                'name' => $order->shipping_name,
                'address' => $order->shipping_address,
                'city' => $order->shipping_city,
                'state' => $order->shipping_state,
                'zipCode' => $order->shipping_zip_code,
                'country' => $order->shipping_country,
            ],
            'items' => $order->orderItems->map(function ($item) {
                return [
                    'id' => (string) $item->product_id,
                    'name' => $item->product_name,
                    'image' => $item->product_image,
                    'description' => $item->product_description,
                    'quantity' => $item->quantity,
                    'price' => (float) $item->price,
                ];
            }),
            'timeline' => $order->statusHistory->map(function ($history) {
                $dateTime = $history->created_at->setTimezone(config('app.timezone'));
                return [
                    'status' => $history->status,
                    'date' => $dateTime->format('Y-m-d'),
                    'time' => $dateTime->format('g:i A'),
                    'notes' => $history->notes,
                ];
            })->sortBy('created_at')->values()->toArray(),
        ];
    }

    public function customers()
    {
        $user = Auth::user();
        
        // Check if user is admin
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized access');
        }

        // Get all non-admin users with their order statistics
        $customers = User::where('is_admin', false)
            ->withCount('orders')
            ->withSum('orders', 'total')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => (string) $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone ?? 'N/A',
                    'joinDate' => $customer->created_at->setTimezone(config('app.timezone'))->format('Y-m-d'),
                    'totalOrders' => (int) $customer->orders_count,
                    'totalSpent' => (float) ($customer->orders_sum_total ?? 0),
                    'status' => 'active', // All customers are active by default
                ];
            });

        // Calculate statistics
        $totalCustomers = $customers->count();
        $activeCustomers = $customers->count(); // All are active for now
        $totalOrders = $customers->sum('totalOrders');
        $totalRevenue = $customers->sum('totalSpent');

        return Inertia::render('Admin', [
            'customers' => $customers,
            'customerStats' => [
                'totalCustomers' => $totalCustomers,
                'activeCustomers' => $activeCustomers,
                'totalOrders' => $totalOrders,
                'totalRevenue' => $totalRevenue,
            ],
        ]);
    }

    public function analytics()
    {
        $user = Auth::user();
        
        // Check if user is admin
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized access');
        }

        $now = now();
        $last30Days = $now->copy()->subDays(30);
        $previous30Days = $last30Days->copy()->subDays(30);

        // Calculate main statistics
        $totalRevenue = Order::sum('total');
        $totalOrders = Order::count();
        $activeUsers = User::where('is_admin', false)->count();
        
        // Calculate conversion rate
        $usersWithOrders = User::whereHas('orders')->where('is_admin', false)->count();
        $conversionRate = $activeUsers > 0 ? ($usersWithOrders / $activeUsers) * 100 : 0;

        // Calculate changes (last 30 days vs previous 30 days)
        $revenueLast30 = Order::where('created_at', '>=', $last30Days)->sum('total');
        $revenuePrevious30 = Order::whereBetween('created_at', [$previous30Days, $last30Days])->sum('total');
        $revenueChange = $revenuePrevious30 > 0 ? (($revenueLast30 - $revenuePrevious30) / $revenuePrevious30) * 100 : 0;

        $ordersLast30 = Order::where('created_at', '>=', $last30Days)->count();
        $ordersPrevious30 = Order::whereBetween('created_at', [$previous30Days, $last30Days])->count();
        $ordersChange = $ordersPrevious30 > 0 ? (($ordersLast30 - $ordersPrevious30) / $ordersPrevious30) * 100 : 0;

        $usersLast30 = User::where('created_at', '>=', $last30Days)->where('is_admin', false)->count();
        $usersPrevious30 = User::whereBetween('created_at', [$previous30Days, $last30Days])->where('is_admin', false)->count();
        $usersChange = $usersPrevious30 > 0 ? (($usersLast30 - $usersPrevious30) / $usersPrevious30) * 100 : 0;

        $conversionLast30 = $usersLast30 > 0 ? (User::whereHas('orders', function($q) use ($last30Days) {
            $q->where('created_at', '>=', $last30Days);
        })->where('is_admin', false)->count() / $usersLast30) * 100 : 0;
        $conversionPrevious30 = $usersPrevious30 > 0 ? (User::whereHas('orders', function($q) use ($previous30Days, $last30Days) {
            $q->whereBetween('created_at', [$previous30Days, $last30Days]);
        })->where('is_admin', false)->count() / $usersPrevious30) * 100 : 0;
        $conversionChange = $conversionPrevious30 > 0 ? $conversionLast30 - $conversionPrevious30 : 0;

        // Get monthly revenue data (last 6 months)
        $salesData = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthStart = $now->copy()->subMonths($i)->startOfMonth();
            $monthEnd = $now->copy()->subMonths($i)->endOfMonth();
            $monthRevenue = Order::whereBetween('created_at', [$monthStart, $monthEnd])->sum('total');
            $salesData[] = [
                'month' => $monthStart->format('M'),
                'sales' => (float) $monthRevenue,
            ];
        }

        // Get top selling products
        $topProducts = OrderItem::select('product_id', 'product_name', DB::raw('SUM(quantity) as total_sold'), DB::raw('SUM(subtotal) as total_revenue'))
            ->groupBy('product_id', 'product_name')
            ->orderBy('total_sold', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->product_name,
                    'sales' => (int) $item->total_sold,
                    'revenue' => (float) $item->total_revenue,
                ];
            });

        // Calculate average order value
        $avgOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;
        $avgOrderValueLast30 = $ordersLast30 > 0 ? $revenueLast30 / $ordersLast30 : 0;
        $avgOrderValuePrevious30 = $ordersPrevious30 > 0 ? $revenuePrevious30 / $ordersPrevious30 : 0;
        $avgOrderValueChange = $avgOrderValuePrevious30 > 0 ? (($avgOrderValueLast30 - $avgOrderValuePrevious30) / $avgOrderValuePrevious30) * 100 : 0;

        // Calculate customer lifetime value (average total spent per customer)
        $customerLifetimeValue = $activeUsers > 0 ? $totalRevenue / $activeUsers : 0;
        $customerLifetimeValueLast30 = $usersLast30 > 0 ? $revenueLast30 / $usersLast30 : 0;
        $customerLifetimeValuePrevious30 = $usersPrevious30 > 0 ? $revenuePrevious30 / $usersPrevious30 : 0;
        $customerLifetimeValueChange = $customerLifetimeValuePrevious30 > 0 ? (($customerLifetimeValueLast30 - $customerLifetimeValuePrevious30) / $customerLifetimeValuePrevious30) * 100 : 0;

        // Return rate (placeholder - would need returns/refunds data)
        $returnRate = 0; // Would need a returns table to calculate this
        $returnRateChange = 0;

        return Inertia::render('Admin', [
            'analytics' => [
                'stats' => [
                    [
                        'label' => 'Total Revenue',
                        'value' => '$' . number_format($totalRevenue, 2),
                        'change' => ($revenueChange >= 0 ? '+' : '') . number_format($revenueChange, 1) . '%',
                        'changeValue' => $revenueChange,
                        'positive' => $revenueChange >= 0,
                    ],
                    [
                        'label' => 'Total Orders',
                        'value' => number_format($totalOrders),
                        'change' => ($ordersChange >= 0 ? '+' : '') . number_format($ordersChange, 1) . '%',
                        'changeValue' => $ordersChange,
                        'positive' => $ordersChange >= 0,
                    ],
                    [
                        'label' => 'Active Users',
                        'value' => number_format($activeUsers),
                        'change' => ($usersChange >= 0 ? '+' : '') . number_format($usersChange, 1) . '%',
                        'changeValue' => $usersChange,
                        'positive' => $usersChange >= 0,
                    ],
                    [
                        'label' => 'Conversion Rate',
                        'value' => number_format($conversionRate, 1) . '%',
                        'change' => ($conversionChange >= 0 ? '+' : '') . number_format($conversionChange, 1) . '%',
                        'changeValue' => $conversionChange,
                        'positive' => $conversionChange >= 0,
                    ],
                ],
                'salesData' => $salesData,
                'topProducts' => $topProducts,
                'metrics' => [
                    [
                        'label' => 'Average Order Value',
                        'value' => '$' . number_format($avgOrderValue, 2),
                        'change' => ($avgOrderValueChange >= 0 ? '+' : '') . number_format($avgOrderValueChange, 1) . '%',
                        'positive' => $avgOrderValueChange >= 0,
                    ],
                    [
                        'label' => 'Customer Lifetime Value',
                        'value' => '$' . number_format($customerLifetimeValue, 2),
                        'change' => ($customerLifetimeValueChange >= 0 ? '+' : '') . number_format($customerLifetimeValueChange, 1) . '%',
                        'positive' => $customerLifetimeValueChange >= 0,
                    ],
                    [
                        'label' => 'Return Rate',
                        'value' => number_format($returnRate, 1) . '%',
                        'change' => ($returnRateChange >= 0 ? '+' : '') . number_format($returnRateChange, 1) . '%',
                        'positive' => $returnRateChange <= 0, // Lower is better for return rate
                    ],
                ],
            ],
        ]);
    }

    public function products()
    {
        $user = Auth::user();
        
        // Check if user is admin
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized access');
        }

        // Get all products with their categories
        $products = Product::with('category')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => (string) $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => (float) $product->price,
                    'originalPrice' => $product->original_price ? (float) $product->original_price : null,
                    'image' => $product->image ? (str_starts_with($product->image, 'http') ? $product->image : asset('storage/' . $product->image)) : null,
                    'category' => $product->category->slug ?? 'uncategorized',
                    'categoryName' => $product->category->name ?? 'Uncategorized',
                    'inStock' => $product->in_stock,
                    'stockQuantity' => $product->stock_quantity ?? 0,
                    'featured' => $product->featured,
                    'badge' => $product->badge,
                    'rating' => $product->rating ? (float) $product->rating : 0,
                    'reviews' => $product->reviews_count ?? 0,
                ];
            });

        // Get all categories for the form
        $categories = Category::all()->map(function ($category) {
            return [
                'slug' => $category->slug,
                'name' => $category->name,
            ];
        });

        return Inertia::render('Admin', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function storeProduct(Request $request)
    {
        $user = Auth::user();
        
        // Check if user is admin
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized access');
        }

        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'originalPrice' => 'nullable|numeric|min:0',
            'category' => 'required|string|exists:categories,slug',
            'inStock' => 'nullable|in:0,1,true,false',
            'featured' => 'nullable|in:0,1,true,false',
            'badge' => 'nullable|string|max:50',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        // Get category
        $category = Category::where('slug', $validated['category'])->first();
        if (!$category) {
            return back()->withErrors(['category' => 'Invalid category selected.']);
        }

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = Str::random(40) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('products', $imageName, 'public');
        }

        // Convert inStock and featured to boolean
        $inStock = filter_var($validated['inStock'] ?? true, FILTER_VALIDATE_BOOLEAN);
        $featured = filter_var($validated['featured'] ?? false, FILTER_VALIDATE_BOOLEAN);

        // Create product
        $product = Product::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . Str::random(6),
            'description' => $validated['description'],
            'price' => $validated['price'],
            'original_price' => $validated['originalPrice'] ?? null,
            'image' => $imagePath,
            'category_id' => $category->id,
            'in_stock' => $inStock,
            'stock_quantity' => $inStock ? 100 : 0,
            'featured' => $featured,
            'badge' => $validated['badge'] ?? null,
            'rating' => 0,
            'reviews_count' => 0,
        ]);

        return redirect()->route('admin.products')->with('success', 'Product created successfully!');
    }

    public function updateProduct(Request $request, $id)
    {
        $user = Auth::user();
        
        // Check if user is admin
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized access');
        }

        $product = Product::findOrFail($id);

        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'originalPrice' => 'nullable|numeric|min:0',
            'category' => 'required|string|exists:categories,slug',
            'inStock' => 'nullable|in:0,1,true,false',
            'featured' => 'nullable|in:0,1,true,false',
            'badge' => 'nullable|string|max:50',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max, optional for updates
        ]);

        // Get category
        $category = Category::where('slug', $validated['category'])->first();
        if (!$category) {
            return back()->withErrors(['category' => 'Invalid category selected.']);
        }

        // Handle image upload (only if new image is provided)
        $imagePath = $product->image; // Keep existing image by default
        if ($request->hasFile('image')) {
            // Delete old image if it exists and is not an external URL
            if ($product->image && !str_starts_with($product->image, 'http')) {
                Storage::disk('public')->delete($product->image);
            }
            
            $image = $request->file('image');
            $imageName = Str::random(40) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('products', $imageName, 'public');
        }

        // Convert inStock and featured to boolean
        $inStock = filter_var($validated['inStock'] ?? true, FILTER_VALIDATE_BOOLEAN);
        $featured = filter_var($validated['featured'] ?? false, FILTER_VALIDATE_BOOLEAN);

        // Update product (keep original slug to maintain URLs)
        $product->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'original_price' => $validated['originalPrice'] ?? null,
            'image' => $imagePath,
            'category_id' => $category->id,
            'in_stock' => $inStock,
            'stock_quantity' => $inStock ? ($product->stock_quantity > 0 ? $product->stock_quantity : 100) : 0,
            'featured' => $featured,
            'badge' => $validated['badge'] ?? null,
        ]);

        return redirect()->route('admin.products')->with('success', 'Product updated successfully!');
    }
}
