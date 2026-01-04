# Database Setup Guide for MariaDB

This guide will help you set up MariaDB for the Technovation Shop application.

## Prerequisites

- MariaDB server installed and running
- PHP with PDO MySQL/MariaDB extension enabled
- Composer installed

## Step 1: Install MariaDB (if not already installed)

### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install mariadb-server
sudo systemctl start mariadb
sudo systemctl enable mariadb
```

### On macOS (using Homebrew):
```bash
brew install mariadb
brew services start mariadb
```

### On Windows:
Download and install from [MariaDB Downloads](https://mariadb.org/download/)

## Step 2: Create Database and User

1. Log in to MariaDB as root:
```bash
sudo mysql -u root -p
```

2. Create the database:
```sql
CREATE DATABASE technovation_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Create a database user (replace `your_username` and `your_password` with your desired credentials):
```sql
CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON technovation_shop.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 3: Configure Laravel Environment

1. Copy the `.env.example` file to `.env` if you haven't already:
```bash
cp .env.example .env
```

2. Update your `.env` file with MariaDB connection details:
```env
DB_CONNECTION=mariadb
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=technovation_shop
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## Step 4: Run Migrations

1. Make sure you have generated the application key:
```bash
php artisan key:generate
```

2. Run the migrations to create all database tables:
```bash
php artisan migrate
```

This will create the following tables:
- `users` (with extended profile fields)
- `categories`
- `products`
- `cart_items`
- `orders`
- `order_items`
- `order_status_history`
- `reviews`
- `product_images`

## Step 5: (Optional) Seed Initial Data

You can create seeders to populate initial data:

```bash
php artisan make:seeder CategorySeeder
php artisan make:seeder ProductSeeder
```

Then run:
```bash
php artisan db:seed
```

## Database Schema Overview

### Core Tables

1. **users** - User accounts with profile information
2. **categories** - Product categories (Laptops, Smartphones, etc.)
3. **products** - Product catalog
4. **cart_items** - Shopping cart items (linked to users)
5. **orders** - Customer orders
6. **order_items** - Items within each order (snapshot of product data)
7. **order_status_history** - Order status change history
8. **reviews** - Product reviews from customers
9. **product_images** - Multiple images per product (optional)

### Key Relationships

- Categories → Products (one-to-many)
- Users → Cart Items (one-to-many)
- Users → Orders (one-to-many)
- Users → Reviews (one-to-many)
- Orders → Order Items (one-to-many)
- Orders → Order Status History (one-to-many)
- Products → Reviews (one-to-many)
- Products → Product Images (one-to-many)

## Troubleshooting

### Connection Issues

If you encounter connection errors:

1. Verify MariaDB is running:
```bash
sudo systemctl status mariadb  # Linux
brew services list              # macOS
```

2. Check if the database exists:
```bash
mysql -u your_username -p -e "SHOW DATABASES;"
```

3. Test connection manually:
```bash
mysql -u your_username -p technovation_shop
```

### Migration Issues

If migrations fail:

1. Check database permissions:
```sql
SHOW GRANTS FOR 'your_username'@'localhost';
```

2. Reset migrations (WARNING: This will drop all tables):
```bash
php artisan migrate:fresh
```

3. Check for foreign key constraint issues - ensure tables are created in the correct order.

## Next Steps

After setting up the database:

1. Create Eloquent models for each table
2. Set up relationships in the models
3. Create controllers to handle database operations
4. Implement API endpoints or Inertia.js data sharing
5. Create seeders for initial data

## Useful Commands

```bash
# Run migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Rollback all migrations
php artisan migrate:reset

# Refresh migrations (drop and recreate)
php artisan migrate:fresh

# Show migration status
php artisan migrate:status

# Create a new migration
php artisan make:migration create_table_name
```

