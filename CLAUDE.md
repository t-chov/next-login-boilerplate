# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Turborepo monorepo called "gibbon-writer" built with Next.js apps and shared packages using pnpm as the package manager.

## Architecture

### Monorepo Structure
- **apps/**: Contains Next.js applications
  - `web/`: Main web application (runs on port 3000)
  - `docs/`: Documentation site (runs on port 3001)
- **packages/**: Shared packages and configurations
  - `ui/`: Shared React component library with exports pattern `"./*": "./src/*.tsx"`
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

## Common Commands

### Development
```bash
# Start all apps in development mode
pnpm dev
# or: turbo dev

# Develop specific app
turbo dev --filter=web
turbo dev --filter=docs
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

### Port Allocation
- Web app: 3000
- Docs app: 3001

### Workspace Dependencies
All apps use workspace-local packages:
- `@repo/ui`: Shared component library
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
- UI components require `appName` prop for context-aware behavior
- Use "use client" directive for client-side interactivity
- Follow React 19 patterns and conventions