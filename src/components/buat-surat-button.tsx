"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FileSignature, FileText, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "./ui/input"

const suratTypes = [
  {
    label: "Surat Perintah",
    href: "/buat-surat",
    icon: FileText,
  },
  {
    label: "Surat Pesanan (Internal)",
    href: "/buat-surat-pesanan",
    icon: FileText,
  },
  {
    label: "Surat Pesanan (Vendor)",
    href: "/buat-surat-pesanan-final",
    icon: FileText,
  },
  {
    label: "Berita Acara Pemeriksaan",
    href: "/buat-berita-acara",
    icon: FileSignature,
  },
  {
    label: "Berita Acara Serah Terima",
    href: "/buat-bastb",
    icon: FileSignature,
  },
]

export function BuatSuratButton() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  const handleSelect = (href: string) => {
    router.push(href)
    setOpen(false)
  }

  const filteredSurat = suratTypes.filter(surat => 
    surat.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Buat Surat
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <div className="p-2">
            <Input 
                placeholder="Cari jenis surat..."
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
                        onClick={() => handleSelect(surat.href)}
                    >
                        <surat.icon className="mr-2 h-4 w-4" />
                        <span>{surat.label}</span>
                    </Button>
                ))
            ) : (
                <p className="p-4 text-center text-sm text-muted-foreground">
                    Jenis surat tidak ditemukan.
                </p>
            )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
