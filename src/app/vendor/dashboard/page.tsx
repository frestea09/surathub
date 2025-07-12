
"use client";

import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, FileText, Package, CheckCircle, Clock, FileStack } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store/userStore';
import { useSuratStore, type Surat } from '@/store/suratStore';
import { Skeleton } from '@/components/ui/skeleton';

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Terkirim: "default",
  Selesai: "default",
  Diarsipkan: "outline",
  Ditolak: "destructive",
  Draft: "secondary", // Status internal, tapi untuk jaga-jaga
};

const StatCard = ({ title, value, icon: Icon, description }: { title: string, value: string, icon: React.ElementType, description: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

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


export default function VendorDashboardPage() {
  const router = useRouter();
  const { activeUser } = useUserStore();
  const { surat, fetchAllSurat, isLoading } = useSuratStore();

  useEffect(() => {
    if (activeUser) {
      fetchAllSurat(activeUser);
    }
  }, [fetchAllSurat, activeUser]);

  const vendorSurat = surat;

  const stats = useMemo(() => {
    if (!vendorSurat) return { total: 0, new: 0, done: 0 };
    const total = vendorSurat.length;
    const newOrders = vendorSurat.filter(s => s.status === 'Terkirim').length;
    const doneOrders = vendorSurat.filter(s => ['Selesai', 'Diarsipkan'].includes(s.status)).length;
    return { total, new: newOrders, done: doneOrders };
  }, [vendorSurat]);

  if (isLoading) {
    return (
        <div>
            <div className="mb-4">
                <Skeleton className="h-8 w-1/3" />
            </div>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2 mb-2"/>
                    <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
       <div>
            <h1 className="text-3xl font-bold tracking-tight">
                Dashboard Vendor
            </h1>
            <p className="text-muted-foreground">
                Selamat datang, {activeUser?.nama}.
            </p>
       </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Total Pesanan Diterima" value={stats.total.toString()} icon={FileStack} description="Jumlah semua pesanan yang pernah dikirim." />
            <StatCard title="Pesanan Baru / Diproses" value={stats.new.toString()} icon={Clock} description="Pesanan yang perlu ditindaklanjuti." />
            <StatCard title="Pesanan Selesai" value={stats.done.toString()} icon={CheckCircle} description="Pesanan yang telah selesai dan diarsipkan." />
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Dokumen Pengadaan untuk Anda</CardTitle>
          <CardDescription>
            Berikut adalah daftar surat pesanan yang telah dikirimkan kepada Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor Surat</TableHead>
                <TableHead>Perihal</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jenis Pengadaan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendorSurat.length > 0 ? (
                vendorSurat.map((s) => (
                  <TableRow key={s.nomor}>
                    <TableCell className="font-medium">{s.nomor}</TableCell>
                    <TableCell>{s.judul}</TableCell>
                    <TableCell>{new Date(s.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' })}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        {s.tipe === 'SP-Vendor' ? <FileText className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                        {s.tipe === 'SP-Vendor' ? 'Obat & BMHP' : 'Barang Jasa Umum'}
                      </Badge>
                    </TableCell>
                     <TableCell>
                      <Badge variant={statusVariant[s.status as keyof typeof statusVariant] || 'default'}>{s.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/cetak-bundle?nomor=${s.nomor}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Bundle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    Belum ada dokumen yang ditujukan untuk Anda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
