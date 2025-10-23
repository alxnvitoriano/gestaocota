"use client";

import { AvatarFallback } from "@radix-ui/react-avatar";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  BadgeCheckIcon,
  BookmarkCheck,
  CalendarDays,
  CheckCheck,
  CircleCheckIcon,
  HandCoins,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  UsersIcon,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Leads",
    url: "/leads",
    icon: UsersIcon,
  },
  {
    title: "Vendedores",
    url: "/sellers",
    icon: HandCoins,
  },
  {
    title: "Lev. Necessidade",
    url: "/clients",
    icon: UsersRound,
  },
  {
    title: "Negociação",
    url: "/negotiations",
    icon: CircleCheckIcon,
  },
  {
    title: "Análise",
    url: "/analysis",
    icon: CheckCheck,
  },
  {
    title: "Agendamentos",
    url: "/appointments",
    icon: CalendarDays,
  },
  {
    title: "Fechamento",
    url: "/closures",
    icon: BookmarkCheck,
  },
  {
    title: "Controle Qual.",
    url: "/quality-control",
    icon: ShieldCheck,
  },
  {
    title: "Resultado Assembléia",
    url: "/assemblies",
    icon: BadgeCheckIcon,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const session = authClient.useSession();
  const pathname = usePathname();
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/authentication");
        },
      },
    });
  };
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-active={pathname === item.url ? "true" : undefined}
                    className={
                      pathname === item.url
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                        : ""
                    }
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar>
                    <AvatarFallback>
                      {session.data?.user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      {session.data?.user?.company?.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {session.data?.user?.email}
                    </p>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
