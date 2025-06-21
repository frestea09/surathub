
"use client";

import { useRouter } from "next/navigation";
import { Mail, Share2, Archive, XCircle } from "lucide-react";

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
    icon: XCircle,
    title: "Surat Ditolak",
    description: "Surat 007/MEMO/RSUD-O/VIII/2024 telah ditolak.",
    time: "30 menit lalu",
    link: "/surat-keluar",
  },
  {
    icon: Mail,
    title: "Surat Baru Diterima",
    description: "Surat dari Kemenkes perihal Undangan Rapat.",
    time: "5 menit lalu",
    link: "/surat-masuk",
  },
  {
    icon: Share2,
    title: "Disposisi Berhasil",
    description: "Surat 005/B/FIN/2024 telah didisposisikan ke Direktur.",
    time: "1 jam lalu",
    link: "/surat-masuk",
  },
  {
    icon: Archive,
    title: "Surat Telah Diarsipkan",
    description: "Surat BAST-2024-04-098 telah diarsipkan.",
    time: "Kemarin",
    link: "/surat-keluar",
  },
  {
    icon: Mail,
    title: "Surat Baru Diterima",
    description: "Invoice dari CV. ATK Bersama.",
    time: "Kemarin",
    link: "/surat-masuk",
  },
  {
    icon: Share2,
    title: "Disposisi Dilihat",
    description: "Direktur telah melihat disposisi Anda.",
    time: "2 hari lalu",
    link: "/surat-masuk",
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
          <div className="space-y-4">
            {allNotifications.map((notif, index) => (
              <div key={index} className="flex items-start gap-4 p-3 -mx-3 rounded-lg hover:bg-muted cursor-pointer" onClick={() => router.push(notif.link)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <notif.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{notif.title}</p>
                  <p className="text-sm text-muted-foreground">{notif.description}</p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{notif.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
