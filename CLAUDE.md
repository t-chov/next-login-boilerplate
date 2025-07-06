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
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component system based on Radix UI and Tailwind CSS
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL
- **Docker**: Containerized development environment

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
# Lint all packages
pnpm lint
# or: turbo lint

# Type checking
pnpm check-types
# or: turbo check-types

# Format code
pnpm format
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

# Reset database
pnpm docker:db-reset
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
- Maintain consistent styling with Tailwind CSS classes using "new-york" style
- Export both the component and its variants (e.g., `Button` and `buttonVariants`)
- Use React.forwardRef for proper ref forwarding
- Include proper TypeScript interfaces extending HTML element props
- Use path aliases for imports (e.g., `@/components`, `@/lib/utils`)

### Database Guidelines
- Use Drizzle ORM for type-safe database operations
- Schema definitions are located in `packages/db/src/schema/`
- Database connection and configuration in `packages/db/src/index.ts`
- Use PostgreSQL as the primary database
- Docker setup includes PostgreSQL container with initialization scripts