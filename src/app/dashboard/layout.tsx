export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <main className="p-6">{children}</main>
      </div>
    );
  }
  