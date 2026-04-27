import { MoreVertical } from 'lucide-react';
import { Button } from '#/components/ui/button';

type LeadStatus = 'nuevo' | 'contactado' | 'inscrito' | 'rechazado';

export interface Lead {
  id: string;
  nombre: string;
  email: string;
  interesAcademico: string;
  fecha: string;
  estado: LeadStatus;
}

export function LeadRow({ lead }: { lead: Lead }) {
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

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  nuevo: { label: 'Nuevo', className: 'text-blue-600 bg-blue-50' },
  contactado: { label: 'Contactado', className: 'text-amber-600 bg-amber-50' },
  inscrito: { label: 'Inscrito', className: 'text-emerald-600 bg-emerald-50' },
  rechazado: { label: 'Rechazado', className: 'text-red-600 bg-red-50' },
};
