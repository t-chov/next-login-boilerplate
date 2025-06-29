#!/bin/bash

# Database Reset Script for Gibbon Writer

set -e

echo "🗄️  Resetting database..."

# Stop the application to prevent connection issues
echo "⏹️  Stopping application..."
docker-compose stop app

# Drop and recreate the database
echo "🗑️  Dropping database..."
docker-compose exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS gibbon_writer;"

echo "🔄 Recreating database..."
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE gibbon_writer;"

# Run initialization script
echo "🔧 Running initialization script..."
docker-compose exec postgres psql -U postgres -d gibbon_writer -f /docker-entrypoint-initdb.d/init.sql

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