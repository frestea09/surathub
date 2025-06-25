
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Printer, Send } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type BundleItem = {
    tipe: 'SPP' | 'SP' | 'SP-Vendor' | 'BA' | 'BASTB';
    data: any;
};

const suratStorageKeys = {
    SPP: 'suratPerintahList',
    SP: 'suratPesananList',
    'SP-Vendor': 'suratPesananFinalList',
    BA: 'beritaAcaraList',
    BASTB: 'bastbList'
};

// Forward chain: SPP -> SP -> SP-Vendor -> BA -> BASTB
const forwardLinks: { [key: string]: any } = {
    SPP: { nextType: 'SP', refKey: 'nomorSuratReferensi', sourceKey: 'nomor' },
    SP: { nextType: 'SP-Vendor', refKey: 'nomorSuratReferensi', sourceKey: 'nomor' },
    'SP-Vendor': { nextType: 'BA', refKey: 'nomorSuratReferensi', sourceKey: 'nomor' },
    BA: { nextType: 'BASTB', refKey: 'nomorBeritaAcara', sourceKey: 'nomor' },
};

// Backward chain: BASTB -> BA -> SP-Vendor -> SP -> SPP
const backwardLinks: { [key: string]: any } = {
    BASTB: { prevType: 'BA', localKey: 'nomorBeritaAcara', targetKey: 'nomor' },
    BA: { prevType: 'SP-Vendor', localKey: 'nomorSuratReferensi', targetKey: 'nomor' },
    'SP-Vendor': { prevType: 'SP', localKey: 'nomorSuratReferensi', targetKey: 'nomor' },
    SP: { prevType: 'SPP', localKey: 'nomorSuratReferensi', targetKey: 'nomor' },
};

const formatCurrency = (value: number) => new Intl.NumberFormat("id-ID").format(value);

