
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  React.useEffect(() => {
    table.setPageSize(5);
  }, [table]);

  const filterableColumns = React.useMemo(() => {
    const columnMap = new Map(table.getAllLeafColumns().map(col => [col.id, col]));
    return {
      nomor: columnMap.get("nomor") ?? columnMap.get("noSurat"),
      perihal: columnMap.get("perihal") ?? columnMap.get("judul"),
      nama: columnMap.has("nama") ? columnMap.get("nama") : undefined,
      status: columnMap.has("status") ? columnMap.get("status") : undefined,
      pengguna: columnMap.has("pengguna") ? columnMap.get("pengguna") : undefined,
      aksi: columnMap.has("aksi") ? columnMap.get("aksi") : undefined,
    }
  }, [table]);

  const statuses = React.useMemo(() => {
    if (!filterableColumns.status) return [];
    const statusSet = new Set<string>();
    data.forEach((row: any) => {
      if (row.status) {
        statusSet.add(row.status);
      }
    });
    return Array.from(statusSet).sort();
  }, [data, filterableColumns.status]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2 py-4">
        {filterableColumns.nomor && (
            <Input
            placeholder="Filter Nomor..."
            value={(filterableColumns.nomor.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                filterableColumns.nomor?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
            />
        )}
         {filterableColumns.perihal && (
            <Input
            placeholder="Filter Perihal/Judul..."
            value={(filterableColumns.perihal.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                filterableColumns.perihal?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
            />
        )}
         {filterableColumns.nama && (
            <Input
            placeholder="Filter Nama..."
            value={(filterableColumns.nama.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                filterableColumns.nama?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
            />
        )}
        {filterableColumns.pengguna && (
          <Input
            placeholder="Filter Pengguna..."
            value={
              (filterableColumns.pengguna.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              filterableColumns.pengguna?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
          />
        )}
        {filterableColumns.aksi && (
          <Input
            placeholder="Filter Aksi..."
            value={(filterableColumns.aksi.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              filterableColumns.aksi?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
          />
        )}
        {filterableColumns.status && statuses.length > 0 && (
          <Select
            value={(filterableColumns.status.getFilterValue() as string) ?? ""}
            onValueChange={(value) => filterableColumns.status?.setFilterValue(value === "all" ? "" : value)}
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
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
    </div>
  )
}
