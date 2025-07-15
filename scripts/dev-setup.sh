#!/bin/bash

# Development Environment Setup Script for Next Login Boilerplate

set -e

echo "🚀 Setting up Next Login Boilerplate development environment..."

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

echo "🎉 Development environment is ready!"
echo ""
echo "📋 Available services:"
echo "   - Web app: http://localhost:13200"
echo "   - Docs app: http://localhost:13201"
echo "   - Database admin: http://localhost:8080"
echo "   - PostgreSQL: localhost:25432"
echo ""
echo "🛠️  Useful commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop services: docker-compose down"
echo "   - Rebuild: docker-compose up --build"
echo "   - Database shell: docker-compose exec postgres psql -U postgres -d next_login_boilerplate"
echo ""