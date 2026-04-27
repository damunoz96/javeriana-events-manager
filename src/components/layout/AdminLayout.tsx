import { Link, Outlet } from '@tanstack/react-router';
import { AppSidebar } from '../app/AppSidebar';

import { SidebarInset, SidebarProvider, SidebarTrigger } from '#/components/ui/sidebar';
import { TooltipProvider } from '#/components/ui/tooltip';

export function AdminLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <Link
              to="/dashboard"
              className="font-heading text-lg font-semibold text-primary hover:opacity-80 transition-opacity"
            >
              Javeriana Lead & Events Manager
            </Link>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
