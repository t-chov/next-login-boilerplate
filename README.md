# Next Login Boilerplate

A modern authentication boilerplate built with Next.js, Turborepo, and Better Auth. This project provides a complete authentication system with email/password login, ready for production use.

## Features

- 🔐 **Complete Authentication System** with Better Auth
- 🚀 **Next.js 15** with App Router and React 19
- 📦 **Turborepo** monorepo structure for scalability
- 🎨 **shadcn/ui** components with Tailwind CSS
- 🗄️ **PostgreSQL** database with Drizzle ORM
- 🧪 **Vitest** for testing with React Testing Library
- 🔧 **TypeScript** with strict type checking
- 🐳 **Docker** development environment
- 📝 **Biome** for code formatting and linting

## Getting Started

### Prerequisites

- Node.js 22 or higher
- pnpm (recommended)
- Docker and Docker Compose

### Installation

1. Clone the repository:
```bash
git clone https://github.com/t-chov/next-login-boilerplate.git
cd next-login-boilerplate
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up the development environment:
```bash
pnpm docker:setup
```

4. Start the development server:
```bash
pnpm dev
```

The application will be available at:
- Web app: http://localhost:13200
- Database admin (Adminer): http://localhost:8080

## Project Structure

This Turborepo monorepo includes:

### Apps and Packages

- `apps/web`: Main Next.js application with authentication
- `packages/db`: Database package with Drizzle ORM and PostgreSQL setup
- `packages/eslint-config`: Shared ESLint configurations
- `packages/typescript-config`: Shared TypeScript configurations

### Authentication Features

- ✅ Email/password authentication
- ✅ User registration and login
- ✅ Session management
- ✅ Protected routes
- ✅ User profile management

## Development

### Available Scripts

```bash
# Development
pnpm dev              # Start all apps in development
pnpm build            # Build all apps and packages
pnpm lint             # Run ESLint
pnpm check-types      # Run TypeScript type checking
pnpm test             # Run tests
pnpm test:run         # Run tests once

# Database
pnpm db:generate      # Generate database migrations
pnpm db:migrate       # Run database migrations
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Drizzle Studio

# Docker
pnpm docker:dev       # Start development environment
pnpm docker:down      # Stop containers
pnpm docker:logs      # View logs
pnpm docker:db-reset  # Reset database
```

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Better Auth
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build System**: Turborepo
- **Testing**: Vitest with React Testing Library
- **Type Safety**: TypeScript with strict configuration
- **Code Quality**: Biome for formatting and linting

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:25432/next_login_boilerplate

# Authentication
BETTER_AUTH_URL=http://localhost:13200
BETTER_AUTH_SECRET=your-secret-key
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:13200
```

## Deployment

This boilerplate is ready for deployment on platforms like Vercel, Netlify, or any Docker-compatible hosting service.

### Production Checklist

- [ ] Configure production environment variables
- [ ] Set up production database
- [ ] Configure authentication secrets
- [ ] Set up monitoring and logging
- [ ] Configure CI/CD pipeline

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turborepo.com/docs)
- [Better Auth Documentation](https://better-auth.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [shadcn/ui Documentation](https://ui.shadcn.com)