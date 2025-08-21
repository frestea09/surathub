
"use client";

import React, { useState, useMemo } from 'react';
import { ColumnDef, SortingState, ColumnFiltersState, useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, flexRender } from "@tanstack/react-table";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from '@/store/userStore';
import type { User } from '@/types';
import { useRouter } from "next/navigation";

import { getUserTableColumns } from './user-table-columns';
import { ActionConfirmationDialog } from './ActionConfirmationDialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';

interface UserTableProps {
  data: User[];
}

export default function UserTable({ data }: UserTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const deleteUser = useUserStore(state => state.deleteUser);
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
  
  const columns: ColumnDef<User>[] = useMemo(() => getUserTableColumns(handleEdit, handleDeleteRequest), [handleEdit, handleDeleteRequest]);

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

       <ActionConfirmationDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus Pengguna"
        description={`Apakah Anda yakin ingin menghapus pengguna "${userToDelete?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmButtonText="Ya, Hapus"
        variant="destructive"
      />
    </>
  );
}
