
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Printer, Send, CheckCircle, HelpCircle, MessageSquareWarning } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription as DialogDescriptionComponent, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { roundHalfUp } from '@/lib/utils';
import { useSuratStore, type Surat } from '@/store/suratStore';
import { useUserStore } from '@/store/userStore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { terbilang } from '@/lib/terbilang';

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

const RenderSuratPerintah = ({ data }: { data: any }) => (
    <div className="bg-white text-black p-8 font-serif text-sm page-break">
        <div className="flex items-center justify-center text-center border-b-4 border-black pb-2 mb-4">
            <Image src="/assets/logo-rs.png" alt="Logo RSUD" width={80} height={80} className="mr-4" data-ai-hint="government logo" />
            <div>
                <h1 className="font-bold text-lg tracking-wide">RUMAH SAKIT UMUM DAERAH OTO ISKANDAR DI NATA</h1>
                <p className="text-xs">Jalan Gading Tutuka Kampung Cingcin Kolot Cingcin - 40912</p>
                <p className="text-xs">Telp. (022) 5891355, 5896590, 5896591 - IGD, Fax. 5896592</p>
                <p className="text-xs">E-mail: rsudotista@bandungkab.go.id</p>
            </div>
        </div>
        <div className="flex justify-end mb-4">
            <p>{data.tempat}, {data.tanggalSurat ? format(new Date(data.tanggalSurat), "dd MMMM yyyy", { locale: id }) : ""}</p>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-x-2 mb-4">
            <span className="font-semibold">Nomor</span><span>: {data.nomor}</span>
            <span className="font-semibold">Lampiran</span><span>: {data.lampiran}</span>
            <span className="font-semibold">Perihal</span><span className="font-semibold">: {data.perihal}</span>
        </div>
        <div className="mb-4">
            <p>Yth</p><p>{data.penerima}</p><p>Di</p><p className="ml-8">{data.penerimaTempat}</p>
        </div>
        <p className="mb-4 text-justify indent-8">{data.isiSurat}</p>
        <p className="mb-12 text-justify indent-8">{data.penutup}</p>
        <div className="flex justify-end">
            <div className="text-center">
                <p>{data.jabatanPenandaTangan}</p>
                <div className="h-20"></div>
                <p className="font-bold underline">{data.namaPenandaTangan}</p>
                <p>{data.nipPenandaTangan}</p>
            </div>
        </div>
    </div>
);

const formatCurrency = (value: number) => new Intl.NumberFormat("id-ID").format(value);

