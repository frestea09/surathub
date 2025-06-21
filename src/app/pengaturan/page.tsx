
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AppLayout } from "@/components/templates/AppLayout";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function PengaturanPage() {
  return (
    <AppLayout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Pengaturan</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Notifikasi</CardTitle>
            <CardDescription>
              Kelola preferensi notifikasi Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="email-notifications" defaultChecked />
              <Label htmlFor="email-notifications">Notifikasi Email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="push-notifications" />
              <Label htmlFor="push-notifications">Notifikasi Push</Label>
            </div>
            <Button>Simpan Pengaturan</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sumber Data</CardTitle>
            <CardDescription>
              Pilih sumber data yang digunakan oleh aplikasi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup defaultValue="dummy">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dummy" id="dummy" />
                <Label htmlFor="dummy">Data Dummy (Lokal)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="prisma" id="prisma" disabled />
                <Label htmlFor="prisma">Database Prisma (MySQL)</Label>
              </div>
            </RadioGroup>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Mode Demonstrasi</AlertTitle>
              <AlertDescription>
                Peralihan ke database Prisma memerlukan langkah teknis di sisi server. Opsi ini hanya untuk tujuan presentasi.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
