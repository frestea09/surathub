
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
import { ArrowLeft, Printer, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { DatePickerWithWarning } from "@/components/ui/date-picker-with-warning";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useSuratStore } from "@/store/suratStore";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function BuatSuratKustomPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addSurat, surat: allSurat } = useSuratStore();
  
  const templateId = searchParams.get('template');
  const templateLabel = searchParams.get('label') || 'Kustom';
  
  // Custom templates use the templateId as their `nomor` for storage purposes.
  // This allows us to find and edit them later.
  const isEditMode = !!templateId && allSurat.some(s => s.nomor === templateId);

  const [formData, setFormData] = useState({
    nomor: "",
    lampiran: "-",
    perihal: "",
    tempat: "Soreang",
    tanggalSurat: new Date(),
    penerima: "",
    penerimaTempat: "Tempat",
    isiSurat: "",
    penutup: "Demikian surat ini disampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih.",
    jabatanPenandaTangan: "",
    namaPenandaTangan: "",
    nipPenandaTangan: "",
  });

  useEffect(() => {
    if (templateId) {
      const existingTemplate = allSurat.find(s => s.nomor === templateId);
      if (existingTemplate) {
        // We are in edit mode, load the data.
        const dataToLoad = existingTemplate.data;
        setFormData({
          ...dataToLoad,
          tanggalSurat: dataToLoad.tanggalSurat ? new Date(dataToLoad.tanggalSurat) : new Date(),
        });
      } else {
        // We are in creation mode for a new template.
        setFormData(prev => ({ ...prev, perihal: templateLabel, nomor: `TEMPLATE-${templateId}` }));
      }
    }
  }, [templateId, templateLabel, allSurat]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, tanggalSurat: date }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    if (!templateId) {
       toast({ variant: "destructive", title: "Gagal", description: "ID templat tidak valid." });
       return;
    }
    if (!formData.perihal) {
      toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Perihal tidak boleh kosong." });
      return;
    }

    try {
      const dataToSave = {
        // Use a unique, non-user-facing ID for the surat nomor to store the template
        nomor: templateId, 
        judul: formData.perihal,
        status: 'Draft',
        tanggal: formData.tanggalSurat.toISOString(),
        penanggungJawab: formData.namaPenandaTangan,
        dariKe: formData.penerima,
        tipe: `KUSTOM-${templateId}`,
        data: { ...formData, status: 'Draft' },
      };

      addSurat(dataToSave);
      
      toast({
        title: "Berhasil",
        description: isEditMode ? `Templat "${formData.perihal}" berhasil diperbarui.` : `Templat untuk "${formData.perihal}" berhasil disimpan.`,
      });
      router.push("/pengaturan/alur-kerja");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan templat.",
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Kembali</span>
        </Button>
        <h1 className="text-xl font-semibold">{isEditMode ? 'Ubah' : 'Buat'} Templat: {templateLabel}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {isEditMode ? 'Update Templat' : 'Simpan Templat'}
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Cetak
          </Button>
        </div>
      </header>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:grid-cols-2 lg:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Desain Templat Surat</CardTitle>
              <CardDescription>
                 Isi konten default untuk templat surat baru Anda. Ini dapat diubah nanti saat membuat surat sebenarnya.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-180px)] pr-4">
              <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="perihal">Perihal (Judul Surat)</Label>
                <Input
                  id="perihal"
                  value={formData.perihal}
                  onChange={handleInputChange}
                  placeholder="Contoh: Surat Rekomendasi Kerja"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nomor">Format Nomor Surat (Opsional)</Label>
                <Input
                  id="nomor"
                  value={formData.nomor}
                  onChange={handleInputChange}
                  placeholder="Contoh: .../SK-DIR/UMUM/I/2025"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lampiran">Lampiran</Label>
                <Input
                  id="lampiran"
                  value={formData.lampiran}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tempat">Tempat Surat</Label>
                  <Input
                    id="tempat"
                    value={formData.tempat}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggalSurat">Tanggal Surat</Label>
                  <DatePickerWithWarning
                    date={formData.tanggalSurat}
                    onDateChange={handleDateChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="penerima">Penerima (Yth.)</Label>
                <Input
                  id="penerima"
                  value={formData.penerima}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="penerimaTempat">Di (Tempat Penerima)</Label>
                <Input
                  id="penerimaTempat"
                  value={formData.penerimaTempat}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isiSurat">Isi Surat</Label>
                <Textarea
                  id="isiSurat"
                  value={formData.isiSurat}
                  onChange={handleInputChange}
                  rows={8}
                  placeholder="Tuliskan paragraf pembuka, isi, dan detail lain dari surat di sini..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="penutup">Kalimat Penutup</Label>
                <Textarea
                  id="penutup"
                  value={formData.penutup}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jabatanPenandaTangan">
                  Jabatan Penanda Tangan
                </Label>
                <Input
                  id="jabatanPenandaTangan"
                  value={formData.jabatanPenandaTangan}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="namaPenandaTangan">Nama Penanda Tangan</Label>
                <Input
                  id="namaPenandaTangan"
                  value={formData.namaPenandaTangan}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nipPenandaTangan">NIP Penanda Tangan</Label>
                <Input
                  id="nipPenandaTangan"
                  value={formData.nipPenandaTangan}
                  onChange={handleInputChange}
                />
              </div>
              </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Preview Surat</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="bg-white text-black p-8 sm:p-12 font-serif text-sm print:shadow-none print:p-0"
                id="surat-preview"
              >
                {/* KOP SURAT */}
                <div className="flex items-center justify-center text-center border-b-4 border-black pb-2 mb-4">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/LOGO_KABUPATEN_BANDUNG.svg/1200px-LOGO_KABUPATEN_BANDUNG.svg.png" alt="Logo RSUD" width={80} height={80} className="mr-4" data-ai-hint="government logo" />
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
                {/* BADAN SURAT */}
                <div className="flex justify-end mb-4">
                  <p>{formData.tempat}, {formData.tanggalSurat ? format(formData.tanggalSurat, "dd MMMM yyyy", { locale: id }) : ""}</p>
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-x-2 mb-4">
                  <span className="font-semibold">Nomor</span>
                  <span>: {formData.nomor || "[Nomor Surat]"}</span>
                  <span className="font-semibold">Lampiran</span>
                  <span>: {formData.lampiran}</span>
                  <span className="font-semibold">Perihal</span>
                  <span className="font-semibold">: {formData.perihal || "[Perihal Surat]"}</span>
                </div>

                <div className="mb-4">
                  <p>Yth.</p>
                  <p>{formData.penerima || "[Nama Penerima]"}</p>
                  <p>Di</p>
                  <p className="ml-8">{formData.penerimaTempat}</p>
                </div>

                <p className="mb-4 text-justify indent-8 whitespace-pre-wrap">
                  {formData.isiSurat || "[Isi surat akan ditampilkan di sini...]"}
                </p>

                <p className="mb-12 text-justify indent-8">
                  {formData.penutup}
                </p>

                {/* TANDA TANGAN */}
                <div className="flex justify-end">
                  <div className="text-center">
                    <p>{formData.jabatanPenandaTangan || "[Jabatan Penanda Tangan]"}</p>
                    <div className="h-20"></div> {/* Space for signature */}
                    <p className="font-bold underline">
                      {formData.namaPenandaTangan || "[Nama Penanda Tangan]"}
                    </p>
                    <p>{formData.nipPenandaTangan || "[NIP Penanda Tangan]"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      {/* Print styles */}
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
          }
        }
      `}</style>
    </div>
  );
}
