"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FileSignature, FileText, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Buat Surat
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Cari jenis surat..." />
          <CommandList>
            <CommandEmpty>Jenis surat tidak ditemukan.</CommandEmpty>
            <CommandGroup>
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
        </Command>
      </PopoverContent>
    </Popover>
  )
}