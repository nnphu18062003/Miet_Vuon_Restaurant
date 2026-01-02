#!/bin/sh
# Database initialization script for production
# Run this ONCE when setting up a new environment

echo "🔧 Running database migrations..."
npm run db:migrate

echo "📊 Checking if database needs initial data..."
# Only seed if database is empty (no products exist)
PRODUCT_COUNT=$(docker exec restaurant_db psql -U postgres -d restaurant_project -t -c "SELECT COUNT(*) FROM products;" 2>/dev/null || echo "0")

if [ "$PRODUCT_COUNT" -eq "0" ]; then
  echo "📦 Database is empty. Running seeds..."
  npm run db:seed
else
  echo "✅ Database already has data. Skipping seeds."
fi

echo "✅ Database setup complete!"
