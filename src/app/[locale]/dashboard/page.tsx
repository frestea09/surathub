
"use client";

import { Bell, CheckCircle, FileClock, FileStack, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardChart } from "@/components/dashboard-chart";
import DashboardLayout from "@/components/dashboard-layout";

const suratData = [
  {
    nomor: "SP-2024-05-001",
    judul: "Surat Perintah Pengadaan ATK",
    jenis: "SPP",
    status: "Diproses",
    tanggal: "2024-05-20",
  },
  {
    nomor: "BA-2024-05-015",
    judul: "Berita Acara Pemeriksaan Barang",
    jenis: "BA",
    status: "Disetujui",
    tanggal: "2024-05-18",
  },
  {
    nomor: "ND-2024-05-032",
    judul: "Nota Dinas Rapat Koordinasi",
    jenis: "Nota Dinas",
    status: "Terkirim",
    tanggal: "2024-05-17",
  },
  {
    nomor: "BAST-2024-04-098",
    judul: "BAST Pengadaan Komputer",
    jenis: "BAST",
    status: "Selesai",
    tanggal: "2024-04-30",
  },
  {
    nomor: "SP-2024-05-002",
    judul: "Surat Perintah Perbaikan AC",
    jenis: "SPP",
    status: "Ditolak",
    tanggal: "2024-05-21",
  },
  {
    nomor: "ND-2024-05-033",
    judul: "Nota Dinas Cuti Tahunan",
    jenis: "Nota Dinas",
    status: "Terkirim",
    tanggal: "2024-05-22",
  },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Disetujui: "default",
  Selesai: "default",
  Diproses: "secondary",
  Terkirim: "outline",
  Ditolak: "destructive",
};

export default function DashboardPage() {
  const t = useTranslations('DashboardPage');
  
  const statCards = [
    {
      title: t('processedLetters'),
      value: "78",
      description: t('processedLettersDesc'),
      icon: FileClock,
    },
    {
      title: t('dueLetters'),
      value: "12",
      description: t('dueLettersDesc'),
      icon: Bell,
    },
    {
      title: t('completedThisMonth'),
      value: "129",
      description: t('completedThisMonthDesc'),
      icon: CheckCircle,
    },
    {
      title: t('totalArchive'),
      value: "2,350",
      description: t('totalArchiveDesc'),
      icon: FileStack,
    },
  ];

  return (
    <DashboardLayout active_nav="dashboard">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t('title')}</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <DashboardChart />
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>{t('recentLettersTitle')}</CardTitle>
              <CardDescription>{t('recentLettersDescription')}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('tableHeaderNumber')}</TableHead>
                  <TableHead>{t('tableHeaderTitle')}</TableHead>
                  <TableHead className="text-center">{t('tableHeaderType')}</TableHead>
                  <TableHead className="text-center">{t('tableHeaderStatus')}</TableHead>
                  <TableHead className="text-right">{t('tableHeaderDate')}</TableHead>
                  <TableHead>
                    <span className="sr-only">{t('tableHeaderActions')}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suratData.map((surat) => (
                  <TableRow key={surat.nomor}>
                    <TableCell className="font-medium">
                      {surat.nomor}
                    </TableCell>
                    <TableCell>{surat.judul}</TableCell>
                    <TableCell className="text-center">{surat.jenis}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={statusVariant[surat.status]}>
                        {surat.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{surat.tanggal}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t('tableHeaderActions')}</DropdownMenuLabel>
                          <DropdownMenuItem>{t('viewDetails')}</DropdownMenuItem>
                          <DropdownMenuItem>{t('track')}</DropdownMenuItem>
                          <DropdownMenuItem>{t('downloadPdf')}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
