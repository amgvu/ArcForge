'use client'

import { SessionProvider } from 'next-auth/react';

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen bg-[#0A0A0B]">
        <SessionProvider>
        <main className="p-6">{children}</main>
        </SessionProvider>
      </div>
    );
  }
  