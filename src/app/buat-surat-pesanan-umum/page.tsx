
"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  PlusCircle,
  Trash2,
  Download,
  Save,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { DatePickerWithWarning } from "@/components/ui/date-picker-with-warning";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useSuratStore } from "@/store/suratStore";
import { terbilang } from "@/lib/terbilang";
import { roundHalfUp } from "@/lib/utils";

type Item = {
  id: number;
  nama: string;
  volume: number;
  satuan: string;
  hargaSatuan: number;
};

type BeritaAcaraHasil = {
  formData: any;
  peserta: any[];
};

const initialItems: Item[] = [
  { id: 1, nama: "Lampu 8 Watt Bulat 4\"", volume: 5, satuan: "Bh", hargaSatuan: 30600 },
  { id: 2, nama: "Steker", volume: 5, satuan: "Bh", hargaSatuan: 12800 },
  { id: 3, nama: "Stop kontak", volume: 5, satuan: "Bh", hargaSatuan: 17400 },
  { id: 4, nama: "Lampu downlight", volume: 50, satuan: "Bh", hargaSatuan: 46000 },
  { id: 5, nama: "Fiting Gantung", volume: 2, satuan: "Bh", hargaSatuan: 8500 },
  { id: 6, nama: "Lampu 15 watt", volume: 2, satuan: "Bh", hargaSatuan: 20500 },
  { id: 7, nama: "Kabel 0,75", volume: 1, satuan: "Rol", hargaSatuan: 429000 },
  { id: 8, nama: "Solasi Nito", volume: 5, satuan: "Bh", hargaSatuan: 12400 },
  { id: 9, nama: "Lampu Neon", volume: 2, satuan: "Bh", hargaSatuan: 46000 },
  { id: 10, nama: "Lampu 8 Watt", volume: 15, satuan: "Bh", hargaSatuan: 56000 },
  { id: 11, nama: "Termial 3L Broco", volume: 10, satuan: "Bh", hargaSatuan: 46000 },
  { id: 12, nama: "Steker Broco", volume: 5, satuan: "Bh", hargaSatuan: 12500 },
  { id: 13, nama: "Stop Kontak Broco", volume: 10, satuan: "Bh", hargaSatuan: 17500 },
];

export default function BuatSuratPesananUmumPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addSurat, surat: allSurat } = useSuratStore();

  const editNomor = searchParams.get('edit');
  const isEditMode = !!editNomor;
  
  const [formData, setFormData] = useState({
    nomor: "000.3/02-Alat Listrik/RSUDO/V/2025",
    hal: "Surat Pesanan",
    tempat: "Soreang",
    tanggalSurat: new Date("2025-05-20T00:00:00"),
    penerima: "TB. Doa Sepuh",
    penerimaAlamat: "Jl. Simpang Wetan Desa Sekarwangi Soreang",
    nomorSuratReferensi: "02/Alat Listrik/PP/V/2025",
    tanggalSuratReferensi: new Date("2025-05-19T00:00:00"),
    terbilang: "",
    jabatanPenandaTangan: "Pejabat Pembuat Komitmen\nRSUD Oto Iskandar Di Nata",
    namaPenandaTangan: "Heru Heriyanto, S.Kep, Ners",
    nipPenandaTangan: "NIP.19741215 200604 1 014",
    ppn: 11,
  });
  const [items, setItems] = useState<Item[]>(initialItems);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [availableSurat, setAvailableSurat] = useState<BeritaAcaraHasil[]>([]);

  useEffect(() => {
    if (isEditMode && allSurat.length > 0) {
        const suratToEdit = allSurat.find(s => s.nomor === editNomor && s.tipe === 'SP-Umum');
        if (suratToEdit) {
            const { formData: dataToLoad, items: itemsToLoad } = suratToEdit.data;
            setFormData({
                ...dataToLoad,
                tanggalSurat: dataToLoad.tanggalSurat ? new Date(dataToLoad.tanggalSurat) : new Date(),
                tanggalSuratReferensi: dataToLoad.tanggalSuratReferensi ? new Date(dataToLoad.tanggalSuratReferensi) : new Date(),
            });
            setItems(itemsToLoad || []);
        }
    }
  }, [editNomor, allSurat, isEditMode]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.volume * item.hargaSatuan, 0);
    const ppnValue = subtotal * (formData.ppn / 100);
    const grandTotal = subtotal + ppnValue;
    return { subtotal, ppnValue, grandTotal };
  }, [items, formData.ppn]);

  useEffect(() => {
    const roundedTotal = roundHalfUp(totals.grandTotal);
    setFormData(prev => ({ ...prev, terbilang: `${terbilang(roundedTotal)} Rupiah` }));
  }, [totals.grandTotal]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (field: 'tanggalSurat' | 'tanggalSuratReferensi', date: Date | undefined) => {
    if (date) setFormData(prev => ({...prev, [field]: date}));
  };

  const handleItemChange = (id: number, field: keyof Item, value: string | number) => {
    let finalValue = value;
    if (field === 'hargaSatuan') {
        finalValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    }
    setItems(prev => prev.map(item => (item.id === id ? { ...item, [field]: finalValue } : item)));
  };

  const handleAddItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems(prev => [...prev, { id: newId, nama: "", volume: 0, satuan: "", hargaSatuan: 0 }]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleOpenImportDialog = () => {
    try {
      if (typeof window !== "undefined") {
        const dataString = localStorage.getItem("beritaAcaraHasilList");
        setAvailableSurat(dataString ? JSON.parse(dataString) : []);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal Membaca Data", description: "Gagal memuat daftar Berita Acara Hasil Pengadaan." });
    }
    setIsImportDialogOpen(true);
  };

  const handleImportSelection = (importData: BeritaAcaraHasil) => {
    setFormData((prev) => ({
      ...prev,
      penerima: importData.peserta?.[0]?.nama || prev.penerima,
      nomorSuratReferensi: importData.formData?.nomor || prev.nomorSuratReferensi,
      tanggalSuratReferensi: importData.formData?.tanggalSurat ? new Date(importData.formData.tanggalSurat) : prev.tanggalSuratReferensi,
    }));
    setIsImportDialogOpen(false);
    toast({ title: "Berhasil", description: `Data dari surat ${importData.formData.nomor} berhasil dimuat.` });
  };

  const handleSave = () => {
    if (!formData.nomor) {
      toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Nomor surat tidak boleh kosong." });
      return;
    }
    try {
      const dataToSave = { formData: { ...formData, status: "Draft" }, items };
      addSurat('suratPesananUmumList', dataToSave);
      toast({ title: "Berhasil", description: isEditMode ? "Draf berhasil diperbarui." : "Data berhasil disimpan sebagai draf." });
      router.push("/surat-keluar?tab=draft");
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Terjadi kesalahan saat menyimpan data." });
    }
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat("id-ID").format(value);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2 print:hidden">
        <Link href="/dashboard"><Button size="icon" variant="outline" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /><span className="sr-only">Back</span></Button></Link>
        <h1 className="text-xl font-semibold">{isEditMode ? 'Edit' : 'Buat'} Surat Pesanan (Umum)</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={handleOpenImportDialog}><Download className="mr-2 h-4 w-4" />Ambil Data</Button>
          <Button variant="outline" onClick={handleSave}><Save className="mr-2 h-4 w-4" />{isEditMode ? 'Update Draf' : 'Simpan'}</Button>
          <Button onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Cetak</Button>
        </div>
      </header>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-1">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-1 print:hidden">
          <Card>
            <CardHeader><CardTitle>Detail Surat Pesanan</CardTitle><CardDescription>Isi detail surat yang akan dikirim ke vendor.</CardDescription></CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-250px)] pr-4">
                <div className="space-y-4">
                  <div className="space-y-2"><Label htmlFor="nomor">Nomor Surat</Label><Input id="nomor" value={formData.nomor} onChange={handleFormChange}/></div>
                  <div className="space-y-2"><Label htmlFor="hal">Hal</Label><Input id="hal" value={formData.hal} onChange={handleFormChange}/></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="tempat">Tempat Surat</Label><Input id="tempat" value={formData.tempat} onChange={handleFormChange}/></div>
                    <div className="space-y-2"><Label>Tanggal Surat</Label><DatePickerWithWarning date={formData.tanggalSurat} onDateChange={(date) => handleDateChange('tanggalSurat', date)} /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="penerima">Penerima / Vendor (Yth)</Label><Input id="penerima" value={formData.penerima} onChange={handleFormChange}/></div>
                  <div className="space-y-2"><Label htmlFor="penerimaAlamat">Alamat Penerima</Label><Input id="penerimaAlamat" value={formData.penerimaAlamat} onChange={handleFormChange}/></div>
                  <Separator />
                  <h3 className="text-sm font-medium">Surat Referensi (Berita Acara)</h3>
                  <div className="space-y-2"><Label htmlFor="nomorSuratReferensi">Nomor Surat Referensi</Label><Input id="nomorSuratReferensi" value={formData.nomorSuratReferensi} onChange={handleFormChange}/></div>
                  <div className="space-y-2"><Label>Tanggal Surat Referensi</Label><DatePickerWithWarning date={formData.tanggalSuratReferensi} onDateChange={(date) => handleDateChange('tanggalSuratReferensi', date)}/></div>
                  <Separator />
                  <h3 className="text-sm font-medium">Penanda Tangan</h3>
                  <div className="space-y-2"><Label htmlFor="jabatanPenandaTangan">Jabatan</Label><Input id="jabatanPenandaTangan" value={formData.jabatanPenandaTangan} onChange={handleFormChange}/></div>
                  <div className="space-y-2"><Label htmlFor="namaPenandaTangan">Nama</Label><Input id="namaPenandaTangan" value={formData.namaPenandaTangan} onChange={handleFormChange}/></div>
                  <div className="space-y-2"><Label htmlFor="nipPenandaTangan">NIP</Label><Input id="nipPenandaTangan" value={formData.nipPenandaTangan} onChange={handleFormChange}/></div>
                  <Separator />
                  <div className="space-y-2"><Label htmlFor="ppn">PPN (%)</Label><Input id="ppn" type="number" value={formData.ppn} onChange={(e) => setFormData(p => ({ ...p, ppn: parseInt(e.target.value, 10) || 0 }))}/></div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Daftar Barang</CardTitle><Button size="sm" onClick={handleAddItem}><PlusCircle className="mr-2 h-4 w-4" />Tambah</Button></CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full pr-4">
                {items.map((item, index) => (
                  <div key={item.id} className="border p-4 rounded-md space-y-2 relative mb-4">
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => handleRemoveItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    <p className="font-semibold text-sm">Barang #{index + 1}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2"><Label htmlFor={`nama-${item.id}`}>Nama Barang</Label><Input id={`nama-${item.id}`} value={item.nama} onChange={(e) => handleItemChange(item.id, "nama", e.target.value)}/></div>
                      <div className="space-y-2"><Label htmlFor={`volume-${item.id}`}>Volume</Label><Input type="number" id={`volume-${item.id}`} value={item.volume} onChange={(e) => handleItemChange(item.id, "volume", parseInt(e.target.value, 10) || 0)}/></div>
                      <div className="space-y-2"><Label htmlFor={`satuan-${item.id}`}>Satuan</Label><Input id={`satuan-${item.id}`} value={item.satuan} onChange={(e) => handleItemChange(item.id, "satuan", e.target.value)}/></div>
                      <div className="space-y-2 col-span-2"><Label htmlFor={`harga-${item.id}`}>Harga Satuan</Label><Input type="number" step="0.01" id={`harga-${item.id}`} value={item.hargaSatuan} onChange={(e) => handleItemChange(item.id, "hargaSatuan", e.target.value)}/></div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 print:col-span-1">
          <Card className="overflow-hidden print:shadow-none print:border-none">
            <CardHeader className="print:hidden"><CardTitle>Preview Surat</CardTitle></CardHeader>
            <CardContent>
              <div className="bg-white text-black p-4 sm:p-8 font-serif text-[11pt] print:shadow-none print:p-0" id="surat-preview">
                <div className="flex items-center justify-center text-center border-b-[3px] border-black pb-2 mb-4">
                  <Image src="/assets/logo-rs.png" alt="Logo RSUD" width={80} height={80} className="mr-4" data-ai-hint="hospital logo"/>
                  <div>
                    <h1 className="font-bold uppercase text-base">Pemerintah Kabupaten Bandung</h1>
                    <h2 className="font-bold uppercase text-xl">Rumah Sakit Umum Daerah Oto Iskandar Di Nata</h2>
                    <p className="text-xs">Jalan Raya Gading Tutuka, Desa Cingcin, Kec. Soreang, Kab. Bandung, Prov. Jawa Barat.</p>
                    <p className="text-xs">Telp. (022) 5891355 Email: rsudotista@bandungkab.go.id Website: rsudotista@bandungkab.go.id</p>
                  </div>
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div className="w-1/2">
                    <div className="grid grid-cols-[auto_1fr] gap-x-4">
                      <span>Nomor</span><span>: {formData.nomor}</span>
                      <span>Lampiran</span><span>: -</span>
                      <span className="font-semibold">Hal</span><span className="font-semibold">: {formData.hal}</span>
                    </div>
                  </div>
                  <div className="text-left w-1/2 text-right">
                    <p>{formData.tempat}, {formData.tanggalSurat ? format(formData.tanggalSurat, "dd MMMM yyyy", { locale: id }) : ""}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p>Yth.</p>
                  <p className="font-semibold">{formData.penerima}</p>
                  <p>Di</p>
                  <p className="ml-4">{formData.penerimaAlamat}</p>
                </div>

                <p className="mb-4 text-justify">
                  Berdasarkan Berita Acara Hasil Pengadaan Barang Jasa Nomor {formData.nomorSuratReferensi} Tanggal {formData.tanggalSuratReferensi ? format(formData.tanggalSuratReferensi, "dd MMMM yyyy", { locale: id }) : ""}, maka dengan ini kami mengadakan Pesanan Barang/Jasa dengan perincian sebagai berikut :
                </p>

                <Table className="mb-4 text-[10pt]">
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="border border-black text-black text-center font-bold">NO</TableHead>
                      <TableHead className="border border-black text-black text-center font-bold w-2/5">Jenis Barang</TableHead>
                      <TableHead className="border border-black text-black text-center font-bold">Volume</TableHead>
                      <TableHead className="border border-black text-black text-center font-bold">Satuan</TableHead>
                      <TableHead className="border border-black text-black text-center font-bold">Harga Satuan</TableHead>
                      <TableHead className="border border-black text-black text-center font-bold">Jumlah Harga</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="border border-black text-center">{index + 1}</TableCell>
                        <TableCell className="border border-black">{item.nama}</TableCell>
                        <TableCell className="border border-black text-center">{item.volume}</TableCell>
                        <TableCell className="border border-black text-center">{item.satuan}</TableCell>
                        <TableCell className="border border-black text-right">{formatCurrency(item.hargaSatuan)}</TableCell>
                        <TableCell className="border border-black text-right">{formatCurrency(item.volume * item.hargaSatuan)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={5} className="border border-black text-right font-bold">Jumlah</TableCell>
                        <TableCell className="border border-black text-right font-bold">{formatCurrency(totals.subtotal)}</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell colSpan={5} className="border border-black text-right font-bold">PPN {formData.ppn}%</TableCell>
                        <TableCell className="border border-black text-right font-bold">{formatCurrency(roundHalfUp(totals.ppnValue))}</TableCell>
                    </TableRow>
                     <TableRow>
                        <TableCell colSpan={5} className="border border-black text-right font-bold">Total</TableCell>
                        <TableCell className="border border-black text-right font-bold">{formatCurrency(roundHalfUp(totals.grandTotal))}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                <div className="mb-12">
                  <p>Terbilang : <span className="italic font-semibold capitalize">{formData.terbilang}</span></p>
                </div>

                <p className="mb-4">Demikian surat ini disampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih.</p>

                <div className="flex justify-end">
                  <div className="text-center w-1/2 ml-auto">
                    {formData.jabatanPenandaTangan.split('\n').map((line, index) => <p key={index}>{line}</p>)}
                    <div className="h-20"></div>
                    <p className="font-bold underline">{formData.namaPenandaTangan}</p>
                    <p>{formData.nipPenandaTangan}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Pilih Berita Acara untuk Diimpor</DialogTitle><DialogDescription>Pilih surat referensi dari daftar di bawah ini untuk mengisi data secara otomatis.</DialogDescription></DialogHeader>
          <ScrollArea className="max-h-96 pr-4">
              {availableSurat.length > 0 ? (
                availableSurat.map((surat: BeritaAcaraHasil) => (
                  <div key={surat.formData.nomor} className="flex items-center justify-between p-2 my-1 hover:bg-muted rounded-md border">
                    <div>
                      <p className="font-semibold">{surat.formData.nomor}</p>
                      <p className="text-sm text-muted-foreground">{surat.formData.namaPaket}</p>
                    </div>
                    <Button onClick={() => handleImportSelection(surat)}>Pilih</Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center p-4">Tidak ada data Berita Acara Hasil Pengadaan yang tersimpan.</p>
              )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <style jsx global>{`@media print { body * { visibility: hidden; } #surat-preview, #surat-preview * { visibility: visible; } #surat-preview { position: absolute; left: 0; top: 0; width: 100%; font-size: 10pt; } } @page { size: A4; margin: 1in; }`}</style>
    </div>
  );
}
