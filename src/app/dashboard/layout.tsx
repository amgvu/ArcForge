'use client'

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen">
        <main>{children}</main>
      </div>
    );
  }
  