import { Moon, Sun } from 'lucide-react';
import { Link, Outlet } from '@tanstack/react-router';
import { AppSidebar } from '../app/AppSidebar';

import { Button } from '#/components/ui/button';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '#/components/ui/sidebar';
import { TooltipProvider } from '#/components/ui/tooltip';
import { useTheme } from '#/hooks/use-theme';

export function AdminLayout() {
  const { theme, toggleTheme } = useTheme();

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
            <div className="ml-auto">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
