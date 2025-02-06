export default function ContactLayout({
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