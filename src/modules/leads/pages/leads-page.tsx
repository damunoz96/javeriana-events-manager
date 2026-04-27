import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Plus, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LeadRow } from '../components/LeadRow';
import { LeadFormDialog } from '../components/LeadFormDialog';
import { LeadDeleteDialog } from '../components/LeadDeleteDialog';
import { leadsQueryOptions } from '../query-options/leads-options';
import { Leads, LEADS_PAGE_SIZE } from '../services/leads';
import { useDebounce } from '#/hooks/use-debounce';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Skeleton } from '#/components/ui/skeleton';

export function LeadsPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [currentPage, setCurrentPage] = useState(0);

  const { data, isLoading, isFetching } = useQuery(leadsQueryOptions(debouncedSearch, currentPage));

  const leads = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LEADS_PAGE_SIZE);
  const isFiltering = isFetching && !isLoading;

  // Form dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<{
    id: string;
    values: { name: string; last_name: string; email: string; program_id: string };
  } | null>(null);

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(0);
  };

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
          <Button variant="gold" size="sm" onClick={handleCreate}>
            <Plus className="size-4" />
            Nuevo Lead
          </Button>
        </div>
      </div>

      {/* Stats + Banner */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total Aspirantes
          </p>
          <div className="mt-2">
            {isLoading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <span className="font-heading text-3xl font-bold">
                {total.toLocaleString('es-CO')}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-xl bg-gold p-5 text-gold-foreground shadow-sm">
          <h3 className="font-heading text-lg font-bold">Campana Activa: Posgrados 2024</h3>
          <p className="mt-1 text-sm text-gold-foreground/80">
            Faltan 14 dias para el cierre de inscripciones anticipadas.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o correo..."
          className="pl-9"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div
          className={`overflow-x-auto ${isFiltering ? 'opacity-50 transition-opacity' : 'transition-opacity'}`}
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
                  Interes Academico
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
              {isLoading && Array.from({ length: 5 }).map((_, i) => <LeadRowSkeleton key={i} />)}

              {!isLoading &&
                leads.map((lead) => (
                  <LeadRow key={lead.id} lead={lead} onEdit={handleEdit} onDelete={handleDelete} />
                ))}

              {!isLoading && leads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No se encontraron leads.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Mostrando {currentPage * LEADS_PAGE_SIZE + 1}-
              {Math.min((currentPage + 1) * LEADS_PAGE_SIZE, total)} de {total} leads
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-xs"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'ghost'}
                  size="icon-xs"
                  onClick={() => setCurrentPage(page)}
                >
                  {page + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon-xs"
                disabled={currentPage === totalPages - 1}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <LeadFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        leadId={editingLead?.id}
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
        <Skeleton className="h-5 w-28 rounded-full" />
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