const RenderSuratPerintah = ({ data }: { data: any }) => (
    <div className="bg-white text-black p-8 font-serif text-sm page-break">
        <div className="flex items-center justify-center text-center border-b-4 border-black pb-2 mb-4">
            <Image src="/assets/logo-rs.png" alt="Logo RSUD" width={80} height={80} className="mr-4" />
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

const RenderSuratPesanan = ({ data }: { data: any }) => {
    const { formData, items } = data;
    const totals = useMemo(() => {
        const subtotal = items.reduce((sum: number, item: any) => sum + item.jumlah * item.hargaSatuan, 0);
        const totalDiskon = items.reduce((sum: number, item: any) => sum + item.jumlah * item.hargaSatuan * (item.diskon / 100), 0);
        const totalAfterDiskon = subtotal - totalDiskon;
        const ppnValue = Math.round(totalAfterDiskon * (formData.ppn / 100));
        const grandTotal = totalAfterDiskon + ppnValue;
        return { subtotal, totalDiskon, totalAfterDiskon, ppnValue, grandTotal };
    }, [items, formData.ppn]);

    return (
        <div className="bg-white text-black p-8 font-serif text-[11pt] page-break">
            <div className="flex items-center justify-center text-center border-b-4 border-black pb-2 mb-4">
                <Image src="/assets/logo-rs.png" alt="Logo RSUD" width={80} height={80} className="mr-4" />
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
                        return (<TableRow key={item.id}><TableCell className="border border-black text-center">{index + 1}</TableCell><TableCell className="border border-black">{item.nama}</TableCell><TableCell className="border border-black text-center">{item.satuan}</TableCell><TableCell className="border border-black text-center">{item.merk}</TableCell><TableCell className="border border-black text-right">{formatCurrency(item.jumlah)}</TableCell><TableCell className="border border-black text-right">{formatCurrency(item.hargaSatuan)}</TableCell><TableCell className="border border-black text-center">{item.diskon}%</TableCell><TableCell className="border border-black text-right">{formatCurrency(jumlahHarga)}</TableCell></TableRow>);
                    })}
                </TableBody>
            </Table>
            <div className="flex justify-end mb-4">
                <div className="w-2/3 md:w-1/2">
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1"><span className="font-bold">TOTAL</span><span className="text-right font-bold">{formatCurrency(totals.subtotal)}</span></div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1"><span className="font-bold">DISKON</span><span className="text-right font-bold">{formatCurrency(totals.totalDiskon)}</span></div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1"><span className="font-bold">TOTAL SETELAH DISKON</span><span className="text-right font-bold">{formatCurrency(totals.totalAfterDiskon)}</span></div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1"><span className="font-bold">PPN {formData.ppn}%</span><span className="text-right font-bold">{formatCurrency(totals.ppnValue)}</span></div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-b border-black py-1"><span className="font-bold">JUMLAH</span><span className="text-right font-bold">{formatCurrency(totals.grandTotal)}</span></div>
                </div>
            </div>
            <div className="mb-12"><p>Terbilang : <span className="italic font-semibold">{formData.terbilang}</span></p></div>
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
        const ppnValue = Math.round(totalAfterDiskon * (formData.ppn / 100));
        const grandTotal = totalAfterDiskon + ppnValue;
        return { subtotal, totalDiskon, totalAfterDiskon, ppnValue, grandTotal };
    }, [items, formData.ppn]);

    return (
        <div className="bg-white text-black p-8 font-serif text-[11pt] page-break">
            <div className="flex items-center justify-center text-center border-b-4 border-black pb-2 mb-4">
                 <Image src="/assets/logo-rs.png" alt="Logo RSUD" width={80} height={80} className="mr-4" />
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
                        return (<TableRow key={item.id}><TableCell className="border border-black text-center">{index + 1}</TableCell><TableCell className="border border-black">{item.nama}</TableCell><TableCell className="border border-black text-center">{item.satuan}</TableCell><TableCell className="border border-black text-center">{item.merk}</TableCell><TableCell className="border border-black text-right">{formatCurrency(item.jumlah)}</TableCell><TableCell className="border border-black text-right">{formatCurrency(item.hargaSatuan)}</TableCell><TableCell className="border border-black text-center">{item.diskon > 0 ? `${item.diskon}%` : "0%"}</TableCell><TableCell className="border border-black text-right">{formatCurrency(jumlahHarga)}</TableCell></TableRow>);
                    })}
                </TableBody>
            </Table>
            <div className="flex justify-end mb-4">
                <div className="w-2/3 md:w-1/2">
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1"><span className="font-bold">Subtotal</span><span className="font-bold text-right">{formatCurrency(totals.subtotal)}</span></div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1"><span className="font-bold">Diskon</span><span className="font-bold text-right">{formatCurrency(totals.totalDiskon)}</span></div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1"><span className="font-bold">Total Setelah Diskon</span><span className="font-bold text-right">{formatCurrency(totals.totalAfterDiskon)}</span></div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1"><span className="font-bold">PPN {formData.ppn}%</span><span className="font-bold text-right">{formatCurrency(totals.ppnValue)}</span></div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-b border-black py-1"><span className="font-bold">JUMLAH</span><span className="font-bold text-right">{formatCurrency(totals.grandTotal)}</span></div>
                </div>
            </div>
            <div className="mb-12"><p>Terbilang : <span className="italic font-semibold">{formData.terbilang}</span></p></div>
            <div className="flex justify-end">
                <div className="text-center">
                    <p>{formData.jabatanPenandaTangan}</p><div className="h-20"></div><p className="font-bold underline">{formData.namaPenandaTangan}</p><p>{formData.nipPenandaTangan}</p>
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
                <Image src="/assets/logo-rs.png" alt="Logo RSUD" width={80} height={80} className="mr-4" />
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
                <Image src="/assets/logo-rs.png" alt="Logo RSUD" width={80} height={80} className="mr-4" />
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

