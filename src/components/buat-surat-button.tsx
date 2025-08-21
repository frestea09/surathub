
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FileSignature, FileText, PlusCircle, ChevronLeft, Package, Pill, Receipt, CheckCircle, ArrowRight, Circle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { BUAT_SURAT_POPOVER } from "@/lib/constants"
import { cn } from "@/lib/utils"

const suratObatItems = [
  { label: BUAT_SURAT_POPOVER.SURAT_PERINTAH, href: "/buat-surat", icon: FileText },
  { label: BUAT_SURAT_POPOVER.SURAT_PESANAN_INTERNAL, href: "/buat-surat-pesanan", icon: FileText },
  { label: BUAT_SURAT_POPOVER.SURAT_PESANAN_VENDOR, href: "/buat-surat-pesanan-final", icon: FileText },
  { label: BUAT_SURAT_POPOVER.BERITA_ACARA_PEMERIKSAAN, href: "/buat-berita-acara", icon: FileSignature },
  { label: BUAT_SURAT_POPOVER.BERITA_ACARA_SERAH_TERIMA, href: "/buat-bastb", icon: FileSignature },
];

const suratUmumItems = [
    { label: BUAT_SURAT_POPOVER.SURAT_PERINTAH_PENGADAAN, href: "/buat-surat-perintah-umum", icon: FileText },
    { label: BUAT_SURAT_POPOVER.BERITA_ACARA_HASIL_PENGADAAN, href: "/buat-berita-acara-hasil", icon: FileSignature },
    { label: BUAT_SURAT_POPOVER.SURAT_PESANAN_UMUM, href: "/buat-surat-pesanan-umum", icon: Receipt },
    { label: BUAT_SURAT_POPOVER.BERITA_ACARA_PEMERIKSAAN_UMUM, href: "/buat-berita-acara-umum", icon: FileSignature },
];

const MainMenu = ({ setView }: { setView: (view: 'obat' | 'umum') => void }) => (
    <div className="p-2 space-y-2">
        <h3 className="px-2 text-sm font-semibold text-muted-foreground">Pilih Jenis Pengadaan</h3>
        <Button variant="ghost" className="w-full justify-start h-12" onClick={() => setView('obat')}>
            <Pill className="mr-3 h-5 w-5" />
            <div>
                <p className="text-base">Obat & Alkes</p>
                <p className="text-xs text-muted-foreground text-left">Alur untuk Farmasi & Alat Kesehatan</p>
            </div>
        </Button>
        <Button variant="ghost" className="w-full justify-start h-12" onClick={() => setView('umum')}>
            <Package className="mr-3 h-5 w-5" />
            <div>
                <p className="text-base">Barang Jasa Umum</p>
                 <p className="text-xs text-muted-foreground text-left">Alur untuk pengadaan non-farmasi</p>
            </div>
        </Button>
    </div>
);

const StepIcon = ({ step }: { step: number }) => (
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
        {step}
    </div>
);

const WorkflowMenu = ({
    title,
    items,
    onBack,
    onSelect
}: {
    title: string,
    items: typeof suratObatItems,
    onBack: () => void,
    onSelect: (href: string) => void
}) => {
    return (
        <div>
            <div className="p-2 flex items-center border-b">
                 <Button variant="ghost" size="icon" className="h-8 w-8 mr-2" onClick={onBack}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-sm font-semibold">{title}</h3>
            </div>
            <div className="p-2">
                <p className="text-xs text-muted-foreground px-2 mb-2">Pilih langkah alur kerja yang ingin Anda mulai.</p>
                <div className="space-y-1">
                    {items.map((item, index) => (
                        <div key={item.href}>
                             <Button
                                variant="ghost"
                                className="w-full justify-start h-11"
                                onClick={() => onSelect(item.href)}
                            >
                                <StepIcon step={index + 1} />
                                <span className="ml-3 text-left">{item.label.substring(3)}</span>
                            </Button>
                            {index < items.length - 1 && (
                                <div className="ml-3 my-1 border-l-2 border-dashed border-border h-4" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export function BuatSuratButton() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [view, setView] = React.useState<'main' | 'obat' | 'umum'>('main');

  const handleSelect = (href: string) => {
    router.push(href)
    setOpen(false)
    setTimeout(() => setView('main'), 300);
  }

  const handleBack = () => {
      setView('main');
  }

  React.useEffect(() => {
      if (open) {
          setView('main');
      }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          {BUAT_SURAT_POPOVER.BUTTON_LABEL}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="end">
        {view === 'main' && <MainMenu setView={setView} />}
        {view === 'obat' && (
            <WorkflowMenu
                title="Alur Pengadaan Obat & Alkes"
                items={suratObatItems}
                onBack={handleBack}
                onSelect={handleSelect}
            />
        )}
        {view === 'umum' && (
             <WorkflowMenu
                title="Alur Pengadaan Umum"
                items={suratUmumItems}
                onBack={handleBack}
                onSelect={handleSelect}
            />
        )}
      </PopoverContent>
    </Popover>
  )
}
