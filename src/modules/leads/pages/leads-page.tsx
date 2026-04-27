import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  MoreVertical,
  Plus,
  Search,
  SlidersHorizontal,
  TrendingUp,
} from 'lucide-react';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';

type LeadStatus = 'nuevo' | 'contactado' | 'inscrito' | 'rechazado';

interface Lead {
  id: string;
  nombre: string;
  email: string;
  interesAcademico: string;
  fecha: string;
  estado: LeadStatus;
}

const mockLeads: Lead[] = [
  {
    id: '1',
    nombre: 'Alejandra Martinez',
    email: 'ale.martinez@email.com',
    interesAcademico: 'Maestria en IA',
    fecha: '12 Oct, 2024',
    estado: 'nuevo',
  },
  {
    id: '2',
    nombre: 'Ricardo Gomez',
    email: 'r.gomez22@university.edu',
    interesAcademico: 'Diplomado en Finanzas',
    fecha: '11 Oct, 2024',
    estado: 'contactado',
  },
  {
    id: '3',
    nombre: 'Catalina Pardo',
    email: 'cpardo_dev@workmail.co',
    interesAcademico: 'Ingenieria de Datos',
    fecha: '10 Oct, 2024',
    estado: 'inscrito',
  },
  {
    id: '4',
    nombre: 'Sebastian Rojas',
    email: 's.rojas@gmail.com',
    interesAcademico: 'MBA Ejecutivo',
    fecha: '9 Oct, 2024',
    estado: 'nuevo',
  },
  {
    id: '5',
    nombre: 'Valentina Castro',
    email: 'vcastro@outlook.com',
    interesAcademico: 'Especializacion en UX',
    fecha: '8 Oct, 2024',
    estado: 'rechazado',
  },
  {
    id: '6',
    nombre: 'Andres Mejia',
    email: 'amejia@empresa.co',
    interesAcademico: 'Maestria en IA',
    fecha: '7 Oct, 2024',
    estado: 'contactado',
  },
  {
    id: '7',
    nombre: 'Laura Fernandez',
    email: 'lfernandez@correo.com',
    interesAcademico: 'Diplomado en Finanzas',
    fecha: '6 Oct, 2024',
    estado: 'inscrito',
  },
  {
    id: '8',
    nombre: 'Carlos Duarte',
    email: 'cduarte@mail.com',
    interesAcademico: 'Ingenieria de Datos',
    fecha: '5 Oct, 2024',
    estado: 'nuevo',
  },
];

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  nuevo: { label: 'Nuevo', className: 'text-blue-600 bg-blue-50' },
  contactado: { label: 'Contactado', className: 'text-amber-600 bg-amber-50' },
  inscrito: { label: 'Inscrito', className: 'text-emerald-600 bg-emerald-50' },
  rechazado: { label: 'Rechazado', className: 'text-red-600 bg-red-50' },
};

const ITEMS_PER_PAGE = 5;

export function LeadsPage() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = mockLeads.filter(
    (lead) =>
      lead.nombre.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight">Panel de Leads</h2>
          <p className="mt-1 text-muted-foreground">
            Administracion y seguimiento de aspirantes interesados.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="size-4" />
            Exportar CSV
          </Button>
          <Button variant="gold" size="sm">
            <Plus className="size-4" />
            Nuevo Lead
          </Button>
        </div>
      </div>

      {/* Stats + Banner */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total Aspirantes
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold">1,248</span>
            <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
              <TrendingUp className="size-3" /> 12%
            </span>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Por Contactar
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold">42</span>
            <span className="text-xs text-muted-foreground">Pendiente</span>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-xl bg-gold p-5 text-gold-foreground shadow-sm">
          <h3 className="font-heading text-lg font-bold">Campana Activa: Posgrados 2024</h3>
          <p className="mt-1 text-sm text-gold-foreground/80">
            Faltan 14 dias para el cierre de inscripciones anticipadas.
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o correo..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="size-4" />
          Todos los Programas
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Nombre Completo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Interes Academico
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Estado
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginated.map((lead) => (
                <LeadRow key={lead.id} lead={lead} />
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No se encontraron leads.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} de {filtered.length} leads
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-xs"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? 'default' : 'ghost'}
                size="icon-xs"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon-xs"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function LeadRow({ lead }: { lead: Lead }) {
  const status = statusConfig[lead.estado];

  return (
    <tr className="transition-colors hover:bg-muted/30">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {getInitials(lead.nombre)}
          </div>
          <span className="font-medium">{lead.nombre}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{lead.email}</td>
      <td className="px-4 py-3">
        <span className="inline-flex rounded-full border bg-muted/50 px-2.5 py-0.5 text-xs font-medium">
          {lead.interesAcademico}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{lead.fecha}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {status.label}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <Button variant="ghost" size="icon-xs">
          <MoreVertical className="size-4" />
        </Button>
      </td>
    </tr>
  );
}
