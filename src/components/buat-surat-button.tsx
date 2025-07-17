
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FileSignature, FileText, PlusCircle, ChevronLeft, Package, Pill, Receipt, CheckCircle, Circle, ArrowRightCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "./ui/input"
import { BUAT_SURAT_POPOVER } from "@/lib/constants"
import { useSuratStore } from "@/store/suratStore"
import { cn } from "@/lib/utils"

const suratObatItems = [
  {
    label: BUAT_SURAT_POPOVER.SURAT_PERINTAH,
    href: "/buat-surat",
    icon: FileText,
    tipe: "SPP",
  },
  {
    label: BUAT_SURAT_POPOVER.SURAT_PESANAN_INTERNAL,
    href: "/buat-surat-pesanan",
    icon: FileText,
    tipe: "SP",
  },
  {
    label: BUAT_SURAT_POPOVER.SURAT_PESANAN_VENDOR,
    href: "/buat-surat-pesanan-final",
    icon: FileText,
    tipe: "SP-Vendor",
  },
  {
    label: BUAT_SURAT_POPOVER.BERITA_ACARA_PEMERIKSAAN,
    href: "/buat-berita-acara",
    icon: FileSignature,
    tipe: "BA",
  },
  {
    label: BUAT_SURAT_POPOVER.BERITA_ACARA_SERAH_TERIMA,
    href: "/buat-bastb",
    icon: FileSignature,
    tipe: "BASTB",
  },
];

const suratUmumItems = [
    {
        label: BUAT_SURAT_POPOVER.SURAT_PERINTAH_PENGADAAN,
        href: "/buat-surat-perintah-umum",
        icon: FileText,
        tipe: "SPU"
    },
    {
        label: BUAT_SURAT_POPOVER.BERITA_ACARA_HASIL_PENGADAAN,
        href: "/buat-berita-acara-hasil",
        icon: FileSignature,
        tipe: "BAH"
    },
    {
        label: BUAT_SURAT_POPOVER.SURAT_PESANAN_UMUM,
        href: "/buat-surat-pesanan-umum",
        icon: Receipt,
        tipe: "SP-Umum"
    },
    {
        label: BUAT_SURAT_POPOVER.BERITA_ACARA_PEMERIKSAAN_UMUM,
        href: "/buat-berita-acara-umum",
        icon: FileSignature,
        tipe: "BA-Umum"
    },
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
    const { surat } = useSuratStore();

    // Filter surat store to only include types relevant to the current menu
    const relevantTipes = new Set(items.map(item => item.tipe));
    const existingTipesInFlow = new Set(surat.filter(s => relevantTipes.has(s.tipe)).map(s => s.tipe));

    const lastCreatedIndex = items.findLastIndex(item => existingTipesInFlow.has(item.tipe));
    const nextStepIndex = (lastCreatedIndex !== -1 && lastCreatedIndex < items.length - 1) ? lastCreatedIndex + 1 : -1; // -1 if all are done
    
    const filteredSurat = items.filter(surat => 
        surat.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusIcon = (index: number) => {
        // All steps are completed
        if (nextStepIndex === -1) {
            return <CheckCircle className="mr-2 h-4 w-4 text-green-500" />;
        }
        if (index < nextStepIndex) {
            return <CheckCircle className="mr-2 h-4 w-4 text-green-500" />;
        }
        if (index === nextStepIndex) {
            return <ArrowRightCircle className="mr-2 h-4 w-4 text-blue-500" />;
        }
        return <Circle className="mr-2 h-4 w-4 text-muted-foreground" />;
    };

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
                    filteredSurat.map((surat) => {
                         const itemIndexInFullList = items.findIndex(item => item.tipe === surat.tipe);
                         const statusIcon = getStatusIcon(itemIndexInFullList);
                         const isNextStep = itemIndexInFullList === nextStepIndex;

                         return (
                            <Button
                                key={surat.href}
                                variant="ghost"
                                className={cn("w-full justify-start", isNextStep && "bg-blue-50 hover:bg-blue-100")}
                                onClick={() => onSelect(surat.href)}
                            >
                                {statusIcon}
                                <span>{surat.label}</span>
                            </Button>
                         )
                    })
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
