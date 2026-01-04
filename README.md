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
  - `HomeController.php` - Home page controller
  - `ProductController.php` - Product management controller
  - `Controller.php` - Base controller

- **Models**: `app/Models/`
  - `User.php` - User model

- **Middleware**: `app/Http/Middleware/`
  - `HandleInertiaRequests.php` - Inertia.js middleware

- **Providers**: `app/Providers/`
  - `AppServiceProvider.php` - Application service provider

- **Routes**: `routes/web.php` - Web routes definition

- **Database**: `database/`
  - `migrations/` - Database migrations
  - `seeders/` - Database seeders
  - `factories/` - Model factories

- **Tests**: `tests/`
  - `Feature/` - Feature tests
  - `Unit/` - Unit tests

### React Files (Frontend)

All React/JavaScript files are located in the `resources/js/` directory:

- **Main Entry**: `resources/js/app.jsx` - Main React application entry point
- **Layout**: `resources/js/Layout.jsx` - Main layout component

- **Pages**: `resources/js/pages/`
  - React page components (17 files) that correspond to routes

- **Components**: `resources/js/components/`
  - `admin/` - Admin panel components
  - `cart/` - Shopping cart components
  - `home/` - Home page components (5 files)
  - `layout/` - Layout components (2 files)
  - `products/` - Product-related components
  - `ui/` - Reusable UI components (9 files)
  - `NavLink.jsx` - Navigation link component

- **Context**: `resources/js/context/`
  - `CartContext.jsx` - Shopping cart context provider

- **Hooks**: `resources/js/hooks/`
  - `use-mobile.jsx` - Mobile detection hook
  - `use-toast.js` - Toast notification hook

- **Data**: `resources/js/data/`
  - `products.js` - Product data

- **Utilities**: `resources/js/lib/`
  - `utils.js` - Utility functions

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
- SQLite (or your preferred database)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
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
php artisan key:generate
```

5. Set up database:
```bash
php artisan migrate
```

6. Build assets:
```bash
npm run build
```

Or use the setup script:
```bash
composer run setup
```

## Development

### Running the Development Server

**Quick Start (Single Terminal):**

Make the script executable:
```bash
chmod +x ./start-dev.sh
```
Use the convenience script to start both Laravel and Vite servers in a single terminal:
```bash
./start-dev.sh
```

This will start both the Laravel backend server and Vite dev server without needing to open multiple terminals. Press `Ctrl+C` to stop both servers.

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

## Project Features

- Product catalog and management
- Shopping cart functionality
- User authentication
- Order management
- Admin dashboard
- Responsive design with Tailwind CSS

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
