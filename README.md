# Technovation Shop

A modern e-commerce application built with Laravel and React, using Inertia.js for seamless server-side and client-side integration.

## Technology Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 18 with Inertia.js
- **UI Components**: Radix UI, Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Query (TanStack Query)

## Project Structure

### PHP Files (Backend)

All PHP application files are located in the `app/` directory:

- **Controllers**: `app/Http/Controllers/`
  - `AdminController.php` - Admin dashboard, products, orders, customers, and analytics management
  - `AuthController.php` - User authentication, registration, login, logout, and password reset
  - `CartController.php` - Shopping cart operations (add, update, remove, fetch)
  - `CheckoutController.php` - Order checkout and processing
  - `HomeController.php` - Home page with featured products and categories
  - `OrderController.php` - User order listing, details, and reviews
  - `ProductController.php` - Product catalog, details, filtering, and product reviews
  - `ProfileController.php` - User profile management
  - `Controller.php` - Base controller

- **Models**: `app/Models/`
  - `CartItem.php` - Shopping cart items
  - `Category.php` - Product categories
  - `Order.php` - Customer orders
  - `OrderItem.php` - Order line items
  - `OrderStatusHistory.php` - Order status tracking timeline
  - `Product.php` - Product catalog
  - `ProductImage.php` - Product images
  - `Review.php` - Product and order reviews
  - `User.php` - User accounts with admin support

- **Middleware**: `app/Http/Middleware/`
  - `EnsureUserIsAdmin.php` - Restricts admin routes to admin users only
  - `HandleInertiaRequests.php` - Inertia.js middleware for sharing data
  - `RedirectAdminToDashboard.php` - Redirects admin users from user routes to admin dashboard
  - `VerifyCsrfToken.php` - CSRF token verification (with API route exclusions)

- **Providers**: `app/Providers/`
  - `AppServiceProvider.php` - Application service provider

- **Routes**: `routes/web.php` - Web routes definition (public, authenticated, and admin routes)

- **Database**: `database/`
  - `migrations/` - Database migrations for all tables
  - `seeders/` - Database seeders (CategorySeeder, ProductSeeder, AdminUserSeeder)
  - `factories/` - Model factories

- **Tests**: `tests/`
  - `Feature/` - Feature tests
  - `Unit/` - Unit tests

### React Files (Frontend)

All React/JavaScript files are located in the `resources/js/` directory:

- **Main Entry**: `resources/js/app.jsx` - Main React application entry point
- **Layout**: `resources/js/Layout.jsx` - Main layout component

- **Pages**: `resources/js/pages/`
  - `Admin.jsx` - Admin panel router
  - `Auth.jsx` - Login and registration page
  - `Categories.jsx` - Category browsing page
  - `Checkout.jsx` - Checkout page
  - `ForgotPassword.jsx` - Password reset request page
  - `Index.jsx` - Home page
  - `NotFound.jsx` - 404 error page
  - `OrderDetail.jsx` - Individual order details page
  - `Orders.jsx` - User order history page
  - `ProductDetail.jsx` - Product detail page with reviews
  - `Products.jsx` - Product catalog page
  - `Profile.jsx` - User profile page
  - `ResetPassword.jsx` - Password reset form page
  - `admin/` - Admin-specific pages:
    - `AdminAnalytics.jsx` - Analytics dashboard
    - `AdminCustomers.jsx` - Customer management
    - `AdminDashboard.jsx` - Main admin dashboard
    - `AdminOrderDetail.jsx` - Admin order detail view
    - `AdminOrders.jsx` - Order management
    - `AdminProducts.jsx` - Product management
    - `AdminSettings.jsx` - Admin settings (placeholder)

- **Components**: `resources/js/components/`
  - `admin/AdminLayout.jsx` - Admin panel layout with sidebar
  - `cart/CartDrawer.jsx` - Shopping cart drawer component
  - `home/` - Home page components:
    - `CategorySection.jsx` - Category showcase
    - `FeaturedProducts.jsx` - Featured products display
    - `HeroSection.jsx` - Hero banner
    - `NewsletterSection.jsx` - Newsletter signup
    - `PromoSection.jsx` - Promotional content
  - `layout/` - Layout components:
    - `Footer.jsx` - Site footer
    - `Navbar.jsx` - Navigation bar
  - `products/ProductCard.jsx` - Product card component
  - `ui/` - Reusable UI components (Radix UI based):
    - `button.jsx` - Button component
    - `dialog.jsx` - Dialog/modal component
    - `dropdown-menu.jsx` - Dropdown menu component
    - `input.jsx` - Input field component
    - `sonner.jsx` - Toast notifications
    - `toast.jsx` - Toast component
    - `toaster.jsx` - Toast container
    - `tooltip.jsx` - Tooltip component
    - `use-toast.js` - Toast hook
  - `NavLink.jsx` - Navigation link component

- **Context**: `resources/js/context/`
  - `CartContext.jsx` - Shopping cart context provider with API integration

- **Hooks**: `resources/js/hooks/`
  - `use-mobile.jsx` - Mobile detection hook
  - `use-toast.js` - Toast notification hook

- **Data**: `resources/js/data/`
  - `products.js` - Static product data (legacy, now using backend data)

- **Utilities**: `resources/js/lib/`
  - `utils.js` - Utility functions (cn helper for classnames)
  - `csrf.js` - CSRF token helper

- **Configuration**: `resources/js/bootstrap.js` - Bootstrap configuration

### Views

- **Blade Templates**: `resources/views/`
  - `app.blade.php` - Main application template (Inertia.js root)
  - `welcome.blade.php` - Welcome page

### Assets

- **CSS**: `resources/css/app.css` - Main stylesheet
- **Public Assets**: `public/` - Publicly accessible files

## Getting Started

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js and npm
- MariaDB (MySQL-compatible database server)
- PHP extensions: PDO, PDO MySQL/MariaDB, OpenSSL, Mbstring, Tokenizer, XML, Ctype, JSON

#### Checking PHP Extensions

Before proceeding, verify that all required PHP extensions are installed and enabled:

**Quick Check:**
```bash
php -m
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yeexiong17/technovation-shop.git
cd technovation-shop
```

2. Install PHP dependencies:
```bash
composer install
```

3. Install JavaScript dependencies:
```bash
npm install
```

4. Set up environment:
```bash
cp .env.example .env
```

5. Create storage link (required for product images):
```bash
php artisan storage:link
```

This creates a symbolic link from `public/storage` to `storage/app/public`, making uploaded product images accessible via the web.

6. Set up database:
   - See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed MariaDB setup instructions
   - Configure your `.env` file with database credentials
   - Run migrations:
```bash
php artisan migrate
php artisan db:seed --class=CategorySeeder
php artisan db:seed --class=ProductSeeder
php artisan db:seed --class=AdminUserSeeder
```

## Development

### Running the Development Server

**Quick Start In Single Terminal (Recommended):**

Make the script executable:
```bash
chmod +x ./start-dev.sh
```
Use the convenience script to start both Laravel and Vite servers in a single terminal:
```bash
./start-dev.sh
```

This will start both the Laravel backend server and Vite dev server without needing to open multiple terminals. Press `Ctrl+C` to stop both servers.

To view the website, navigate to:
```bash
http://127.0.0.1:8000
```

**Alternative Options:**

Start all development services (Laravel server, queue worker, logs, and Vite):
```bash
composer run dev
```

Or run services individually in separate terminals:

- Laravel server: `php artisan serve`
- Vite dev server: `npm run dev`
- Queue worker: `php artisan queue:listen`
- Logs: `php artisan pail`

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
composer run test
```

Or:
```bash
php artisan test
```

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
