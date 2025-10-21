"use client";

// Imports from the framework
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Imports from packages
import { BotIcon, SettingsIcon, VideoIcon } from "lucide-react";

// Imports from components
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DashboardUserButton } from "@/modules/dashboard/ui/components/dashboard-user-button";

const firstSection = [
  {
    icon: VideoIcon,
    label: "Interviews",
    href: "/interviews",
  },
  {
    icon: BotIcon,
    label: "Coaching",
    href: "/coaching",
  },
];

const secondSection = [
  {
    icon: SettingsIcon,
    label: "Settings",
    href: "/settings",
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href="/" className="flex items-center gap-2 px-2 pt-2">
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
          <div>
            <p className="text-lg font-semibold">Interviewcrew</p>
            <p className="text-lg font-semibold pl-5">Interviewer</p>
          </div>
        </Link>
      </SidebarHeader>
      <div className="px-4 py-2">
        <Separator className="opacity-10 text-[#5d6b68]" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {firstSection.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                    pathname === item.href &&
                      "bg-linear-to-r/oklch border-[#5D6B68]/10"
                  )}
                  isActive={pathname === item.href}
                >
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span className="text-sm font-medium tracking-tight">
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <div className="px-4 py-2">
            <Separator className="opacity-10 text-[#5D6B68]" />
        </div>
        <SidebarGroup>
          <SidebarMenu>
            {secondSection.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                    pathname === item.href &&
                      "bg-linear-to-r/oklch border-[#5D6B68]/10"
                  )}
                  isActive={pathname === item.href}
                >
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span className="text-sm font-medium tracking-tight">
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="text-white">
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};
