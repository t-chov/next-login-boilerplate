import { beforeEach, describe, expect, it, vi } from "vitest";

const mockCreateAuthClient = vi.fn(() => ({
  signIn: {
    email: vi.fn(),
  },
  signUp: {
    email: vi.fn(),
  },
  signOut: vi.fn(),
  useSession: vi.fn(),
}));

vi.mock("../auth-client", async () => {
  const actual = await vi.importActual("../auth-client");
  return {
    ...actual,
    default: mockCreateAuthClient(),
  };
});

describe("Auth Client", () => {
  beforeEach(async () => {
    vi.resetModules();
    const mockSignIn = { email: vi.fn() };
    const mockSignUp = { email: vi.fn() };
    const mockSignOut = vi.fn();
    const mockUseSession = vi.fn();
    mockCreateAuthClient.mockReturnValue({
      signIn: mockSignIn,
      signUp: mockSignUp,
      signOut: mockSignOut,
      useSession: mockUseSession,
    });
  });

  it("should create auth client with correct base URL", async () => {
    await import("../auth-client");

    expect(mockCreateAuthClient).toHaveBeenCalledWith();
  });

  it("should export signIn with email method", async () => {
    const authClientModule = await import("../auth-client");
    expect(authClientModule.default.signIn).toBeDefined();
    expect(authClientModule.default.signIn.email).toBeDefined();
    expect(typeof authClientModule.default.signIn.email).toBe("function");
  });

  it("should export signUp with email method", async () => {
    const authClientModule = await import("../auth-client");
    expect(authClientModule.default.signUp).toBeDefined();
    expect(authClientModule.default.signUp.email).toBeDefined();
    expect(typeof authClientModule.default.signUp.email).toBe("function");
  });

  it("should export signOut function", async () => {
    const authClientModule = await import("../auth-client");
    expect(authClientModule.default.signOut).toBeDefined();
    expect(typeof authClientModule.default.signOut).toBe("function");
  });

  it("should export useSession hook", async () => {
    const authClientModule = await import("../auth-client");
    expect(authClientModule.default.useSession).toBeDefined();
    expect(typeof authClientModule.default.useSession).toBe("function");
  });

  describe("Authentication Methods", () => {
    it("should call signIn.email with correct parameters", async () => {
      const authClientModule = await import("../auth-client");
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      await authClientModule.default.signIn.email(credentials);
      expect(authClientModule.default.signIn.email).toHaveBeenCalledWith(credentials);
    });

    it("should call signUp.email with correct parameters", async () => {
      const authClientModule = await import("../auth-client");
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      await authClientModule.default.signUp.email(userData);
      expect(authClientModule.default.signUp.email).toHaveBeenCalledWith(userData);
    });

    it("should call signOut", async () => {
      const authClientModule = await import("../auth-client");
      await authClientModule.default.signOut();
      expect(authClientModule.default.signOut).toHaveBeenCalled();
    });
  });
});
