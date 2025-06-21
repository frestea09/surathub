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

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Buat Surat
         <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Ketik untuk mencari jenis surat..." />
        <CommandList>
          <CommandEmpty>Jenis surat tidak ditemukan.</CommandEmpty>
          <CommandGroup heading="Pilih Jenis Surat">
            {suratTypes.map((surat) => (
              <CommandItem
                key={surat.href}
                onSelect={() => {
                  runCommand(() => router.push(surat.href))
                }}
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
