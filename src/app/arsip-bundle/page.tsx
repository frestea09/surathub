
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { AppLayout } from '@/components/templates/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSuratStore, type Surat } from '@/store/suratStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { PackageSearch, FileText, ChevronRight, ChevronLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { roundHalfUp } from '@/lib/utils';

// Mapping from tipe to a more readable name
const tipeToLabel: { [key: string]: string } = {
    'SPP': '1. Surat Perintah',
    'SP': '2. Surat Pesanan (Internal)',
    'SP-Vendor': '3. Surat Pesanan (Vendor)',
    'BA': '4. BA Pemeriksaan',
    'BASTB': '5. BA Serah Terima',
    'SPU': '1. Surat Perintah Pengadaan',
    'BAH': '2. BA Hasil Pengadaan',
    'SP-Umum': '3. Surat Pesanan',
    'BA-Umum': '4. BA Pemeriksaan',
};

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Terkirim: "default",
  Draft: "secondary",
  Diarsipkan: "outline",
  Ditolak: "destructive",
  Selesai: "default",
  Baru: "secondary",
  Didisposisikan: "outline",
  Disetujui: "default",
};

// Forward chain: to find children
const forwardLinks: { [key: string]: { nextType: string[]; refKey: string; sourceKey: string; } } = {
    SPP: { nextType: ['SP'], refKey: 'nomorSuratReferensi', sourceKey: 'nomor' },
    SP: { nextType: ['SP-Vendor'], refKey: 'nomorSuratReferensi', sourceKey: 'nomor' },
    'SP-Vendor': { nextType: ['BA'], refKey: 'nomorSuratReferensi', sourceKey: 'nomor' },
    BA: { nextType: ['BASTB'], refKey: 'nomorBeritaAcara', sourceKey: 'nomor' },
    // Alur Umum
    SPU: { nextType: ['BAH'], refKey: 'nomorSuratReferensi', sourceKey: 'nomor' },
    BAH: { nextType: ['SP-Umum'], refKey: 'nomorSuratReferensi', sourceKey: 'nomor' },
    'SP-Umum': { nextType: ['BA-Umum'], refKey: 'nomorSuratReferensi', sourceKey: 'nomor' },
};

const formatCurrency = (value: number) => new Intl.NumberFormat("id-ID", { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

const calculateTotal = (surat: Surat): number => {
    if (!surat.data || !surat.data.items) return 0;
    const { items, formData } = surat.data;
    const ppn = formData?.ppn || 11;
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.volume || item.jumlah) * item.hargaSatuan, 0);
    const totalDiskon = items.reduce((sum: number, item: any) => sum + (item.volume || item.jumlah) * item.hargaSatuan * ((item.diskon || 0) / 100), 0);
    const totalAfterDiskon = subtotal - totalDiskon;
    const ppnValue = totalAfterDiskon * (ppn / 100);
    return roundHalfUp(totalAfterDiskon + ppnValue);
};

