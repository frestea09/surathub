
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activeUser, logout } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);

  useEffect(() => {
    // This effect ensures that the user is authenticated.
    // It will redirect to the login page if no active user is found after a brief delay.
    const checkAuth = () => {
      if (!useUserStore.getState().activeUser) {
        if (pathname !== '/vendor/login') {
          router.replace('/vendor/login');
        } else {
          setIsAuthCheckComplete(true);
        }
      } else {
        setIsAuthCheckComplete(true);
      }
    };

    // A small delay helps ensure the state is hydrated from storage before checking.
    const timer = setTimeout(checkAuth, 50);
    return () => clearTimeout(timer);
  }, [pathname, router]);

  const handleLogout = () => {
    logout();
    router.push('/vendor/login');
  };

  if (!isAuthCheckComplete) {
    // Show a skeleton loader while auth check is in progress, but only if not on the login page itself
    if (pathname === '/vendor/login') return <>{children}</>;
    
    return (
        <div className="flex min-h-screen w-full flex-col">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <Skeleton className="h-8 w-48" />
                <div className="ml-auto flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <Skeleton className="h-96 w-full" />
            </main>
        </div>
    );
  }
  
  if (!activeUser && pathname !== '/vendor/login') {
    return null; // Render nothing while redirecting
  }
  
  // If on login page, just render children without the layout
  if (pathname === '/vendor/login') {
      return <>{children}</>;
  }


  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/vendor/dashboard"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M22 12h-6l-2 3h-4l-2-3H2" />
              <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
            <span className="hidden md:inline-block">Portal Vendor SuratHub</span>
          </Link>
          <Link
            href="/vendor/dashboard"
            className={cn(
              "text-muted-foreground transition-colors hover:text-foreground",
              pathname === "/vendor/dashboard" && "text-foreground font-semibold"
            )}
          >
            Dashboard
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          {activeUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{activeUser.nama.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{activeUser.nama}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
