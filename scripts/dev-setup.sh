#!/bin/bash

# Development Environment Setup Script for Gibbon Writer

set -e

echo "🚀 Setting up Gibbon Writer development environment..."

# Check if .env file exists, if not copy from example
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please review and update the values as needed."
else
    echo "✅ .env file already exists."
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "🐳 Starting Docker containers..."
docker-compose up -d

echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec postgres pg_isready -U postgres; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done

echo "📦 Installing dependencies..."
docker-compose exec app pnpm install

echo "🗄️  Running database migrations..."
docker-compose exec app pnpm --filter=@repo/db db:generate
docker-compose exec app pnpm --filter=@repo/db db:push

echo "🎉 Development environment is ready!"
echo ""
echo "📋 Available services:"
echo "   - Web app: http://localhost:3000"
echo "   - Docs app: http://localhost:3001"
echo "   - Database admin: http://localhost:8080"
echo "   - PostgreSQL: localhost:5432"
echo ""
echo "🛠️  Useful commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop services: docker-compose down"
echo "   - Rebuild: docker-compose up --build"
echo "   - Database shell: docker-compose exec postgres psql -U postgres -d gibbon_writer"
echo ""