
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Home,
  LineChart,
  Package,
  PanelLeft,
  Settings,
  FileText,
  UserCog,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BuatSuratButton } from "@/components/buat-surat-button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const notifications = [
  {
    title: "Surat Baru Diterima",
    description: "Surat dari Kemenkes perihal Undangan Rapat.",
    time: "5 menit lalu",
  },
  {
    title: "Disposisi Berhasil",
    description: "Surat 005/B/FIN/2024 telah didisposisikan.",
    time: "1 jam lalu",
  },
  {
    title: "Surat Telah Diarsipkan",
    description: "Surat BAST-2024-04-098 telah diarsipkan.",
    time: "Kemarin",
  },
];

export default function PengaturanPage() {
  const router = useRouter();
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
              <span className="">SuratHub</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/surat-masuk"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <FileText className="h-4 w-4" />
                Surat Masuk
              </Link>
              <Link
                href="/surat-keluar"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                Surat Keluar
              </Link>
              <Link
                href="/laporan"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-4 w-4" />
                Laporan
              </Link>
              <Link
                href="/notifikasi"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Bell className="h-4 w-4" />
                Notifikasi
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <UserCog className="h-4 w-4" />
                Admin
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/pengaturan"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Pengaturan
              </Link>
            </nav>
          </div>
        </div>
      </aside>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
           <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
                  <span className="sr-only">SuratHub</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/surat-masuk"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <FileText className="h-5 w-5" />
                  Surat Masuk
                </Link>
                <Link
                  href="/surat-keluar"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Surat Keluar
                </Link>
                <Link
                  href="/laporan"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Laporan
                </Link>
                 <Link
                  href="/notifikasi"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Bell className="h-5 w-5" />
                  Notifikasi
                </Link>
                <Link
                  href="/admin"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <UserCog className="h-5 w-5" />
                  Admin
                </Link>
                 <Link
                  href="/pengaturan"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Pengaturan
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
           <DropdownMenu onOpenChange={(open) => { if (open) setShowNotificationBadge(false); }}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative h-8 w-8 rounded-full">
                {showNotificationBadge && notifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0 text-xs">{notifications.length}</Badge>
                )}
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notif, index) => (
                <DropdownMenuItem key={index} className="flex flex-col items-start gap-1 whitespace-normal" onClick={() => router.push('/surat-masuk')}>
                  <p className="font-semibold">{notif.title}</p>
                  <p className="text-xs text-muted-foreground">{notif.description}</p>
                  <p className="text-xs text-muted-foreground">{notif.time}</p>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-sm text-primary" onClick={() => router.push('/notifikasi')}>
                Lihat semua notifikasi
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
              <DropdownMenuLabel>Admin</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profil')}>Profil</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/pengaturan')}>Pengaturan</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/')}>Keluar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Pengaturan</h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Notifikasi</CardTitle>
              <CardDescription>
                Kelola preferensi notifikasi Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="email-notifications" defaultChecked />
                <Label htmlFor="email-notifications">Notifikasi Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="push-notifications" />
                <Label htmlFor="push-notifications">Notifikasi Push</Label>
              </div>
              <Button>Simpan Pengaturan</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
