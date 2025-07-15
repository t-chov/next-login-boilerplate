import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the auth module
const mockAuthHandler = vi.fn();
const mockAuth = {
  handler: mockAuthHandler,
};

vi.mock("@/lib/auth", () => ({
  auth: mockAuth,
}));

// Mock toNextJsHandler
const mockToNextJsHandler = vi.fn();
vi.mock("better-auth/next-js", () => ({
  toNextJsHandler: mockToNextJsHandler,
}));

describe("Auth API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("should call toNextJsHandler with auth.handler", async () => {
    const mockHandlers = {
      GET: vi.fn(),
      POST: vi.fn(),
    };
    mockToNextJsHandler.mockReturnValue(mockHandlers);

    // Import the route module
    await import("../route");

    expect(mockToNextJsHandler).toHaveBeenCalledWith(mockAuthHandler);
  });

  it("should export GET and POST handlers", async () => {
    const mockHandlers = {
      GET: vi.fn(),
      POST: vi.fn(),
    };
    mockToNextJsHandler.mockReturnValue(mockHandlers);

    const routeModule = await import("../route");

    expect(routeModule.GET).toBe(mockHandlers.GET);
    expect(routeModule.POST).toBe(mockHandlers.POST);
  });

  it("should handle GET requests", async () => {
    const mockRequest = new Request("http://localhost:3000/api/auth/session");
    const mockResponse = new Response('{"user": null}');

    const mockGetHandler = vi.fn().mockResolvedValue(mockResponse);
    mockToNextJsHandler.mockReturnValue({
      GET: mockGetHandler,
      POST: vi.fn(),
    });

    const routeModule = await import("../route");
    const response = await routeModule.GET(mockRequest);

    expect(mockGetHandler).toHaveBeenCalledWith(mockRequest);
    expect(response).toBe(mockResponse);
  });

  it("should handle POST requests", async () => {
    const mockRequest = new Request("http://localhost:3000/api/auth/sign-in", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com", password: "password" }),
    });
    const mockResponse = new Response('{"success": true}');

    const mockPostHandler = vi.fn().mockResolvedValue(mockResponse);
    mockToNextJsHandler.mockReturnValue({
      GET: vi.fn(),
      POST: mockPostHandler,
    });

    const routeModule = await import("../route");
    const response = await routeModule.POST(mockRequest);

    expect(mockPostHandler).toHaveBeenCalledWith(mockRequest);
    expect(response).toBe(mockResponse);
  });
});
