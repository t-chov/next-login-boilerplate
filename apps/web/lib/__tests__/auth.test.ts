import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
const mockBetterAuth = vi.fn((config) => ({
  config,
  handler: vi.fn(),
  $fetch: vi.fn(),
}));

const mockDrizzleAdapter = vi.fn(() => ({}));

vi.mock("drizzle-orm/postgres-js", () => ({
  drizzle: vi.fn(() => ({})),
}));

vi.mock("postgres", () => ({
  default: vi.fn(() => ({})),
}));

vi.mock("better-auth", () => ({
  betterAuth: mockBetterAuth,
}));

vi.mock("better-auth/adapters/drizzle", () => ({
  drizzleAdapter: mockDrizzleAdapter,
}));

vi.mock("@repo/db/schema", () => ({}));

describe("Auth Configuration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create auth instance with correct configuration", async () => {
    const { auth } = await import("../auth");
    expect(auth).toBeDefined();
    expect(auth.config).toBeDefined();
  });

  it("should have email and password authentication enabled", async () => {
    await import("../auth");
    expect(mockBetterAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        emailAndPassword: {
          enabled: true,
          requireEmailVerification: false,
        },
      })
    );
  });

  it("should use correct base URL", async () => {
    await import("../auth");
    expect(mockBetterAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: "http://localhost:13200",
      })
    );
  });

  it("should use default secret", async () => {
    await import("../auth");
    expect(mockBetterAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        secret: "default-secret-key",
      })
    );
  });

  it("should configure drizzle adapter", async () => {
    await import("../auth");
    expect(mockDrizzleAdapter).toHaveBeenCalledWith(expect.any(Object), {
      provider: "pg",
    });
  });
});
