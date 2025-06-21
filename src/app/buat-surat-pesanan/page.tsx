"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { ArrowLeft, Printer, Sparkles, PlusCircle, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

type Item = {
  id: number;
  nama: string;
  satuan: string;
  merk: string;
  jumlah: number;
  hargaSatuan: number;
  diskon: number; // percentage
};

const initialItems: Item[] = [
    { id: 1, nama: 'ALKOHOL 70% 1 LT', satuan: 'BOTOL', merk: 'ONEMED', jumlah: 24, hargaSatuan: 23800, diskon: 0 },
    { id: 2, nama: 'ALKOHOL SWAB ONEMED 100 LBR', satuan: 'BUAH', merk: 'ONEMED', jumlah: 10000, hargaSatuan: 80, diskon: 0 },
    { id: 3, nama: "APRON ONE BOX 50'S", satuan: 'BUAH', merk: 'ONEMED', jumlah: 1500, hargaSatuan: 1656, diskon: 0 },
    { id: 4, nama: 'CONDOM CATH L ONEMED', satuan: 'BUAH', merk: 'ONEMED', jumlah: 5, hargaSatuan: 5300, diskon: 0 },
    { id: 5, nama: 'CONDOM CATH M ONEMED', satuan: 'BUAH', merk: 'ONEMED', jumlah: 5, hargaSatuan: 5300, diskon: 0 },
    { id: 6, nama: "DERFAMIX TULLE 10 X 10 CM BOX 10'S", satuan: 'BUAH', merk: 'ONEMED', jumlah: 80, hargaSatuan: 2800, diskon: 0 },
    { id: 7, nama: "DERFAMIX TULLE 10 X 25 TYPE A BOX 10'S", satuan: 'BUAH', merk: 'ONEMED', jumlah: 250, hargaSatuan: 9800, diskon: 0 },
    { id: 8, nama: 'DR.J PAD 60 X 90 KARTON 100', satuan: 'BUAH', merk: 'ONEMED', jumlah: 1000, hargaSatuan: 2497, diskon: 0 },
    { id: 9, nama: 'MEDIGLOVE SURGICAL STERILE PF 7 BOX 50 PSG', satuan: 'PASANG', merk: 'ONEMED', jumlah: 1000, hargaSatuan: 4960, diskon: 0 },
    { id: 10, nama: 'MEDIGLOVE SURGICAL STERILE PF 7.5 BOX 50 PSG', satuan: 'PASANG', merk: 'ONEMED', jumlah: 700, hargaSatuan: 4960, diskon: 0 },
    { id: 11, nama: "NURSE CAP GREEN OM BOX 100'S", satuan: 'BUAH', merk: 'ONEMED', jumlah: 2000, hargaSatuan: 298, diskon: 0 },
    { id: 12, nama: 'ONE CLEAN WASH GLOVE BH', satuan: 'BUAH', merk: 'ONEMED', jumlah: 48, hargaSatuan: 9800, diskon: 0 },
    { id: 13, nama: 'ONE SCRUB 4% GALON 5 LT BH', satuan: 'GALON', merk: 'ONEMED', jumlah: 2, hargaSatuan: 348000, diskon: 0 },
    { id: 14, nama: 'PLESTERIN BULAT NON WOVEN BOX 200 STR', satuan: 'BUAH', merk: 'ONEMED', jumlah: 1400, hargaSatuan: 154, diskon: 0 },
    { id: 15, nama: 'POV IODINE 10% 1 LT ONEMED', satuan: 'BOTOL', merk: 'ONEMED', jumlah: 50, hargaSatuan: 68770, diskon: 0 },
    { id: 16, nama: "SPUIT 1 CC TB ONEMED BOX 100'S", satuan: 'BUAH', merk: 'ONEMED', jumlah: 6000, hargaSatuan: 520, diskon: 0 },
    { id: 17, nama: "SPUIT 3 CC ONEMED BOX 100'S", satuan: 'BUAH', merk: 'ONEMED', jumlah: 8000, hargaSatuan: 507, diskon: 0 },
    { id: 18, nama: "SPUIT 5 CC ONEMED BOX 100'S", satuan: 'BUAH', merk: 'ONEMED', jumlah: 8000, hargaSatuan: 514, diskon: 0 },
    { id: 19, nama: "SPUIT 10 CC ONEMED BOX 100'S", satuan: 'BUAH', merk: 'ONEMED', jumlah: 4000, hargaSatuan: 812, diskon: 0 },
    { id: 20, nama: "SPUIT 20 CC EC OM BOX 50'S", satuan: 'BUAH', merk: 'ONEMED', jumlah: 2000, hargaSatuan: 1160, diskon: 0 },
    { id: 21, nama: "SPUIT 50 CC CATHETER TIP OM BOX 30'S", satuan: 'BUAH', merk: 'ONEMED', jumlah: 360, hargaSatuan: 4073, diskon: 0 },
    { id: 22, nama: "SPUIT 50 CC LL ONEMED BOX 20'S", satuan: 'BUAH', merk: 'ONEMED', jumlah: 500, hargaSatuan: 3400, diskon: 0 },
    { id: 23, nama: 'ST.GYNAECOLOG STERIL OM', satuan: 'PASANG', merk: 'ONEMED', jumlah: 100, hargaSatuan: 15800, diskon: 0 },
];

