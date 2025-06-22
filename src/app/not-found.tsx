
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <SearchX className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold">404 - Halaman Tidak Ditemukan</CardTitle>
          <CardDescription className="text-lg">
            Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Pastikan Anda telah memasukkan alamat URL yang benar.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/dashboard">Kembali ke Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