export default function CetakBundlePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [bundle, setBundle] = useState<BundleItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
    const [vendorEmail, setVendorEmail] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const startNomor = searchParams.get('nomor');
        const startTipe = searchParams.get('tipe');

        if (!startNomor || !startTipe) {
            setIsLoading(false);
            return;
        }

        const allLists: { [key: string]: any[] } = Object.fromEntries(
            Object.entries(suratStorageKeys).map(([tipe, key]) => [
                tipe,
                JSON.parse(localStorage.getItem(key) || '[]')
            ])
        );
        
        const startList = allLists[startTipe];
        if (!startList) {
             setIsLoading(false);
             return;
        }

        const startDoc = startList.find(doc => (doc.formData?.nomor || doc.nomor) === startNomor);

        if (!startDoc) {
            setIsLoading(false);
            return;
        }

        const bundleMap = new Map();
        bundleMap.set(startTipe, startDoc);

        // Traverse backward
        let currentDoc = startDoc;
        let currentTipe: string = startTipe;
        while (backwardLinks[currentTipe]) {
            const link = backwardLinks[currentTipe];
            const localRefValue = currentDoc.formData?.[link.localKey] || currentDoc[link.localKey];
            const prevList = allLists[link.prevType];
            const prevDoc = prevList.find((doc: any) => (doc.formData?.[link.targetKey] || doc[link.targetKey]) === localRefValue);
            
            if (prevDoc) {
                bundleMap.set(link.prevType, prevDoc);
                currentDoc = prevDoc;
                currentTipe = link.prevType;
            } else {
                break;
            }
        }

        // Traverse forward
        currentDoc = startDoc;
        currentTipe = startTipe;
        while (forwardLinks[currentTipe]) {
            const link = forwardLinks[currentTipe];
            const sourceRefValue = currentDoc.formData?.[link.sourceKey] || currentDoc[link.sourceKey];
            const nextList = allLists[link.nextType];
            const nextDoc = nextList.find((doc: any) => (doc.formData?.[link.refKey] || doc[link.refKey]) === sourceRefValue);

            if (nextDoc) {
                bundleMap.set(link.nextType, nextDoc);
                currentDoc = nextDoc;
                currentTipe = link.nextType;
            } else {
                break;
            }
        }

        const orderedTipes = ['SPP', 'SP', 'SP-Vendor', 'BA', 'BASTB'];
        const orderedBundle = orderedTipes
            .map(tipe => bundleMap.has(tipe) ? { tipe, data: bundleMap.get(tipe) } as BundleItem : null)
            .filter((item): item is BundleItem => item !== null);

        setBundle(orderedBundle);
        setIsLoading(false);

    }, [searchParams]);

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vendorEmail) {
            toast({ variant: "destructive", title: "Email tidak valid", description: "Harap masukkan alamat email vendor." });
            return;
        }
        setIsSending(true);

        const vendorSurat = bundle.find(item => item.tipe === 'SP-Vendor');
        const vendorName = vendorSurat?.data?.formData?.penerima || 'Vendor';

        try {
            const response = await fetch('/api/kirim-bundle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: vendorEmail,
                    vendorName: vendorName,
                    bundleUrl: window.location.href, // Send a link to the current page
                    documentCount: bundle.length
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal mengirim email.');
            }
            
            toast({ title: "Email Terkirim", description: `Bundle dokumen berhasil dikirim ke ${vendorEmail}.` });
            setIsEmailDialogOpen(false);
        } catch (error: any) {
            toast({ variant: "destructive", title: "Gagal Mengirim Email", description: error.message });
        } finally {
            setIsSending(false);
        }
    };

    const renderComponent = (item: BundleItem) => {
        switch (item.tipe) {
            case 'SPP': return <RenderSuratPerintah data={item.data} />;
            case 'SP': return <RenderSuratPesanan data={item.data} />;
            case 'SP-Vendor': return <RenderSuratPesananFinal data={item.data} />;
            case 'BA': return <RenderBeritaAcara data={item.data} />;
            case 'BASTB': return <RenderBASTB data={item.data} />;
            default: return null;
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
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="outline" onClick={() => setIsEmailDialogOpen(true)}>
                            <Send className="mr-2 h-4 w-4" />
                            Kirim ke Vendor
                        </Button>
                        <Button onClick={() => window.print()}>
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak Semua
                        </Button>
                    </div>
                </header>
                <main>
                    {bundle.length > 0 ? (
                        bundle.map((item, index) => (
                            <Card key={index} className="my-4 mx-auto w-[210mm] min-h-[297mm] shadow-lg print:shadow-none print:border-none print:m-0 print:w-full">
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

            <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                <DialogContent>
                    <form onSubmit={handleSendEmail}>
                        <DialogHeader>
                            <DialogTitle>Kirim Bundle Dokumen ke Vendor</DialogTitle>
                            <DialogDescription>
                                Masukkan alamat email vendor untuk mengirim tautan ke bundle dokumen ini.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label htmlFor="vendor-email">Email Vendor</Label>
                            <Input
                                id="vendor-email"
                                type="email"
                                placeholder="contoh@vendor.com"
                                value={vendorEmail}
                                onChange={(e) => setVendorEmail(e.target.value)}
                                required
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Batal</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSending}>
                                {isSending ? 'Mengirim...' : 'Kirim Email'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
