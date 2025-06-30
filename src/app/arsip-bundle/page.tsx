
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
import { PackageSearch, FileArchive, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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


export default function ArsipBundlePage() {
    const { surat, isLoading, fetchAllSurat } = useSuratStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [date, setDate] = useState<DateRange | undefined>();

    useEffect(() => {
        fetchAllSurat();
    }, [fetchAllSurat]);

    const bundles = useMemo(() => {
        if (isLoading || surat.length === 0) return [];
        
        const suratMap = new Map(surat.map(s => [s.nomor, s]));
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

    const filteredBundles = useMemo(() => {
        return bundles.filter(bundle => {
            if (bundle.length === 0) return false;

            const matchesSearchTerm = searchTerm === '' || bundle.some(doc => doc.nomor.toLowerCase().includes(searchTerm.toLowerCase()) || doc.judul.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesDateRange = !date?.from || bundle.some(doc => {
                 const docDate = new Date(doc.tanggal);
                 const from = date.from!;
                 const to = date.to ? new Date(date.to.setHours(23, 59, 59, 999)) : new Date(from.setHours(23, 59, 59, 999));
                 return docDate >= from && docDate <= to;
            });

            return matchesSearchTerm && matchesDateRange;
        });
    }, [bundles, searchTerm, date]);


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
                <h1 className="text-lg font-semibold md:text-2xl">Arsip Bundle Dokumen</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Filter Bundle</CardTitle>
                    <CardDescription>Cari bundle berdasarkan nomor surat, perihal, atau rentang tanggal.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-4">
                    <Input
                        placeholder="Cari nomor atau perihal surat..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                    <DateRangePicker date={date} setDate={setDate} />
                </CardContent>
            </Card>

            <div className="mt-6">
                {filteredBundles.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredBundles.map(bundle => {
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
                ) : (
                    <Alert>
                        <PackageSearch className="h-4 w-4" />
                        <AlertTitle>Tidak Ada Bundle Ditemukan</AlertTitle>
                        <AlertDescription>
                            Tidak ada bundle dokumen yang cocok dengan kriteria filter Anda. Coba sesuaikan pencarian atau rentang tanggal Anda.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </AppLayout>
    );
}
