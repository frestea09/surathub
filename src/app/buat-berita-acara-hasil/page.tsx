
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Printer, Download, Save, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { DatePickerWithWarning } from '@/components/ui/date-picker-with-warning';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSuratStore, type Surat } from '@/store/suratStore';
import { terbilang } from "@/lib/terbilang";

type Peserta = {
  id: number;
  nama: string;
  pemilik: string;
  hasilEvaluasi: string;
};

const IMPORT_ITEMS_PER_PAGE = 3;

export default function BuatBeritaAcaraHasilPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addSurat, surat: allSurat } = useSuratStore();

  const editNomor = searchParams.get('edit');
  const isEditMode = !!editNomor;

  const [formData, setFormData] = useState({
    nomor: '02/Alat Listrik/PP/V/2025',
    nomorSuratReferensi: '',
    tanggalSurat: new Date('2025-05-19T00:00:00'),
    narasiPembuka: 'Pada Hari ini Senin Tanggal Sembilan Belas Bulan Mei Tahun Dua Ribu Dua Puluh Lima, telah dibuat Berita Acara Hasil Pengadaan Barang/Jasa untuk paket pekerjaan',
    kodePaket: 'Belanja Alat Listrik',
    namaPaket: 'Pengadaan Belanja Alat Listrik Bulan Mei 2025',
    nilaiHps: 5310000,
    metodePemilihan: 'Pengadan Langsung',
    nilaiPenawaran: 5308575,
    nilaiTerkoreksi: 5308575,
    nilaiNegosiasi: 5308575,
    narasiPenutup: 'Demikian surat ini disampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih.',
    pejabatNama: 'Asep Yuyun, S.Sos',
    pejabatNip: 'NIP.19741219 201001 1 001',
    vendorTempat: 'Soreang',
    vendorTanggal: new Date('2025-05-19T00:00:00'),
  });

  const [peserta, setPeserta] = useState<Peserta[]>([
    { id: 1, nama: 'TB Doa Sepuh', pemilik: 'iin Permana', hasilEvaluasi: 'Lulus' }
  ]);
  
  // State for import dialog
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importSearchTerm, setImportSearchTerm] = useState("");
  const [importCurrentPage, setImportCurrentPage] = useState(1);
  
  const availableSurat = useMemo(() => {
    return allSurat.filter(s => s.tipe === 'SPU');
  }, [allSurat]);

   useEffect(() => {
    if (isEditMode && allSurat.length > 0) {
      const suratToEdit = allSurat.find(s => s.nomor === editNomor && s.tipe === 'BAH');
      if (suratToEdit) {
        const { formData: dataToLoad, peserta: pesertaToLoad } = suratToEdit.data;
        setFormData({
            ...dataToLoad,
            tanggalSurat: dataToLoad.tanggalSurat ? new Date(dataToLoad.tanggalSurat) : new Date(),
            vendorTanggal: dataToLoad.vendorTanggal ? new Date(dataToLoad.vendorTanggal) : new Date(),
        });
        setPeserta(pesertaToLoad || []);
      }
    }
  }, [editNomor, allSurat, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [id]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleDateChange = (field: 'tanggalSurat' | 'vendorTanggal', date: Date | undefined) => {
    if(date) {
      setFormData(prev => ({...prev, [field]: date}));
    }
  };

  const handleSave = () => {
    if (!formData.nomor) {
      toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Nomor surat tidak boleh kosong." });
      return;
    }
    
    try {
      const suratToSave = {
        nomor: formData.nomor,
        judul: formData.namaPaket,
        status: isEditMode ? (allSurat.find(s => s.nomor === editNomor)?.status || 'Draft') : 'Draft',
        tanggal: formData.tanggalSurat.toISOString(),
        penanggungJawab: formData.pejabatNama,
        dariKe: peserta.map(p => p.nama).join(', '),
        tipe: 'BAH',
        data: { 
          formData: { ...formData, status: isEditMode ? (allSurat.find(s => s.nomor === editNomor)?.status || 'Draft') : 'Draft' }, 
          peserta 
        },
      };

      addSurat(suratToSave);

      toast({ title: "Berhasil", description: isEditMode ? "Draf berhasil diperbarui." : "Data berhasil disimpan sebagai draf." });
      router.push("/surat-keluar?tab=draft");
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Terjadi kesalahan saat menyimpan data." });
    }
  };

  const handleOpenImportDialog = () => {
    setImportCurrentPage(1);
    setImportSearchTerm("");
    setIsImportDialogOpen(true);
  };
  
  const handleImportSelection = (surat: Surat) => {
    setFormData(prev => ({
      ...prev,
      namaPaket: surat.judul,
      nomorSuratReferensi: surat.nomor,
    }));
    setIsImportDialogOpen(false);
    toast({ title: "Berhasil", description: `Data dari surat ${surat.nomor} berhasil dimuat.` });
  };
  
  const formatCurrency = (value: number) => new Intl.NumberFormat("id-ID", { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  const nilaiHpsTerbilang = terbilang(formData.nilaiHps);

  // Pagination and search for import dialog
  const filteredImportSurat = useMemo(() => {
    return availableSurat.filter(s =>
      s.nomor.toLowerCase().includes(importSearchTerm.toLowerCase()) ||
      s.judul.toLowerCase().includes(importSearchTerm.toLowerCase())
    );
  }, [availableSurat, importSearchTerm]);

  const paginatedImportSurat = useMemo(() => {
    const startIndex = (importCurrentPage - 1) * IMPORT_ITEMS_PER_PAGE;
    return filteredImportSurat.slice(startIndex, startIndex + IMPORT_ITEMS_PER_PAGE);
  }, [filteredImportSurat, importCurrentPage]);

  const totalImportPages = Math.ceil(filteredImportSurat.length / IMPORT_ITEMS_PER_PAGE);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2 print:hidden">
        <Link href="/dashboard"><Button size="icon" variant="outline" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /><span className="sr-only">Back</span></Button></Link>
        <h1 className="text-xl font-semibold">{isEditMode ? 'Edit' : 'Buat'} Berita Acara Hasil Pengadaan</h1>
        <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" onClick={handleOpenImportDialog}><Download className="mr-2 h-4 w-4" />Ambil Data</Button>
            <Button variant="outline" onClick={handleSave}><Save className="mr-2 h-4 w-4" />{isEditMode ? 'Update Draf' : 'Simpan'}</Button>
            <Button onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Cetak</Button>
        </div>
      </header>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-1">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-1 print:hidden">
          <Card>
            <CardHeader><CardTitle>Detail Berita Acara</CardTitle><CardDescription>Isi detail Berita Acara Hasil Pengadaan.</CardDescription></CardHeader>
            <CardContent>
             <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="space-y-4 pr-4">
                  <div className="space-y-2"><Label>Nomor Surat</Label><Input id="nomor" value={formData.nomor} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label>Tanggal Surat</Label><DatePickerWithWarning date={formData.tanggalSurat} onDateChange={(d) => handleDateChange('tanggalSurat', d)} /></div>
                  <div className="space-y-2"><Label>Kode Paket</Label><Input id="kodePaket" value={formData.kodePaket} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label>Nama Paket</Label><Input id="namaPaket" value={formData.namaPaket} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label>Nilai Total HPS</Label><Input id="nilaiHps" type="number" value={formData.nilaiHps} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label>Metode Pemilihan</Label><Input id="metodePemilihan" value={formData.metodePemilihan} onChange={handleInputChange} /></div>
                  <Separator />
                  <h3 className="text-sm font-medium">Hasil Negosiasi</h3>
                  <div className="space-y-2"><Label>Nilai Penawaran</Label><Input id="nilaiPenawaran" type="number" value={formData.nilaiPenawaran} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label>Nilai Terkoreksi</Label><Input id="nilaiTerkoreksi" type="number" value={formData.nilaiTerkoreksi} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label>Nilai Negosiasi Biaya</Label><Input id="nilaiNegosiasi" type="number" value={formData.nilaiNegosiasi} onChange={handleInputChange} /></div>
                  <Separator />
                  <h3 className="text-sm font-medium">Penanda Tangan</h3>
                  <div className="space-y-2"><Label>Nama Pejabat</Label><Input id="pejabatNama" value={formData.pejabatNama} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label>NIP Pejabat</Label><Input id="pejabatNip" value={formData.pejabatNip} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label>Tempat Vendor</Label><Input id="vendorTempat" value={formData.vendorTempat} onChange={handleInputChange} /></div>
                  <div className="space-y-2"><Label>Tanggal Vendor</Label><DatePickerWithWarning date={formData.vendorTanggal} onDateChange={(d) => handleDateChange('vendorTanggal', d)} /></div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 print:col-span-1">
           <Card className="overflow-hidden print:shadow-none print:border-none">
            <CardHeader className="print:hidden"><CardTitle>Preview Berita Acara</CardTitle></CardHeader>
            <CardContent>
              <div className="bg-white text-black p-4 sm:p-8 font-serif text-sm print:shadow-none print:p-0" id="surat-preview">
                {/* KOP SURAT */}
                <div className="flex items-center justify-center text-center border-b-[3px] border-black pb-2 mb-4">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/LOGO_KABUPATEN_BANDUNG.svg/1200px-LOGO_KABUPATEN_BANDUNG.svg.png" alt="Logo RSUD" width={80} height={80} className="mr-4" data-ai-hint="government logo" />
                  <div>
                    <h1 className="font-bold uppercase text-base">Pemerintah Kabupaten Bandung</h1>
                    <h2 className="font-bold uppercase text-xl">Rumah Sakit Umum Daerah Oto Iskandar Di Nata</h2>
                    <p className="text-xs">Jalan Raya Gading Tutuka, Desa Cingcin, Kec. Soreang, Kab. Bandung, Prov. Jawa Barat.</p>
                    <p className="text-xs">Telp. (022) 5891355 Email: rsudotista@bandungkab.go.id Website: rsudotista@bandungkab.go.id</p>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <h2 className="font-bold underline text-base uppercase">Berita Acara Hasil Pengadaan Barang Jasa</h2>
                  <p>Nomor: {formData.nomor}</p>
                </div>
                
                <p className="mb-4 text-justify">{formData.narasiPembuka}:</p>
                
                <div className="mb-4 ml-8 grid grid-cols-[12rem_auto_1fr] gap-x-2 gap-y-1">
                    <span>Kode Paket</span><span>:</span><span>{formData.kodePaket}</span>
                    <span>Nama Paket</span><span>:</span><span>{formData.namaPaket}</span>
                    <span>Nilai Total HPS</span><span>:</span><span>{formatCurrency(formData.nilaiHps)},- ({nilaiHpsTerbilang} Rupiah)</span>
                    <span>Metode Pemilihan</span><span>:</span><span>{formData.metodePemilihan}</span>
                </div>

                <div className="mb-2">
                    <p>A. Pembukaan Penawaran</p>
                    <p>B. Evaluasi Penawaran</p>
                    <div className="ml-4">
                        <p>1. Evaluasi Penawaran</p>
                        <Table className="text-xs border-collapse border border-black"><TableHeader><TableRow><TableHead className="border border-black text-black font-bold text-center">No</TableHead><TableHead className="border border-black text-black font-bold">Nama Peserta</TableHead><TableHead className="border border-black text-black font-bold text-center">Hasil Evaluasi</TableHead><TableHead className="border border-black text-black font-bold text-center">Keterangan</TableHead></TableRow></TableHeader>
                            <TableBody>{peserta.map((p, i) => (<TableRow key={p.id}><TableCell className="border border-black text-center">{i + 1}</TableCell><TableCell className="border border-black">{p.nama}<br/>Pemilik: {p.pemilik}</TableCell><TableCell className="border border-black text-center">{p.hasilEvaluasi}</TableCell><TableCell className="border border-black"></TableCell></TableRow>))}</TableBody>
                        </Table>
                    </div>
                     <div className="ml-4 mt-2">
                        <p>2. Evaluasi Teknis</p>
                        <Table className="text-xs border-collapse border border-black"><TableHeader><TableRow><TableHead className="border border-black text-black font-bold text-center">No</TableHead><TableHead className="border border-black text-black font-bold">Nama Peserta</TableHead><TableHead className="border border-black text-black font-bold text-center">Hasil Evaluasi</TableHead><TableHead className="border border-black text-black font-bold text-center">Keterangan</TableHead></TableRow></TableHeader>
                            <TableBody>{peserta.map((p, i) => (<TableRow key={p.id}><TableCell className="border border-black text-center">{i + 1}</TableCell><TableCell className="border border-black">{p.nama}<br/>Pemilik: {p.pemilik}</TableCell><TableCell className="border border-black text-center">{p.hasilEvaluasi}</TableCell><TableCell className="border border-black"></TableCell></TableRow>))}</TableBody>
                        </Table>
                    </div>
                     <div className="ml-4 mt-2">
                        <p>3. Evaluasi Harga Biaya</p>
                        <Table className="text-xs border-collapse border border-black"><TableHeader><TableRow><TableHead className="border border-black text-black font-bold text-center">No</TableHead><TableHead className="border border-black text-black font-bold">Nama Peserta</TableHead><TableHead className="border border-black text-black font-bold text-center">Hasil Evaluasi</TableHead><TableHead className="border border-black text-black font-bold text-center">Keterangan</TableHead></TableRow></TableHeader>
                            <TableBody>{peserta.map((p, i) => (<TableRow key={p.id}><TableCell className="border border-black text-center">{i + 1}</TableCell><TableCell className="border border-black">{p.nama}<br/>Pemilik: {p.pemilik}</TableCell><TableCell className="border border-black text-center">{p.hasilEvaluasi}</TableCell><TableCell className="border border-black"></TableCell></TableRow>))}</TableBody>
                        </Table>
                    </div>
                </div>

                <div className="mb-4">
                    <p>C. Hasil Negosiasi Biaya sebagai berikut:</p>
                    <div className="ml-4 grid grid-cols-[12rem_auto_1fr] gap-x-2 gap-y-1">
                        <span>1. Nilai Penawaran</span><span>:</span><span>{new Intl.NumberFormat('id-ID').format(formData.nilaiPenawaran)}</span>
                        <span>2. Nilai Terkoreksi</span><span>:</span><span>{new Intl.NumberFormat('id-ID').format(formData.nilaiTerkoreksi)}</span>
                        <span>3. Nilai Negosiasi Biaya</span><span>:</span><span>{new Intl.NumberFormat('id-ID').format(formData.nilaiNegosiasi)}</span>
                    </div>
                </div>

                <p className="mb-8">{formData.narasiPenutup}</p>

                <div className="flex justify-between">
                    <div className="text-center w-1/2">
                        <p>Pejabat Pengadaan Barang/Jasa</p>
                        <p>RSUD Oto Iskandar Di Nata</p>
                        <div className="h-20"></div>
                        <p className="font-bold underline">{formData.pejabatNama}</p>
                        <p>{formData.pejabatNip}</p>
                    </div>
                    <div className="text-center w-1/2">
                        <p>{formData.vendorTempat}, {formData.vendorTanggal ? format(formData.vendorTanggal, "dd MMMM yyyy", { locale: id }) : ''}</p>
                        <p>{peserta[0]?.nama || 'Nama Vendor'}</p>
                        <div className="h-20"></div>
                        <p className="font-bold underline">{peserta[0]?.pemilik || 'Pemilik Vendor'}</p>
                    </div>
                </div>
              </div>
            </CardContent>
           </Card>
        </div>
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogContent><DialogHeader><DialogTitle>Pilih Surat Perintah untuk Diimpor</DialogTitle><DialogDescription>Pilih surat referensi untuk mengisi data.</DialogDescription></DialogHeader>
            <div className="relative my-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Cari no. surat atau perihal..."
                    value={importSearchTerm}
                    onChange={(e) => setImportSearchTerm(e.target.value)}
                    className="pl-8"
                />
            </div>
            <ScrollArea className="max-h-80 pr-4 space-y-2">{paginatedImportSurat.length > 0 ? (paginatedImportSurat.map((s, i) => (<div key={`${s.nomor}-${i}`} className="flex items-center justify-between p-2 my-1 hover:bg-muted rounded-md border"><div><p className="font-semibold">{s.nomor}</p><p className="text-sm text-muted-foreground">{s.judul}</p></div><Button onClick={() => handleImportSelection(s)}>Pilih</Button></div>))) : (<p className="text-sm text-muted-foreground text-center p-4">Tidak ada Surat Perintah (Umum) yang tersedia.</p>)}</ScrollArea>
             {totalImportPages > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-4">
                    <Button variant="outline" size="sm" onClick={() => setImportCurrentPage(p => Math.max(p - 1, 1))} disabled={importCurrentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                    <span className="text-sm text-muted-foreground">Hal {importCurrentPage} dari {totalImportPages}</span>
                    <Button variant="outline" size="sm" onClick={() => setImportCurrentPage(p => Math.min(p + 1, totalImportPages))} disabled={importCurrentPage === totalImportPages}><ChevronRight className="h-4 w-4" /></Button>
                </div>
            )}
          </DialogContent>
        </Dialog>
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
            font-size: 11pt;
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