const RenderSuratPesanan = ({ data }: { data: any }) => {
    const { formData, items } = data;
    const totals = useMemo(() => {
        const subtotal = items.reduce((sum: number, item: any) => sum + item.jumlah * item.hargaSatuan, 0);
        const totalDiskon = items.reduce((sum: number, item: any) => sum + item.jumlah * item.hargaSatuan * (item.diskon / 100), 0);
        const totalAfterDiskon = subtotal - totalDiskon;
        const ppnValue = totalAfterDiskon * (formData.ppn / 100);
        const grandTotal = totalAfterDiskon + ppnValue;
        return { subtotal, totalDiskon, totalAfterDiskon, ppnValue, grandTotal };
    }, [items, formData.ppn]);

    return (
        <div className="bg-white text-black p-8 font-serif text-[11pt] page-break">
            <div className="flex items-center justify-center text-center border-b-4 border-black pb-2 mb-4">
                <Image src="/assets/logo-rs.png" alt="Logo RSUD" width={80} height={80} className="mr-4" data-ai-hint="government logo" />
                <div>
                    <h1 className="font-bold text-lg tracking-wide">RUMAH SAKIT UMUM DAERAH OTO ISKANDAR DI NATA</h1>
                    <p className="text-xs">Jalan Gading Tutuka Kampung Cingcin Kolot Cingcin - 40912</p>
                    <p className="text-xs">Telp. (022) 5891355, 5896590, 5896591 - IGD, Fax. 5896592</p>
                    <p className="text-xs">E-mail: rsudotista@bandungkab.go.id</p>
                </div>
            </div>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="grid grid-cols-[auto_1fr] gap-x-2">
                        <span>Nomor</span><span>: {formData.nomor}</span>
                        <span>Lampiran</span><span>: -</span>
                        <span>Perihal</span><span className="font-semibold">: {formData.perihal}</span>
                    </div>
                </div>
                <div className="text-left">
                    <p>{formData.tempat}, {formData.tanggalSurat ? format(new Date(formData.tanggalSurat), "dd MMMM yyyy", { locale: id }) : ""}</p>
                    <p>Kepada Yth</p><p>{formData.penerima}</p><p>Di</p><p className="ml-4">{formData.penerimaTempat}</p>
                </div>
            </div>
            <p className="mb-4 text-justify">
                Berdasarkan Surat perintah pengadaan Pejabat Pembuat Komitmen Nomor RSUD Oto Iskandar Di Nata Nomor : {formData.nomorSuratReferensi} tanggal {formData.tanggalSuratReferensi ? format(new Date(formData.tanggalSuratReferensi), "dd MMMM yyyy", { locale: id }) : ""}, Maka dengan ini kami memohon untuk menerbitkan surat pesanan sesuai dengan perincian sebagai berikut.
            </p>
            <Table className="mb-4 text-[10pt]">
                <TableHeader className="bg-gray-100"><TableRow><TableHead className="border border-black text-black text-center font-bold">NO</TableHead><TableHead className="border border-black text-black text-center font-bold">Nama Barang</TableHead><TableHead className="border border-black text-black text-center font-bold">Satuan</TableHead><TableHead className="border border-black text-black text-center font-bold">Merk</TableHead><TableHead className="border border-black text-black text-center font-bold">Jumlah</TableHead><TableHead className="border border-black text-black text-center font-bold">Harga Satuan</TableHead><TableHead className="border border-black text-black text-center font-bold">Diskon</TableHead><TableHead className="border border-black text-black text-center font-bold">Jumlah Harga</TableHead></TableRow></TableHeader>
                <TableBody>
                    {items.map((item: any, index: number) => {
                        const jumlahHarga = item.jumlah * item.hargaSatuan * (1 - item.diskon / 100);
                        return (<TableRow key={item.id}><TableCell className="border border-black text-center">{index + 1}</TableCell><TableCell className="border border-black">{item.nama}</TableCell><TableCell className="border border-black text-center">{item.satuan}</TableCell><TableCell className="border border-black text-center">{item.merk}</TableCell><TableCell className="border border-black text-right">{formatCurrency(item.jumlah)}</TableCell><TableCell className="border border-black text-right">{formatCurrency(roundHalfUp(item.hargaSatuan))}</TableCell><TableCell className="border border-black text-center">{item.diskon}%</TableCell><TableCell className="border border-black text-right">{formatCurrency(roundHalfUp(jumlahHarga))}</TableCell></TableRow>);
                    })}
                </TableBody>
            </Table>
            <div className="flex justify-end mb-4">
                <div className="w-2/3 md:w-1/2">
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1"><span className="font-bold">TOTAL</span><span className="text-right font-bold">{formatCurrency(roundHalfUp(totals.subtotal))}</span></div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1"><span className="font-bold">DISKON</span><span className="text-right font-bold">{formatCurrency(roundHalfUp(totals.totalDiskon))}</span></div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1"><span className="font-bold">TOTAL SETELAH DISKON</span><span className="text-right font-bold">{formatCurrency(roundHalfUp(totals.totalAfterDiskon))}</span></div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1"><span className="font-bold">PPN {formData.ppn}%</span><span className="text-right font-bold">{formatCurrency(roundHalfUp(totals.ppnValue))}</span></div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-b border-black py-1"><span className="font-bold">JUMLAH</span><span className="text-right font-bold">{formatCurrency(roundHalfUp(totals.grandTotal))}</span></div>
                </div>
            </div>
            <div className="mb-12"><p>Terbilang : <span className="italic font-semibold capitalize">{formData.terbilang}</span></p></div>
            <div className="flex justify-end">
                <div className="text-center">
                    <p>{formData.jabatanPenandaTangan}</p><div className="h-20"></div><p className="font-bold underline">{formData.namaPenandaTangan}</p><p>NIP. {formData.nipPenandaTangan}</p>
                </div>
            </div>
        </div>
    );
};

