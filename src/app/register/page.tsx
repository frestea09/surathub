
"use client";

import { UserForm } from "@/components/organisms/UserForm";
import { AppLayout } from "@/components/templates/AppLayout";

export default function RegisterPage() {
  return (
    <AppLayout>
      <div className="flex flex-1 items-center justify-center p-4">
        <UserForm />
      </div>
    </AppLayout>
  );
}
