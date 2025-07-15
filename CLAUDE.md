# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Turborepo monorepo called "gibbon-writer" built with Next.js apps and shared packages using pnpm as the package manager.

## Architecture

### Monorepo Structure
- **apps/**: Contains Next.js applications
  - `web/`: Main web application (runs on port 13200)
- **packages/**: Shared packages and configurations
  - `db/`: Database package with Drizzle ORM and PostgreSQL setup
  - `eslint-config/`: Centralized ESLint configurations for base, Next.js, and React
  - `typescript-config/`: Shared TypeScript configurations

### Key Technologies
- **Turborepo**: Build system and task runner with dependency graph management
- **Next.js 15.3.0**: Full-stack React framework with Turbopack
- **React 19.1.0**: UI library
- **TypeScript 5.8.2**: Type checking
- **pnpm**: Package manager with workspace support
- **ESLint**: Code linting with custom configurations
- **Prettier**: Code formatting
- **Tailwind CSS 4.x**: Utility-first CSS framework with new v4 syntax and OKLCH color space
- **shadcn/ui**: Pre-built component system based on Radix UI and Tailwind CSS
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL
- **Better Auth**: Authentication library with email/password support
- **Vitest**: Fast unit testing framework with React Testing Library
- **Biome**: Fast formatter and linter for JavaScript/TypeScript
- **Docker**: Containerized development environment with PostgreSQL and Adminer
- **tw-animate-css**: Animation utilities for Tailwind CSS

## Common Commands

### Development
```bash
# Start all apps in development mode
pnpm dev
# or: turbo dev

# Develop specific app
turbo dev --filter=web
```

### Building
```bash
# Build all apps and packages
pnpm build
# or: turbo build

# Build specific app
turbo build --filter=web
```

### Code Quality
```bash
# Lint all packages (ESLint)
pnpm lint
# or: turbo lint

# Lint with Biome
pnpm lint:biome
# or: turbo lint:biome

# Type checking
pnpm check-types
# or: turbo check-types

# Format code (Prettier)
pnpm format

# Format with Biome
pnpm format:biome
# or: turbo format:biome

# Biome check and fix
pnpm -w biome check --write .
```

### Testing
```bash
# Run all tests
pnpm test:run
# or: turbo test:run

# Run tests in watch mode
pnpm test
# or: turbo test

# Run tests with UI
pnpm test:ui
# or: turbo test:ui

# Run tests with coverage
pnpm test:coverage
# or: turbo test:coverage

# Run specific test file
pnpm test:run lib/__tests__/auth-integration.test.ts

# Run tests for specific app
turbo test:run --filter=web
```

### Database Management
```bash
# Generate database migrations
pnpm db:generate
# or: turbo db:generate

# Run database migrations
pnpm db:migrate
# or: turbo db:migrate

# Push schema changes to database
pnpm db:push
# or: turbo db:push

# Open Drizzle Studio
pnpm db:studio
# or: turbo db:studio

# Reset database (complete reset)
./scripts/db-reset.sh
```

### Docker Development
```bash
# Start development environment
pnpm docker:dev

# Start with rebuild
pnpm docker:build

# Stop containers
pnpm docker:down

# View logs
pnpm docker:logs

# Setup development environment
pnpm docker:setup
# or: ./scripts/dev-setup.sh

# Reset database
pnpm docker:db-reset

# Access database admin (Adminer)
# Available at http://localhost:8080
# Server: postgres, User: user, Password: password, Database: appdb
```

### Package Management
```bash
# Install dependencies
pnpm install

# Generate new React component in ui package
cd packages/ui && pnpm generate:component
```

## Development Workflow

### Turbo Task Dependencies
- `build` tasks depend on upstream package builds (`^build`)
- `lint` and `check-types` follow dependency order
- `dev` tasks run without caching and are persistent

### Adding New Components
- Shared components go in `packages/ui/src/`
- Use the generator: `turbo gen react-component` from ui package
- Components are exported via path mapping in package.json

### shadcn/ui Components
- shadcn/ui components are located in `apps/web/components/ui/`
- Import shadcn/ui components using path aliases: `@/components/ui/[component-name]`
- Add new shadcn/ui components using `npx shadcn add [component-name]` from the web app directory
- Configuration uses "new-york" style with RSC disabled
- All shadcn/ui components use the utility function `cn()` from `@/lib/utils`
- Components use Tailwind CSS classes and `class-variance-authority` for variants

### Port Allocation
- Web app: 13200
- Adminer (database admin): 8080

### Workspace Dependencies
All apps use workspace-local packages:
- `@repo/db`: Database package with Drizzle ORM
- `@repo/eslint-config`: ESLint configurations
- `@repo/typescript-config`: TypeScript configurations

## Code Standards

### ESLint Configuration
- Max warnings: 0 (strict linting)
- Configurations available: base, next-js, react-internal
- Uses Prettier for formatting integration

### TypeScript
- Strict type checking with `tsc --noEmit`
- Shared configs for different project types (Next.js, React library)

### Component Patterns
- Use "use client" directive for client-side interactivity
- Follow React 19 patterns and conventions

### shadcn/ui Component Guidelines
- Use `cn()` utility function from `@/lib/utils` for className merging in all shadcn/ui components
- Follow the established variant pattern with `class-variance-authority`
- Import Radix UI primitives when needed for accessibility
- Maintain consistent styling with Tailwind CSS v4.x classes using "new-york" style
- Export both the component and its variants (e.g., `Button` and `buttonVariants`)
- Use React.forwardRef for proper ref forwarding
- Include proper TypeScript interfaces extending HTML element props
- Use path aliases for imports (e.g., `@/components`, `@/lib/utils`)
- Available components include: Button, Card, Input, Label, and other UI primitives
- Use `lucide-react` for icons throughout the component system

### Database Guidelines
- Use Drizzle ORM for type-safe database operations
- Schema definitions are located in `packages/db/src/schema/`
- Database connection and configuration in `packages/db/src/index.ts`
- Use PostgreSQL as the primary database
- Docker setup includes PostgreSQL container with initialization scripts

### Authentication Guidelines
- Use Better Auth for all authentication needs
- Configuration in `apps/web/lib/auth.ts`
- Email/password authentication is enabled by default
- Authentication tables are auto-generated with the following structure:
  - `user`: id, name, email, emailVerified, image, createdAt, updatedAt
  - `session`: id, expiresAt, token, createdAt, updatedAt, ipAddress, userAgent, userId
  - `account`: id, accountId, providerId, userId, accessToken, refreshToken, expiresAt, etc.
  - `verification`: id, identifier, value, expiresAt, createdAt, updatedAt
- Client-side authentication hooks available via `@/lib/auth-client`
- API routes are configured at `/api/auth/[...all]`
- Environment variables required: `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_BETTER_AUTH_URL`

## Environment Variables

The following environment variables are used across the project:

### Database Configuration
- `DATABASE_URL`: Complete database connection string
- `POSTGRES_HOST`: PostgreSQL server host
- `POSTGRES_PORT`: PostgreSQL server port
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password

### Authentication
- `BETTER_AUTH_URL`: Server-side auth URL
- `BETTER_AUTH_SECRET`: Secret key for authentication
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Client-side auth URL

### General
- `NODE_ENV`: Environment (development/production/test)

### Testing Guidelines
- Use Vitest for all unit and integration testing
- Configuration in `apps/web/vitest.config.ts`
- Test setup in `apps/web/test/setup.ts` with global mocks
- Testing environment: happy-dom for fast DOM simulation
- Test patterns:
  - Unit tests for utilities and functions: `__tests__/[name].test.ts`
  - Component tests: `__tests__/[component].test.tsx`
  - Integration tests: `__tests__/[feature]-integration.test.ts`
- Mock external dependencies in test setup
- Use React Testing Library for component testing
- Environment variables are mocked in test setup
- All authentication methods have comprehensive test coverage

### Code Formatting Guidelines
- **Biome**: Primary formatter and linter for TypeScript/JavaScript
  - Configuration in root `biome.json`
  - Automatic import sorting and code formatting
  - CSS class sorting for Tailwind CSS with `useSortedClasses` rule
  - Type import optimization and unused import removal
  - Advanced override patterns for build directories
  - Git integration with VCS configuration
  - Available in all packages with `format:biome` and `lint:biome` scripts
- **ESLint**: Legacy linting setup (still available)
  - Shared configurations in `packages/eslint-config/`
  - Max warnings set to 0 for strict linting
- **Prettier**: Legacy formatting (still available)
  - Used alongside ESLint for consistent formatting
- Use `pnpm -w biome check --write .` for project-wide formatting and linting