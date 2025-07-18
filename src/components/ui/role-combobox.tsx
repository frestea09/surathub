
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

  // Flatten the roles into a structure that the combobox can use easily.
  const roleGroups = React.useMemo(() => {
    let roleEntries = Object.entries(roles);
    if (filterExternal) {
      roleEntries = roleEntries.filter(([group]) => group !== "Pihak Eksternal");
    }
    return roleEntries;
  }, [roles, filterExternal]);

  const allRolesFlat = React.useMemo(() => {
    return roleGroups.flatMap(([, groupRoles]) => groupRoles);
  }, [roleGroups]);

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
              ? allRolesFlat.find((role) => role.toLowerCase() === value.toLowerCase())
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
            {roleGroups.map(([group, groupRoles]) => (
              <CommandGroup key={group} heading={group}>
                {groupRoles.map((role) => (
                  <CommandItem
                    key={role}
                    value={role}
                    onSelect={(currentValue) => {
                      // This logic is now correct. It sets the value if it's different,
                      // or clears it if the same item is selected again.
                      onValueChange(currentValue.toLowerCase() === value.toLowerCase() ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.toLowerCase() === role.toLowerCase() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {role}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
