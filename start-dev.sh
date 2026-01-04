#!/bin/bash

# Start Laravel + Inertia.js Development Servers
# Run this script and keep it running, or run commands separately in different terminals

echo "🚀 Starting Laravel + Inertia.js Development Environment"
echo ""
echo "This will start:"
echo "  1. Vite dev server (frontend assets)"
echo "  2. Laravel server (backend)"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers in parallel
cd "$(dirname "$0")"

# Start Vite in background
npm run dev &
VITE_PID=$!

# Start Laravel
php artisan serve &
LARAVEL_PID=$!

# Wait for user interruptc
trap "kill $VITE_PID $LARAVEL_PID 2>/dev/null; exit" INT TERM

echo "✅ Servers started!"
echo "   Vite: http://localhost:5173"
echo "   Laravel: http://localhost:8000"
echo ""
echo "Visit http://localhost:8000 in your browser"
echo ""
echo "Press Ctrl+C to stop..."

wait

