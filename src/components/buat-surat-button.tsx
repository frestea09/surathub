"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function BuatSuratButton() {
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Buat Surat
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Pilih Jenis Surat</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/buat-surat')}>
                    Surat Perintah
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/buat-surat-pesanan')}>
                    Surat Pesanan (Internal)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/buat-surat-pesanan-final')}>
                    Surat Pesanan (Vendor)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/buat-berita-acara')}>
                    Berita Acara Pemeriksaan
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
