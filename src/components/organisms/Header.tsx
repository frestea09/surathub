
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, PanelLeft, Search } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BuatSuratButton } from "@/components/buat-surat-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavLinks } from "../molecules/NavLinks";
import { HEADER_SR, USER_MENU, NOTIFICATION_MENU } from "@/lib/constants";

type Notification = {
  title: string;
  description: string;
  time: string;
  link: string;
};

type User = {
  name: string;
  avatar: string;
  initials: string;
};

type HeaderProps = {
  notifications: Notification[];
  user: User;
};

export function Header({ notifications, user }: HeaderProps) {
  const router = useRouter();
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">{HEADER_SR.TOGGLE_NAV}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <NavLinks isMobile={true} />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={HEADER_SR.SEARCH_PLACEHOLDER}
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <DropdownMenu
        onOpenChange={(open) => {
          if (open) setShowNotificationBadge(false);
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative h-8 w-8 rounded-full"
          >
            {showNotificationBadge && notifications.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0 text-xs">
                {notifications.length}
              </Badge>
            )}
            <Bell className="h-4 w-4" />
            <span className="sr-only">{HEADER_SR.TOGGLE_NOTIF}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>{NOTIFICATION_MENU.LABEL}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.map((notif, index) => (
            <DropdownMenuItem
              key={index}
              className="flex flex-col items-start gap-1 whitespace-normal"
              onClick={() => router.push(notif.link)}
            >
              <p className="font-semibold">{notif.title}</p>
              <p className="text-xs text-muted-foreground">{notif.description}</p>
              <p className="text-xs text-muted-foreground">{notif.time}</p>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="justify-center text-sm text-primary"
            onClick={() => router.push("/notifikasi")}
          >
            {NOTIFICATION_MENU.VIEW_ALL}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <BuatSuratButton />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.avatar}
                alt="User"
                data-ai-hint="user avatar"
              />
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <span className="sr-only">{HEADER_SR.TOGGLE_USER_MENU}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/profil")}>
            {USER_MENU.PROFIL}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/pengaturan")}>
            {USER_MENU.PENGATURAN}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/")}>
            {USER_MENU.KELUAR}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
