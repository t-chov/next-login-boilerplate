#!/bin/bash

# Database Reset Script for Next Login Boilerplate

set -e

echo "🗄️  Resetting database..."

# Drop and recreate the database
echo "🗑️  Dropping database..."
docker-compose exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS next_login_boilerplate;"

echo "🔄 Recreating database..."
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE next_login_boilerplate;"

# Run initialization script
echo "🔧 Running initialization script..."
docker-compose exec postgres psql -U postgres -d next_login_boilerplate -f /docker-entrypoint-initdb.d/init.sql

# Generate and push migrations
echo "📝 Generating migrations..."
docker-compose exec app pnpm --filter=@repo/db db:generate

echo "🚀 Pushing schema to database..."
docker-compose exec app pnpm --filter=@repo/db db:push

# Restart the application
echo "▶️  Restarting application..."
docker-compose start app

echo "✅ Database reset complete!"
echo "📋 You can now access:"
echo "   - Database admin: http://localhost:8080"
echo "   - PostgreSQL: localhost:25432"