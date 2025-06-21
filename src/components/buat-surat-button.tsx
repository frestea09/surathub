"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "@/navigation"
import { PlusCircle } from "lucide-react"
import { useTranslations } from "next-intl"

export function BuatSuratButton() {
    const router = useRouter();
    const tLayout = useTranslations('DashboardLayout');
    const tButton = useTranslations('BuatSuratButton');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {tLayout('createLetter')}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{tButton('label')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/buat-surat')}>
                    {tButton('perintah')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/buat-surat-pesanan')}>
                    {tButton('pesananInternal')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/buat-surat-pesanan-final')}>
                    {tButton('pesananVendor')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/buat-berita-acara')}>
                    {tButton('pemeriksaan')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/buat-bastb')}>
                    {tButton('serahTerima')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
