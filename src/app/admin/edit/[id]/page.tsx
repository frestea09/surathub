
"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { UserForm } from '@/components/organisms/UserForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AppLayout } from '@/components/templates/AppLayout';

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id as string;
  
  const { users, fetchUsers, isLoading: isStoreLoading } = useUserStore(state => ({
    users: state.users,
    fetchUsers: state.fetchUsers,
    isLoading: state.isLoading,
  }));
  
  const user = users.find(u => u.id === userId);

  useEffect(() => {
    // Fetch users if the store is empty
    if (users.length === 0) {
      fetchUsers();
    }
  }, [fetchUsers, users.length]);

  const isLoading = isStoreLoading || (users.length > 0 && !user);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 -mt-16">
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
      </AppLayout>
    );
  }

  if (!user) {
      return (
        <AppLayout>
          <div className="text-destructive text-center p-4">Pengguna tidak ditemukan.</div>
        </AppLayout>
      );
  }

  return (
    <AppLayout>
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 -mt-16">
        <UserForm user={user} />
      </div>
    </AppLayout>
  );
}
