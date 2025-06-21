
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Home,
  LineChart,
  MoreHorizontal,
  Package,
  PanelLeft,
  Settings,
  UserCog,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Cell } from "recharts";
import { DateRange } from "react-day-picker";

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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BuatSuratButton } from "@/components/buat-surat-button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useToast } from "@/hooks/use-toast";

const statCards = [
  {
    title: "Waktu Proses Rata-Rata",
    value: "1.2 Hari",
    description: "Turun 0.2 hari dari bulan lalu",
    icon: Clock,
  },
  {
    title: "Surat Lewat Tenggat",
    value: "3",
    description: "Perlu perhatian segera",
    icon: AlertTriangle,
  },
  {
    title: "Selesai Bulan Ini",
    value: "129",
    description: "+20.1% dari bulan lalu",
    icon: CheckCircle,
  },
  {
    title: "Total Surat Dibuat",
    value: "350",
    description: "Total semua surat masuk & keluar",
    icon: FileText,
  },
];

const suratVolumeData = [
  { name: "Jan", total: 110 },
  { name: "Feb", total: 150 },
  { name: "Mar", total: 90 },
  { name: "Apr", total: 180 },
  { name: "Mei", total: 120 },
  { name: "Jun", total: 210 },
  { name: "Jul", total: 140 },
];

const statusDistributionData = [
  { name: "Baru / Draft", value: 40 },
  { name: "Diproses / Terkirim", value: 78 },
  { name: "Selesai", value: 129 },
  { name: "Diarsipkan", value: 2350 },
];

const COLORS = ["#FFB347", "#77B5FE", "#82ca9d", "#d1d5db"];

const allSuratData = [
  { noSurat: "123/A/UM/2024", perihal: "Undangan Rapat Koordinasi", jenis: "Masuk", tanggal: "2024-07-25", dariKe: "Kemenkes", status: "Didisposisikan", penanggungJawab: "Direktur Utama" },
  { noSurat: "001/SP/RSUD-O/VII/2024", perihal: "Surat Perintah Pengadaan ATK", jenis: "Keluar", tanggal: "2024-07-28", dariKe: "Pejabat Pengadaan", status: "Terkirim", penanggungJawab: "Admin" },
  { noSurat: "003/BA/RSUD-O/VII/2024", perihal: "Berita Acara Pemeriksaan", jenis: "Keluar", tanggal: "2024-07-30", dariKe: "Internal", status: "Draft", penanggungJawab: "Admin" },
  { noSurat: "PNW/2024/VI/045", perihal: "Penawaran Kerjasama", jenis: "Masuk", tanggal: "2024-07-22", dariKe: "PT. Medika Jaya", status: "Selesai", penanggungJawab: "Bagian Pengadaan" },
  { noSurat: "004/BASTB/RSUD-O/VII/2024", perihal: "Berita Acara Serah Terima", jenis: "Keluar", tanggal: "2024-07-31", dariKe: "Internal", status: "Diarsipkan", penanggungJawab: "Sistem" },
  { noSurat: "INV/2024/07/998", perihal: "Invoice Pembelian ATK", jenis: "Masuk", tanggal: "2024-07-26", dariKe: "CV. ATK Bersama", status: "Baru", penanggungJawab: "Admin" },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Baru: "secondary",
  Draft: "secondary",
  Didisposisikan: "outline",
  Terkirim: "default",
  Selesai: "default",
  Diarsipkan: "outline",
};

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
];


export default function LaporanPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);

  const handleExport = () => {
    toast({
      title: "Fitur Dalam Pengembangan",
      description: "Fungsi ekspor data laporan akan segera tersedia.",
    });
  };

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
              <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link href="/surat-masuk" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <FileText className="h-4 w-4" />
                Surat Masuk
              </Link>
              <Link href="/surat-keluar" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Package className="h-4 w-4" />
                Surat Keluar
              </Link>
              <Link href="/laporan" className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary">
                <LineChart className="h-4 w-4" />
                Laporan
              </Link>
              <Link href="/notifikasi" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Bell className="h-4 w-4" />
                Notifikasi
              </Link>
              <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <UserCog className="h-4 w-4" />
                Admin
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link href="/pengaturan" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
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
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
                  <span className="sr-only">SuratHub</span>
                </Link>
                <Link href="/dashboard" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link href="/surat-masuk" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                  <FileText className="h-5 w-5" />
                  Surat Masuk
                </Link>
                <Link href="/surat-keluar" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                  <Package className="h-5 w-5" />
                  Surat Keluar
                </Link>
                <Link href="/laporan" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground">
                  <LineChart className="h-5 w-5" />
                  Laporan
                </Link>
                <Link href="/notifikasi" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                  <Bell className="h-5 w-5" />
                  Notifikasi
                </Link>
                <Link href="/admin" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                  <UserCog className="h-5 w-5" />
                  Admin
                </Link>
                 <Link href="/pengaturan" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
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
            <h1 className="text-lg font-semibold md:text-2xl">Laporan</h1>
          </div>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {statCards.map((card, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Volume Surat per Bulan</CardTitle>
                <CardDescription>Jumlah total surat masuk dan keluar yang tercatat setiap bulan.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={suratVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#77B5FE" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle>Distribusi Status Surat</CardTitle>
                <CardDescription>Proporsi surat berdasarkan statusnya saat ini.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={statusDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                       {statusDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Laporan Rinci Semua Surat</CardTitle>
                <CardDescription>Lacak alur dan status semua surat dalam sistem.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                 <DateRangePicker />
                 <Button onClick={handleExport}>
                   <Download className="mr-2 h-4 w-4" />
                   Ekspor
                 </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nomor Surat</TableHead>
                    <TableHead>Perihal</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Tgl</TableHead>
                    <TableHead>Dari/Ke</TableHead>
                    <TableHead>Status Saat Ini</TableHead>
                    <TableHead>Penanggung Jawab</TableHead>
                    <TableHead><span className="sr-only">Aksi</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allSuratData.map((surat) => (
                    <TableRow key={surat.noSurat}>
                      <TableCell className="font-medium">{surat.noSurat}</TableCell>
                      <TableCell>{surat.perihal}</TableCell>
                      <TableCell>
                         <Badge variant={surat.jenis === 'Masuk' ? 'secondary' : 'outline'}>{surat.jenis}</Badge>
                      </TableCell>
                      <TableCell>{surat.tanggal}</TableCell>
                      <TableCell>{surat.dariKe}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[surat.status as keyof typeof statusVariant]}>{surat.status}</Badge>
                      </TableCell>
                      <TableCell>{surat.penanggungJawab}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem>Lihat Detail Surat</DropdownMenuItem>
                            <DropdownMenuItem>Lihat Alur Lengkap</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
