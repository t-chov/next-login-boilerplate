"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-slate-100 backdrop-blur">
      <div className="container flex h-16 items-center">
        <Link
          href="/"
          className="pl-4 font-bold text-foreground text-xl transition-colors hover:text-primary"
        >
          Gibbon-Writer
        </Link>
      </div>
    </header>
  );
}
