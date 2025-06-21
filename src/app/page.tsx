
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from 'next/navigation';

const roles = {
  "Pimpinan & Pengawas": [
    "Direktur",
    "Dewan Pengawas",
    "Satuan Pengawasan Intern (SPI)",
  ],
  "Wakil Direktur Umum dan Sumber Daya": [
    "Wakil Direktur Umum dan Sumber Daya",
    "Kepala Bagian Umum dan Kepegawaian",
    "Tim Kerja Bidang Umum & Kepegawaian",
    "Kepala Bagian Keuangan",
    "Tim Kerja Bidang Pendapatan",
    "Tim Kerja Bidang Pengeluaran",
    "Kepala Bagian Perencanaan dan Kehumasan",
    "Tim Kerja Bidang Perencanaan",
    "Tim Kerja Bidang Kehumasan",
  ],
  "Wakil Direktur Pelayanan": [
    "Wakil Direktur Pelayanan",
    "Kepala Bidang Pelayanan Medik",
    "Tim Kerja Bidang Pelayanan Medik",
    "Kepala Bidang Pelayanan Keperawatan",
    "Tim Kerja Bidang Pelayanan Keperawatan",
    "Kepala Bidang Mutu Pelayanan",
    "Tim Kerja Bidang Mutu Pelayanan",
    "Kepala Bidang Rawat Inap",
    "Tim Kerja Bidang Rawat Inap",
  ],
  "Wakil Direktur Penunjang": [
    "Wakil Direktur Penunjang",
    "Kepala Bidang Penunjang Medik",
    "Tim Kerja Bidang Farmasi",
    "Tim Kerja Bidang Radiologi",
    "Tim Kerja Bidang Laboratorium",
    "Tim Kerja Bidang Rehabilitasi Medik",
    "Tim Kerja Bidang Gizi",
    "Kepala Bidang Penunjang Non-Medik",
    "Tim Kerja Bidang Sarana & Prasarana",
    "Tim Kerja Bidang Keamanan",
    "Tim Kerja Bidang Kebersihan dan Pengelolaan Sampah",
  ],
  "Komite & SMF": [
    "Komite Rekrutmen Medis",
    "Komite Etik dan Hukum",
    "Komite Pengendalian Infeksi",
    "Komite Mutu dan Keselamatan Pasien",
    "SMF (Sarana Medis Fungsional)",
  ],
};

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-primary"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
            </div>
          <CardTitle className="text-2xl">Login SuratHub</CardTitle>
          <CardDescription>
            Masuk untuk mengakses sistem manajemen surat RSUD Oto Iskandar Di Nata
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">NIP / Username</Label>
              <Input id="username" placeholder="Masukkan NIP atau username" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Masukkan password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Jabatan / Role</Label>
              <Select required>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Pilih jabatan Anda" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roles).map(([group, groupRoles]) => (
                    <SelectGroup key={group}>
                      <SelectLabel>{group}</SelectLabel>
                      {groupRoles.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
