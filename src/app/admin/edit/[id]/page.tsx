
"use client";

import { useParams } from 'next/navigation';
import { useUser } from '@/hooks/useUsers';
import { UserForm } from '@/components/organisms/UserForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id as string;
  const { user, isLoading, error } = useUser(userId);

  if (isLoading) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md">
            <CardHeader>
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="h-4 w-64 mx-auto mt-2" />
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
            </Card>
      </div>
    );
  }

  if (error) {
      return <div className="text-destructive text-center p-4">Gagal memuat data pengguna.</div>
  }

  return <UserForm user={user} />;
}
