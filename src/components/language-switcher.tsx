'use client';

import { useTransition } from 'react';
import { usePathname, useRouter } from '@/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('DashboardLayout');
  const [isPending, startTransition] = useTransition();

  const onSelectChange = (nextLocale: string) => {
    startTransition(() => {
        router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select defaultValue={locale} onValueChange={onSelectChange} disabled={isPending}>
        <SelectTrigger className="w-auto border-0 bg-transparent text-muted-foreground shadow-none focus:ring-0">
          <SelectValue placeholder={t('language')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="id">Bahasa Indonesia</SelectItem>
          <SelectItem value="en">English</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
