
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  COLUMN_NIP,
  COLUMN_NAMA,
  COLUMN_JABATAN,
  COLUMN_PASSWORD,
  COLUMN_STATUS,
  COLUMN_ACTIONS_LABEL,
  ACTION_EDIT_LABEL,
  ACTION_DELETE_LABEL,
} from '@/lib/constants';
import type { User } from '@/types';

export const getUserTableColumns = (
    onEdit: (user: User) => void,
    onDelete: (user: User) => void
): ColumnDef<User>[] => [
    { accessorKey: "nip", header: COLUMN_NIP },
    { accessorKey: "nama", header: COLUMN_NAMA },
    { accessorKey: "jabatan", header: COLUMN_JABATAN },
    { accessorKey: "password", header: COLUMN_PASSWORD, cell: () => "••••••••" },
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
      header: () => <div className="text-right">{COLUMN_ACTIONS_LABEL}</div>,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{COLUMN_ACTIONS_LABEL}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(user)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  {ACTION_EDIT_LABEL}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => onDelete(user)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  {ACTION_DELETE_LABEL}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }
    }
];
