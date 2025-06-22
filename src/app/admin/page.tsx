
"use client";

import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";
import { AppLayout } from "@/components/templates/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import UserTable from "@/components/organisms/UserTable";
import { USER_PAGE_HEADING, USER_PAGE_DESCRIPTION, ADD_USER_BUTTON_LABEL } from "@/lib/constants";

export default function AdminPage() {
  const router = useRouter();
  const { users, isLoading, error } = useUsers();

  const handleAddUser = () => {
    router.push('/register');
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 py-4">
            <Skeleton className="h-10 max-w-xs w-full" />
            <Skeleton className="h-10 max-w-xs w-full" />
          </div>
          <Skeleton className="h-64 w-full rounded-md border" />
        </div>
      );
    }

    if (error) {
      return <p className="text-destructive text-center">Gagal memuat data pengguna.</p>;
    }
    
    if (users) {
      return <UserTable data={users} />;
    }
    
    return null;
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">{USER_PAGE_HEADING}</h1>
        <Button onClick={handleAddUser}>{ADD_USER_BUTTON_LABEL}</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{USER_PAGE_HEADING}</CardTitle>
          <CardDescription>{USER_PAGE_DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