const RenderSuratPesananFinal = ({ data }: { data: any }) => {
    const { formData, items } = data;
    const totals = useMemo(() => {
        const subtotal = items.reduce((sum: number, item: any) => sum + item.jumlah * item.hargaSatuan, 0);
        const totalDiskon = items.reduce((sum: number, item: any) => sum + item.jumlah * item.hargaSatuan * (item.diskon / 100), 0);
        const totalAfterDiskon = subtotal - totalDiskon;
        const ppnValue = totalAfterDiskon * (formData.ppn / 100);
        const grandTotal = totalAfterDiskon + ppnValue;
        return { subtotal, totalDiskon, totalAfterDiskon, ppnValue, grandTotal };
    }, [items, formData.ppn]);

    return (
        <div className="bg-white text-black p-8 font-serif text-[11pt] page-break">
            <div className="flex items-center justify-center text-center border-b-4 border-black pb-2 mb-4">
                 <Image src="/assets/logo-rs.png" alt="Logo RSUD" width={80} height={80} className="mr-4" data-ai-hint="government logo" />
                <div>
                    <h1 className="font-bold text-lg tracking-wide">RUMAH SAKIT UMUM DAERAH OTO ISKANDAR DI NATA</h1>
                    <p className="text-xs">Jalan Gading Tutuka Kampung Cingcin Kolot Cingcin - 40912</p>
                    <p className="text-xs">Telp. (022) 5891355, 5896590, 5896591 - IGD, Fax. 5896592</p>
                    <p className="text-xs">E-mail: rsudotista@bandungkab.go.id</p>
                </div>
            </div>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="grid grid-cols-[auto_1fr] gap-x-2">
                        <span>Nomor</span><span>: {formData.nomor}</span>
                        <span>Lampiran</span><span>: -</span>
                        <span>Perihal</span><span className="font-semibold">: {formData.perihal}</span>
                    </div>
                </div>
                <div className="text-left">
                    <p>{formData.tempat}, {formData.tanggalSurat ? format(new Date(formData.tanggalSurat), "dd MMMM yyyy", { locale: id }) : ""}</p>
                    <p>Kepada Yth</p><p className="font-semibold">{formData.penerima}</p><p>Di</p><p className="ml-4">{formData.penerimaTempat}</p>
                </div>
            </div>
            <p className="mb-4 text-justify">
                Berdasarkan Usulan dari Pejabat Pengadaan RSUD Oto Iskandar Di Nata Nomor : {formData.nomorSuratReferensi} Tanggal {formData.tanggalSuratReferensi ? format(new Date(formData.tanggalSuratReferensi), "dd MMMM yyyy", { locale: id }) : ""}, Maka dengan ini kami menyatakan pesanan barang/jasa dengan perincian sebagai berikut:
            </p>
            <Table className="mb-4 text-[10pt]">
                <TableHeader className="bg-gray-100"><TableRow><TableHead className="border border-black text-black text-center font-bold">NO</TableHead><TableHead className="border border-black text-black text-center font-bold">Nama Barang</TableHead><TableHead className="border border-black text-black text-center font-bold">Satuan</TableHead><TableHead className="border border-black text-black text-center font-bold">Merk</TableHead><TableHead className="border border-black text-black text-center font-bold">Jumlah</TableHead><TableHead className="border border-black text-black text-center font-bold">Harga Satuan</TableHead><TableHead className="border border-black text-black text-center font-bold">Diskon</TableHead><TableHead className="border border-black text-black text-center font-bold">Jumlah Harga</TableHead></TableRow></TableHeader>
                <TableBody>
                     {items.map((item: any, index: number) => {
                        const jumlahHarga = item.jumlah * item.hargaSatuan * (1 - item.diskon / 100);
                        return (<TableRow key={item.id}><TableCell className="border border-black text-center">{index + 1}</TableCell><TableCell className="border border-black">{item.nama}</TableCell><TableCell className="border border-black text-center">{item.satuan}</TableCell><TableCell className="border border-black text-center">{item.merk}</TableCell><TableCell className="border border-black text-right">{formatCurrency(item.jumlah)}</TableCell><TableCell className="border border-black text-right">{formatCurrency(roundHalfUp(item.hargaSatuan))}</TableCell><TableCell className="border border-black text-center">{item.diskon > 0 ? `${item.diskon}%` : "0%"}</TableCell><TableCell className="border border-black text-right">{formatCurrency(roundHalfUp(jumlahHarga))}</TableCell></TableRow>);
                    })}
                </TableBody>
            </Table>
            <div className="flex justify-end mb-4">
                <div className="w-2/3 md:w-1/2">
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1"><span className="font-bold">Subtotal</span><span className="font-bold text-right">{formatCurrency(roundHalfUp(totals.subtotal))}</span></div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1"><span className="font-bold">Diskon</span><span className="font-bold text-right">{formatCurrency(roundHalfUp(totals.totalDiskon))}</span></div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1"><span className="font-bold">Total Setelah Diskon</span><span className="font-bold text-right">{formatCurrency(roundHalfUp(totals.totalAfterDiskon))}</span></div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1"><span className="font-bold">PPN {formData.ppn}%</span><span className="font-bold text-right">{formatCurrency(roundHalfUp(totals.ppnValue))}</span></div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-b border-black py-1"><span className="font-bold">JUMLAH</span><span className="font-bold text-right">{formatCurrency(roundHalfUp(totals.grandTotal))}</span></div>
                </div>
            </div>
            <div className="mb-12"><p>Terbilang : <span className="italic font-semibold capitalize">{formData.terbilang}</span></p></div>
            <div className="flex justify-end">
                <div className="text-center">
                    <p>{formData.jabatanPenandaTangan}</p><div className="h-20"></div><p className="font-bold underline">{formData.namaPenandaTangan}</p><p>NIP. {formData.nipPenandaTangan}</p>
                </div>
            </div>
        </div>
    );
};

