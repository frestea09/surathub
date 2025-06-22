
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Printer, Sparkles, Download, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { DatePickerWithWarning } from '@/components/ui/date-picker-with-warning';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useSuratStore } from '@/store/suratStore';

type BeritaAcara = {
  formData: any;
  items: any[];
};

export default function BuatBastbPage() {
  const { toast } = useToast();
  const router = useRouter();
  const addSurat = useSuratStore(state => state.addSurat);

  const [formData, setFormData] = useState({
    nomor: 'BASTB/06/FAR/IV/2025',
    narasiPembuka: 'Pada hari ini, Rabu Tanggal Tiga Puluh Bulan April Tahun Dua Ribu Dua Puluh Lima, bertempat di Rumah Sakit Umum Daerah Oto Iskandar Di Nata, yang bertanda tangan dibawah ini.',
    pihak1Nama: 'Saep Trian Prasetia.S.Si. Apt',
    pihak1Nip: '198408272008011005',
    pihak1Jabatan: 'Pejabat Pembuat Komitmen RSUD Oto Iskandar Di Nata',
    pihak1Alamat: 'Jalan Raya Gading Tutuka Desa Cingcin, Kecamatan Soreang Kabupaten Bandung',
    pihak2Nama: 'dr. H. Yani Sumpena Muchtar, SH, MH.Kes',
    pihak2Nip: '196711022002121001',
    pihak2Jabatan: 'Kuasa Pengguna Anggaran RSUD Oto Iskandar Di Nata',
    pihak2Alamat: 'Jalan Raya Gading Tutuka Desa Cingcin, Kecamatan Soreang Kabupaten Bandung',
    nomorSuratPesanan: '000.3/06-FAR/PPK-RSUD OTISTA/V/2025',
    tanggalSuratPesanan: new Date('2025-04-08T00:00:00'),
    nomorBeritaAcara: '06/PPK-FAR/RSUDO/IV/2025',
    tanggalBeritaAcara: new Date('2025-04-30T00:00:00'),
    narasiPenutup: 'Demikian Berita Acara Serah Terima Barang ini, dibuat dalam rangkap 3 (Tiga) untuk di pergunakan sebagaimana mestinya.',
  });
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [availableSurat, setAvailableSurat] = useState<BeritaAcara[]>([]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (field: 'tanggalSuratPesanan' | 'tanggalBeritaAcara', date: Date | undefined) => {
    if(date) {
      setFormData(prev => ({...prev, [field]: date}))
    }
  }
  
  const handlePrint = () => {
    window.print();
  };

  const handleOpenImportDialog = () => {
    try {
      if (typeof window !== 'undefined') {
        const dataString = localStorage.getItem('beritaAcaraList');
        setAvailableSurat(dataString ? JSON.parse(dataString) : []);
      }
    } catch (error) {
      toast({
          variant: "destructive",
          title: "Gagal Membaca Data",
          description: "Gagal memuat daftar Berita Acara.",
      });
    }
    setIsImportDialogOpen(true);
  };
  
  const handleImportSelection = (importData: BeritaAcara) => {
    setFormData(prev => ({
      ...prev,
      nomorBeritaAcara: importData.formData?.nomor || prev.nomorBeritaAcara,
      tanggalBeritaAcara: new Date(), 
      nomorSuratPesanan: importData.formData?.nomorSuratReferensi || prev.nomorSuratPesanan,
      tanggalSuratPesanan: importData.formData?.tanggalSuratReferensi ? new Date(importData.formData.tanggalSuratReferensi) : prev.tanggalSuratPesanan,
      pihak1Nama: importData.formData?.pejabatNama || prev.pihak1Nama,
      pihak1Nip: importData.formData?.pejabatNip ? importData.formData.pejabatNip.replace('NIP. ', '') : prev.pihak1Nip,
    }));

    setIsImportDialogOpen(false);
    toast({
      title: "Berhasil",
      description: `Data dari berita acara ${importData.formData.nomor} berhasil dimuat.`,
    });
  };

  const handleSave = () => {
    if (!formData.nomor) {
      toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Nomor surat tidak boleh kosong." });
      return;
    }
    
    try {
      const dataToSave = { formData: { ...formData, status: 'Draft' } };
      addSurat('bastbList', dataToSave);
      toast({ title: "Berhasil", description: "Data BASTB berhasil disimpan sebagai draft." });
      router.push("/surat-keluar?tab=draft");
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Terjadi kesalahan saat menyimpan data." });
      console.error("Failed to save", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
        <Link href="/dashboard">
          <Button size="icon" variant="outline" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Buat Berita Acara Serah Terima</h1>
        <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" onClick={handleOpenImportDialog}>
              <Download className="mr-2 h-4 w-4" />
              Ambil Data
            </Button>
            <Button variant="outline" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Simpan
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
                Isi detail Berita Acara Serah Terima Barang/Jasa.
              </CardDescription>
            </CardHeader>
            <CardContent>
             <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="space-y-4 pr-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomor">Nomor Surat</Label>
                    <Input id="nomor" value={formData.nomor} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="narasiPembuka">Narasi Pembuka</Label>
                    <Textarea id="narasiPembuka" value={formData.narasiPembuka} onChange={handleInputChange} rows={5} />
                  </div>
                  <Separator />
                  <h3 className="text-sm font-medium">Pihak Kesatu (Pejabat Pembuat Komitmen)</h3>
                  <div className="space-y-2">
                    <Label htmlFor="pihak1Nama">Nama</Label>
                    <Input id="pihak1Nama" value={formData.pihak1Nama} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pihak1Nip">NIP</Label>
                    <Input id="pihak1Nip" value={formData.pihak1Nip} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pihak1Jabatan">Jabatan</Label>
                    <Input id="pihak1Jabatan" value={formData.pihak1Jabatan} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pihak1Alamat">Alamat</Label>
                    <Input id="pihak1Alamat" value={formData.pihak1Alamat} onChange={handleInputChange} />
                  </div>
                  <Separator />
                  <h3 className="text-sm font-medium">Pihak Kedua (Kuasa Pengguna Anggaran)</h3>
                   <div className="space-y-2">
                    <Label htmlFor="pihak2Nama">Nama</Label>
                    <Input id="pihak2Nama" value={formData.pihak2Nama} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pihak2Nip">NIP</Label>
                    <Input id="pihak2Nip" value={formData.pihak2Nip} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pihak2Jabatan">Jabatan</Label>
                    <Input id="pihak2Jabatan" value={formData.pihak2Jabatan} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pihak2Alamat">Alamat</Label>
                    <Input id="pihak2Alamat" value={formData.pihak2Alamat} onChange={handleInputChange} />
                  </div>
                  <Separator />
                  <h3 className="text-sm font-medium">Dokumen Referensi</h3>
                  <div className="space-y-2">
                    <Label htmlFor="nomorSuratPesanan">Nomor Surat Pesanan</Label>
                    <Input id="nomorSuratPesanan" value={formData.nomorSuratPesanan} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tanggal Surat Pesanan</Label>
                    <DatePickerWithWarning date={formData.tanggalSuratPesanan} onDateChange={(date) => handleDateChange('tanggalSuratPesanan', date)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomorBeritaAcara">Nomor Berita Acara Pemeriksaan</Label>
                    <Input id="nomorBeritaAcara" value={formData.nomorBeritaAcara} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tanggal Berita Acara Pemeriksaan</Label>
                    <DatePickerWithWarning date={formData.tanggalBeritaAcara} onDateChange={(date) => handleDateChange('tanggalBeritaAcara', date)} />
                  </div>
                  <Separator />
                   <div className="space-y-2">
                    <Label htmlFor="narasiPenutup">Narasi Penutup</Label>
                    <Textarea id="narasiPenutup" value={formData.narasiPenutup} onChange={handleInputChange} rows={3} />
                  </div>
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
              <div className="bg-white text-black p-4 sm:p-8 font-serif text-[11pt] print:shadow-none print:p-0" id="surat-preview">
                {/* KOP SURAT */}
                <div className="flex items-center justify-center text-center border-b-4 border-black pb-2 mb-4">
                  <Image src="/assets/logo-rs.png" alt="Logo RSUD" width={80} height={80} className="mr-4" />
                  <div>
                    <h1 className="font-bold text-lg tracking-wide">RUMAH SAKIT UMUM DAERAH OTO ISKANDAR DI NATA</h1>
                    <p className="text-xs">Jalan Gading Tutuka Kampung Cingcin Kolot Cingcin - 40912</p>
                    <p className="text-xs">Telp. (022) 5891355, 5896590, 5896591 - IGD, Fax. 5896592</p>
                    <p className="text-xs">E-mail: rsudotista@bandungkab.go.id</p>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <h2 className="font-bold underline text-base">BERITA ACARA SERAH TERIMA BARANG/JASA</h2>
                  <p>NOMOR: {formData.nomor}</p>
                </div>
                
                <p className="mb-4 text-justify indent-8">
                  {formData.narasiPembuka}
                </p>
                
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
                  PIHAK KESATU telah melaksanakan pemeriksaan terhadap Pengadaan Obat yang dipesan melalui surat pesanan Nomor {formData.nomorSuratPesanan} tanggal {formData.tanggalSuratPesanan ? format(formData.tanggalSuratPesanan, "dd MMMM yyyy", { locale: id }) : ''}, dalam kondisi baik dan sesuai dengan spesifikasi yang terdapat dalam berita acara Pemeriksaan Barang Nomor: {formData.nomorBeritaAcara} tanggal {formData.tanggalBeritaAcara ? format(formData.tanggalBeritaAcara, "dd MMMM yyyy", { locale: id }) : ''} (jenis barang terlampir). Untuk selanjutnya diserah terimakan kepada PIHAK KEDUA.
                </p>

                <p className="mb-8 text-justify indent-8">
                  {formData.narasiPenutup}
                </p>

                <div className="flex justify-between">
                    <div className="text-center w-1/2">
                        <p>PIHAK PERTAMA</p>
                        <p>PEJABAT PEMBUAT KOMITMEN</p>
                        <div className="h-20"></div>
                        <p className="font-bold underline">{formData.pihak1Nama}</p>
                        <p>NIP. {formData.pihak1Nip}</p>
                    </div>
                    <div className="text-center w-1/2">
                        <p>PIHAK KEDUA</p>
                        <p>KUASA PENGGUNA ANGGARAN</p>
                        <div className="h-20"></div>
                        <p className="font-bold underline">{formData.pihak2Nama}</p>
                        <p>NIP. {formData.pihak2Nip}</p>
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
                <DialogTitle>Pilih Berita Acara untuk Diimpor</DialogTitle>
                <DialogDescription>Pilih surat referensi dari daftar di bawah ini untuk mengisi data secara otomatis.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-96">
                <div className="pr-4">
                  {availableSurat.length > 0 ? (
                      availableSurat.map((surat: BeritaAcara) => (
                          <div key={surat.formData.nomor} className="flex items-center justify-between p-2 my-1 hover:bg-muted rounded-md border">
                              <div>
                                  <p className="font-semibold">{surat.formData.nomor}</p>
                                  <p className="text-sm text-muted-foreground">Vendor: {surat.formData.vendorNama}</p>
                              </div>
                              <Button onClick={() => handleImportSelection(surat)}>Pilih</Button>
                          </div>
                      ))
                  ) : (
                      <p className="text-sm text-muted-foreground text-center p-4">Tidak ada data Berita Acara yang tersimpan.</p>
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
