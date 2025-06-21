
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppLayout } from "@/components/templates/AppLayout";

export default function ProfilPage() {
  return (
    <AppLayout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Profil Pengguna</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informasi Akun</CardTitle>
          <CardDescription>
            Kelola informasi akun dan preferensi Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue="admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="admin@surathub.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Jabatan</Label>
            <Input id="role" defaultValue="Direktur" readOnly />
          </div>
            <Button>Simpan Perubahan</Button>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