const RenderBeritaAcara = ({ data }: { data: any }) => {
    const { formData, items } = data;
    return (
        <div className="bg-white text-black p-8 font-serif text-[11pt] page-break">
            <div className="flex items-center justify-center text-center border-b-4 border-black pb-2 mb-4">
                <Image src="/assets/logo-rs.png" alt="Logo RSUD" width={80} height={80} className="mr-4" data-ai-hint="government logo" />
                <div>
                    <h1 className="font-bold text-lg tracking-wide">RUMAH SAKIT UMUM DAERAH OTO ISKANDAR DI NATA</h1>
                    <p className="text-xs">Jalan Gading Tutuka Kampung Cingcin Kolot Cingcin - 40912</p>
                    <p className="text-xs">Telp. (022) 5891355, 5896590, 5896591 - IGD, Fax. 5896592</p>
                    <p className="text-xs">E-mail: rsudotista@bandungkab.go.id</p>
                </div>
            </div>
            <div className="text-center mb-4"><h2 className="font-bold underline text-base">BERITA ACARA PENERIMA DAN PEMERIKSAAN BARANG</h2><p>NOMOR: {formData.nomor}</p></div>
            <p className="mb-4 text-justify indent-8">{formData.narasiPembuka}</p>
            <div className="mb-4 ml-8">
                <div className="grid grid-cols-[auto_1fr_1fr] gap-x-2">
                    <span className="w-20">Nama</span><span>:</span><span className="font-semibold">{formData.vendorNama}</span>
                    <span className="w-20">Alamat</span><span>:</span><span>{formData.vendorAlamat}</span>
                </div>
            </div>
            <p className="mb-4 text-justify indent-8">
                Sebagai Realisasi dari Surat Pesanan dari Pejabat Pembuat Komitmen Nomor: {formData.nomorSuratReferensi} Tanggal {formData.tanggalSuratReferensi ? format(new Date(formData.tanggalSuratReferensi), "dd MMMM yyyy", { locale: id }) : ""}, dengan jumlah dan jenis barang sebagai berikut:
            </p>
            <Table className="mb-4 text-[10pt]">
                <TableHeader className="bg-gray-100"><TableRow><TableHead className="border border-black text-black text-center font-bold">NO</TableHead><TableHead className="border border-black text-black text-center font-bold" style={{ width: "35%" }}>NAMA BARANG</TableHead><TableHead className="border border-black text-black text-center font-bold">SATUAN</TableHead><TableHead className="border border-black text-black text-center font-bold">MERK</TableHead><TableHead className="border border-black text-black text-center font-bold">JUMLAH</TableHead><TableHead className="border border-black text-black text-center font-bold">KETERANGAN</TableHead></TableRow></TableHeader>
                <TableBody>
                    {items.map((item: any, index: number) => (<TableRow key={item.id}><TableCell className="border border-black text-center">{index + 1}</TableCell><TableCell className="border border-black">{item.nama}</TableCell><TableCell className="border border-black text-center">{item.satuan}</TableCell><TableCell className="border border-black text-center">{item.merk}</TableCell><TableCell className="border border-black text-right">{formatCurrency(item.jumlah)}</TableCell><TableCell className="border border-black">{item.keterangan}</TableCell></TableRow>))}
                </TableBody>
            </Table>
            <p className="mb-8 text-justify indent-8">{formData.narasiPenutup}</p>
            <div className="flex justify-between">
                <div className="text-center w-1/2"><p>Penyedia Barang/Jasa,</p><p className="font-semibold mt-20">{formData.penyediaNama}</p></div>
                <div className="text-center w-1/2"><p>Pejabat Pembuat Komitmen</p><p>RSUD Oto Iskandar Di Nata</p><div className="h-20"></div><p className="font-bold underline">{formData.pejabatNama}</p><p>{formData.pejabatNip}</p></div>
            </div>
        </div>
    );
};

