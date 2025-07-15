
"use client";

import { useState, useEffect, useMemo } from "react";
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
import { DatePickerWithWarning } from "@/components/ui/date-picker-with-warning";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useSuratStore, type Surat } from "@/store/suratStore";

type Item = {
  id: number;
  nama: string;
  satuan: string;
  merk: string;
  jumlah: number;
  keterangan: string;
};

const initialItems: Item[] = [
  {
    id: 1,
    nama: "ALKOHOL 70% 1 LT",
    satuan: "BOTOL",
    merk: "ONEMED",
    jumlah: 24,
    keterangan: "Baik sesuai dengan SP",
  },
];

export default function BuatBeritaAcaraPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addSurat, surat: allSurat } = useSuratStore();
  
  const editNomor = searchParams.get('edit');
  const isEditMode = !!editNomor;

  const [formData, setFormData] = useState({
    nomor: "06/PPK-FAR/RSUDO/IV/2025",
    narasiPembuka:
      "Pada hari ini, Rabu Tanggal Tiga Puluh Bulan April Tahun Dua Ribu Dua Puluh Lima, bertempat di Rumah Sakit Umum Daerah Oto Iskandar Di Nata, yang bertanda tangan dibawah ini Pejabat Pembuat Komitmen RSUD Oto Iskandar Di Nata Tahun Anggaran 2025, dengan ini menyatakan dengan sebenarnya telah melaksanakan pemeriksaan barang dan jasa.",
    vendorNama: "PT Intisumber Hasil Sempurna Global",
    vendorAlamat:
      "Jl. Raya Sapan Kawasan DE PRIMA TERRA Blok B-3 No 5 Bojongsoang Bandung",
    nomorSuratReferensi: "000.3/06-FAR/PPK-RSUD OTISTA/IV/2025",
    tanggalSuratReferensi: new Date("2025-04-08T00:00:00"),
    narasiPenutup:
      "Demikian Berita Acara Pemeriksaan Barang ini, dibuat dalam rangkap 3 (Tiga) untuk di pergunakan sebagaimana mestinya.",
    penyediaNama: "PT Intisumber Hasil Sempurna Global",
    pejabatNama: "Saep Trian Prasetia.S.Si.Apt",
    pejabatNip: "NIP. 198408272008011005",
  });
  const [items, setItems] = useState<Item[]>(initialItems);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  
  const availableSurat = useMemo(() => {
    return allSurat.filter(s => s.tipe === 'SP-Vendor');
  }, [allSurat]);

  useEffect(() => {
    if (isEditMode && allSurat.length > 0) {
      const suratToEdit = allSurat.find(s => s.nomor === editNomor && s.tipe === 'BA');
      if (suratToEdit) {
        const { formData: dataToLoad, items: itemsToLoad } = suratToEdit.data;
        setFormData({
            ...dataToLoad,
            tanggalSuratReferensi: dataToLoad.tanggalSuratReferensi ? new Date(dataToLoad.tanggalSuratReferensi) : new Date(),
        });
        setItems(itemsToLoad || []);
      }
    }
  }, [editNomor, allSurat, isEditMode]);


  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({...prev, tanggalSuratReferensi: date}));
    }
  }

  const handleItemChange = (
    id: number,
    field: keyof Item,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddItem = () => {
    const newId =
      items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems((prev) => [
      ...prev,
      { id: newId, nama: "", satuan: "", merk: "", jumlah: 0, keterangan: "" },
    ]);
  };

  const handleRemoveItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenImportDialog = () => {
    setIsImportDialogOpen(true);
  };

  const handleImportSelection = (importData: Surat) => {
    const { formData: fd, items: i } = importData.data;
    setFormData((prev) => ({
      ...prev,
      vendorNama: fd?.penerima || prev.vendorNama,
      penyediaNama: fd?.penerima || prev.penyediaNama,
      nomorSuratReferensi: fd?.nomor || prev.nomorSuratReferensi,
      tanggalSuratReferensi: fd?.tanggalSurat ? new Date(fd.tanggalSurat) : prev.tanggalSuratReferensi,
    }));

    const mappedItems: Item[] = (i || []).map((item: any, index: number) => ({
      ...item,
      id: index + 1,
      keterangan: "Baik sesuai dengan SP", // Default value
    }));
    setItems(mappedItems);

    setIsImportDialogOpen(false);
    toast({
      title: "Berhasil",
      description: `Data dari surat ${fd.nomor} berhasil dimuat.`,
    });
  };

  const handleSave = () => {
    if (!formData.nomor) {
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan",
        description: "Nomor surat tidak boleh kosong.",
      });
      return;
    }

    try {
      const suratToSave = {
        nomor: formData.nomor,
        judul: `Berita Acara untuk ${formData.vendorNama}`,
        status: isEditMode ? (allSurat.find(s => s.nomor === editNomor)?.status || 'Draft') : 'Draft',
        tanggal: new Date().toISOString(),
        penanggungJawab: formData.pejabatNama,
        dariKe: formData.vendorNama,
        tipe: 'BA',
        data: {
          formData: { ...formData, status: isEditMode ? (allSurat.find(s => s.nomor === editNomor)?.status || 'Draft') : 'Draft' },
          items,
        }
      };

      addSurat(suratToSave);

      toast({
        title: "Berhasil",
        description: isEditMode ? "Draf berita acara berhasil diperbarui." : "Data berita acara berhasil disimpan sebagai draft.",
      });
      router.push("/surat-keluar?tab=draft");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan data.",
      });
      console.error("Failed to save", error);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID").format(value);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
        <Link href="/dashboard">
          <Button size="icon" variant="outline" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">{isEditMode ? 'Edit' : 'Buat'} Berita Acara</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={handleOpenImportDialog}>
            <Download className="mr-2 h-4 w-4" />
            Ambil Data
          </Button>
          <Button variant="outline" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {isEditMode ? 'Update Draf' : 'Simpan'}
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
              <CardTitle>Detail Berita Acara</CardTitle>
              <CardDescription>
                Isi detail Berita Acara Pemeriksaan Barang.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nomor">Nomor Surat</Label>
                <Input
                  id="nomor"
                  value={formData.nomor}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="narasiPembuka">Narasi Pembuka</Label>
                <Textarea
                  id="narasiPembuka"
                  value={formData.narasiPembuka}
                  onChange={handleFormChange}
                  rows={5}
                />
              </div>
              <Separator />
              <h3 className="text-sm font-medium">Vendor</h3>
              <div className="space-y-2">
                <Label htmlFor="vendorNama">Nama Vendor</Label>
                <Input
                  id="vendorNama"
                  value={formData.vendorNama}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendorAlamat">Alamat Vendor</Label>
                <Input
                  id="vendorAlamat"
                  value={formData.vendorAlamat}
                  onChange={handleFormChange}
                />
              </div>
              <Separator />
              <h3 className="text-sm font-medium">Surat Referensi (Pesanan)</h3>
              <div className="space-y-2">
                <Label htmlFor="nomorSuratReferensi">
                  Nomor Surat Referensi
                </Label>
                <Input
                  id="nomorSuratReferensi"
                  value={formData.nomorSuratReferensi}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Tanggal Surat Referensi
                </Label>
                <DatePickerWithWarning 
                  date={formData.tanggalSuratReferensi}
                  onDateChange={handleDateChange}
                />
              </div>
              <Separator />
              <h3 className="text-sm font-medium">Penanda Tangan</h3>
              <div className="space-y-2">
                <Label htmlFor="penyediaNama">Penyedia Barang / Jasa</Label>
                <Input
                  id="penyediaNama"
                  value={formData.penyediaNama}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pejabatNama">
                  Pejabat Pembuat Komitmen (Nama)
                </Label>
                <Input
                  id="pejabatNama"
                  value={formData.pejabatNama}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pejabatNip">
                  Pejabat Pembuat Komitmen (NIP)
                </Label>
                <Input
                  id="pejabatNip"
                  value={formData.pejabatNip}
                  onChange={handleFormChange}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="narasiPenutup">Narasi Penutup</Label>
                <Textarea
                  id="narasiPenutup"
                  value={formData.narasiPenutup}
                  onChange={handleFormChange}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Daftar Barang</CardTitle>
              <Button size="sm" onClick={handleAddItem}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-4 pr-4">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="border p-4 rounded-md space-y-2 relative"
                    >
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <p className="font-semibold text-sm">
                        Barang #{index + 1}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor={`nama-${item.id}`}>Nama Barang</Label>
                          <Input
                            id={`nama-${item.id}`}
                            value={item.nama}
                            onChange={(e) =>
                              handleItemChange(item.id, "nama", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`satuan-${item.id}`}>Satuan</Label>
                          <Input
                            id={`satuan-${item.id}`}
                            value={item.satuan}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "satuan",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`merk-${item.id}`}>Merk</Label>
                          <Input
                            id={`merk-${item.id}`}
                            value={item.merk}
                            onChange={(e) =>
                              handleItemChange(item.id, "merk", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`jumlah-${item.id}`}>Jumlah</Label>
                          <Input
                            type="number"
                            id={`jumlah-${item.id}`}
                            value={item.jumlah}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "jumlah",
                                parseInt(e.target.value, 10) || 0
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor={`keterangan-${item.id}`}>
                            Keterangan
                          </Label>
                          <Input
                            id={`keterangan-${item.id}`}
                            value={item.keterangan}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "keterangan",
                                e.target.value
                              )
                            }
                          />
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
              <CardTitle>Preview Berita Acara</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="bg-white text-black p-4 sm:p-8 font-serif text-[11pt] print:shadow-none print:p-0"
                id="surat-preview"
              >
                {/* KOP SURAT */}
                <div className="flex items-center justify-center text-center border-b-4 border-black pb-2 mb-4">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/LOGO_KABUPATEN_BANDUNG.svg/1200px-LOGO_KABUPATEN_BANDUNG.svg.png" alt="Logo RSUD" width={80} height={80} className="mr-4" />
                  <div>
                    <h1 className="font-bold text-lg tracking-wide">
                      RUMAH SAKIT UMUM DAERAH OTO ISKANDAR DI NATA
                    </h1>
                    <p className="text-xs">
                      Jalan Gading Tutuka Kampung Cingcin Kolot Cingcin - 40912
                    </p>
                    <p className="text-xs">
                      Telp. (022) 5891355, 5896590, 5896591 - IGD, Fax. 5896592
                    </p>
                    <p className="text-xs">
                      E-mail: rsudotista@bandungkab.go.id
                    </p>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <h2 className="font-bold underline text-base">
                    BERITA ACARA PENERIMA DAN PEMERIKSAAN BARANG
                  </h2>
                  <p>NOMOR: {formData.nomor}</p>
                </div>

                <p className="mb-4 text-justify indent-8">
                  {formData.narasiPembuka}
                </p>

                <div className="mb-4 ml-8">
                  <div className="grid grid-cols-[auto_1fr_1fr] gap-x-2">
                    <span className="w-20">Nama</span>
                    <span>:</span>
                    <span className="font-semibold">{formData.vendorNama}</span>
                    <span className="w-20">Alamat</span>
                    <span>:</span>
                    <span>{formData.vendorAlamat}</span>
                  </div>
                </div>

                <p className="mb-4 text-justify indent-8">
                  Sebagai Realisasi dari Surat Pesanan dari Pejabat Pembuat
                  Komitmen Nomor: {formData.nomorSuratReferensi} Tanggal{" "}
                  {formData.tanggalSuratReferensi ? format(formData.tanggalSuratReferensi, "dd MMMM yyyy", { locale: id }) : ""}, dengan jumlah dan jenis
                  barang sebagai berikut:
                </p>

                <Table className="mb-4 text-[10pt]">
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="border border-black text-black text-center font-bold">
                        NO
                      </TableHead>
                      <TableHead
                        className="border border-black text-black text-center font-bold"
                        style={{ width: "35%" }}
                      >
                        NAMA BARANG
                      </TableHead>
                      <TableHead className="border border-black text-black text-center font-bold">
                        SATUAN
                      </TableHead>
                      <TableHead className="border border-black text-black text-center font-bold">
                        MERK
                      </TableHead>
                      <TableHead className="border border-black text-black text-center font-bold">
                        JUMLAH
                      </TableHead>
                      <TableHead className="border border-black text-black text-center font-bold">
                        KETERANGAN
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="border border-black text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="border border-black">
                          {item.nama}
                        </TableCell>
                        <TableCell className="border border-black text-center">
                          {item.satuan}
                        </TableCell>
                        <TableCell className="border border-black text-center">
                          {item.merk}
                        </TableCell>
                        <TableCell className="border border-black text-right">
                          {formatCurrency(item.jumlah)}
                        </TableCell>
                        <TableCell className="border border-black">
                          {item.keterangan}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <p className="mb-8 text-justify indent-8">
                  {formData.narasiPenutup}
                </p>

                <div className="flex justify-between">
                  <div className="text-center w-1/2">
                    <p>Penyedia Barang/Jasa,</p>
                    <p className="font-semibold mt-20">
                      {formData.penyediaNama}
                    </p>
                  </div>
                  <div className="text-center w-1/2">
                    <p>Pejabat Pembuat Komitmen</p>
                    <p>RSUD Oto Iskandar Di Nata</p>
                    <div className="h-20"></div>
                    <p className="font-bold underline">
                      {formData.pejabatNama}
                    </p>
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
          <DialogHeader>
            <DialogTitle>
              Pilih Surat Pesanan (Vendor) untuk Diimpor
            </DialogTitle>
            <DialogDescription>
              Pilih surat referensi dari daftar di bawah ini untuk mengisi data
              secara otomatis.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <div className="pr-4">
              {availableSurat.length > 0 ? (
                availableSurat.map((surat: Surat) => (
                  <div
                    key={surat.nomor}
                    className="flex items-center justify-between p-2 my-1 hover:bg-muted rounded-md border"
                  >
                    <div>
                      <p className="font-semibold">{surat.nomor}</p>
                      <p className="text-sm text-muted-foreground">
                        {surat.judul}
                      </p>
                    </div>
                    <Button onClick={() => handleImportSelection(surat)}>
                      Pilih
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center p-4">
                  Tidak ada data Surat Pesanan (Vendor) yang tersedia.
                </p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #surat-preview,
          #surat-preview * {
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
