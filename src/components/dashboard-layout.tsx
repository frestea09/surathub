'use client';

import {
  Bell,
  FileText,
  Home,
  LineChart,
  Package,
  PanelLeft,
  Search,
  Settings,
  UserCog,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BuatSuratButton } from '@/components/buat-surat-button';
import { Link, usePathname, useRouter } from '@/navigation';
import LanguageSwitcher from './language-switcher';

type DashboardLayoutProps = {
  children: React.ReactNode;
  active_nav: 'dashboard' | 'surat-masuk' | 'surat-keluar' | 'laporan' | 'notifikasi' | 'admin' | 'pengaturan';
};

const notifications = [
  {
    title: "Surat Baru Diterima",
    description: "Surat dari Kemenkes perihal Undangan Rapat.",
    time: "5 menit lalu",
    link: "/surat-masuk",
  },
  {
    title: "Disposisi Berhasil",
    description: "Surat 005/B/FIN/2024 telah didisposisikan.",
    time: "1 jam lalu",
    link: "/surat-masuk",
  },
  {
    title: "Surat Telah Diarsipkan",
    description: "Surat BAST-2024-04-098 telah diarsipkan.",
    time: "Kemarin",
    link: "/surat-keluar",
  },
];


export default function DashboardLayout({ children, active_nav }: DashboardLayoutProps) {
  const t = useTranslations('DashboardLayout');
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', icon: Home, label: t('sidebar.dashboard'), key: 'dashboard' },
    { href: '/surat-masuk', icon: FileText, label: t('sidebar.incomingMail'), key: 'surat-masuk' },
    { href: '/surat-keluar', icon: Package, label: t('sidebar.outgoingMail'), key: 'surat-keluar' },
    { href: '/laporan', icon: LineChart, label: t('sidebar.reports'), key: 'laporan' },
    { href: '/notifikasi', icon: Bell, label: t('sidebar.notifications'), key: 'notifikasi' },
    { href: '/admin', icon: UserCog, label: t('sidebar.admin'), key: 'admin' },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
              <span>SuratHub</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    active_nav === link.key ? 'bg-muted text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/pengaturan"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    active_nav === 'pengaturan' ? 'bg-muted text-primary' : 'text-muted-foreground'
                  }`}
              >
                <Settings className="h-4 w-4" />
                {t('sidebar.settings')}
              </Link>
            </nav>
          </div>
        </div>
      </aside>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                 <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
                    <span>SuratHub</span>
                  </Link>
                {navLinks.map(link => (
                    <Link
                        key={link.key}
                        href={link.href}
                        className={`-mx-3 flex items-center gap-4 rounded-xl px-3 py-2 ${
                            active_nav === link.key ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                    </Link>
                ))}
                 <Link
                    href="/pengaturan"
                    className={`-mx-3 flex items-center gap-4 rounded-xl px-3 py-2 ${
                        active_nav === 'pengaturan' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <Settings className="h-5 w-5" />
                    {t('sidebar.settings')}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('searchPlaceholder')}
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <LanguageSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative h-8 w-8 rounded-full">
                <Badge className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0 text-xs">{notifications.length}</Badge>
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>{t('notifications')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notif, index) => (
                <DropdownMenuItem key={index} className="flex flex-col items-start gap-1 whitespace-normal" onClick={() => router.push(notif.link)}>
                  <p className="font-semibold">{notif.title}</p>
                  <p className="text-xs text-muted-foreground">{notif.description}</p>
                  <p className="text-xs text-muted-foreground">{notif.time}</p>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-sm text-primary" onClick={() => router.push('/notifikasi')}>
                {t('viewAllNotifications')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <BuatSuratButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/32x32.png" alt="User" data-ai-hint="user avatar" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('userMenuLabel')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profil')}>{t('profile')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/pengaturan')}>{t('settings')}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/')}>{t('logout')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
        </main>
      </div>
    </div>
  );
}