export default function BuatSuratPesananPage() {
  const [formData, setFormData] = useState({
    nomor: '000.3/PPBJ-RSUD OTISTA/IV/2025',
    perihal: 'Penerbitan Surat Pesanan',
    tempatTanggal: 'Soreang, 08 April 2025',
    penerima: 'PEJABAT PEMBUAT KOMITMEN',
    penerimaTempat: 'Tempat',
    nomorSuratReferensi: '000.3/PPK-RSUD OTISTA/IV/2025',
    tanggalSuratReferensi: '08/April/2025',
    terbilang: 'Empat Puluh Sembilan Juta Empat Ratus Tiga Puluh Ribu Empat Ratus Dua Puluh Enam Rupiah',
    jabatanPenandaTangan: 'Pejabat Pengadaan Barang Jasa',
    namaPenandaTangan: 'Deti Hapitri, A.Md.Gz',
    nipPenandaTangan: 'NIP. 197711042005042013',
    ppn: 11,
  });
  const [items, setItems] = useState<Item[]>(initialItems);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.jumlah * item.hargaSatuan), 0);
    const totalDiskon = items.reduce((sum, item) => sum + (item.jumlah * item.hargaSatuan * item.diskon / 100), 0);
    const totalAfterDiskon = subtotal - totalDiskon;
    const ppnValue = Math.round(totalAfterDiskon * (formData.ppn / 100));
    const grandTotal = totalAfterDiskon + ppnValue;
    return { subtotal, totalDiskon, ppnValue, grandTotal };
  }, [items, formData.ppn]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleItemChange = (id: number, field: keyof Item, value: string | number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleAddItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems(prev => [...prev, { id: newId, nama: '', satuan: '', merk: '', jumlah: 0, hargaSatuan: 0, diskon: 0 }]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };
  
  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID').format(value);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
        <Link href="/">
          <Button size="icon" variant="outline" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Buat Surat Pesanan</h1>
        <div className="ml-auto flex items-center gap-2">
            <Button variant="outline">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate with AI
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Cetak
            </Button>
        </div>
      </header>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-1">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-1 print:hidden">
          <Card>
            <CardHeader>
              <CardTitle>Detail Surat Pesanan</CardTitle>
              <CardDescription>Isi detail surat yang akan dibuat.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nomor">Nomor Surat</Label>
                <Input id="nomor" value={formData.nomor} onChange={handleFormChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="perihal">Perihal</Label>
                <Input id="perihal" value={formData.perihal} onChange={handleFormChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tempatTanggal">Tempat & Tanggal</Label>
                <Input id="tempatTanggal" value={formData.tempatTanggal} onChange={handleFormChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="penerima">Penerima (Yth)</Label>
                <Input id="penerima" value={formData.penerima} onChange={handleFormChange} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="penerimaTempat">Di</Label>
                <Input id="penerimaTempat" value={formData.penerimaTempat} onChange={handleFormChange} />
              </div>
              <Separator />
               <h3 className="text-sm font-medium">Surat Referensi (Perintah)</h3>
                <div className="space-y-2">
                  <Label htmlFor="nomorSuratReferensi">Nomor Surat Referensi</Label>
                  <Input id="nomorSuratReferensi" value={formData.nomorSuratReferensi} onChange={handleFormChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggalSuratReferensi">Tanggal Surat Referensi</Label>
                  <Input id="tanggalSuratReferensi" value={formData.tanggalSuratReferensi} onChange={handleFormChange} />
                </div>
               <Separator />
                <h3 className="text-sm font-medium">Penanda Tangan</h3>
               <div className="space-y-2">
                <Label htmlFor="jabatanPenandaTangan">Jabatan</Label>
                <Input id="jabatanPenandaTangan" value={formData.jabatanPenandaTangan} onChange={handleFormChange} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="namaPenandaTangan">Nama</Label>
                <Input id="namaPenandaTangan" value={formData.namaPenandaTangan} onChange={handleFormChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nipPenandaTangan">NIP</Label>
                <Input id="nipPenandaTangan" value={formData.nipPenandaTangan} onChange={handleFormChange} />
              </div>
               <Separator />
                <div className="space-y-2">
                  <Label htmlFor="terbilang">Total (Terbilang)</Label>
                  <Textarea id="terbilang" value={formData.terbilang} onChange={handleFormChange} rows={2}/>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="ppn">PPN (%)</Label>
                  <Input id="ppn" type="number" value={formData.ppn} onChange={handleFormChange} />
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Daftar Barang</CardTitle>
              <Button size="sm" onClick={handleAddItem}><PlusCircle className="mr-2 h-4 w-4"/>Tambah</Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-4 pr-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="border p-4 rounded-md space-y-2 relative">
                      <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleRemoveItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <p className="font-semibold text-sm">Barang #{index + 1}</p>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2 col-span-2">
                              <Label htmlFor={`nama-${item.id}`}>Nama Barang</Label>
                              <Input id={`nama-${item.id}`} value={item.nama} onChange={(e) => handleItemChange(item.id, 'nama', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor={`satuan-${item.id}`}>Satuan</Label>
                              <Input id={`satuan-${item.id}`} value={item.satuan} onChange={(e) => handleItemChange(item.id, 'satuan', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor={`merk-${item.id}`}>Merk</Label>
                              <Input id={`merk-${item.id}`} value={item.merk} onChange={(e) => handleItemChange(item.id, 'merk', e.target.value)} />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor={`jumlah-${item.id}`}>Jumlah</Label>
                              <Input type="number" id={`jumlah-${item.id}`} value={item.jumlah} onChange={(e) => handleItemChange(item.id, 'jumlah', parseInt(e.target.value) || 0)} />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor={`harga-${item.id}`}>Harga Satuan</Label>
                              <Input type="number" id={`harga-${item.id}`} value={item.hargaSatuan} onChange={(e) => handleItemChange(item.id, 'hargaSatuan', parseInt(e.target.value) || 0)} />
                          </div>
                           <div className="space-y-2 col-span-2">
                              <Label htmlFor={`diskon-${item.id}`}>Diskon (%)</Label>
                              <Input type="number" id={`diskon-${item.id}`} value={item.diskon} onChange={(e) => handleItemChange(item.id, 'diskon', parseInt(e.target.value) || 0)} />
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 print:col-span-1">
           <Card className="overflow-hidden print:shadow-none print:border-none">
            <CardHeader className="print:hidden">
              <CardTitle>Preview Surat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white text-black p-4 sm:p-8 font-serif text-[11pt] print:shadow-none print:p-0" id="surat-preview">
                {/* KOP SURAT */}
                <div className="text-center border-b-[3px] border-black pb-2 mb-4">
                  <h1 className="font-bold text-lg tracking-wide">RUMAH SAKIT UMUM DAERAH OTO ISKANDAR DI NATA</h1>
                  <p className="text-xs">Jalan Gading Tutuka Kampung Cingcin Kolot Cingcin - 40912</p>
                  <p className="text-xs">Telp. (022) 5891355, 5896590, 5896591 - IGD, Fax. 5896592</p>
                  <p className="text-xs">E-mail: rsudotista@bandungkab.go.id</p>
                </div>
                
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="grid grid-cols-[auto_1fr] gap-x-2">
                            <span className="">Nomor</span><span>: {formData.nomor}</span>
                            <span className="">Lampiran</span><span>: -</span>
                            <span className="">Perihal</span><span className="font-semibold">: {formData.perihal}</span>
                        </div>
                    </div>
                    <div className="text-left">
                        <p>{formData.tempatTanggal}</p>
                        <p>Kepada Yth</p>
                        <p>{formData.penerima}</p>
                        <p>Di</p>
                        <p className="ml-4">{formData.penerimaTempat}</p>
                    </div>
                </div>

                <p className="mb-4 text-justify">
                  Berdasarkan Surat perintah pengadaan Pejabat Pembuat Komitmen Nomor RSUD Oto Iskandar Di Nata Nomor : {formData.nomorSuratReferensi} tanggal {formData.tanggalSuratReferensi}, Maka dengan ini kami memohon untuk menerbitkan surat pesanan sesuai dengan perincian sebagai berikut.
                </p>

                <Table className="mb-4 text-[10pt]">
                    <TableHeader className="bg-gray-100">
                        <TableRow>
                            <TableHead className="border border-black text-black text-center font-bold">NO</TableHead>
                            <TableHead className="border border-black text-black text-center font-bold">Nama Barang</TableHead>
                            <TableHead className="border border-black text-black text-center font-bold">Satuan</TableHead>
                            <TableHead className="border border-black text-black text-center font-bold">Merk</TableHead>
                            <TableHead className="border border-black text-black text-center font-bold">Jumlah</TableHead>
                            <TableHead className="border border-black text-black text-center font-bold">Harga Satuan</TableHead>
                            <TableHead className="border border-black text-black text-center font-bold">Diskon</TableHead>
                            <TableHead className="border border-black text-black text-center font-bold">Jumlah Harga</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item, index) => {
                            const jumlahHarga = item.jumlah * item.hargaSatuan * (1 - item.diskon / 100);
                            return (
                                <TableRow key={item.id}>
                                    <TableCell className="border border-black text-center">{index + 1}</TableCell>
                                    <TableCell className="border border-black">{item.nama}</TableCell>
                                    <TableCell className="border border-black text-center">{item.satuan}</TableCell>
                                    <TableCell className="border border-black text-center">{item.merk}</TableCell>
                                    <TableCell className="border border-black text-right">{formatCurrency(item.jumlah)}</TableCell>
                                    <TableCell className="border border-black text-right">{formatCurrency(item.hargaSatuan)}</TableCell>
                                    <TableCell className="border border-black text-center">{item.diskon}%</TableCell>
                                    <TableCell className="border border-black text-right">{formatCurrency(jumlahHarga)}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>

                <div className="flex justify-end mb-4">
                    <div className="w-1/2">
                        <div className="grid grid-cols-2 gap-x-4 border-t border-b border-black py-1">
                            <span className="font-bold">TOTAL</span><span className="text-right font-bold">{formatCurrency(totals.subtotal)}</span>
                            <span className="font-bold">DISKON {items.some(i => i.diskon > 0) ? '(%)' : ''}</span><span className="text-right font-bold">{formatCurrency(totals.totalDiskon)}</span>
                            <span className="font-bold">PPN {formData.ppn}%</span><span className="text-right font-bold">{formatCurrency(totals.ppnValue)}</span>
                            <span className="font-bold">JUMLAH</span><span className="text-right font-bold">{formatCurrency(totals.grandTotal)}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <p>Terbilang : <span className="italic font-semibold">{formData.terbilang}</span></p>
                </div>


                <div className="flex justify-end">
                    <div className="text-center">
                        <p>{formData.jabatanPenandaTangan}</p>
                        <div className="h-20"></div>
                        <p className="font-bold underline">{formData.namaPenandaTangan}</p>
                        <p>NIP. {formData.nipPenandaTangan}</p>
                    </div>
                </div>
              </div>
            </CardContent>
           </Card>
        </div>
      </main>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #surat-preview, #surat-preview * {
            visibility: visible;
          }
          #surat-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            font-size: 10pt;
          }
          .print\\:grid-cols-1 {
            grid-template-columns: 1fr;
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
          .print\\:p-0 {
            padding: 0;
          }
        }
        @page {
          size: A4;
          margin: 1in;
        }
      `}</style>
    </div>
  );
}
