
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FileSignature, FileText, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

  const handleSelect = (href: string) => {
    router.push(href)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Buat Surat
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Pilih Jenis Surat</DropdownMenuLabel>
        <DropdownMenuGroup>
          {suratTypes.map((surat) => (
            <DropdownMenuItem key={surat.href} onSelect={() => handleSelect(surat.href)} className="cursor-pointer">
              <surat.icon className="mr-2 h-4 w-4" />
              <span>{surat.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
