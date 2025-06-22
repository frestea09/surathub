
"use client";

import React, { useState, useMemo } from 'react';
import { ColumnDef, SortingState, ColumnFiltersState, useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from 'swr';
import { useToast } from "@/hooks/use-toast";
import { User, deleteUser } from '@/data/users';

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  COLUMN_NIP,
  COLUMN_NAMA,
  COLUMN_JABATAN,
  COLUMN_PASSWORD,
  COLUMN_STATUS,
  COLUMN_ACTIONS_LABEL,
  ACTION_EDIT_LABEL,
  ACTION_DELETE_LABEL,
  DELETE_CONFIRM_TITLE,
  DELETE_CONFIRM_DESCRIPTION_PREFIX,
  DELETE_CONFIRM_DESCRIPTION_SUFFIX,
  CANCEL_BUTTON_LABEL,
  CONFIRM_DELETE_BUTTON_LABEL
} from '@/lib/constants';

interface UserTableProps {
  data: User[];
}

export default function UserTable({ data }: UserTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const handleDeleteRequest = (user: User) => {
    setUserToDelete(user);
  };
  
  const handleEdit = (user: User) => {
    router.push(`/admin/edit/${user.id}`);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      mutate('/api/users');
      toast({
        title: "Pengguna Dihapus",
        description: `Pengguna dengan nama ${userToDelete.nama} telah berhasil dihapus.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Menghapus",
        description: error.message,
      });
    } finally {
      setUserToDelete(null);
    }
  };

  const columns: ColumnDef<User>[] = useMemo(() => [
    { accessorKey: "nip", header: COLUMN_NIP },
    { accessorKey: "nama", header: COLUMN_NAMA },
    { accessorKey: "jabatan", header: COLUMN_JABATAN },
    { accessorKey: "password", header: COLUMN_PASSWORD },
    {
      accessorKey: "status",
      header: COLUMN_STATUS,
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
              <DropdownMenuLabel>{COLUMN_ACTIONS_LABEL}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEdit(user)}>
                <Pencil className="mr-2 h-4 w-4" />
                {ACTION_EDIT_LABEL}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteRequest(user)}>
                <Trash2 className="mr-2 h-4 w-4" />
                {ACTION_DELETE_LABEL}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ], [router]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  
  React.useEffect(() => {
    table.setPageSize(5);
  }, [table]);

  const statuses = useMemo(() => {
    const statusSet = new Set<string>();
    data.forEach(row => statusSet.add(row.status));
    return Array.from(statusSet).sort();
  }, [data]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 py-4">
        <Input
          placeholder="Filter Nama..."
          value={(table.getColumn("nama")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("nama")?.setFilterValue(event.target.value)}
          className="max-w-xs"
        />
        <Input
          placeholder="Filter NIP..."
          value={(table.getColumn("nip")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("nip")?.setFilterValue(event.target.value)}
          className="max-w-xs"
        />
        <Select
          value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) => table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Tidak ada hasil.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
         <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} dari {table.getCoreRowModel().rows.length} baris ditampilkan.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Selanjutnya
        </Button>
      </div>

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{DELETE_CONFIRM_TITLE}</AlertDialogTitle>
            <AlertDialogDescription>
              {DELETE_CONFIRM_DESCRIPTION_PREFIX} <span className="font-bold">{userToDelete?.nama}</span>{DELETE_CONFIRM_DESCRIPTION_SUFFIX}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>{CANCEL_BUTTON_LABEL}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>
              {CONFIRM_DELETE_BUTTON_LABEL}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
