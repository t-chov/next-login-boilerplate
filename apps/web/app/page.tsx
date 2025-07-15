"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";

export default function Home() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <h1 className="font-bold text-4xl text-foreground">Welcome to Gibbon-Writer</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            A modern writing platform built with Next.js and Turborepo.
          </p>
            {session ? (
              <>
                <span className="text-muted-foreground text-sm">
                  こんにちは、{session.user.name}さん
                </span>
                <Button variant="outline" onClick={() => signOut()}>
                  サインアウト
                </Button>
              </>
            ) : (
              <div className="space-x-2">
                <Button asChild variant="outline">
                  <Link href="/auth/sign-in">サインイン</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/sign-up">サインアップ</Link>
                </Button>
              </div>
            )}
          {session && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-green-800">認証に成功しました！ユーザーID: {session.user.id}</p>
              <p className="mt-1 text-green-600 text-sm">メール: {session.user.email}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
