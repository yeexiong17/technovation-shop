# Testing Guide for Laravel + Inertia.js App

## Prerequisites

Make sure you have:
- PHP 8.2+ installed
- Composer installed
- Node.js 18+ and npm installed

## Step 1: Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

## Step 2: Environment Setup

```bash
# Copy environment file (if not already done)
cp .env.example .env

# Generate application key
php artisan key:generate
```

## Step 3: Start Development Servers

You need **TWO terminals** running simultaneously:

### Terminal 1: Vite (Frontend Assets)
```bash
npm run dev
```
This will start Vite on `http://localhost:5173` (or similar)

### Terminal 2: Laravel (Backend Server)
```bash
php artisan serve
```
This will start Laravel on `http://localhost:8000`

## Step 4: Test the Application

1. Open your browser and go to: `http://localhost:8000`

2. Test these routes:
   - `/` - Home page
   - `/products` - Products listing
   - `/products/1` - Product detail (use any product ID)
   - `/categories` - Categories page
   - `/auth` - Authentication page
   - `/admin` - Admin dashboard

## Common Issues & Fixes

### Issue: "Vite manifest not found"
**Fix:** Make sure `npm run dev` is running in Terminal 1

### Issue: "Page component not found"
**Fix:** Check that the page file exists in `resources/js/pages/` with correct casing

### Issue: "Module not found"
**Fix:** Run `npm install` again to ensure all dependencies are installed

### Issue: "Route not found"
**Fix:** Clear Laravel cache:
```bash
php artisan route:clear
php artisan config:clear
php artisan cache:clear
```

## Expected Behavior

✅ All pages should load with the same design as before
✅ Navigation should work (no page refreshes)
✅ Cart functionality should work
✅ All components should render correctly

## If Everything Works

Once you've confirmed everything works, you can safely remove the `frontend/` folder (if it still exists):
```bash
rm -rf frontend/
```

