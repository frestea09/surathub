
"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { useUserStore, type User } from '@/store/userStore';
import { RoleCombobox } from '@/components/ui/role-combobox';
import {
  ROLES,
  STATUS_OPTIONS,
  ADD_USER_TITLE,
  ADD_USER_DESCRIPTION,
  EDIT_USER_TITLE,
  EDIT_USER_DESCRIPTION_PREFIX,
  NAMA_LENGKAP_LABEL,
  NIP_USERNAME_LABEL,
  PASSWORD_LABEL,
  CONFIRM_PASSWORD_LABEL,
  JABATAN_ROLE_LABEL,
  STATUS_LABEL,
  NAMA_LENGKAP_PLACEHOLDER,
  NIP_USERNAME_PLACEHOLDER,
  PASSWORD_PLACEHOLDER,
  PASSWORD_EDIT_PLACEHOLDER,
  CONFIRM_PASSWORD_PLACEHOLDER,
  STATUS_PLACEHOLDER,
  SAVE_USER_BUTTON_LABEL,
  UPDATE_USER_BUTTON_LABEL,
  BACK_TO_ADMIN_LINK_TEXT,
  CANCEL_AND_BACK_LINK_TEXT,
} from '@/lib/constants';

interface UserFormProps {
  user?: User;
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { addUser, updateUser } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!user;

  const formSchema = z.object({
    nama: z.string().min(1, "Nama lengkap atau nama perusahaan tidak boleh kosong."),
    nip: z.string().min(1, "NIP/Username tidak boleh kosong."),
    jabatan: z.string().min(1, "Jabatan harus dipilih."),
    status: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  }).refine(data => {
    if (!isEditMode) {
      return data.password && data.password.length > 0;
    }
    return true;
  }, {
    message: "Password tidak boleh kosong.",
    path: ["password"],
  }).refine(data => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak cocok.",
    path: ["confirmPassword"],
  });

  type UserFormValues = z.infer<typeof formSchema>;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: '',
      nip: '',
      jabatan: '',
      status: 'Aktif',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (isEditMode && user) {
      form.reset({
        nama: user.nama,
        nip: user.nip,
        jabatan: user.jabatan,
        status: user.status,
        password: '',
        confirmPassword: '',
      });
    }
  }, [user, isEditMode, form]);

  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && user) {
        const updateData: Partial<User> = { ...data };
        if (!data.password) {
            delete updateData.password;
        }
        await updateUser(user.id, updateData);
        toast({ title: "Berhasil", description: "Data pengguna telah berhasil diperbarui." });
      } else {
        await addUser(data);
        toast({ title: "Berhasil", description: "Pengguna baru berhasil ditambahkan." });
      }
      router.push('/admin');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Gagal", description: error.message });
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-primary"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
          </div>
        <CardTitle className="text-2xl">{isEditMode ? EDIT_USER_TITLE : ADD_USER_TITLE}</CardTitle>
        <CardDescription>
          {isEditMode ? `${EDIT_USER_DESCRIPTION_PREFIX} ${user.nama}` : ADD_USER_DESCRIPTION}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="nama" render={({ field }) => (
              <FormItem>
                <FormLabel>{NAMA_LENGKAP_LABEL}</FormLabel>
                <FormControl><Input placeholder={NAMA_LENGKAP_PLACEHOLDER} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="nip" render={({ field }) => (
              <FormItem>
                <FormLabel>{NIP_USERNAME_LABEL}</FormLabel>
                <FormControl><Input placeholder={NIP_USERNAME_PLACEHOLDER} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>{PASSWORD_LABEL}</FormLabel>
                <FormControl><Input type="password" placeholder={isEditMode ? PASSWORD_EDIT_PLACEHOLDER : PASSWORD_PLACEHOLDER} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>{CONFIRM_PASSWORD_LABEL}</FormLabel>
                <FormControl><Input type="password" placeholder={CONFIRM_PASSWORD_PLACEHOLDER} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="jabatan" render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{JABATAN_ROLE_LABEL}</FormLabel>
                <FormControl>
                  <RoleCombobox
                    value={field.value}
                    onValueChange={field.onChange}
                    roles={ROLES}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {isEditMode && (
               <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                  <FormLabel>{STATUS_LABEL}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                      <SelectTrigger><SelectValue placeholder={STATUS_PLACEHOLDER} /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      {STATUS_OPTIONS.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                      </SelectContent>
                  </Select>
                  <FormMessage />
                  </FormItem>
              )} />
            )}
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : (isEditMode ? UPDATE_USER_BUTTON_LABEL : SAVE_USER_BUTTON_LABEL)}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/admin" className="underline underline-offset-4 hover:text-primary">
                {isEditMode ? CANCEL_AND_BACK_LINK_TEXT : BACK_TO_ADMIN_LINK_TEXT}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