const RenderBASTB = ({ data }: { data: any }) => {
    const { formData } = data;
    return (
        <div className="bg-white text-black p-8 font-serif text-[11pt] page-break">
            <div className="flex items-center justify-center text-center border-b-4 border-black pb-2 mb-4">
                <Image src="/assets/logo-rs.png" alt="Logo RSUD" width={80} height={80} className="mr-4" data-ai-hint="government logo" />
                <div>
                    <h1 className="font-bold text-lg tracking-wide">RUMAH SAKIT UMUM DAERAH OTO ISKANDAR DI NATA</h1>
                    <p className="text-xs">Jalan Gading Tutuka Kampung Cingcin Kolot Cingcin - 40912</p>
                    <p className="text-xs">Telp. (022) 5891355, 5896590, 5896591 - IGD, Fax. 5896592</p>
                    <p className="text-xs">E-mail: rsudotista@bandungkab.go.id</p>
                </div>
            </div>
            <div className="text-center mb-4"><h2 className="font-bold underline text-base">BERITA ACARA SERAH TERIMA BARANG/JASA</h2><p>NOMOR: {formData.nomor}</p></div>
            <p className="mb-4 text-justify indent-8">{formData.narasiPembuka}</p>
            <div className="mb-4">
                <div className="grid grid-cols-[8rem_auto_1fr] gap-x-2 gap-y-1">
                    <span>Nama</span><span>:</span><span>{formData.pihak1Nama}</span>
                    <span>NIP</span><span>:</span><span>{formData.pihak1Nip}</span>
                    <span>JABATAN</span><span>:</span><span>{formData.pihak1Jabatan}</span>
                    <span className="align-top">Alamat</span><span className="align-top">:</span><span className="align-top">{formData.pihak1Alamat}</span>
                </div>
                <p className="mt-2">Dalam Hal Ini Bertindak Sebagai Pejabat Pembuat Komitmen Yang Selanjutnya Disebut <span className="font-bold">PIHAK KESATU</span></p>
            </div>
            <div className="mb-4">
                 <div className="grid grid-cols-[8rem_auto_1fr] gap-x-2 gap-y-1">
                    <span>Nama</span><span>:</span><span>{formData.pihak2Nama}</span>
                    <span>NIP</span><span>:</span><span>{formData.pihak2Nip}</span>
                    <span>JABATAN</span><span>:</span><span>{formData.pihak2Jabatan}</span>
                    <span className="align-top">Alamat</span><span className="align-top">:</span><span className="align-top">{formData.pihak2Alamat}</span>
                </div>
                <p className="mt-2">Dalam Hal Ini Bertindak Sebagai Kuasa Pengguna Anggaran Yang Selanjutnya Disebut <span className="font-bold">PIHAK KE DUA</span></p>
            </div>
            <p className="mb-4 text-justify indent-8">
                PIHAK KESATU telah melaksanakan pemeriksaan terhadap Pengadaan Obat yang dipesan melalui surat pesanan Nomor {formData.nomorSuratPesanan} tanggal {formData.tanggalSuratPesanan ? format(new Date(formData.tanggalSuratPesanan), "dd MMMM yyyy", { locale: id }) : ''}, dalam kondisi baik dan sesuai dengan spesifikasi yang terdapat dalam berita acara Pemeriksaan Barang Nomor: {formData.nomorBeritaAcara} tanggal {formData.tanggalBeritaAcara ? format(new Date(formData.tanggalBeritaAcara), "dd MMMM yyyy", { locale: id }) : ''} (jenis barang terlampir). Untuk selanjutnya diserah terimakan kepada PIHAK KEDUA.
            </p>
            <p className="mb-8 text-justify indent-8">{formData.narasiPenutup}</p>
            <div className="flex justify-between">
                <div className="text-center w-1/2"><p>PIHAK PERTAMA</p><p>PEJABAT PEMBUAT KOMITMEN</p><div className="h-20"></div><p className="font-bold underline">{formData.pihak1Nama}</p><p>NIP. {formData.pihak1Nip}</p></div>
                <div className="text-center w-1/2"><p>PIHAK KEDUA</p><p>KUASA PENGGUNA ANGGARAN</p><div className="h-20"></div><p className="font-bold underline">{formData.pihak2Nama}</p><p>NIP. {formData.pihak2Nip}</p></div>
            </div>
        </div>
    );
};

