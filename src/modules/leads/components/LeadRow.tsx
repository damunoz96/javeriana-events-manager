import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '#/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu';

interface LeadRowProps {
  lead: {
    id: string;
    name: string;
    last_name: string;
    email: string;
    created_at: string;
    programs: { title: string } | null;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function LeadRow({ lead, onEdit, onDelete }: LeadRowProps) {
  const fullName = `${lead.name} ${lead.last_name}`;
  const date = new Date(lead.created_at).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <tr className="transition-colors hover:bg-muted/30">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {getInitials(fullName)}
          </div>
          <span className="font-medium">{fullName}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{lead.email}</td>
      <td className="px-4 py-3">
        {lead.programs ? (
          <span className="inline-flex rounded-full border bg-muted/50 px-2.5 py-0.5 text-xs font-medium">
            {lead.programs.title}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{date}</td>
      <td className="px-4 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(lead.id)}>
              <Pencil className="size-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(lead.id)}
            >
              <Trash2 className="size-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
