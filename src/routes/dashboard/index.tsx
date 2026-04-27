import { Link, createFileRoute } from '@tanstack/react-router';
import { BookOpen, ClipboardList } from 'lucide-react';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHome,
});

function DashboardHome() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="space-y-2">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Bienvenido al panel de administracion
        </h2>
        <p className="text-lg text-muted-foreground">
          Gestiona la oferta academica y el registro de leads de la Pontificia Universidad Javeriana.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/dashboard/events"
          className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
        >
          <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <BookOpen className="size-6" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-card-foreground">
            Oferta Academica
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Administra los programas, eventos y actividades academicas disponibles.
          </p>
        </Link>

        <Link
          to="/dashboard/leads"
          className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
        >
          <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <ClipboardList className="size-6" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-card-foreground">
            Registro de Leads
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Consulta y gestiona los leads registrados en los distintos eventos.
          </p>
        </Link>
      </div>

    </div>
  );
}
