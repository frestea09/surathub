
"use client";

import { useRouter } from "next/navigation";
import { Mail, Share2, Archive, XCircle, FilePenLine, CheckCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/templates/AppLayout";

const allNotifications = [
   {
    icon: Mail,
    title: "Surat Perintah Baru",
    description: "PPK mengirimkan 'Surat Perintah' No. 000.3/PPK-RSUD OTISTA/IV/2025.",
    time: "5 menit lalu",
    link: "/surat-masuk",
    isRead: false,
  },
  {
    icon: FilePenLine,
    title: "Draf Perlu Diselesaikan",
    description: "Draf 'Berita Acara Serah Terima' No. BASTB/06/FAR/IV/2025 belum diselesaikan.",
    time: "30 menit lalu",
    link: "/surat-keluar?tab=draft",
    isRead: false,
  },
  {
    icon: CheckCircle,
    title: "Proses Pengadaan Selesai",
    description: "Seluruh alur untuk pengadaan 'Barang Farmasi' telah selesai dan diarsipkan.",
    time: "1 jam lalu",
    link: "/surat-keluar",
    isRead: true,
  },
  {
    icon: XCircle,
    title: "Surat Ditolak Direktur",
    description: "Surat keluar '007/MEMO/RSUD-O/VIII/2024' telah ditolak.",
    time: "2 jam lalu",
    link: "/surat-keluar?tab=ditolak",
    isRead: false,
  },
  {
    icon: Share2,
    title: "Disposisi Baru",
    description: "Surat masuk 'INV/2024/07/998' telah didisposisikan kepada Anda.",
    time: "Kemarin",
    link: "/surat-masuk",
    isRead: true,
  },
  {
    icon: Archive,
    title: "Surat Telah Diarsipkan",
    description: "Surat masuk 'INV/2024/07/998' telah diarsipkan setelah selesai diproses.",
    time: "2 hari lalu",
    link: "/surat-masuk",
    isRead: true,
  },
];

export default function NotifikasiPage() {
  const router = useRouter();

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Notifikasi</h1>
        <Button variant="outline" size="sm">Tandai semua terbaca</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Semua Notifikasi</CardTitle>
          <CardDescription>
            Berikut adalah daftar semua notifikasi Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {allNotifications.map((notif, index) => (
              <div 
                key={index} 
                className={`flex items-start gap-4 p-3 -mx-3 rounded-lg hover:bg-muted cursor-pointer transition-colors ${!notif.isRead ? 'bg-primary/5' : ''}`} 
                onClick={() => router.push(notif.link)}
              >
                <div className={`relative flex h-10 w-10 items-center justify-center rounded-full ${notif.isRead ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                  <notif.icon className="h-5 w-5" />
                   {!notif.isRead && <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${!notif.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>{notif.title}</p>
                  <p className="text-sm text-muted-foreground">{notif.description}</p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap pt-1">{notif.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}

    