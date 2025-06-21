"use client"

import * as React from "react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"

// Data hari libur nasional Indonesia untuk tahun 2025 (contoh)
const nationalHolidays2025 = [
  { month: 0, day: 1, name: "Tahun Baru Masehi" },
  { month: 0, day: 29, name: "Tahun Baru Imlek 2576" },
  { month: 2, day: 1, name: "Isra Mikraj Nabi Muhammad SAW" },
  { month: 2, day: 29, name: "Hari Suci Nyepi Tahun Baru Saka 1947" },
  { month: 2, day: 30, name: "Cuti Bersama Nyepi" },
  { month: 2, day: 31, name: "Idul Fitri 1446 H" },
  { month: 3, day: 1, name: "Idul Fitri 1446 H" },
  { month: 3, day: 18, name: "Wafat Isa Al Masih" },
  { month: 4, day: 1, name: "Hari Buruh Internasional" },
  { month: 4, day: 12, name: "Hari Raya Waisak 2569 BE" },
  { month: 4, day: 29, name: "Kenaikan Isa Al Masih" },
  { month: 5, day: 1, name: "Hari Lahir Pancasila" },
  { month: 6, day: 7, name: "Idul Adha 1446 H" },
  { month: 6, day: 27, name: "Tahun Baru Islam 1447 H" },
  { month: 7, day: 17, name: "Hari Kemerdekaan Republik Indonesia" },
  { month: 9, day: 5, name: "Maulid Nabi Muhammad SAW" },
  { month: 11, day: 25, name: "Hari Raya Natal" },
  { month: 11, day: 26, name: "Cuti Bersama Natal" },
];

interface DatePickerWithWarningProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  className?: string;
}

export function DatePickerWithWarning({ date, onDateChange, className }: DatePickerWithWarningProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    setIsOpen(false);
    
    if (!selectedDate) return;

    // Set time to 0 to ignore timezone differences in comparison
    const checkDate = new Date(selectedDate);
    checkDate.setHours(0, 0, 0, 0);

    const selectedMonth = checkDate.getMonth();
    const selectedDay = checkDate.getDate();

    const holiday = nationalHolidays2025.find(h => h.month === selectedMonth && h.day === selectedDay);

    if (holiday) {
      toast({
        title: "Peringatan Hari Libur",
        description: `Tanggal yang Anda pilih adalah ${holiday.name}.`,
      });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
