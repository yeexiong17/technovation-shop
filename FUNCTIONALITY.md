# Technovation Shop - Functionality Overview

A comprehensive guide to all features available in the Technovation Shop e-commerce application.

## Customer Features

### Authentication
- **User Registration** - Create new account with email and password
- **User Login** - Secure authentication with email/password
- **Password Reset** - Forgot password flow with email verification
- **Logout** - Secure session termination

### Product Browsing
- **Home Page** - Featured products and category overview
- **Product Catalog** - Browse all products with filtering by category
- **Product Search** - Search products by name/description
- **Product Details** - View detailed product information, images, ratings, and reviews
- **Category Navigation** - Browse products by category (Laptops, Smartphones, Audio, etc.)

### Shopping Cart
- **Add to Cart** - Add products to shopping cart
- **Update Quantity** - Modify item quantities in cart
- **Remove Items** - Delete items from cart
- **Cart Persistence** - Cart items saved to database per user

### Checkout & Orders
- **Checkout Process** - Secure checkout with shipping and payment information
- **Order Placement** - Create orders with order number generation
- **Order History** - View all past orders
- **Order Details** - View complete order information including:
  - Order items with product snapshots
  - Shipping address
  - Payment method
  - Order status timeline
  - Tracking number (when available)

### Reviews & Ratings
- **Product Reviews** - Write and edit reviews for products
- **Order Reviews** - Rate and review orders after delivery
- **Review Display** - View all product reviews with ratings and verified purchase badges
- **Rating Calculation** - Automatic product rating calculation from reviews

### User Profile
- **Profile View** - View personal information and account statistics
- **Profile Edit** - Update name, email, phone, and address information
- **Account Statistics** - View total orders and member since date

## Admin Features

### Dashboard
- **Overview Statistics** - Total revenue, orders, active users, conversion rate
- **Recent Orders** - Latest orders with customer and order details
- **Top Products** - Best-selling products by revenue

### Product Management
- **Product List** - View all products with details (name, price, stock, rating, reviews)
- **Add Product** - Create new products with:
  - Product information (name, description, price, category)
  - Image upload
  - Stock management
  - Featured product flag
  - Product badges
- **Edit Product** - Update existing product information and images
- **View Reviews** - View all customer reviews for each product

### Order Management
- **Order List** - View all customer orders with filtering and search
- **Order Details** - Admin-specific order detail view with:
  - Complete order information
  - Customer details
  - Order items
  - Status history timeline
- **Update Order Status** - Change order status (pending, processing, shipped, delivered, cancelled)
- **Tracking Number** - Add or update shipping tracking numbers

### Customer Management
- **Customer List** - View all registered customers
- **Customer Statistics** - Total orders and spending per customer
- **Customer Overview** - Overall customer statistics and metrics

### Analytics
- **Revenue Overview** - Revenue trends and statistics
- **Top Selling Products** - Product performance metrics
- **Average Order Value** - AOV calculations
- **Customer Lifetime Value** - CLV metrics
- **Return Rate** - Return/refund statistics

### Security & Access Control
- **Admin Authentication** - Separate admin login flow
- **Route Protection** - Admin-only routes protected by middleware
- **Admin Redirect** - Admins automatically redirected to admin dashboard
- **User Route Restriction** - Admins cannot access regular user routes

## Technical Features

### Data Management
- **Database Integration** - Full MariaDB integration with Eloquent ORM
- **Image Storage** - Product images stored in `public/storage/products`
- **Data Persistence** - All user data, orders, and cart items saved to database

### User Experience
- **Responsive Design** - Mobile-friendly interface
- **Real-time Updates** - Dynamic cart and order updates
- **Toast Notifications** - User feedback for actions
- **Loading States** - Visual feedback during operations
- **Error Handling** - Graceful error messages

### Timezone Support
- **GMT+8 Timezone** - All timestamps displayed in Asia/Kuala_Lumpur timezone
- **Consistent Formatting** - Dates and times formatted consistently across the application

## Route Protection

- **Public Routes**: `/` (home), `/auth` (login/register), `/forgot-password`, `/reset-password`
- **Authenticated Routes**: All product, cart, checkout, order, and profile routes
- **Admin Routes**: All `/admin/*` routes require admin privileges

