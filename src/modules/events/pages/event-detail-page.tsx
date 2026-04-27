import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  MapPin,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { eventDetailQueryOptions, eventLeadsQueryOptions } from '../query-options/events-options';
import { LeadRow } from '#/modules/leads/components/LeadRow';
import { LeadFormDialog } from '#/modules/leads/components/LeadFormDialog';
import { LeadDeleteDialog } from '#/modules/leads/components/LeadDeleteDialog';
import { Leads } from '#/modules/leads/services/leads';
import { useDebounce } from '#/hooks/use-debounce';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { Input } from '#/components/ui/input';
import { Separator } from '#/components/ui/separator';
import { Skeleton } from '#/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs';

const modalityLabels = {
  online: 'En linea',
  in_person: 'Presencial',
  hybrid: 'Hibrido',
} as const;

const LEADS_PER_PAGE = 10;

export function EventDetailPage({ eventId }: { eventId: string }) {
  const { data: program } = useSuspenseQuery(eventDetailQueryOptions(eventId));

  const [leadsSearch, setLeadsSearch] = useState('');
  const debouncedLeadsSearch = useDebounce(leadsSearch);
  const [leadsPage, setLeadsPage] = useState(0);

  const {
    data: leadsData,
    isLoading: leadsLoading,
    isFetching: leadsFetching,
  } = useQuery(eventLeadsQueryOptions(eventId, debouncedLeadsSearch, leadsPage));

  const leads = leadsData?.data ?? [];
  const leadsTotal = leadsData?.total ?? 0;
  const leadsTotalPages = Math.ceil(leadsTotal / LEADS_PER_PAGE);
  const isLeadsFiltering = leadsFetching && !leadsLoading;

  const startDate = program.start_date
    ? new Date(program.start_date).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;
  const endDate = program.end_date
    ? new Date(program.end_date).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  // Form dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<{
    id: string;
    values: { name: string; last_name: string; email: string; program_id: string };
  } | null>(null);

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingLead(null);
    setFormOpen(true);
  };

  const handleEdit = async (id: string) => {
    const lead = await Leads.getById(id);
    if (!lead) return;
    setEditingLead({
      id,
      values: {
        name: lead.name,
        last_name: lead.last_name,
        email: lead.email,
        program_id: lead.program_id,
      },
    });
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingLeadId(id);
    setDeleteOpen(true);
  };

  const handleLeadsSearchChange = (value: string) => {
    setLeadsSearch(value);
    setLeadsPage(0);
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild>
        <Link to="/dashboard/events">
          <ArrowLeft className="size-4" />
          Volver al catalogo
        </Link>
      </Button>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{program.category}</Badge>
          <Badge variant="outline">{modalityLabels[program.modality]}</Badge>
          <Badge variant="outline">{program.level}</Badge>
        </div>
        <h2 className="font-heading text-3xl font-bold tracking-tight">{program.title}</h2>
        <p className="max-w-3xl text-muted-foreground">{program.description}</p>
      </div>

      <Separator />

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardHeader className="flex-row items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm text-muted-foreground">Duracion</CardTitle>
              <p className="font-heading text-lg font-bold">{program.duration_weeks} semanas</p>
            </div>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader className="flex-row items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm text-muted-foreground">Modalidad</CardTitle>
              <p className="font-heading text-lg font-bold">{modalityLabels[program.modality]}</p>
            </div>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader className="flex-row items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm text-muted-foreground">Nivel</CardTitle>
              <p className="font-heading text-lg font-bold capitalize">{program.level}</p>
            </div>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader className="flex-row items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm text-muted-foreground">Leads registrados</CardTitle>
              <p className="font-heading text-lg font-bold">{leadsTotal}</p>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="leads">
        <TabsList>
          <TabsTrigger value="details">
            <Calendar className="size-4" />
            Detalles
          </TabsTrigger>
          <TabsTrigger value="leads">
            <Users className="size-4" />
            Leads ({leadsTotal})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informacion del programa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {startDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fecha de inicio</p>
                    <p className="mt-1 font-medium">{startDate}</p>
                  </div>
                )}
                {endDate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fecha de fin</p>
                    <p className="mt-1 font-medium">{endDate}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categoria</p>
                  <p className="mt-1 font-medium">{program.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Creado el</p>
                  <p className="mt-1 font-medium">
                    {new Date(program.created_at).toLocaleDateString('es-CO', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {program.tags && program.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {program.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          {/* Search + Add */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o correo..."
                className="pl-9"
                value={leadsSearch}
                onChange={(e) => handleLeadsSearchChange(e.target.value)}
              />
            </div>
            <Button variant="gold" size="sm" onClick={handleCreate}>
              <Plus className="size-4" />
              Agregar Lead
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div
              className={`overflow-x-auto ${isLeadsFiltering ? 'opacity-50 transition-opacity' : 'transition-opacity'}`}
            >
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
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leadsLoading &&
                    Array.from({ length: 5 }).map((_, i) => <LeadRowSkeleton key={i} />)}

                  {!leadsLoading &&
                    leads.map((lead) => (
                      <LeadRow
                        key={lead.id}
                        lead={lead}
                        showProgram={false}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}

                  {!leadsLoading && leads.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                        No se encontraron leads para este programa.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {leadsTotalPages > 0 && (
              <div className="flex items-center justify-between border-t px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  Mostrando {leadsPage * LEADS_PER_PAGE + 1}-
                  {Math.min((leadsPage + 1) * LEADS_PER_PAGE, leadsTotal)} de {leadsTotal} leads
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon-xs"
                    disabled={leadsPage === 0}
                    onClick={() => setLeadsPage((p) => p - 1)}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  {Array.from({ length: leadsTotalPages }, (_, i) => i).map((page) => (
                    <Button
                      key={page}
                      variant={page === leadsPage ? 'default' : 'ghost'}
                      size="icon-xs"
                      onClick={() => setLeadsPage(page)}
                    >
                      {page + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon-xs"
                    disabled={leadsPage === leadsTotalPages - 1}
                    onClick={() => setLeadsPage((p) => p + 1)}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <LeadFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        leadId={editingLead?.id}
        defaultProgramId={eventId}
        defaultValues={editingLead?.values}
      />

      <LeadDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        leadId={deletingLeadId}
      />
    </div>
  );
}

function LeadRowSkeleton() {
  return (
    <tr>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-40" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-4 py-3 text-right">
        <Skeleton className="ml-auto size-6 rounded" />
      </td>
    </tr>
  );
}
