import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock better-auth/react
const mockSignIn = {
  email: vi.fn(),
};
const mockSignUp = {
  email: vi.fn(),
};
const mockSignOut = vi.fn();
const mockUseSession = vi.fn();

const mockCreateAuthClient = vi.fn(() => ({
  signIn: mockSignIn,
  signUp: mockSignUp,
  signOut: mockSignOut,
  useSession: mockUseSession,
}));

vi.mock("better-auth/react", () => ({
  createAuthClient: mockCreateAuthClient,
}));

describe("Auth Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create auth client with correct base URL", async () => {
    await import("../auth-client");

    expect(mockCreateAuthClient).toHaveBeenCalledWith({
      baseURL: "http://localhost:13200",
    });
  });

  it("should export signIn with email method", async () => {
    const { signIn } = await import("../auth-client");
    expect(signIn).toBeDefined();
    expect(signIn.email).toBeDefined();
    expect(typeof signIn.email).toBe("function");
  });

  it("should export signUp with email method", async () => {
    const { signUp } = await import("../auth-client");
    expect(signUp).toBeDefined();
    expect(signUp.email).toBeDefined();
    expect(typeof signUp.email).toBe("function");
  });

  it("should export signOut function", async () => {
    const { signOut } = await import("../auth-client");
    expect(signOut).toBeDefined();
    expect(typeof signOut).toBe("function");
  });

  it("should export useSession hook", async () => {
    const { useSession } = await import("../auth-client");
    expect(useSession).toBeDefined();
    expect(typeof useSession).toBe("function");
  });

  describe("Authentication Methods", () => {
    it("should call signIn.email with correct parameters", async () => {
      const { signIn } = await import("../auth-client");
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      await signIn.email(credentials);
      expect(mockSignIn.email).toHaveBeenCalledWith(credentials);
    });

    it("should call signUp.email with correct parameters", async () => {
      const { signUp } = await import("../auth-client");
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      await signUp.email(userData);
      expect(mockSignUp.email).toHaveBeenCalledWith(userData);
    });

    it("should call signOut", async () => {
      const { signOut } = await import("../auth-client");
      await signOut();
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
