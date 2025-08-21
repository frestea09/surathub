
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  LineChart,
  Bell,
  UserCog,
  Settings,
  History,
  HelpCircle,
  PackageSearch,
  Mailbox,
  Send,
  BarChart2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { useUserStore } from "@/store/userStore";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const navGroups = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Manajemen Surat",
    icon: FileText,
    subItems: [
      { href: "/surat-masuk", label: NAV_LINKS.SURAT_MASUK, icon: Mailbox },
      { href: "/surat-keluar", label: NAV_LINKS.SURAT_KELUAR, icon: Send },
      { href: "/arsip-bundle", label: NAV_LINKS.ARSIP_BUNDLE, icon: PackageSearch },
    ],
  },
  {
    title: "Laporan",
    href: "/laporan",
    icon: BarChart2,
  },
  {
    title: "Notifikasi",
    href: "/notifikasi",
    icon: Bell,
  },
  {
    title: "Administrasi",
    icon: UserCog,
    subItems: [
      { href: "/admin", label: NAV_LINKS.ADMIN, icon: Users },
      { href: "/log-aktivitas", label: NAV_LINKS.LOG_AKTIVITAS, icon: History },
      { href: "/pengaturan", label: NAV_LINKS.PENGATURAN, icon: Settings },
    ],
  },
  {
    title: "Bantuan",
    href: "/bantuan",
    icon: HelpCircle,
  },
];

type NavLinksProps = {
  isMobile?: boolean;
};

export function NavLinks({ isMobile = false }: NavLinksProps) {
  const pathname = usePathname();
  const { activeUser } = useUserStore();

  const vendorHiddenRoutes = ["/dashboard", "/admin", "/log-aktivitas", "/laporan", "/pengaturan"];

  const visibleNavGroups =
    activeUser?.jabatan === "Vendor"
      ? navGroups.filter((group) => !group.href || !vendorHiddenRoutes.includes(group.href))
      : navGroups;

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };
  
  const getAccordionValue = () => {
    const activeGroup = visibleNavGroups.find(group => 
      group.subItems?.some(item => isActive(item.href))
    );
    return activeGroup ? [activeGroup.title] : [];
  }

  // Mobile view remains a flat list for simplicity
  if (isMobile) {
    const allItems = visibleNavGroups.flatMap(group => 
      group.href ? [{ href: group.href, label: group.title, icon: group.icon }] : 
      (group.subItems ? group.subItems.map(item => ({...item, icon: item.icon})) : [])
    );
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
              isActive(item.href) && "bg-muted text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  // Desktop view with Accordion for sub-menus
  return (
    <div className="flex-1">
        <Accordion type="multiple" defaultValue={getAccordionValue()} className="w-full">
            {visibleNavGroups.map((group) => (
              group.subItems ? (
                <AccordionItem key={group.title} value={group.title} className="border-b-0">
                  <AccordionTrigger className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary hover:no-underline",
                    group.subItems.some(item => isActive(item.href)) && "text-primary"
                  )}>
                     <group.icon className="h-5 w-5" />
                     {group.title}
                  </AccordionTrigger>
                  <AccordionContent className="pl-6 pt-1 pb-1">
                    <nav className="grid items-start gap-1">
                      {group.subItems.map(item => (
                         <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary text-sm",
                            isActive(item.href) && "bg-muted text-primary font-semibold"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      ))}
                    </nav>
                  </AccordionContent>
                </AccordionItem>
              ) : (
                 <Link
                  key={group.href}
                  href={group.href || "/"}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary",
                    isActive(group.href || "/") && "bg-muted text-primary"
                  )}
                >
                  <group.icon className="h-5 w-5" />
                  {group.title}
                </Link>
              )
            ))}
        </Accordion>
    </div>
  );
}
