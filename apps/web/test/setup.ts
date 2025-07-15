import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock better-auth client
vi.mock("@/lib/auth-client", () => ({
  signIn: {
    email: vi.fn(),
  },
  signUp: {
    email: vi.fn(),
  },
  signOut: vi.fn(),
  useSession: () => ({
    data: null,
    isPending: false,
  }),
}));

// Setup environment variables for tests
process.env.BETTER_AUTH_URL = "http://localhost:3000";
process.env.BETTER_AUTH_SECRET = "test-secret";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test_db";
