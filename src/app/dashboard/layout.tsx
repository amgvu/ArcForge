export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <main className="p-6">{children}</main>
      </div>
    );
  }
  