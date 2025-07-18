
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ROLES } from "@/lib/constants"

interface RoleComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function RoleCombobox({ value, onValueChange, placeholder = "Pilih Jabatan..." }: RoleComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const allRoles = React.useMemo(() => {
    return Object.values(ROLES).flat();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {value
            ? allRoles.find((role) => role === value)
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Cari jabatan..." />
          <CommandList>
            <CommandEmpty>Jabatan tidak ditemukan.</CommandEmpty>
            {Object.entries(ROLES).filter(([group]) => group !== "Pihak Eksternal").map(([group, rolesInGroup]) => (
              <CommandGroup key={group} heading={group}>
                {rolesInGroup.map((role) => (
                  <CommandItem
                    key={role}
                    value={role}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? "" : currentValue)
                      setOpen(false)
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
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
