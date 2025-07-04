
"use client";

import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, FileText, Package } from "lucide-react";
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

export default function VendorDashboardPage() {
  const router = useRouter();
  const { activeUser } = useUserStore();
  const { surat, fetchAllSurat, isLoading } = useSuratStore();

  useEffect(() => {
    if (activeUser) {
      fetchAllSurat(activeUser);
    }
  }, [fetchAllSurat, activeUser]);

  const vendorSurat = useMemo(() => {
    // The data is already filtered by the store, so we can just use it directly.
    return surat;
  }, [surat]);

  if (isLoading) {
    return <p>Memuat data...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">
        Selamat Datang, {activeUser?.nama}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Dokumen Pengadaan untuk Anda</CardTitle>
          <CardDescription>
            Berikut adalah daftar surat pesanan yang telah dikirimkan kepada Anda. Klik 'Lihat Bundle' untuk melihat detail lengkap.
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
                  <TableCell colSpan={5} className="text-center h-24">
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
