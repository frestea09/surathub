
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  XCircle,
  CheckCircle,
  Clock,
  Download,
  FilePenLine,
  FileText,
  Mailbox,
  MoreHorizontal,
  Send,
  Share2,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Cell } from "recharts";
import { DateRange } from "react-day-picker";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/ui/data-table";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppLayout } from "@/components/templates/AppLayout";
import { useSurat, type Surat as SuratLaporan } from "@/hooks/useSurat";
import { Skeleton } from "@/components/ui/skeleton";

const mockUsers = [
    { id: 'admin', name: 'Admin Utama', role: 'Administrator Sistem', unit: 'All' },
    { id: 'direktur', name: 'dr. H. Yani Sumpena Muchtar, SH, MH.Kes', role: 'Direktur', unit: 'All' },
    { id: 'keuangan', name: 'Jane Doe', role: 'Kepala Bagian Keuangan', unit: 'Keuangan' },
    { id: 'ppk', name: 'Saep Trian Prasetia.S.Si.Apt', role: 'Pejabat Pembuat Komitmen', unit: 'Pengadaan' },
    { id: 'ppbj', name: 'Deti Hapitri, A.Md.Gz', role: 'Pejabat Pengadaan Barang Jasa', unit: 'Pengadaan' },
    { id: 'staf', name: 'Staf Umum', role: 'Staf/Pengguna', unit: 'Umum' },
    { id: 'yanmed', name: 'Dr. Anisa Fitriani, Sp.A', role: 'Kepala Bidang Pelayanan Medik', unit: 'Pelayanan' },
];

const COLORS = ["#FFB347", "#77B5FE", "#82ca9d", "#d1d5db", "#FF6961"];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Baru: "secondary",
  Draft: "secondary",
  Didisposisikan: "outline",
  Terkirim: "default",
  Selesai: "default",
  Diarsipkan: "outline",
  Ditolak: "destructive",
};

const StatCardSkeleton = () => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-8 w-1/4 mb-2" />
            <Skeleton className="h-3 w-full" />
        </CardContent>
    </Card>
);

const ChartSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-[300px] w-full" />
        </CardContent>
    </Card>
);

