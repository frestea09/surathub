
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
import { useSuratStore, type Surat } from "@/store/suratStore";
import { terbilang } from "@/lib/terbilang";
import { roundHalfUp } from "@/lib/utils";

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
  {
    id: 1,
    nama: "ALKOHOL 70% 1 LT",
    satuan: "BOTOL",
    merk: "ONEMED",
    jumlah: 24,
    hargaSatuan: 23800,
    diskon: 0,
  },
];

export default function BuatSuratPesananPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addSurat, surat: allSurat } = useSuratStore();

  const editNomor = searchParams.get('edit');
  const isEditMode = !!editNomor;
  
  const [formData, setFormData] = useState({
    nomor: "000.3/PPBJ-RSUD OTISTA/IV/2025",
    perihal: "Penerbitan Surat Pesanan",
    tempat: "Soreang",
    tanggalSurat: new Date("2025-04-08T00:00:00"),
    penerima: "PEJABAT PEMBUAT KOMITMEN",
    penerimaTempat: "Tempat",
    nomorSuratReferensi: "000.3/PPK-RSUD OTISTA/IV/2025",
    tanggalSuratReferensi: new Date("2025-04-08T00:00:00"),
    terbilang: "",
    jabatanPenandaTangan: "Pejabat Pengadaan Barang Jasa",
    namaPenandaTangan: "Deti Hapitri, A.Md.Gz",
    nipPenandaTangan: "NIP. 197711042005042013",
    ppn: 11,
  });
  const [items, setItems] = useState<Item[]>(initialItems);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  
  const availableSurat = useMemo(() => {
    return allSurat.filter(s => s.tipe === 'SPP');
  }, [allSurat]);

  useEffect(() => {
    if (isEditMode && allSurat.length > 0) {
        const suratToEdit = allSurat.find(s => s.nomor === editNomor && s.tipe === 'SP');
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
    const subtotal = items.reduce(
      (sum, item) => sum + item.jumlah * item.hargaSatuan,
      0
    );
    const totalDiskon = items.reduce(
      (sum, item) => sum + item.jumlah * item.hargaSatuan * (item.diskon / 100),
      0
    );
    const totalAfterDiskon = subtotal - totalDiskon;
    const ppnValue = totalAfterDiskon * (formData.ppn / 100);
    const grandTotal = totalAfterDiskon + ppnValue;
    return { subtotal, totalDiskon, totalAfterDiskon, ppnValue, grandTotal };
  }, [items, formData.ppn]);

  useEffect(() => {
    if (totals.grandTotal > 0) {
      const roundedTotal = roundHalfUp(totals.grandTotal);
      const terbilangText = terbilang(roundedTotal);
      setFormData(prev => ({
        ...prev,
        terbilang: `${terbilangText} Rupiah`
      }));
    } else {
       setFormData(prev => ({ ...prev, terbilang: "Nol Rupiah" }));
    }
  }, [totals.grandTotal]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (field: 'tanggalSurat' | 'tanggalSuratReferensi', date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({...prev, [field]: date}))
    }
  };

  const handleItemChange = (
    id: number,
    field: keyof Item,
    value: string | number
  ) => {
    let finalValue = value;
    if (field === 'hargaSatuan') {
      finalValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) || 0 : value;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: finalValue } : item))
    );
  };

  const handleAddItem = () => {
    const newId =
      items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems((prev) => [
      ...prev,
      {
        id: newId,
        nama: "",
        satuan: "",
        merk: "",
        jumlah: 0,
        hargaSatuan: 0,
        diskon: 0,
      },
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
    setFormData((prev) => ({
      ...prev,
      nomorSuratReferensi: importData.nomor || prev.nomorSuratReferensi,
      tanggalSuratReferensi: importData.tanggal
        ? new Date(importData.tanggal)
        : prev.tanggalSuratReferensi,
    }));
    setIsImportDialogOpen(false);
    toast({
      title: "Berhasil",
      description: `Data dari surat ${importData.nomor} berhasil dimuat.`,
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
        judul: formData.perihal,
        status: isEditMode ? (allSurat.find(s => s.nomor === editNomor)?.status || 'Draft') : 'Draft',
        tanggal: formData.tanggalSurat.toISOString(),
        penanggungJawab: formData.namaPenandaTangan,
        dariKe: formData.penerima,
        tipe: 'SP',
        data: {
          formData: { ...formData, status: isEditMode ? (allSurat.find(s => s.nomor === editNomor)?.status || 'Draft') : 'Draft' },
          items,
        }
      };
      
      addSurat(suratToSave);
      
      toast({
        title: "Berhasil",
        description: isEditMode ? "Draf surat pesanan berhasil diperbarui." : "Data surat pesanan berhasil disimpan sebagai draft.",
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
        <h1 className="text-xl font-semibold">{isEditMode ? 'Edit' : 'Buat'} Surat Pesanan</h1>
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
              <CardTitle>Detail Surat Pesanan</CardTitle>
              <CardDescription>
                Isi detail surat yang akan dibuat.
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
                <Label htmlFor="perihal">Perihal</Label>
                <Input
                  id="perihal"
                  value={formData.perihal}
                  onChange={handleFormChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tempat">Tempat Surat</Label>
                  <Input
                    id="tempat"
                    value={formData.tempat}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Surat</Label>
                  <DatePickerWithWarning date={formData.tanggalSurat} onDateChange={(date) => handleDateChange('tanggalSurat', date)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="penerima">Penerima (Yth)</Label>
                <Input
                  id="penerima"
                  value={formData.penerima}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="penerimaTempat">Di</Label>
                <Input
                  id="penerimaTempat"
                  value={formData.penerimaTempat}
                  onChange={handleFormChange}
                />
              </div>
              <Separator />
              <h3 className="text-sm font-medium">
                Surat Referensi (Perintah)
              </h3>
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
                <DatePickerWithWarning date={formData.tanggalSuratReferensi} onDateChange={(date) => handleDateChange('tanggalSuratReferensi', date)} />
              </div>
              <Separator />
              <h3 className="text-sm font-medium">Penanda Tangan</h3>
              <div className="space-y-2">
                <Label htmlFor="jabatanPenandaTangan">Jabatan</Label>
                <Input
                  id="jabatanPenandaTangan"
                  value={formData.jabatanPenandaTangan}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="namaPenandaTangan">Nama</Label>
                <Input
                  id="namaPenandaTangan"
                  value={formData.namaPenandaTangan}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nipPenandaTangan">NIP</Label>
                <Input
                  id="nipPenandaTangan"
                  value={formData.nipPenandaTangan}
                  onChange={handleFormChange}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="terbilang">Total (Terbilang)</Label>
                <Textarea
                  id="terbilang"
                  value={formData.terbilang}
                  onChange={handleFormChange}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ppn">PPN (%)</Label>
                <Input
                  id="ppn"
                  type="number"
                  value={formData.ppn}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ppn: parseInt(e.target.value, 10) || 0,
                    }))
                  }
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
                        <div className="space-y-2">
                          <Label htmlFor={`harga-${item.id}`}>
                            Harga Satuan
                          </Label>
                          <Input
                            type="number"
                            id={`harga-${item.id}`}
                            value={item.hargaSatuan}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "hargaSatuan",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor={`diskon-${item.id}`}>
                            Diskon (%)
                          </Label>
                          <Input
                            type="number"
                            id={`diskon-${item.id}`}
                            value={item.diskon}
                            onChange={(e) =>
                              handleItemChange(
                                item.id,
                                "diskon",
                                parseInt(e.target.value, 10) || 0
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
              <CardTitle>Preview Surat</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="bg-white text-black p-4 sm:p-8 font-serif text-[11pt] print:shadow-none print:p-0"
                id="surat-preview"
              >
                {/* KOP SURAT */}
                <div className="flex items-center justify-center text-center border-b-4 border-black pb-2 mb-4">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/LOGO_KABUPATEN_BANDUNG.svg/1200px-LOGO_KABUPATEN_BANDUNG.svg.png" alt="Logo RSUD" width={80} height={80} className="mr-4" data-ai-hint="hospital logo" />
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

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="grid grid-cols-[auto_1fr] gap-x-2">
                      <span className="">Nomor</span>
                      <span>: {formData.nomor}</span>
                      <span className="">Lampiran</span>
                      <span>: -</span>
                      <span className="">Perihal</span>
                      <span className="font-semibold">
                        : {formData.perihal}
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <p>{formData.tempat}, {formData.tanggalSurat ? format(formData.tanggalSurat, "dd MMMM yyyy", { locale: id }) : ""}</p>
                    <p>Kepada Yth</p>
                    <p>{formData.penerima}</p>
                    <p>Di</p>
                    <p className="ml-4">{formData.penerimaTempat}</p>
                  </div>
                </div>

                <p className="mb-4 text-justify">
                  Berdasarkan Surat perintah pengadaan Pejabat Pembuat Komitmen
                  Nomor RSUD Oto Iskandar Di Nata Nomor :{" "}
                  {formData.nomorSuratReferensi} tanggal{" "}
                  {formData.tanggalSuratReferensi ? format(new Date(formData.tanggalSuratReferensi), "dd MMMM yyyy", { locale: id }) : ""}, Maka dengan ini kami memohon
                  untuk menerbitkan surat pesanan sesuai dengan perincian
                  sebagai berikut.
                </p>

                <Table className="mb-4 text-[10pt]">
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="border border-black text-black text-center font-bold">
                        NO
                      </TableHead>
                      <TableHead className="border border-black text-black text-center font-bold">
                        Nama Barang
                      </TableHead>
                      <TableHead className="border border-black text-black text-center font-bold">
                        Satuan
                      </TableHead>
                      <TableHead className="border border-black text-black text-center font-bold">
                        Merk
                      </TableHead>
                      <TableHead className="border border-black text-black text-center font-bold">
                        Jumlah
                      </TableHead>
                      <TableHead className="border border-black text-black text-center font-bold">
                        Harga Satuan
                      </TableHead>
                      <TableHead className="border border-black text-black text-center font-bold">
                        Diskon
                      </TableHead>
                      <TableHead className="border border-black text-black text-center font-bold">
                        Jumlah Harga
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => {
                      const jumlahHarga =
                        item.jumlah *
                        item.hargaSatuan *
                        (1 - item.diskon / 100);
                      return (
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
                          <TableCell className="border border-black text-right">
                            {formatCurrency(roundHalfUp(item.hargaSatuan))}
                          </TableCell>
                          <TableCell className="border border-black text-center">
                            {item.diskon}%
                          </TableCell>
                          <TableCell className="border border-black text-right">
                            {formatCurrency(roundHalfUp(jumlahHarga))}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                <div className="flex justify-end mb-4">
                  <div className="w-2/3 md:w-1/2">
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1">
                      <span className="font-bold">TOTAL</span>
                      <span className="text-right font-bold">
                        {formatCurrency(roundHalfUp(totals.subtotal))}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1">
                      <span className="font-bold">DISKON</span>
                      <span className="text-right font-bold">
                        {formatCurrency(roundHalfUp(totals.totalDiskon))}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1">
                      <span className="font-bold">TOTAL SETELAH DISKON</span>
                      <span className="text-right font-bold">
                        {formatCurrency(roundHalfUp(totals.totalAfterDiskon))}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-black py-1">
                      <span className="font-bold">PPN {formData.ppn}%</span>
                      <span className="text-right font-bold">
                        {formatCurrency(roundHalfUp(totals.ppnValue))}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 border-t border-b border-black py-1">
                      <span className="font-bold">JUMLAH</span>
                      <span className="text-right font-bold">
                        {formatCurrency(roundHalfUp(totals.grandTotal))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-12">
                  <p>
                    Terbilang :{" "}
                    <span className="italic font-semibold capitalize">
                      {formData.terbilang}
                    </span>
                  </p>
                </div>

                <div className="flex justify-end">
                  <div className="text-center">
                    <p>{formData.jabatanPenandaTangan}</p>
                    <div className="h-20"></div>
                    <p className="font-bold underline">
                      {formData.namaPenandaTangan}
                    </p>
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
          <DialogHeader>
            <DialogTitle>Pilih Surat Perintah untuk Diimpor</DialogTitle>
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
                  Tidak ada data Surat Perintah yang tersedia.
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
