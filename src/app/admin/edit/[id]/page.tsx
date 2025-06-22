
"use client";

import React, { useEffect, useState } from 'react';
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
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';

const roles = {
  "Pimpinan & Pengawas": ["Direktur", "Dewan Pengawas", "Satuan Pengawasan Intern (SPI)"],
  "Wakil Direktur Umum dan Sumber Daya": ["Wakil Direktur Umum dan Sumber Daya", "Kepala Bagian Umum dan Kepegawaian", "Tim Kerja Bidang Umum & Kepegawaian", "Kepala Bagian Keuangan", "Tim Kerja Bidang Pendapatan", "Tim Kerja Bidang Pengeluaran", "Kepala Bagian Perencanaan dan Kehumasan", "Tim Kerja Bidang Perencanaan", "Tim Kerja Bidang Kehumasan"],
  "Wakil Direktur Pelayanan": ["Wakil Direktur Pelayanan", "Kepala Bidang Pelayanan Medik", "Tim Kerja Bidang Pelayanan Medik", "Kepala Bidang Pelayanan Keperawatan", "Tim Kerja Bidang Pelayanan Keperawatan", "Kepala Bidang Mutu Pelayanan", "Tim Kerja Bidang Mutu Pelayanan", "Kepala Bidang Rawat Inap", "Tim Kerja Bidang Rawat Inap"],
  "Wakil Direktur Penunjang": ["Wakil Direktur Penunjang", "Kepala Bidang Penunjang Medik", "Tim Kerja Bidang Farmasi", "Tim Kerja Bidang Radiologi", "Tim Kerja Bidang Laboratorium", "Tim Kerja Bidang Rehabilitasi Medik", "Tim Kerja Bidang Gizi", "Kepala Bidang Penunjang Non-Medik", "Tim Kerja Bidang Sarana & Prasarana", "Tim Kerja Bidang Keamanan", "Tim Kerja Bidang Kebersihan dan Pengelolaan Sampah"],
  "Komite & SMF": ["Komite Rekrutmen Medis", "Komite Etik dan Hukum", "Komite Pengendalian Infeksi", "Komite Mutu dan Keselamatan Pasien", "SMF (Sarana Medis Fungsional)"],
};

const USERS_STORAGE_KEY = 'surathub_users';

type User = {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  status: string;
  password?: string;
};

// Define a type for the form data, omitting 'id'
type UserFormData = Omit<User, 'id'>;

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const userId = params.id as string;
      if (!userId) {
        setLoading(false);
        return;
      }

      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        const users: User[] = JSON.parse(storedUsers);
        const userToEdit = users.find((u) => u.id === userId);
        
        if (userToEdit) {
          setUser(userToEdit);
          setFormData({
            nama: userToEdit.nama,
            nip: userToEdit.nip,
            jabatan: userToEdit.jabatan,
            status: userToEdit.status,
            password: userToEdit.password || '',
          });
        } else {
          toast({ variant: "destructive", title: "Error", description: "Pengguna tidak ditemukan." });
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast({ variant: "destructive", title: "Error", description: "Gagal memuat data pengguna." });
    } finally {
      setLoading(false);
    }
  }, [params.id, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => prev ? { ...prev, [id]: value } : null);
  };

  const handleSelectChange = (name: keyof UserFormData, value: string) => {
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData) return;

    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        let users: User[] = JSON.parse(storedUsers);
        
        const isNipExist = users.some(u => u.nip === formData.nip && u.id !== user.id);
        if (isNipExist) {
          toast({
            variant: "destructive",
            title: "Gagal",
            description: "NIP / Username sudah digunakan oleh pengguna lain.",
          });
          return;
        }
        
        const updatedUsers = users.map((u: User) =>
          u.id === user.id
            ? { ...u, ...formData, password: formData.password || u.password }
            : u
        );
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
        
        toast({
          title: "Berhasil",
          description: "Data pengguna telah berhasil diperbarui.",
        });
        router.push('/admin');
      }
    } catch (error) {
      console.error("Failed to save user data:", error);
      toast({ variant: "destructive", title: "Gagal", description: "Terjadi kesalahan saat menyimpan data." });
    }
  };

  if (loading || !formData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto mt-2" />
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-32" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!user) {
     return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle>Pengguna Tidak Ditemukan</CardTitle>
                <CardDescription>Pengguna yang Anda coba edit tidak ada.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Button asChild>
                    <Link href="/admin">Kembali ke Daftar Pengguna</Link>
                 </Button>
            </CardContent>
        </Card>
      </div>
     );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-primary"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
            </div>
          <CardTitle className="text-2xl">Ubah Data Pengguna</CardTitle>
          <CardDescription>
            Perbarui informasi untuk pengguna: <span className='font-bold'>{user.nama}</span>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSave}>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input id="nama" value={formData.nama} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nip">NIP / Username</Label>
              <Input id="nip" value={formData.nip} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Kosongkan jika tidak ingin mengubah" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jabatan">Jabatan / Role</Label>
              <Select value={formData.jabatan} onValueChange={(value) => handleSelectChange('jabatan', value)} name="jabatan" required>
                <SelectTrigger id="jabatan">
                  <SelectValue placeholder="Pilih jabatan pengguna" />
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
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)} name="status" required>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Pilih status pengguna" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Non-Aktif">Non-Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" className="w-full">
              Simpan Perubahan
            </Button>
             <p className="text-center text-sm text-muted-foreground">
                <Link
                  href="/admin"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Batal dan Kembali
                </Link>
              </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
