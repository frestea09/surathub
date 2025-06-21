
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/dashboard-layout";

export default function ProfilPage() {
  const t = useTranslations('ProfilePage');

  return (
    <DashboardLayout active_nav="profil">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">{t('title')}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('cardTitle')}</CardTitle>
          <CardDescription>{t('cardDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">{t('usernameLabel')}</Label>
            <Input id="username" defaultValue="admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('emailLabel')}</Label>
            <Input id="email" type="email" defaultValue="admin@surathub.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">{t('roleLabel')}</Label>
            <Input id="role" defaultValue="Direktur" readOnly />
          </div>
           <Button>{t('saveButton')}</Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
