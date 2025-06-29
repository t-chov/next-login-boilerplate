# Docker Development Setup

This document explains how to set up the development environment using Docker containers.

## Quick Start

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd gibbon-writer
   pnpm run docker:setup
   ```

2. **Start development:**
   ```bash
   pnpm run docker:dev
   ```

3. **Access services:**
   - Web app: http://localhost:13200
   - Docs app: http://localhost:13201
   - Database admin: http://localhost:8080
   - PostgreSQL: localhost:5432

## Available Commands

### Docker Management
```bash
# Start all services
pnpm run docker:dev

# Build and start services
pnpm run docker:build

# Stop all services
pnpm run docker:down

# View logs
pnpm run docker:logs

# Setup development environment
pnpm run docker:setup

# Reset database
pnpm run docker:db-reset
```

### Database Management
```bash
# Generate migrations
pnpm run db:generate

# Apply migrations
pnpm run db:migrate

# Push schema changes
pnpm run db:push

# Open database studio
pnpm run db:studio
```

## Services

### Application Container
- **Image:** Custom Node.js 18 Alpine
- **Ports:** 13200 (web), 13201 (docs)
- **Volumes:** Source code mounted for hot reload
- **Command:** `pnpm dev` (runs all apps via Turborepo)

### PostgreSQL Database
- **Image:** PostgreSQL 15 Alpine
- **Port:** 5432
- **Database:** gibbon_writer
- **User:** postgres
- **Password:** password
- **Persistent storage:** Docker volume

### Adminer (Database Admin)
- **Image:** Adminer latest
- **Port:** 8080
- **Access:** http://localhost:8080
- **Login:** postgres/password/gibbon_writer

## Development Container (VS Code)

The project includes VS Code development container configuration:

1. **Prerequisites:**
   - VS Code with Remote-Containers extension
   - Docker Desktop

2. **Usage:**
   - Open project in VS Code
   - Command Palette → "Remote-Containers: Reopen in Container"
   - VS Code will build and connect to the development container

3. **Features:**
   - Pre-configured extensions (ESLint, Prettier, TypeScript)
   - Integrated terminal with all tools
   - Hot reload and debugging support

## Environment Variables

Copy `.env.example` to `.env` and customize:

```env
# Database
DATABASE_URL=postgresql://postgres:password@postgres:5432/gibbon_writer
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=gibbon_writer
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:13200
```

## File Structure

```
├── docker-compose.yml              # Main compose file
├── docker-compose.override.yml     # Development overrides
├── Dockerfile.dev                  # Main development container
├── .devcontainer/                  # VS Code dev container config
├── docker/
│   └── postgres/                   # PostgreSQL configuration
├── scripts/
│   ├── dev-setup.sh               # Setup script
│   └── db-reset.sh                # Database reset script
└── apps/
    ├── web/Dockerfile.dev         # Web app container
    └── docs/Dockerfile.dev        # Docs app container
```

## Troubleshooting

### Port Conflicts
If ports are already in use, update `docker-compose.yml`:
```yaml
services:
  app:
    ports:
      - "3010:13200"  # Change host port
      - "3011:13201"
```

### Database Connection Issues
```bash
# Check database status
docker-compose ps postgres

# View database logs
docker-compose logs postgres

# Connect to database
docker-compose exec postgres psql -U postgres -d gibbon_writer
```

### Container Rebuild
```bash
# Force rebuild all containers
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Volume Issues
```bash
# Remove all volumes (will delete data)
docker-compose down -v

# Prune unused volumes
docker volume prune
```

### Performance on macOS
The setup uses cached volume mounts for better performance on macOS. If you experience slow file watching, ensure Docker Desktop has sufficient resources allocated.

## Production Deployment

This setup is for development only. For production:

1. Create production Dockerfiles
2. Use environment-specific compose files
3. Configure proper secrets management
4. Set up health checks and monitoring
5. Use production-grade PostgreSQL setup