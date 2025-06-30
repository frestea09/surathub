
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FileSignature, FileText, PlusCircle, ChevronLeft, Package, Pill } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "./ui/input"
import { BUAT_SURAT_POPOVER } from "@/lib/constants"
import { Separator } from "./ui/separator"

const suratObatItems = [
  {
    label: BUAT_SURAT_POPOVER.SURAT_PERINTAH,
    href: "/buat-surat",
    icon: FileText,
  },
  {
    label: BUAT_SURAT_POPOVER.SURAT_PESANAN_INTERNAL,
    href: "/buat-surat-pesanan",
    icon: FileText,
  },
  {
    label: BUAT_SURAT_POPOVER.SURAT_PESANAN_VENDOR,
    href: "/buat-surat-pesanan-final",
    icon: FileText,
  },
  {
    label: BUAT_SURAT_POPOVER.BERITA_ACARA_PEMERIKSAAN,
    href: "/buat-berita-acara",
    icon: FileSignature,
  },
  {
    label: BUAT_SURAT_POPOVER.BERITA_ACARA_SERAH_TERIMA,
    href: "/buat-bastb",
    icon: FileSignature,
  },
];

const suratUmumItems = [
    {
        label: BUAT_SURAT_POPOVER.SURAT_PERINTAH_PENGADAAN,
        href: "/buat-surat-perintah-umum",
        icon: FileText,
    },
    // ... Other general procurement documents can be added here
];

const MainMenu = ({ setView }: { setView: (view: 'obat' | 'umum') => void }) => (
    <div className="p-2 space-y-2">
        <Button variant="ghost" className="w-full justify-start" onClick={() => setView('obat')}>
            <Pill className="mr-2 h-4 w-4" />
            <span>Pengadaan Obat & BMHP</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => setView('umum')}>
            <Package className="mr-2 h-4 w-4" />
            <span>Pengadaan Barang Jasa Umum</span>
        </Button>
    </div>
);

const SuratMenu = ({ 
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
    const [searchTerm, setSearchTerm] = React.useState("");
    const filteredSurat = items.filter(surat => 
        surat.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="p-2 flex items-center border-b">
                 <Button variant="ghost" size="icon" className="h-8 w-8 mr-2" onClick={onBack}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-sm font-semibold">{title}</h3>
            </div>
            <div className="p-2">
                <Input 
                    placeholder={BUAT_SURAT_POPOVER.SEARCH_PLACEHOLDER}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9"
                />
            </div>
            <div className="flex flex-col p-1">
                {filteredSurat.length > 0 ? (
                    filteredSurat.map((surat) => (
                        <Button
                            key={surat.href}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => onSelect(surat.href)}
                        >
                            <surat.icon className="mr-2 h-4 w-4" />
                            <span>{surat.label}</span>
                        </Button>
                    ))
                ) : (
                    <p className="p-4 text-center text-sm text-muted-foreground">
                        {BUAT_SURAT_POPOVER.NOT_FOUND}
                    </p>
                )}
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
    // Reset view after a short delay to allow popover to close gracefully
    setTimeout(() => setView('main'), 300);
  }

  const handleBack = () => {
      setView('main');
  }

  // Reset to main menu when popover opens
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
      <PopoverContent className="w-[300px] p-0">
        {view === 'main' && <MainMenu setView={setView} />}
        {view === 'obat' && (
            <SuratMenu 
                title="Alur Pengadaan Obat & BMHP"
                items={suratObatItems}
                onBack={handleBack}
                onSelect={handleSelect}
            />
        )}
        {view === 'umum' && (
             <SuratMenu 
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