const RenderBeritaAcaraUmum = ({ data }: { data: any }) => {
    const { formData, items } = data;
    return (
        <div className="bg-white text-black p-8 font-serif text-sm page-break">
            <div className="flex items-center justify-center text-center border-b-[3px] border-black pb-2 mb-4">
                <Image src="/assets/logo-rs.png" alt="Logo RSUD" width={80} height={80} className="mr-4" data-ai-hint="government logo"/>
                <div>
                <h1 className="font-bold uppercase text-base">Pemerintah Kabupaten Bandung</h1>
                <h2 className="font-bold uppercase text-xl">Rumah Sakit Umum Daerah Oto Iskandar Di Nata</h2>
                <p className="text-xs">Jalan Raya Gading Tutuka, Desa Cingcin, Kec. Soreang, Kab. Bandung, Prov. Jawa Barat.</p>
                <p className="text-xs">Telp. (022) 5891355 Email: rsudotista@bandungkab.go.id Website: rsudotista@bandungkab.go.id</p>
                </div>
            </div>
            <div className="text-center mb-4"><h2 className="font-bold underline text-base uppercase">Berita Acara Penerima dan Pemeriksaan Barang</h2><p>Nomor: {formData.nomor}</p></div>
            <p className="mb-4 text-justify indent-8">{formData.narasiPembuka}</p>
            <div className="mb-4 ml-8 grid grid-cols-[12rem_auto_1fr] gap-x-2 gap-y-1">
                <span>Nama Perusahaan</span><span>:</span><span>{formData.vendorNama}</span>
                <span>Alamat Perusahaan</span><span>:</span><span>{formData.vendorAlamat}</span>
            </div>
            <p className="mb-4 text-justify">{formData.narasiRealisasi}</p>
            <Table className="mb-4 text-[10pt]">
                <TableHeader className="bg-gray-100"><TableRow><TableHead className="border border-black text-black text-center font-bold">NO</TableHead><TableHead className="border border-black text-black text-center font-bold w-2/5">Jenis pekerjaan</TableHead><TableHead className="border border-black text-black text-center font-bold">Volume</TableHead><TableHead className="border border-black text-black text-center font-bold">Satuan</TableHead><TableHead className="border border-black text-black text-center font-bold">Keterangan</TableHead></TableRow></TableHeader>
                <TableBody>
                {items.map((item: any, index: number) => (<TableRow key={item.id}><TableCell className="border border-black text-center">{index + 1}</TableCell><TableCell className="border border-black">{item.nama}</TableCell><TableCell className="border border-black text-center">{item.volume}</TableCell><TableCell className="border border-black text-center">{item.satuan}</TableCell><TableCell className="border border-black">{item.keterangan}</TableCell></TableRow>))}
                </TableBody>
            </Table>
            <p className="mb-8 text-justify">{formData.narasiPenutup}</p>
            <div className="flex justify-between">
                <div className="text-center w-1/2"><p>Penyedia Barang /Jasa</p><p>{formData.penyediaNama}</p><div className="h-20"></div><p className="font-bold underline">{formData.penyediaPemilik}</p><p>Pemilik</p></div>
                <div className="text-center w-1/2"><p>{formData.tempatTanggal}</p>{formData.pejabatJabatan.split('\n').map((line: string, i: number) => <p key={i}>{line}</p>)}<div className="h-20"></div><p className="font-bold underline">{formData.pejabatNama}</p><p>{formData.pejabatNip}</p></div>
            </div>
        </div>
    );
};

const VendorActionPanel = ({ onConfirm, onAsk }: { onConfirm: () => void; onAsk: () => void; }) => {
    return (
        <Card className="mb-6 print:hidden">
            <CardHeader>
                <CardTitle>Panel Aksi Vendor</CardTitle>
                <CardDescription>
                    Harap tinjau dokumen di bawah ini. Lakukan konfirmasi jika semua sudah sesuai, atau ajukan pertanyaan jika ada yang perlu direvisi.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
                <Button className="w-full sm:w-auto" onClick={onConfirm}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Konfirmasi & Setujui Pesanan
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" onClick={onAsk}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Ajukan Pertanyaan / Revisi
                </Button>
            </CardContent>
        </Card>
    );
};

