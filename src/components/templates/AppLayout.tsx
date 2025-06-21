
"use client";

import React from "react";
import { Sidebar } from "@/components/organisms/Sidebar";
import { Header } from "@/components/organisms/Header";

const MOCK_NOTIFICATIONS = [
  {
    title: "Surat Ditolak",
    description: "Surat 007/MEMO/RSUD-O/VIII/2024 telah ditolak.",
    time: "30 menit lalu",
    link: "/surat-keluar",
  },
  {
    title: "Surat Baru Diterima",
    description: "Surat dari Kemenkes perihal Undangan Rapat.",
    time: "5 menit lalu",
    link: "/surat-masuk"
  },
  {
    title: "Disposisi Berhasil",
    description: "Surat 005/B/FIN/2024 telah didisposisikan.",
    time: "1 jam lalu",
    link: "/surat-masuk"
  },
  {
    title: "Surat Telah Diarsipkan",
    description: "Surat BAST-2024-04-098 telah diarsipkan.",
    time: "Kemarin",
    link: "/surat-keluar"
  },
];

const MOCK_USER = {
  name: "Admin",
  avatar: "https://placehold.co/32x32.png",
  initials: "AD",
};

export function AppLayout({ children }: { children: React.ReactNode }) {
  // In a real app, this data would come from a context, hook or props
  const [notifications] = React.useState(MOCK_NOTIFICATIONS);
  const [user] = React.useState(MOCK_USER);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header notifications={notifications} user={user} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
