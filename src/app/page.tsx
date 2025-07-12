
"use client";

import React, { useEffect } from 'react';
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
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/hooks/use-toast';
import { ROLES } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const { login, activeUser } = useUserStore();
  const { toast } = useToast();
  const [nip, setNip] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('');

  useEffect(() => {
    // Redirect if user is already logged in
    if (activeUser) {
      if (activeUser.jabatan === 'Vendor') {
        router.replace('/vendor/dashboard');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [activeUser, router]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nip || !password) {
        toast({
            variant: "destructive",
            title: "Login Gagal",
            description: "NIP dan Password tidak boleh kosong."
        });
        return;
    }

    try {
        const user = await login(nip, password);
        // We will not validate role for this prototype to allow easy login
        // But in a real app, you would check if user.jabatan === role
        toast({
            title: "Login Berhasil",
            description: `Selamat datang, ${user.nama}!`
        });

        if (user.jabatan === 'Vendor') {
          router.push('/vendor/dashboard');
        } else {
          router.push('/dashboard');
        }

    } catch(error: any) {
        toast({
            variant: "destructive",
            title: "Login Gagal",
            description: error.message || "NIP atau password salah."
        });
    }
  };
  
  // Render nothing or a loading spinner while redirecting
  if (activeUser) {
    return null; 
  }

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
              <Input id="username" placeholder="Masukkan NIP atau username" required value={nip} onChange={(e) => setNip(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Masukkan password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Jabatan / Role</Label>
              <Select required onValueChange={setRole} value={role}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Pilih jabatan Anda" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLES).filter(([group]) => group !== "Pihak Eksternal").map(([group, groupRoles]) => (
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
          <CardFooter className="flex-col gap-4">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Login sebagai vendor?{' '}
              <Link href="/vendor/login" className="underline underline-offset-4 hover:text-primary">
                Klik di sini
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
