"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FileSignature, FileText, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

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

  const handleSelect = (href: string) => {
    router.push(href)
    setOpen(false)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Buat Surat
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Cari jenis surat..." />
        <CommandList>
          <CommandEmpty>Jenis surat tidak ditemukan.</CommandEmpty>
          <CommandGroup heading="Pilih Jenis Surat">
            {suratTypes.map((surat) => (
              <CommandItem
                key={surat.href}
                onSelect={() => handleSelect(surat.href)}
                className="cursor-pointer"
              >
                <surat.icon className="mr-2 h-4 w-4" />
                <span>{surat.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
