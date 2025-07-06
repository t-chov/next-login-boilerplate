"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur bg-slate-100">
      <div className="container flex h-16 items-center">
        <Link href="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors pl-4">
          Gibbon-Writer
        </Link>
      </div>
    </header>
  );
}