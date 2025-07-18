
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { JABATAN_PLACEHOLDER } from "@/lib/constants";

interface RoleComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  roles: Record<string, string[]>;
  filterExternal?: boolean;
}

export function RoleCombobox({
  value,
  onValueChange,
  roles,
  filterExternal = false,
}: RoleComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // Flatten the roles into a single array for searching and finding the label
  const allRolesFlat = React.useMemo(() => {
    let roleEntries = Object.entries(roles);
    if (filterExternal) {
      roleEntries = roleEntries.filter(([group]) => group !== "Pihak Eksternal");
    }
    return roleEntries.flatMap(([, roleList]) => roleList);
  }, [roles, filterExternal]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">
            {value
              ? allRolesFlat.find((role) => role.toLowerCase() === value.toLowerCase()) || JABATAN_PLACEHOLDER
              : JABATAN_PLACEHOLDER}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Cari jabatan..." />
          <CommandList>
            <CommandEmpty>Jabatan tidak ditemukan.</CommandEmpty>
            {Object.entries(roles).map(([group, groupRoles], index) => {
              if (filterExternal && group === "Pihak Eksternal") {
                return null;
              }
              const filteredGroupRoles = groupRoles.filter(role => allRolesFlat.includes(role));
              if (filteredGroupRoles.length === 0) return null;

              return (
                <CommandGroup key={group} heading={group}>
                  {filteredGroupRoles.map((role) => (
                    <CommandItem
                      key={role}
                      value={role}
                      onSelect={(currentValue) => {
                        onValueChange(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === role ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {role}
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
