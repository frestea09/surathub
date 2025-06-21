
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
       <Card className="w-full max-w-lg text-center">
        <CardHeader>
           <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold">Terjadi Kesalahan</CardTitle>
          <CardDescription className="text-lg">
            Maaf, terjadi kesalahan yang tidak terduga pada aplikasi.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Anda dapat mencoba memuat ulang halaman atau kembali ke dashboard.
            </p>
             <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                <p className="text-sm font-mono text-left text-destructive break-all">
                  {error.message || "An unknown error occurred."}
                </p>
             </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button onClick={() => reset()} className="w-full">
            Coba Lagi
          </Button>
           <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard">Kembali ke Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
