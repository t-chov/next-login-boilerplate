import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SignInPage from "../page";

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

    expect(screen.getByRole("heading", { name: "サインイン" })).toBeInTheDocument();
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "サインイン" })).toBeInTheDocument();
  });

  it("should show link to sign up page", () => {
    render(<SignInPage />);

    const signUpLink = screen.getByRole("link", { name: "サインアップ" });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute("href", "/auth/sign-up");
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
    signIn.email.mockResolvedValue({});

    render(<SignInPage />);

    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");
    const submitButton = screen.getByRole("button", { name: "サインイン" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signIn.email).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("should redirect to home page on successful sign in", async () => {
    const { signIn } = await vi.importMock("@/lib/auth-client");
    const { useRouter } = await vi.importMock("next/navigation");
    const mockPush = vi.fn();
    (useRouter as vi.Mock).mockReturnValue({ push: mockPush });
    signIn.email.mockResolvedValue({});

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
    signIn.email.mockRejectedValue(new Error("Authentication failed"));

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
      ).toBeInTheDocument();
    });
  });

  it("should show loading state when submitting", async () => {
    const { signIn } = await vi.importMock("@/lib/auth-client");
    signIn.email.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 1000)));

    render(<SignInPage />);

    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");
    const submitButton = screen.getByRole("button", { name: "サインイン" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(screen.getByText("サインイン中...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("should require email and password fields", () => {
    render(<SignInPage />);

    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");

    expect(emailInput).toHaveAttribute("required");
    expect(passwordInput).toHaveAttribute("required");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
