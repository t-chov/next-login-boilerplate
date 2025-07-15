import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import SignUpPage from "../page";
import { useRouter } from "next/navigation";
import React from "react";

vi.mock("@/lib/auth-client", () => ({
  signUp: {
    email: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

describe("SignUpPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render sign up form", () => {
    render(<SignUpPage />);

    expect(screen.getByRole("heading", { name: "サインアップ" })).not.toBeNull();
    expect(screen.getByLabelText("名前")).not.toBeNull();
    expect(screen.getByLabelText("メールアドレス")).not.toBeNull();
    expect(screen.getByLabelText("パスワード")).not.toBeNull();
    expect(screen.getByRole("button", { name: "サインアップ" })).not.toBeNull();
  });

  it("should show link to sign in page", () => {
    render(<SignUpPage />);

    const signInLink = screen.getByRole("link", { name: "サインイン" });
    expect(signInLink).not.toBeNull();
    expect(signInLink.getAttribute("href")).toBe("/auth/sign-in");
  });

  it("should update input values when user types", () => {
    render(<SignUpPage />);

    const nameInput = screen.getByLabelText("名前") as HTMLInputElement;
    const emailInput = screen.getByLabelText("メールアドレス") as HTMLInputElement;
    const passwordInput = screen.getByLabelText("パスワード") as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(nameInput.value).toBe("Test User");
    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("should call signUp when form is submitted with valid data", async () => {
    const { signUp } = await vi.importMock("@/lib/auth-client");
    (signUp as any).email.mockResolvedValue({});

    render(<SignUpPage />);

    const nameInput = screen.getByLabelText("名前");
    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");
    const submitButton = screen.getByRole("button", { name: "サインアップ" });

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect((signUp as any).email).toHaveBeenCalledWith({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("should redirect to home page on successful sign up", async () => {
    const { signUp } = await vi.importMock("@/lib/auth-client");
    (signUp as any).email.mockResolvedValue({});
    const mockPush = vi.fn();
    (useRouter as Mock).mockReturnValue({ push: mockPush });

    render(<SignUpPage />);

    const nameInput = screen.getByLabelText("名前");
    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");
    const submitButton = screen.getByRole("button", { name: "サインアップ" });

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("should show error message on failed sign up", async () => {
    const { signUp } = await vi.importMock("@/lib/auth-client");
    (signUp as any).email.mockRejectedValue(new Error("Registration failed"));

    render(<SignUpPage />);

    const nameInput = screen.getByLabelText("名前");
    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");
    const submitButton = screen.getByRole("button", { name: "サインアップ" });

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("サインアップに失敗しました。入力内容を確認してください。")
      ).not.toBeNull();
    });
  });

  it("should show loading state when submitting", async () => {
    const { signUp } = await vi.importMock("@/lib/auth-client");
    (signUp as any).email.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(<SignUpPage />);

    const nameInput = screen.getByLabelText("名前");
    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");
    const submitButton = screen.getByRole("button", { name: "サインアップ" });

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(screen.getByText("サインアップ中...")).not.toBeNull();
  });

  it("should require all fields", () => {
    render(<SignUpPage />);

    const nameInput = screen.getByLabelText("名前");
    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");

    expect(nameInput.getAttribute("required")).not.toBeNull();
    expect(emailInput.getAttribute("required")).not.toBeNull();
    expect(passwordInput.getAttribute("required")).not.toBeNull();
    expect(nameInput.getAttribute("type")).toBe("text");
    expect(emailInput.getAttribute("type")).toBe("email");
    expect(passwordInput.getAttribute("type")).toBe("password");
  });
});
