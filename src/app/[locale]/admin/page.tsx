
"use client";

import { useTranslations } from "next-intl";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/components/dashboard-layout";
import { useRouter } from "@/navigation";

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

export default function AdminPage() {
  const router = useRouter();
  const t = useTranslations('AdminPage');
  
  return (
    <DashboardLayout active_nav="admin">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">{t('title')}</h1>
        <Button onClick={() => router.push('/register')}>{t('addUser')}</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('userList')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('tableHeaderNip')}</TableHead>
                <TableHead>{t('tableHeaderName')}</TableHead>
                <TableHead>{t('tableHeaderPosition')}</TableHead>
                <TableHead className="text-center">{t('tableHeaderStatus')}</TableHead>
                <TableHead>
                  <span className="sr-only">{t('tableHeaderActions')}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersData.map((user) => (
                <TableRow key={user.nip}>
                  <TableCell className="font-medium">{user.nip}</TableCell>
                  <TableCell>{user.nama}</TableCell>
                  <TableCell>{user.jabatan}</TableCell>
                  <TableCell className="text-center">
                      <Badge variant={user.status === 'Aktif' ? 'default' : 'destructive'}>
                        {user.status === 'Aktif' ? t('statusActive') : t('statusInactive')}
                      </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('tableHeaderActions')}</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            {t('actionEdit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('actionDelete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