export default function LaporanPage() {
  const { toast } = useToast();
  const { surat: allSuratData, isLoading, error } = useSurat();
  const [selectedSurat, setSelectedSurat] = useState<SuratLaporan | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAlurOpen, setIsAlurOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(mockUsers[0]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(new Date().getFullYear(), 11, 31),
  });


  const handleRoleChange = (userId: string) => {
      const user = mockUsers.find(u => u.id === userId);
      if(user) {
          setCurrentUser(user);
      }
  };

  const { filteredData, dynamicStatCards, suratVolumeData, statusDistributionData } = useMemo(() => {
    let dataByUnit = (currentUser.unit === 'All')
      ? allSuratData || []
      : (allSuratData || []).filter(s => s.unit === currentUser.unit);
      
    const dataByDate = date?.from
      ? dataByUnit.filter(surat => {
          const suratDate = new Date(surat.tanggal);
          const from = date.from!;
          const to = date.to ? new Date(date.to.setHours(23, 59, 59, 999)) : new Date(from.setHours(23, 59, 59, 999));
          return suratDate >= from && suratDate <= to;
      })
      : dataByUnit;

    const cards = [
      {
        title: "Waktu Proses Rata-Rata",
        value: "1.2 Hari",
        description: "Turun 0.2 hari dari bulan lalu",
        icon: Clock,
      },
      {
        title: "Surat Ditolak",
        value: dataByDate.filter(s => s.status === 'Ditolak').length.toString(),
        description: "Total surat yang ditolak",
        icon: XCircle,
      },
      {
        title: "Selesai Bulan Ini",
        value: dataByDate.filter(s => s.status === 'Selesai').length.toString(),
        description: "+20.1% dari bulan lalu",
        icon: CheckCircle,
      },
      {
        title: "Total Surat Dibuat",
        value: dataByDate.length.toString(),
        description: "Total semua surat masuk & keluar",
        icon: FileText,
      },
    ];
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const volumeData = monthNames.map((monthName, index) => ({
      name: monthName,
      total: dataByDate.filter(s => new Date(s.tanggal).getMonth() === index).length
    }));
    
    const statusData = [
      { name: "Baru / Draft", value: dataByDate.filter(s => s.status === 'Baru' || s.status === 'Draft').length },
      { name: "Diproses / Terkirim", value: dataByDate.filter(s => s.status === 'Didisposisikan' || s.status === 'Terkirim').length },
      { name: "Selesai", value: dataByDate.filter(s => s.status === 'Selesai').length },
      { name: "Diarsipkan", value: dataByDate.filter(s => s.status === 'Diarsipkan').length },
      { name: "Ditolak", value: dataByDate.filter(s => s.status === 'Ditolak').length },
    ].filter(item => item.value > 0);

    return { filteredData: dataByDate, dynamicStatCards: cards, suratVolumeData: volumeData, statusDistributionData: statusData };
  }, [currentUser, date, allSuratData]);


  const handleExport = () => {
    if (filteredData.length === 0) {
        toast({
            variant: "destructive",
            title: "Gagal Ekspor",
            description: "Tidak ada data untuk diekspor pada rentang tanggal yang dipilih.",
        });
        return;
    }
    
    const headers = ["Nomor Surat", "Perihal", "Jenis", "Tanggal", "Dari/Ke", "Status Saat Ini", "Penanggung Jawab", "Unit"];
    
    const csvRows = [
        headers.join(','),
        ...filteredData.map(row => 
            [
                `"${row.nomor}"`,
                `"${row.judul.replace(/"/g, '""')}"`,
                `"${row.jenis}"`,
                `"${row.tanggal}"`,
                `"${row.dariKe}"`,
                `"${row.status}"`,
                `"${row.penanggungJawab}"`,
                `"${row.unit}"`
            ].join(',')
        )
    ];
    
    const csvString = csvRows.join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `laporan-surat-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    toast({
        title: "Ekspor Berhasil",
        description: "Data laporan telah berhasil diunduh.",
    });
  };

  const handleActionClick = (surat: SuratLaporan, action: 'detail' | 'alur') => {
    setSelectedSurat(surat);
    if (action === 'detail') {
      setIsDetailOpen(true);
    } else if (action === 'alur') {
      setIsAlurOpen(true);
    }
  };

  const columns: ColumnDef<SuratLaporan>[] = [
      {
          accessorKey: "nomor",
          header: "Nomor Surat",
      },
      {
          accessorKey: "judul",
          header: "Perihal",
      },
      {
          accessorKey: "jenis",
          header: "Jenis",
          cell: ({ row }) => {
              const jenis = row.original.jenis;
              return <Badge variant={jenis === 'Surat Masuk' ? 'secondary' : 'outline'}>{jenis}</Badge>
          }
      },
      {
          accessorKey: "tanggal",
          header: "Tanggal",
      },
      {
          accessorKey: "dariKe",
          header: "Dari/Ke",
      },
      {
          accessorKey: "status",
          header: "Status Saat Ini",
           cell: ({ row }) => {
              const status = row.original.status;
              return <Badge variant={statusVariant[status as keyof typeof statusVariant]}>{status}</Badge>
          }
      },
      {
          accessorKey: "penanggungJawab",
          header: "Penanggung Jawab",
      },
      {
          id: "actions",
          cell: ({ row }) => {
              const surat = row.original;
              return (
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleActionClick(surat, 'detail')}>Lihat Detail Surat</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleActionClick(surat, 'alur')}>Lihat Alur Lengkap</DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
              )
          }
      }
  ];

  if (error) {
    return (
        <AppLayout>
             <Card className="bg-destructive/10 border-destructive/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle />
                        Gagal Memuat Data Laporan
                    </CardTitle>
                    <CardDescription className="text-destructive">
                        Terjadi kesalahan saat mengambil data surat untuk laporan. Silakan coba muat ulang halaman.
                    </CardDescription>
                </CardHeader>
            </Card>
        </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Laporan ({currentUser.role})</h1>
          <div className="w-64">
            <Label htmlFor="role-switcher-laporan">Tampilan Sebagai:</Label>
            <Select value={currentUser.id} onValueChange={handleRoleChange}>
                <SelectTrigger id="role-switcher-laporan">
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
        {isLoading ? (
            <>
                <StatCardSkeleton/>
                <StatCardSkeleton/>
                <StatCardSkeleton/>
                <StatCardSkeleton/>
            </>
        ) : (
            dynamicStatCards.map((card, index) => (
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
            ))
        )}
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        {isLoading ? (
            <>
                <ChartSkeleton />
                <ChartSkeleton />
            </>
        ) : (
            <>
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
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
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
            </>
        )}
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Laporan Rinci Semua Surat</CardTitle>
            <CardDescription>Lacak alur dan status semua surat dalam sistem untuk {currentUser.unit === 'All' ? 'semua unit' : `unit ${currentUser.unit}`}.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
              <DateRangePicker date={date} setDate={setDate} />
              <Button onClick={handleExport} disabled={isLoading}>
                <Download className="mr-2 h-4 w-4" />
                Ekspor
              </Button>
          </div>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                 <div className="space-y-4">
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-8 w-1/3 ml-auto" />
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredData}
                />
            )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Surat</DialogTitle>
            <DialogDescription>
              Detail lengkap dari surat yang dipilih.
            </DialogDescription>
          </DialogHeader>
          {selectedSurat && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nomor" className="text-right">Nomor</Label>
                <Input id="nomor" value={selectedSurat.nomor} readOnly className="col-span-3" />
              </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="perihal" className="text-right">Perihal</Label>
                <Input id="perihal" value={selectedSurat.judul} readOnly className="col-span-3" />
              </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="jenis" className="text-right">Jenis</Label>
                <Input id="jenis" value={selectedSurat.jenis} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tanggal" className="text-right">Tanggal</Label>
                <Input id="tanggal" value={selectedSurat.tanggal} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dariKe" className="text-right">Dari/Ke</Label>
                <Input id="dariKe" value={selectedSurat.dariKe} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Input id="status" value={selectedSurat.status} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="penanggungJawab" className="text-right">P. Jawab</Label>
                <Input id="penanggungJawab" value={selectedSurat.penanggungJawab} readOnly className="col-span-3" />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Tutup</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Alur Dialog */}
      <Dialog open={isAlurOpen} onOpenChange={setIsAlurOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alur Lengkap Surat</DialogTitle>
            <DialogDescription>
              Linimasa perjalanan surat nomor <span className="font-semibold">{selectedSurat?.nomor}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedSurat?.jenis === 'Surat Masuk' ? (
              <ul className="space-y-4">
                  <li className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white"><Mailbox className="h-4 w-4" /></div>
                          <div className="w-px h-16 bg-border"></div>
                      </div>
                      <div>
                          <p className="font-semibold">Surat Diterima</p>
                          <p className="text-sm text-muted-foreground">Oleh: Admin, Pada: {selectedSurat.tanggal}</p>
                          <p className="text-sm">Surat diterima dari {selectedSurat.dariKe}.</p>
                      </div>
                  </li>
                  <li className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white"><Share2 className="h-4 w-4" /></div>
                            <div className="w-px h-16 bg-border"></div>
                        </div>
                        <div>
                          <p className="font-semibold">Disposisi</p>
                          <p className="text-sm text-muted-foreground">Oleh: Admin, Kepada: {selectedSurat.penanggungJawab}</p>
                          <p className="text-sm">Surat diteruskan untuk ditindaklanjuti.</p>
                        </div>
                  </li>
                    <li className="flex items-start">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full text-white"><CheckCircle className="h-4 w-4" /></div>
                        <div className="ml-4">
                          <p className="font-semibold">Proses Selesai</p>
                          <p className="text-sm text-muted-foreground">Oleh: {selectedSurat.penanggungJawab}</p>
                          <p className="text-sm">{selectedSurat.status === 'Selesai' || selectedSurat.status === 'Diarsipkan' ? 'Tindakan yang diperlukan telah selesai.' : 'Surat masih dalam proses.'}</p>
                        </div>
                    </li>
              </ul>
            ) : (
                <ul className="space-y-4">
                  <li className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white"><FilePenLine className="h-4 w-4" /></div>
                          <div className="w-px h-16 bg-border"></div>
                      </div>
                      <div>
                          <p className="font-semibold">Draft Dibuat</p>
                          <p className="text-sm text-muted-foreground">Oleh: {selectedSurat?.penanggungJawab}, Pada: {selectedSurat?.tanggal}</p>
                          <p className="text-sm">Surat sedang dalam proses pembuatan.</p>
                      </div>
                  </li>
                    <li className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-white"><UserCheck className="h-4 w-4" /></div>
                          <div className="w-px h-16 bg-border"></div>
                      </div>
                      <div>
                        <p className="font-semibold">Disetujui</p>
                        <p className="text-sm text-muted-foreground">{selectedSurat?.status !== 'Draft' ? 'Oleh: Atasan Terkait' : 'Menunggu persetujuan'}</p>
                        <p className="text-sm">Persetujuan internal untuk pengiriman.</p>
                      </div>
                  </li>
                  <li className="flex items-start">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full text-white"><Send className="h-4 w-4" /></div>
                        <div className="ml-4">
                        <p className="font-semibold">Surat Terkirim</p>
                        <p className="text-sm text-muted-foreground">{selectedSurat?.status === 'Terkirim' ? `Kepada: ${selectedSurat?.dariKe}` : 'Surat belum dikirim'}</p>
                        <p className="text-sm">Surat telah dikirimkan ke tujuan.</p>
                      </div>
                  </li>
              </ul>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Tutup</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
