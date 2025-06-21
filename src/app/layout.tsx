import "./globals.css";

// This layout is intentionally minimal to avoid conflicts with the
// internationalized layout in src/app/[locale]/layout.tsx.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
