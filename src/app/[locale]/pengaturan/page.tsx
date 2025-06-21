
"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/dashboard-layout";

export default function PengaturanPage() {
  const t = useTranslations('SettingsPage');

  return (
    <DashboardLayout active_nav="pengaturan">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t('title')}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('cardTitle')}</CardTitle>
          <CardDescription>{t('cardDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="email-notifications" defaultChecked />
            <Label htmlFor="email-notifications">{t('emailLabel')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="push-notifications" />
            <Label htmlFor="push-notifications">{t('pushLabel')}</Label>
          </div>
          <Button>{t('saveButton')}</Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
