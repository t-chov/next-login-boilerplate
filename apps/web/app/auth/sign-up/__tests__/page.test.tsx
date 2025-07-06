import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SignUpPage from "../page";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

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

    expect(screen.getByRole("heading", { name: "サインアップ" })).toBeInTheDocument();
    expect(screen.getByLabelText("名前")).toBeInTheDocument();
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "サインアップ" })).toBeInTheDocument();
  });

  it("should show link to sign in page", () => {
    render(<SignUpPage />);

    const signInLink = screen.getByRole("link", { name: "サインイン" });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute("href", "/auth/sign-in");
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
    (signUp.email as vi.Mock).mockResolvedValue({});

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
      expect(signUp.email).toHaveBeenCalledWith({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("should redirect to home page on successful sign up", async () => {
    (signUp.email as vi.Mock).mockResolvedValue({});
    const mockPush = vi.fn();
    (useRouter as vi.Mock).mockReturnValue({ push: mockPush });

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
    (signUp.email as vi.Mock).mockRejectedValue(new Error("Registration failed"));

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
      ).toBeInTheDocument();
    });
  });

  it("should show loading state when submitting", async () => {
    (signUp.email as vi.Mock).mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 1000)));

    render(<SignUpPage />);

    const nameInput = screen.getByLabelText("名前");
    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");
    const submitButton = screen.getByRole("button", { name: "サインアップ" });

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(screen.getByText("サインアップ中...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("should require all fields", () => {
    render(<SignUpPage />);

    const nameInput = screen.getByLabelText("名前");
    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");

    expect(nameInput).toHaveAttribute("required");
    expect(emailInput).toHaveAttribute("required");
    expect(passwordInput).toHaveAttribute("required");
    expect(nameInput).toHaveAttribute("type", "text");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