export default function ArsipBundlePage() {
    const { surat, isLoading, fetchAllSurat } = useSuratStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [date, setDate] = useState<DateRange | undefined>();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [activeTab, setActiveTab] = useState("bundle");

    useEffect(() => {
        fetchAllSurat();
    }, [fetchAllSurat]);

    // Memoized calculation for all bundles
    const allBundles = useMemo(() => {
        if (isLoading || surat.length === 0) return [];
        
        const bundlesMap = new Map<string, Surat[]>();

        const findChildrenRecursive = (doc: Surat, chain: Surat[]) => {
            chain.push(doc);
            const link = forwardLinks[doc.tipe];
            if (link) {
                const children = surat.filter(s =>
                    link.nextType.includes(s.tipe) &&
                    (s.data.formData?.[link.refKey] || s.data[link.refKey]) === (doc.data.formData?.[link.sourceKey] || doc.data[link.sourceKey])
                );
                children.forEach(child => {
                  if(!chain.some(c => c.nomor === child.nomor)) {
                     findChildrenRecursive(child, chain)
                  }
                });
            }
        };

        const bundleHeads = surat.filter(s => s.tipe === 'SPP' || s.tipe === 'SPU');

        bundleHeads.forEach(head => {
            const currentChain: Surat[] = [];
            findChildrenRecursive(head, currentChain);
            if (currentChain.length > 0) {
                bundlesMap.set(head.nomor, currentChain.sort((a,b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()));
            }
        });
        
        return Array.from(bundlesMap.values());
    }, [surat, isLoading]);

    // Memoized calculation for vendor orders only
    const vendorOrders = useMemo(() => {
        return surat.filter(s => s.tipe === 'SP-Vendor' || s.tipe === 'SP-Umum');
    }, [surat]);
    
    // Generic filtering logic
    const filterItems = (items: any[], isBundle: boolean) => {
        return items.filter(item => {
            const documents = isBundle ? item : [item];
            if (documents.length === 0) return false;

            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const matchesSearchTerm = lowerCaseSearchTerm === '' || documents.some((doc: Surat) => 
                doc.nomor.toLowerCase().includes(lowerCaseSearchTerm) || 
                doc.judul.toLowerCase().includes(lowerCaseSearchTerm) ||
                doc.dariKe.toLowerCase().includes(lowerCaseSearchTerm) ||
                doc.nomor.toLowerCase().split(/[\/\.-]/).some(part => part.includes(lowerCaseSearchTerm))
            );

            const matchesDateRange = !date?.from || documents.some((doc: Surat) => {
                 const docDate = new Date(doc.tanggal);
                 const from = date.from!;
                 const to = date.to ? new Date(date.to.setHours(23, 59, 59, 999)) : new Date(from.setHours(23, 59, 59, 999));
                 return docDate >= from && docDate <= to;
            });

            return matchesSearchTerm && matchesDateRange;
        });
    };
    
    const filteredBundles = useMemo(() => filterItems(allBundles, true), [allBundles, searchTerm, date]);
    const filteredVendorOrders = useMemo(() => filterItems(vendorOrders, false), [vendorOrders, searchTerm, date]);

    useEffect(() => {
      setCurrentPage(1);
    }, [searchTerm, date, activeTab]);

    const paginatedBundles = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return filteredBundles.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredBundles, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredBundles.length / itemsPerPage);

    const vendorOrderColumns: ColumnDef<Surat>[] = useMemo(() => [
        { accessorKey: "nomor", header: "Nomor Surat Pesanan" },
        { accessorKey: "judul", header: "Perihal" },
        { accessorKey: "dariKe", header: "Nama Vendor" },
        { accessorKey: "tanggal", header: "Tanggal Pesanan", cell: ({ row }) => format(new Date(row.original.tanggal), 'dd MMMM yyyy', { locale: id }) },
        { id: "total", header: "Total Nilai", cell: ({ row }) => formatCurrency(calculateTotal(row.original)) },
        { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={statusVariant[row.original.status as keyof typeof statusVariant] || 'secondary'}>{row.original.status}</Badge> },
        { id: "actions", header: "Aksi", cell: ({ row }) => (
            <Button asChild variant="outline" size="sm">
                <Link href={`/cetak-bundle?nomor=${row.original.nomor}&tipe=${row.original.tipe}`}>
                    <Eye className="h-4 w-4 mr-2" /> Lihat Bundle
                </Link>
            </Button>
        )},
    ], []);

    if (isLoading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-64" />
                </div>
                <div className="flex flex-wrap items-center gap-2 py-4">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-64" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Arsip Dokumen</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Filter Dokumen</CardTitle>
                    <CardDescription>Cari berdasarkan nomor surat, perihal, nama vendor, atau bagian no. surat (misal: 06-FAR, ppkrsud, 2025).</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-4">
                    <Input
                        placeholder="Cari no. surat, perihal, vendor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                    <DateRangePicker date={date} setDate={setDate} />
                </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList>
                    <TabsTrigger value="bundle">Bundle Lengkap</TabsTrigger>
                    <TabsTrigger value="vendor">Pesanan Vendor</TabsTrigger>
                </TabsList>
                <TabsContent value="bundle">
                    <div className="mt-6">
                        {filteredBundles.length > 0 ? (
                            <>
                                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                    {paginatedBundles.map(bundle => {
                                        const head = bundle[0];
                                        const firstDate = new Date(bundle[0].tanggal);
                                        const lastDate = new Date(bundle[bundle.length - 1].tanggal);
                                        const dateRange = format(firstDate, "dd MMM", { locale: id }) + (firstDate.getTime() !== lastDate.getTime() ? ` - ${format(lastDate, "dd MMM yyyy", { locale: id })}` : ` ${format(lastDate, "yyyy", { locale: id })}`);

                                        return (
                                            <Card key={head.nomor} className="flex flex-col">
                                                <CardHeader>
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                            <PackageSearch className="h-6 w-6" />
                                                        </div>
                                                        <div>
                                                            <CardTitle className="text-base">{head.judul}</CardTitle>
                                                            <CardDescription>{dateRange} • {bundle.length} Dokumen</CardDescription>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="flex-grow">
                                                    <ul className="space-y-2">
                                                        {bundle.map(doc => (
                                                            <li key={doc.nomor} className="flex items-center justify-between text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                                    <span className="text-muted-foreground">{tipeToLabel[doc.tipe] || doc.tipe}</span>
                                                                </div>
                                                                <Badge variant={statusVariant[doc.status as keyof typeof statusVariant] || 'secondary'}>{doc.status}</Badge>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                                <div className="p-6 pt-0">
                                                    <Button asChild className="w-full">
                                                        <Link href={`/cetak-bundle?nomor=${head.nomor}&tipe=${head.tipe}`}>
                                                            Lihat & Cetak Bundle
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </Card>
                                        )
                                    })}
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center space-x-4 py-4 mt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-2" />
                                            Sebelumnya
                                        </Button>
                                        <span className="text-sm font-medium text-muted-foreground">
                                            Halaman {currentPage} dari {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Selanjutnya
                                            <ChevronRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Alert className="mt-6">
                                <PackageSearch className="h-4 w-4" />
                                <AlertTitle>Tidak Ada Bundle Ditemukan</AlertTitle>
                                <AlertDescription>
                                    Tidak ada bundle dokumen yang cocok dengan kriteria filter Anda. Coba sesuaikan pencarian atau rentang tanggal Anda.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="vendor">
                     <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Daftar Surat Pesanan ke Vendor</CardTitle>
                            <CardDescription>Tabel ini berisi daftar semua surat pesanan yang dikirimkan ke vendor. Klik tombol "Lihat Bundle" untuk melihat seluruh dokumen terkait.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={vendorOrderColumns} data={filteredVendorOrders} />
                        </CardContent>
                     </Card>
                </TabsContent>
            </Tabs>
        </AppLayout>
    );
}
