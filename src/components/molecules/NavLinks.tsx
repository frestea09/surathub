
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Package,
  LineChart,
  Bell,
  UserCog,
  Settings,
  History,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/surat-masuk", label: "Surat Masuk", icon: FileText },
  { href: "/surat-keluar", label: "Surat Keluar", icon: Package },
  { href: "/laporan", label: "Laporan", icon: LineChart },
  { href: "/notifikasi", label: "Notifikasi", icon: Bell },
  { href: "/admin", label: "Admin", icon: UserCog },
  { href: "/log-aktivitas", label: "Log Aktivitas", icon: History },
  { href: "/bantuan", label: "Bantuan", icon: HelpCircle },
];

const secondaryNavItem = { href: "/pengaturan", label: "Pengaturan", icon: Settings };

type NavLinksProps = {
  isMobile?: boolean;
};

export function NavLinks({ isMobile = false }: NavLinksProps) {
  const pathname = usePathname();

  if (isMobile) {
    const allItems = [...mainNavItems, secondaryNavItem];
    return (
      <nav className="grid gap-2 text-lg font-medium">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M22 12h-6l-2 3h-4l-2-3H2" />
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
          </svg>
          <span className="sr-only">SuratHub</span>
        </Link>
        {allItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
              pathname === item.href && "bg-muted text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  // Desktop
  return (
    <>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === item.href && "bg-muted text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <Link
            href={secondaryNavItem.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              pathname === secondaryNavItem.href && "bg-muted text-primary"
            )}
          >
            <secondaryNavItem.icon className="h-4 w-4" />
            {secondaryNavItem.label}
          </Link>
        </nav>
      </div>
    </>
  );
}
