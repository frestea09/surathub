
"use client";

import { UserForm } from "@/components/organisms/UserForm";
import { AppLayout } from "@/components/templates/AppLayout";

export default function RegisterPage() {
  return (
    <AppLayout>
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 -mt-16">
        <UserForm />
      </div>
    </AppLayout>
  );
}
