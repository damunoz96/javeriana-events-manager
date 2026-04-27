import { Link, linkOptions, useMatchRoute } from '@tanstack/react-router';
import { BookOpen, ClipboardList } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '#/components/ui/sidebar';

const navItems = [
  linkOptions({
    title: 'Oferta Académica',
    icon: BookOpen,
    to: '/dashboard/events',
  }),
  linkOptions({
    title: 'Registro de Leads',
    icon: ClipboardList,
    to: '/dashboard/leads',
  }),
];

export function AppSidebar() {
  const matchRoute = useMatchRoute();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Pontificia Universidad Javeriana">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="font-heading text-xs font-bold">PUJ</span>
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-heading text-sm font-semibold">Pontificia Universidad</span>
                <span className="font-heading text-xs text-muted-foreground">Javeriana</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={!!matchRoute({ to: item.to })}
                    tooltip={item.title}
                  >
                    <Link to={item.to}>
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
        <SidebarSeparator />
        <div className="p-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          Dirección de Mercadeo
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
