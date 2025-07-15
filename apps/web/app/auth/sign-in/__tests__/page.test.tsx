import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import SignInPage from "../page";
import React from "react";

// Mock auth client
vi.mock("@/lib/auth-client", () => ({
  signIn: {
    email: vi.fn(),
  },
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

describe("SignInPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render sign in form", () => {
    render(<SignInPage />);

    expect(screen.getByRole("heading", { name: "サインイン" })).not.toBeNull();
    expect(screen.getByLabelText("メールアドレス")).not.toBeNull();
    expect(screen.getByLabelText("パスワード")).not.toBeNull();
    expect(screen.getByRole("button", { name: "サインイン" })).not.toBeNull();
  });

  it("should show link to sign up page", () => {
    render(<SignInPage />);

    const signUpLink = screen.getByRole("link", { name: "サインアップ" });
    expect(signUpLink).not.toBeNull();
    expect(signUpLink.getAttribute("href")).toBe("/auth/sign-up");
  });

  it("should update input values when user types", () => {
    render(<SignInPage />);

    const emailInput = screen.getByLabelText("メールアドレス") as HTMLInputElement;
    const passwordInput = screen.getByLabelText("パスワード") as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("should call signIn when form is submitted with valid data", async () => {
    const { signIn } = await vi.importMock("@/lib/auth-client");
    (signIn as any).email.mockResolvedValue({});

    render(<SignInPage />);

    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");
    const submitButton = screen.getByRole("button", { name: "サインイン" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect((signIn as any).email).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("should redirect to home page on successful sign in", async () => {
    const { signIn } = await vi.importMock("@/lib/auth-client");
    const { useRouter } = await vi.importMock("next/navigation");
    const mockPush = vi.fn();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    (signIn as any).email.mockResolvedValue({});

    render(<SignInPage />);

    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");
    const submitButton = screen.getByRole("button", { name: "サインイン" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("should show error message on failed sign in", async () => {
    const { signIn } = await vi.importMock("@/lib/auth-client");
    (signIn as any).email.mockRejectedValue(new Error("Authentication failed"));

    render(<SignInPage />);

    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");
    const submitButton = screen.getByRole("button", { name: "サインイン" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("サインインに失敗しました。メールアドレスとパスワードを確認してください。")
      ).not.toBeNull();
    });
  });

  it("should show loading state when submitting", async () => {
    const { signIn } = await vi.importMock("@/lib/auth-client");
    (signIn as any).email.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(<SignInPage />);

    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");
    const submitButton = screen.getByRole("button", { name: "サインイン" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(screen.getByText("サインイン中...")).not.toBeNull();
  });

  it("should require email and password fields", () => {
    render(<SignInPage />);

    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");

    expect(emailInput.getAttribute("required")).not.toBeNull();
    expect(passwordInput.getAttribute("required")).not.toBeNull();
    expect(emailInput.getAttribute("type")).toBe("email");
    expect(passwordInput.getAttribute("type")).toBe("password");
  });
});
