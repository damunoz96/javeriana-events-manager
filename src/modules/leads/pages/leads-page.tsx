import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { LeadRow } from '../components/LeadRow';
import { LeadRowSkeleton } from '../components/LeadRowSkeleton';
import { LeadFormDialog } from '../components/LeadFormDialog';
import { LeadDeleteDialog } from '../components/LeadDeleteDialog';
import { useLeadCrud } from '../hooks/use-lead-crud';
import { leadsQueryOptions } from '../query-options/leads-options';
import { LEADS_PAGE_SIZE } from '../services/leads';
import { useDebounce } from '#/hooks/use-debounce';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Skeleton } from '#/components/ui/skeleton';
import { PaginationControls } from '#/components/ui/pagination-controls';

export function LeadsPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [currentPage, setCurrentPage] = useState(0);

  const { data, isLoading, isFetching } = useQuery(leadsQueryOptions(debouncedSearch, currentPage));

  const leads = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LEADS_PAGE_SIZE);
  const isFiltering = isFetching && !isLoading;

  const crud = useLeadCrud();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(0);
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
          <Button variant="gold" size="sm" onClick={crud.handleCreate}>
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
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => <LeadRowSkeleton key={i} />)}

              {!isLoading &&
                leads.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    onEdit={crud.handleEdit}
                    onDelete={crud.handleDelete}
                  />
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

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          pageSize={LEADS_PAGE_SIZE}
          onPageChange={setCurrentPage}
          label="leads"
        />
      </div>

      {/* Dialogs */}
      <LeadFormDialog
        open={crud.formOpen}
        onOpenChange={crud.setFormOpen}
        leadId={crud.editingLead?.id}
        defaultValues={crud.editingLead?.values}
      />

      <LeadDeleteDialog
        open={crud.deleteOpen}
        onOpenChange={crud.setDeleteOpen}
        leadId={crud.deletingLeadId}
      />
    </div>
  );
}
