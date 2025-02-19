export default function AboutUsLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen text-center">
        <main>{children}</main>
      </div>
    );
  }