
"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import Image from "next/image";
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
import { useSuratStore } from "@/store/suratStore";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

type Item = {
  id: number;
  nama: string;
  volume: number;
  satuan: string;
  keterangan: string;
};

type SuratPesananUmum = {
  formData: any;
  items: Omit<Item, "keterangan">[];
};

const initialItems: Item[] = [
  { id: 1, nama: "Lampu 8 Watt Bulat 4\"", volume: 5, satuan: "Bh", keterangan: "Baik Sesuai dengan SP" },
];

export default function BuatBeritaAcaraUmumPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addSurat, surat: allSurat } = useSuratStore();
  
  const editNomor = searchParams.get('edit');
  const isEditMode = !!editNomor;

  const [formData, setFormData] = useState({
    nomor: "02/BAP-Alat Listrik/V/2025",
    nomorSuratReferensi: "",
    narasiPembuka: "Pada Hari Sabtu Tanggal Tiga Puluh Satu Bulan Mei Tahun Dua Ribu Dua Puluh Lima, bertempat di Rumah Sakit Umum Daerah Oto Iskandar Di Nata, berdasarkan Surat Keputusan Direktur RSUD Oto Iskandar Di Nata Nomor : 800.1.10.2/216/UMPEG/2024 yang bertanda tangan dibawah ini Pejabat Pembuat Komitmen Yang bersumber dari Pendapatan Fungsional Rumah Sakit Umum Daerah Oto Iskandar Di Nata yang dianggarkan dalam Rencana Bisnis Anggaran (RBA) Rumah Sakit Umum Daerah Oto Iskandar Di Nata Tahun Anggaran 2025 menyatakan dengan sebenarnya telah melaksanakan penerimaan dan pemeriksaan barang dari:",
    vendorNama: "TB. Doa Sepuh",
    vendorAlamat: "Jl. Simpang Wetan Desa Sekarwangi Soreang",
    narasiRealisasi: "Sebagai realisasi dari Surat Pesanan dari Pejabat Pembuat Komitmen Nomor: 000.3/02-Alat Listrik/RSUDO/V/2025, tanggal 20 Mei 2025 dengan jumlah dan jenis barang sebagai berikut:",
    narasiPenutup: "Demikian Berita Acara Pemeriksaan Barang ini, dibuat dalam rangkap 4 (empat) untuk dipergunakan sebagaimana mestinya.",
    tempatTanggal: "Soreang, 31 Mei 2025",
    penyediaNama: "TB. Doa Sepuh",
    penyediaPemilik: "Iin Permana",
    pejabatJabatan: "Pejabat Pembuat Komitmen\nRumah Sakit Umum Daerah Oto Iskandar Di Nata\nTahun Anggaran 2025",
    pejabatNama: "Heru Heriyanto, S.Kep, Ners",
    pejabatNip: "NIP. 19741215 200604 1 014",
  });
  const [items, setItems] = useState<Item[]>(initialItems);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [availableSurat, setAvailableSurat] = useState<SuratPesananUmum[]>([]);

  useEffect(() => {
    if (isEditMode && allSurat.length > 0) {
      const suratToEdit = allSurat.find(s => s.nomor === editNomor && s.tipe === 'BA-Umum');
      if (suratToEdit) {
        const { formData: dataToLoad, items: itemsToLoad } = suratToEdit.data;
        setFormData(dataToLoad);
        setItems(itemsToLoad || []);
      }
    }
  }, [editNomor, allSurat, isEditMode]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleItemChange = (id: number, field: keyof Item, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems((prev) => [ ...prev, { id: newId, nama: "", volume: 0, satuan: "", keterangan: "Baik Sesuai dengan SP" }]);
  };

  const handleRemoveItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOpenImportDialog = () => {
    try {
      if (typeof window !== "undefined") {
        const dataString = localStorage.getItem("suratPesananUmumList");
        setAvailableSurat(dataString ? JSON.parse(dataString) : []);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal Membaca Data", description: "Gagal memuat daftar Surat Pesanan (Umum)." });
    }
    setIsImportDialogOpen(true);
  };

  const handleImportSelection = (importData: SuratPesananUmum) => {
    setFormData((prev) => ({
      ...prev,
      vendorNama: importData.formData?.penerima || prev.vendorNama,
      vendorAlamat: importData.formData?.penerimaAlamat || prev.vendorAlamat,
      penyediaNama: importData.formData?.penerima || prev.penyediaNama,
      narasiRealisasi: `Sebagai realisasi dari Surat Pesanan dari Pejabat Pembuat Komitmen Nomor: ${importData.formData?.nomor}, tanggal ${format(new Date(importData.formData?.tanggalSurat), "dd MMMM yyyy", { locale: id })} dengan jumlah dan jenis barang sebagai berikut:`,
      nomorSuratReferensi: importData.formData?.nomor || "",
    }));

    const mappedItems: Item[] = (importData.items || []).map((item) => ({
      ...item,
      keterangan: "Baik Sesuai dengan SP",
    }));
    setItems(mappedItems);

    setIsImportDialogOpen(false);
    toast({ title: "Berhasil", description: `Data dari surat ${importData.formData.nomor} berhasil dimuat.` });
  };

  const handleSave = () => {
    if (!formData.nomor) {
      toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Nomor surat tidak boleh kosong." });
      return;
    }
    try {
      const dataToSave = { formData: { ...formData, status: "Draft", perihal: `BA Pemeriksaan untuk ${formData.vendorNama}` }, items };
      addSurat('beritaAcaraUmumList', dataToSave);
      toast({ title: "Berhasil", description: isEditMode ? "Draf berhasil diperbarui." : "Data berhasil disimpan sebagai draf." });
      router.push("/surat-keluar?tab=draft");
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Terjadi kesalahan saat menyimpan data." });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2 print:hidden">
        <Link href="/dashboard"><Button size="icon" variant="outline" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /><span className="sr-only">Back</span></Button></Link>
        <h1 className="text-xl font-semibold">{isEditMode ? 'Edit' : 'Buat'} BA Pemeriksaan (Umum)</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={handleOpenImportDialog}><Download className="mr-2 h-4 w-4" />Ambil Data</Button>
          <Button variant="outline" onClick={handleSave}><Save className="mr-2 h-4 w-4" />{isEditMode ? 'Update Draf' : 'Simpan'}</Button>
          <Button onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Cetak</Button>
        </div>
      </header>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-1">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-1 print:hidden">
          <Card>
            <CardHeader><CardTitle>Detail Berita Acara</CardTitle><CardDescription>Isi detail Berita Acara Pemeriksaan Barang.</CardDescription></CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-250px)] pr-4">
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Nomor Surat</Label><Input id="nomor" value={formData.nomor} onChange={handleFormChange} /></div>
                  <div className="space-y-2"><Label>Narasi Pembuka</Label><Textarea id="narasiPembuka" value={formData.narasiPembuka} onChange={handleFormChange} rows={8} /></div>
                  <Separator />
                  <h3 className="text-sm font-medium">Vendor</h3>
                  <div className="space-y-2"><Label>Nama Vendor</Label><Input id="vendorNama" value={formData.vendorNama} onChange={handleFormChange} /></div>
                  <div className="space-y-2"><Label>Alamat Vendor</Label><Input id="vendorAlamat" value={formData.vendorAlamat} onChange={handleFormChange} /></div>
                  <Separator />
                  <h3 className="text-sm font-medium">Penanda Tangan</h3>
                  <div className="space-y-2"><Label>Tempat & Tanggal</Label><Input id="tempatTanggal" value={formData.tempatTanggal} onChange={handleFormChange}/></div>
                  <div className="space-y-2"><Label>Penyedia Barang / Jasa</Label><Input id="penyediaNama" value={formData.penyediaNama} onChange={handleFormChange} /></div>
                  <div className="space-y-2"><Label>Pemilik Penyedia</Label><Input id="penyediaPemilik" value={formData.penyediaPemilik} onChange={handleFormChange} /></div>
                  <div className="space-y-2"><Label>Jabatan Pejabat</Label><Textarea id="pejabatJabatan" value={formData.pejabatJabatan} onChange={handleFormChange} rows={3}/></div>
                  <div className="space-y-2"><Label>Nama Pejabat</Label><Input id="pejabatNama" value={formData.pejabatNama} onChange={handleFormChange} /></div>
                  <div className="space-y-2"><Label>NIP Pejabat</Label><Input id="pejabatNip" value={formData.pejabatNip} onChange={handleFormChange} /></div>
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
                      <div className="space-y-2 col-span-2"><Label>Nama Barang</Label><Input value={item.nama} onChange={(e) => handleItemChange(item.id, "nama", e.target.value)}/></div>
                      <div className="space-y-2"><Label>Volume</Label><Input type="number" value={item.volume} onChange={(e) => handleItemChange(item.id, "volume", parseInt(e.target.value, 10) || 0)}/></div>
                      <div className="space-y-2"><Label>Satuan</Label><Input value={item.satuan} onChange={(e) => handleItemChange(item.id, "satuan", e.target.value)}/></div>
                      <div className="space-y-2 col-span-2"><Label>Keterangan</Label><Input value={item.keterangan} onChange={(e) => handleItemChange(item.id, "keterangan", e.target.value)}/></div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 print:col-span-1">
          <Card className="overflow-hidden print:shadow-none print:border-none">
            <CardHeader className="print:hidden"><CardTitle>Preview Berita Acara</CardTitle></CardHeader>
            <CardContent>
              <div className="bg-white text-black p-4 sm:p-8 font-serif text-sm print:shadow-none print:p-0" id="surat-preview">
                <div className="flex items-center justify-center text-center border-b-[3px] border-black pb-2 mb-4">
                  <Image src="/assets/logo-rs.png" alt="Logo RSUD" width={80} height={80} className="mr-4" data-ai-hint="hospital logo"/>
                  <div>
                    <h1 className="font-bold uppercase text-base">Pemerintah Kabupaten Bandung</h1>
                    <h2 className="font-bold uppercase text-xl">Rumah Sakit Umum Daerah Oto Iskandar Di Nata</h2>
                    <p className="text-xs">Jalan Raya Gading Tutuka, Desa Cingcin, Kec. Soreang, Kab. Bandung, Prov. Jawa Barat.</p>
                    <p className="text-xs">Telp. (022) 5891355 Email: rsudotista@bandungkab.go.id Website: rsudotista@bandungkab.go.id</p>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <h2 className="font-bold underline text-base uppercase">Berita Acara Penerima dan Pemeriksaan Barang</h2>
                  <p>Nomor: {formData.nomor}</p>
                </div>

                <p className="mb-4 text-justify indent-8">{formData.narasiPembuka}</p>
                
                <div className="mb-4 ml-8 grid grid-cols-[12rem_auto_1fr] gap-x-2 gap-y-1">
                    <span>Nama Perusahaan</span><span>:</span><span>{formData.vendorNama}</span>
                    <span>Alamat Perusahaan</span><span>:</span><span>{formData.vendorAlamat}</span>
                </div>

                <p className="mb-4 text-justify">{formData.narasiRealisasi}</p>

                <Table className="mb-4 text-[10pt]">
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="border border-black text-black text-center font-bold">NO</TableHead>
                      <TableHead className="border border-black text-black text-center font-bold w-2/5">Jenis pekerjaan</TableHead>
                      <TableHead className="border border-black text-black text-center font-bold">Volume</TableHead>
                      <TableHead className="border border-black text-black text-center font-bold">Satuan</TableHead>
                      <TableHead className="border border-black text-black text-center font-bold">Keterangan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="border border-black text-center">{index + 1}</TableCell>
                        <TableCell className="border border-black">{item.nama}</TableCell>
                        <TableCell className="border border-black text-center">{item.volume}</TableCell>
                        <TableCell className="border border-black text-center">{item.satuan}</TableCell>
                        <TableCell className="border border-black">{item.keterangan}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <p className="mb-8 text-justify">{formData.narasiPenutup}</p>

                <div className="flex justify-between">
                  <div className="text-center w-1/2">
                    <p>Penyedia Barang /Jasa</p>
                    <p>{formData.penyediaNama}</p>
                    <div className="h-20"></div>
                    <p className="font-bold underline">{formData.penyediaPemilik}</p>
                    <p>Pemilik</p>
                  </div>
                  <div className="text-center w-1/2">
                    <p>{formData.tempatTanggal}</p>
                    {formData.pejabatJabatan.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                    <div className="h-20"></div>
                    <p className="font-bold underline">{formData.pejabatNama}</p>
                    <p>{formData.pejabatNip}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Pilih Surat Pesanan untuk Diimpor</DialogTitle><DialogDescription>Pilih surat referensi untuk mengisi data.</DialogDescription></DialogHeader>
          <ScrollArea className="max-h-96 pr-4">
              {availableSurat.length > 0 ? (
                availableSurat.map((surat: SuratPesananUmum, i: number) => (
                  <div key={`${surat.formData.nomor}-${i}`} className="flex items-center justify-between p-2 my-1 hover:bg-muted rounded-md border">
                    <div>
                      <p className="font-semibold">{surat.formData.nomor}</p>
                      <p className="text-sm text-muted-foreground">{surat.formData.penerima}</p>
                    </div>
                    <Button onClick={() => handleImportSelection(surat)}>Pilih</Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center p-4">Tidak ada Surat Pesanan (Umum) yang tersimpan.</p>
              )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <style jsx global>{`@media print { body * { visibility: hidden; } #surat-preview, #surat-preview * { visibility: visible; } #surat-preview { position: absolute; left: 0; top: 0; width: 100%; font-size: 11pt; } } @page { size: A4; margin: 1in; }`}</style>
    </div>
  );
}
