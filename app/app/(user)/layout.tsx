export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-neutral-bg min-h-screen">{children}</div>;
}
