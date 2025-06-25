
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
import { BUAT_SURAT_POPOVER } from "@/lib/constants"

const suratTypes = [
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
          {BUAT_SURAT_POPOVER.BUTTON_LABEL}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
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
                        onClick={() => handleSelect(surat.href)}
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
      </PopoverContent>
    </Popover>
  )
}
