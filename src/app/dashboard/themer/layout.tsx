'use client'

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen bg-neutral-900">
        <main className="p-6">{children}</main>
      </div>
    );
  }