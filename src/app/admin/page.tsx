
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

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
import { AppLayout } from "@/components/templates/AppLayout";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";


const usersData = [
  {
    nip: "198408272008011005",
    nama: "Saep Trian Prasetia.S.Si.Apt",
    jabatan: "Pejabat Pembuat Komitmen",
    status: "Aktif",
  },
  {
    nip: "196711022002121001",
    nama: "dr. H. Yani Sumpena Muchtar, SH, MH.Kes",
    jabatan: "Kuasa Pengguna Anggaran",
    status: "Aktif",
  },
  {
    nip: "197711042005042013",
    nama: "Deti Hapitri, A.Md.Gz",
    jabatan: "Pejabat Pengadaan Barang Jasa",
    status: "Aktif",
  },
  {
    nip: "123456789012345678",
    nama: "Admin",
    jabatan: "Direktur",
    status: "Aktif",
  },
  {
    nip: "098765432109876543",
    nama: "Jane Doe",
    jabatan: "Kepala Bagian Keuangan",
    status: "Non-Aktif",
  },
];

type User = typeof usersData[0];

const columns: ColumnDef<User>[] = [
    {
        accessorKey: "nip",
        header: "NIP/Username",
    },
    {
        accessorKey: "nama",
        header: "Nama",
    },
    {
        accessorKey: "jabatan",
        header: "Jabatan",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return <Badge variant={status === 'Aktif' ? 'default' : 'destructive'}>{status}</Badge>;
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Ubah
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
];

export default function AdminPage() {
  const router = useRouter();
  
  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Manajemen Pengguna</h1>
        <Button onClick={() => router.push('/register')}>Tambah Pengguna</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>
            Kelola pengguna yang terdaftar di sistem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={usersData}
            searchKey="nama"
            searchPlaceholder="Cari berdasarkan nama..."
          />
        </CardContent>
      </Card>
    </AppLayout>
  );
}
