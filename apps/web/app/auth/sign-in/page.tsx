"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signIn.email({
        email,
        password,
      });
      router.push("/");
    } catch (error) {
      let errorMessage = "サインインに失敗しました。メールアドレスとパスワードを確認してください。";

      if (
        (error as Error)?.message?.includes("INVALID_EMAIL") ||
        (error as Error)?.message?.includes("INVALID_PASSWORD")
      ) {
        errorMessage = "メールアドレスまたはパスワードが正しくありません。";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>サインイン</CardTitle>
          <CardDescription>アカウントにサインインしてください</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                placeholder="パスワードを入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="rounded bg-red-50 p-2 text-red-600 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "サインイン中..." : "サインイン"}
            </Button>
          </form>
          <div className="mt-4 text-center text-gray-600 text-sm">
            アカウントをお持ちでない場合は{" "}
            <Link href="/auth/sign-up" className="text-blue-600 hover:underline">
              サインアップ
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
