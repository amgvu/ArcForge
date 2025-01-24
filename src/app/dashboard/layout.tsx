'use client'

import { SessionProvider } from 'next-auth/react';

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <SessionProvider>
        <main className="p-6">{children}</main>
        </SessionProvider>
      </div>
    );
  }
  