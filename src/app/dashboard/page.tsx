
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";
import {
  Bell,
  CheckCircle,
  FileClock,
  FileStack,
  FileText,
  Home,
  LineChart,
  MoreHorizontal,
  Package,
  PanelLeft,
  Search,
  Settings,
  UserCog,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardChart } from "@/components/dashboard-chart";
import { BuatSuratButton } from "@/components/buat-surat-button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockUsers = [
    { id: 'admin', name: 'Admin', role: 'Admin', unit: 'All' },
    { id: 'direktur', name: 'Dr. H. Yani Sumpena', role: 'Direktur', unit: 'All' },
    { id: 'kabag-keuangan', name: 'Jane Doe', role: 'Kepala Bagian Keuangan', unit: 'Keuangan' },
    { id: 'ppk', name: 'Saep Trian Prasetia', role: 'Pejabat Pembuat Komitmen', unit: 'Pengadaan' },
    { id: 'kabag-umum', name: 'Budi Darmawan', role: 'Kepala Bagian Umum', unit: 'Umum' },
];

const allSuratData = [
  { nomor: "SP-2024-05-001", judul: "Surat Perintah Pengadaan ATK", jenis: "SPP", status: "Diproses", tanggal: "2024-05-20", unit: "Umum", penanggungJawab: "Admin" },
  { nomor: "BA-2024-05-015", judul: "Berita Acara Pemeriksaan Barang", jenis: "BA", status: "Disetujui", tanggal: "2024-05-18", unit: "Pengadaan", penanggungJawab: "Saep Trian Prasetia" },
  { nomor: "ND-2024-05-032", judul: "Nota Dinas Rapat Koordinasi", jenis: "Nota Dinas", status: "Terkirim", tanggal: "2024-05-17", unit: "Pimpinan", penanggungJawab: "Dr. H. Yani Sumpena" },
  { nomor: "BAST-2024-04-098", judul: "BAST Pengadaan Komputer", jenis: "BAST", status: "Selesai", tanggal: "2024-04-30", unit: "Keuangan", penanggungJawab: "Jane Doe" },
  { nomor: "SP-2024-05-002", judul: "Surat Perintah Perbaikan AC", jenis: "SPP", status: "Ditolak", tanggal: "2024-05-21", unit: "Umum", penanggungJawab: "Admin" },
  { nomor: "ND-2024-05-033", judul: "Nota Dinas Cuti Tahunan", jenis: "Nota Dinas", status: "Terkirim", tanggal: "2024-05-22", unit: "Kepegawaian", penanggungJawab: "Kepala Bagian Umum" },
  { nomor: "INV/2024/07/998", perihal: "Invoice Pembelian ATK", jenis: "Masuk", tanggal: "2024-07-26", unit: "Keuangan", penanggungJawab: "Admin" },
  { noSurat: "123/A/UM/2024", perihal: "Undangan Rapat Koordinasi", jenis: "Masuk", tanggal: "2024-07-25", unit: "Pimpinan", penanggungJawab: "Direktur Utama" },
];


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

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Disetujui: "default",
  Selesai: "default",
  Diproses: "secondary",
  Terkirim: "outline",
  Ditolak: "destructive",
};

export default function DashboardPage() {
  const router = useRouter();
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);
  const [currentUser, setCurrentUser] = useState(mockUsers[0]);

  const handleRoleChange = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
        setCurrentUser(user);
    }
  };

  const { filteredSurat, dynamicStatCards } = useMemo(() => {
      const surat = (currentUser.unit === 'All') 
          ? allSuratData 
          : allSuratData.filter(s => s.unit === currentUser.unit);

      const cards = [
        {
          title: "Surat Diproses",
          value: surat.filter(s => s.status === 'Diproses').length.toString(),
          description: "Surat dalam proses pengerjaan",
          icon: FileClock,
        },
        {
          title: "Jatuh Tempo",
          value: surat.filter(s => s.status === 'Ditolak').length.toString(), // Example logic
          description: "Surat perlu perhatian segera",
          icon: Bell,
        },
        {
          title: "Selesai Bulan Ini",
          value: surat.filter(s => s.status === 'Selesai' || s.status === 'Disetujui').length.toString(),
          description: "Total surat yang sudah selesai",
          icon: CheckCircle,
        },
        {
          title: "Total Arsip",
          value: surat.length.toString(),
          description: "Total semua surat terarsip",
          icon: FileStack,
        },
      ];

      return { filteredSurat: surat, dynamicStatCards: cards };
  }, [currentUser]);


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
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
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
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
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
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
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
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Pengaturan
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
                  placeholder="Cari surat..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
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
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard ({currentUser.role})</h1>
             <div className="w-64">
                <Label htmlFor="role-switcher">Tampilan Sebagai:</Label>
                <Select value={currentUser.id} onValueChange={handleRoleChange}>
                    <SelectTrigger id="role-switcher">
                        <SelectValue placeholder="Pilih Peran" />
                    </SelectTrigger>
                    <SelectContent>
                        {mockUsers.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                                {user.name} ({user.role})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {dynamicStatCards.map((card, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <DashboardChart data={filteredSurat} />
            <Card className="xl:col-span-2">
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                  <CardTitle>Surat Terbaru</CardTitle>
                  <CardDescription>
                    Daftar surat yang baru-baru ini diproses untuk {currentUser.unit === 'All' ? 'semua unit' : `unit ${currentUser.unit}`}.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. Surat</TableHead>
                      <TableHead>Judul</TableHead>
                      <TableHead className="text-center">Jenis</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Tanggal</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSurat.slice(0, 6).map((surat) => (
                      <TableRow key={surat.nomor}>
                        <TableCell className="font-medium">
                          {surat.nomor}
                        </TableCell>
                        <TableCell>{surat.judul || surat.perihal}</TableCell>
                        <TableCell className="text-center">{surat.jenis}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={statusVariant[surat.status as keyof typeof statusVariant] || 'default'}>
                            {surat.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{surat.tanggal}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                              <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                              <DropdownMenuItem>Lacak</DropdownMenuItem>
                              <DropdownMenuItem>Unduh PDF</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

    