export default function CetakBundlePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const { surat, isLoading: isSuratLoading, fetchAllSurat, updateSurat, addRevisionNote } = useSuratStore();
    const { activeUser } = useUserStore();
    
    const [bundle, setBundle] = useState<Surat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
    const [revisionMessage, setRevisionMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const isVendor = activeUser?.jabatan === 'Vendor';
    const vendorOrder = bundle.find(s => s.tipe === 'SP-Vendor' || s.tipe === 'SP-Umum');
    const orderStatus = vendorOrder?.status;

    useEffect(() => {
        fetchAllSurat();
    }, [fetchAllSurat]);

    useEffect(() => {
        if (isSuratLoading) return;

        const startNomor = searchParams.get('nomor');
        if (!startNomor || surat.length === 0) {
            setIsLoading(false);
            return;
        }

        const suratMap = new Map(surat.map(s => [s.nomor, s]));
        const forwardLinks: { [key: string]: string[] } = {
            'SPP': ['SP'], 'SP': ['SP-Vendor'], 'SP-Vendor': ['BA'], 'BA': ['BASTB'],
            'SPU': ['BAH'], 'BAH': ['SP-Umum'], 'SP-Umum': ['BA-Umum']
        };
        const backwardLinks: { [key: string]: string } = {
            'SP': 'SPP', 'SP-Vendor': 'SP', 'BA': 'SP-Vendor', 'BASTB': 'BA',
            'BAH': 'SPU', 'SP-Umum': 'BAH', 'BA-Umum': 'SP-Umum'
        };

        const findChainRecursive = (doc: Surat, chain: Set<Surat>) => {
            if (!doc || chain.has(doc)) return;
            chain.add(doc);

            // Forward search
            const nextTypes = forwardLinks[doc.tipe] || [];
            const children = surat.filter(s =>
                nextTypes.includes(s.tipe) &&
                (s.data.formData?.nomorSuratReferensi || s.data.nomorSuratReferensi || s.data.formData?.nomor) === doc.nomor
            );
            children.forEach(child => findChainRecursive(child, chain));

            // Backward search
            const prevType = backwardLinks[doc.tipe];
            if (prevType) {
                const refNomor = doc.data.formData?.nomorSuratReferensi || doc.data.nomorSuratReferensi;
                const parent = surat.find(s => s.tipe === prevType && s.nomor === refNomor);
                if (parent) findChainRecursive(parent, chain);
            }
        };

        const startingDoc = suratMap.get(startNomor);
        if (!startingDoc) {
            setIsLoading(false);
            return;
        }

        const fullChain = new Set<Surat>();
        findChainRecursive(startingDoc, fullChain);
        
        const finalBundle = Array.from(fullChain);
        
        const typeOrder = ['SPP', 'SPU', 'BAH', 'SP', 'SP-Vendor', 'SP-Umum', 'BA', 'BA-Umum', 'BASTB'];
        finalBundle.sort((a, b) => typeOrder.indexOf(a.tipe) - typeOrder.indexOf(b.tipe));

        setBundle(finalBundle);
        setIsLoading(false);

    }, [searchParams, isSuratLoading, surat]);
    
    const handleSendToVendor = () => {
        if (!vendorOrder) return;
        updateSurat(vendorOrder.nomor, { status: 'Terkirim' });
        toast({ title: "Dokumen Diterbitkan", description: `Dokumen pesanan telah diterbitkan ke portal vendor.` });
    };
    
    const handleVendorConfirm = () => {
        if (vendorOrder) {
            updateSurat(vendorOrder.nomor, { status: 'Disetujui' });
            toast({ title: "Pesanan Dikonfirmasi", description: "Terima kasih, tim internal akan segera menindaklanjuti." });
        }
    };

    const handleSendQuestion = (e: React.FormEvent) => {
        e.preventDefault();
        if (!vendorOrder || !revisionMessage.trim()) {
            toast({ variant: "destructive", title: "Gagal", description: "Pesan revisi tidak boleh kosong." });
            return;
        }

        const note = {
            by: activeUser?.nama || "Vendor",
            date: new Date().toISOString(),
            message: revisionMessage,
        };

        addRevisionNote(vendorOrder.nomor, note);
        updateSurat(vendorOrder.nomor, { status: 'Revisi Diminta' });

        toast({
            title: "Permintaan Revisi Terkirim",
            description: "Permintaan Anda telah dicatat dan dikirim ke tim internal.",
        });
        setIsQuestionDialogOpen(false);
        setRevisionMessage('');
    };


    const renderComponent = (item: Surat) => {
        const { tipe, data } = item;
        switch (tipe) {
            case 'SPP':
            case 'SPU':
                return <RenderSuratPerintah data={data.formData || data} />;
            case 'SP':
                return <RenderSuratPesanan data={data} />;
            case 'SP-Vendor':
                return <RenderSuratPesananFinal data={data} />;
            case 'BA':
                return <RenderBeritaAcara data={data} />;
            case 'BASTB':
                return <RenderBASTB data={data} />;
            case 'BA-Umum':
                 return <RenderBeritaAcaraUmum data={data} />;
            case 'BAH': // Need to add a renderer for BAH
            case 'SP-Umum': // Need to add a renderer for SP-Umum
            default:
                return (
                    <div className="p-8 text-center bg-white page-break">
                        <p className="font-bold">Pratinjau tidak tersedia</p>
                        <p className="text-muted-foreground text-sm">Pratinjau untuk tipe surat '{tipeToLabel[tipe] || tipe}' belum diimplementasikan di halaman bundle ini.</p>
                    </div>
                );
        }
    };
    
    if (isLoading) {
        return (
             <div className="flex min-h-screen w-full flex-col bg-muted/40">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2 print:hidden">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-6 w-48" />
                    <div className="ml-auto flex items-center gap-2">
                        <Skeleton className="h-9 w-24" />
                    </div>
                </header>
                <main className="flex flex-1 flex-col p-4 sm:p-6 items-center">
                    <Skeleton className="h-[842px] w-[595px]" />
                </main>
             </div>
        )
    }

    return (
        <>
            <div className="flex min-h-screen w-full flex-col bg-muted/40">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2 print:hidden">
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="text-xl font-semibold">Cetak Bundle Dokumen</h1>
                    {!isVendor && (
                        <div className="ml-auto flex items-center gap-2">
                             {vendorOrder && vendorOrder.status === 'Draft' && (
                                <Button onClick={handleSendToVendor}>
                                    <Send className="mr-2 h-4 w-4" />
                                    Terbitkan ke Vendor
                                </Button>
                            )}
                            <Button onClick={() => window.print()} variant="outline">
                                <Printer className="mr-2 h-4 w-4" />
                                Cetak Semua
                            </Button>
                        </div>
                    )}
                </header>
                <main className="p-4 sm:p-6">
                    {isVendor && orderStatus === 'Terkirim' && (
                        <VendorActionPanel 
                            onConfirm={handleVendorConfirm} 
                            onAsk={() => setIsQuestionDialogOpen(true)}
                        />
                    )}
                     {isVendor && orderStatus === 'Disetujui' && (
                        <Alert variant="default" className="mb-6 bg-green-50 border-green-200 print:hidden">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertTitle className="text-green-800">Pesanan Dikonfirmasi</AlertTitle>
                            <AlertDescription className="text-green-700">
                                Anda telah mengonfirmasi pesanan ini. Tim internal akan melanjutkan proses.
                            </AlertDescription>
                        </Alert>
                    )}
                    {isVendor && orderStatus === 'Revisi Diminta' && (
                        <Alert variant="destructive" className="mb-6 print:hidden">
                            <MessageSquareWarning className="h-4 w-4" />
                            <AlertTitle>Permintaan Revisi Terkirim</AlertTitle>
                            <AlertDescription>
                                Anda telah mengirimkan permintaan revisi. Mohon tunggu balasan dari tim internal.
                            </AlertDescription>
                        </Alert>
                    )}
                    {bundle.length > 0 ? (
                        bundle.map((item) => (
                            <Card key={item.nomor} className="my-4 mx-auto w-full max-w-[210mm] min-h-[297mm] shadow-lg print:shadow-none print:border-none print:m-0">
                                <CardContent className="p-0">
                                    {renderComponent(item)}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p>Tidak ada dokumen terkait yang ditemukan untuk surat dengan nomor {searchParams.get('nomor')}.</p>
                            <Button variant="link" asChild><Link href="/surat-keluar">Kembali ke Surat Keluar</Link></Button>
                        </div>
                    )}
                </main>
                 <style jsx global>{`
                    @media print {
                      body {
                        background-color: white;
                      }
                      .print\\:hidden {
                        display: none;
                      }
                       .print\\:shadow-none {
                        box-shadow: none;
                      }
                      .print\\:border-none {
                        border: none;
                      }
                       .print\\:m-0 {
                        margin: 0;
                      }
                       .print\\:w-full {
                        width: 100%;
                       }
                      .page-break {
                          page-break-after: always;
                      }
                      .page-break:last-child {
                          page-break-after: avoid;
                      }
                    }
                    @page {
                      size: A4;
                      margin: 2cm;
                    }
                `}</style>
            </div>

            <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
                 <form onSubmit={handleSendQuestion}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Ajukan Pertanyaan atau Revisi</DialogTitle>
                            <DialogDescriptionComponent>
                                Kirim pesan ke tim internal terkait pesanan ini. Pesan Anda akan dicatat dalam sistem.
                            </DialogDescriptionComponent>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="question-body">Pesan Anda</Label>
                                <Textarea id="question-body" placeholder="Jelaskan pertanyaan atau permintaan revisi Anda secara detail di sini..." rows={6} required value={revisionMessage} onChange={e => setRevisionMessage(e.target.value)} />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="secondary">Batal</Button></DialogClose>
                            <Button type="submit">Kirim Permintaan</Button>
                        </DialogFooter>
                    </DialogContent>
                 </form>
            </Dialog>
        </>
    );
}

