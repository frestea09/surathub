
"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AppLayout } from "@/components/templates/AppLayout";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";


const initialUsersData = [
  {
    id: "dir-01",
    nip: "196711022002121001",
    nama: "dr. H. Yani Sumpena Muchtar, SH, MH.Kes",
    jabatan: "Direktur",
    status: "Aktif",
    password: "password-direktur",
  },
  {
    id: "ppk-01",
    nip: "198408272008011005",
    nama: "Saep Trian Prasetia.S.Si.Apt",
    jabatan: "Pejabat Pembuat Komitmen",
    status: "Aktif",
    password: "password-ppk",
  },
  {
    id: "ppbj-01",
    nip: "197711042005042013",
    nama: "Deti Hapitri, A.Md.Gz",
    jabatan: "Pejabat Pengadaan Barang Jasa",
    status: "Aktif",
    password: "password-ppbj",
  },
  {
    id: "admin-01",
    nip: "admin",
    nama: "Admin Utama",
    jabatan: "Administrator Sistem",
    status: "Aktif",
    password: "password-admin",
  },
  {
    id: "keu-01",
    nip: "198001012005012002",
    nama: "Jane Doe",
    jabatan: "Kepala Bagian Keuangan",
    status: "Aktif",
    password: "password-keuangan",
  },
  {
    id: "umum-01",
    nip: "198203152006041001",
    nama: "Budi Darmawan",
    jabatan: "Kepala Bagian Umum",
    status: "Non-Aktif",
    password: "password-umum",
  },
   {
    id: "yanmed-01",
    nip: "197505202003122001",
    nama: "Dr. Anisa Fitriani, Sp.A",
    jabatan: "Kepala Bidang Pelayanan Medik",
    status: "Aktif",
    password: "password-yanmed",
  },
];

type User = typeof initialUsersData[0];
const USERS_STORAGE_KEY = 'surathub_users';

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [userList, setUserList] = useState<User[] | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        setUserList(JSON.parse(storedUsers));
      } else {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsersData));
        setUserList(initialUsersData);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      setUserList(initialUsersData);
    }
  }, []);

  const handleEdit = (user: User) => {
    router.push(`/admin/edit/${user.id}`); 
  };
  
  const handleDeleteRequest = (user: User) => {
    setUserToDelete(user);
  };
  
  const handleDeleteConfirm = () => {
    if (!userToDelete || userList === null) return;
    const updatedList = userList.filter(u => u.id !== userToDelete.id);
    setUserList(updatedList);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedList));

    toast({
      title: "Pengguna Dihapus",
      description: `Pengguna dengan nama ${userToDelete.nama} telah berhasil dihapus.`,
    });
    setUserToDelete(null);
  };
  
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
        accessorKey: "password",
        header: "Password",
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
            const user = row.original;
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
                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Ubah
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteRequest(user)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              )
          }
      }
  ];

  if (userList === null) {
    return (
      <AppLayout>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">Manajemen Pengguna</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pengguna</CardTitle>
            <CardDescription>
              Kelola pengguna yang terdaftar di sistem. Tambah, ubah, atau hapus akun pengguna.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex items-center gap-2 py-4">
                <Skeleton className="h-10 max-w-xs w-full" />
                <Skeleton className="h-10 max-w-xs w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

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
            Kelola pengguna yang terdaftar di sistem. Tambah, ubah, atau hapus akun pengguna.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={userList}
          />
        </CardContent>
      </Card>
      
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Pengguna</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pengguna <span className="font-bold">{userToDelete?.nama}</span>? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
