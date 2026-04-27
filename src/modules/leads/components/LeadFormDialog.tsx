import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Leads } from '../services/leads';
import { allProgramsQueryOptions } from '#/modules/events/query-options/events-options';
import { QueryKeys } from '#/constants/query-keys';
import { Button } from '#/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';

interface LeadFormData {
  name: string;
  last_name: string;
  email: string;
  program_id: string;
}

interface LeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId?: string | null;
  defaultProgramId?: string | null;
  defaultValues?: {
    name: string;
    last_name: string;
    email: string;
    program_id: string;
  } | null;
}

export function LeadFormDialog({
  open,
  onOpenChange,
  leadId,
  defaultProgramId,
  defaultValues,
}: LeadFormDialogProps) {
  const isEditing = !!leadId;
  const queryClient = useQueryClient();

  const [form, setForm] = useState<LeadFormData>({
    name: '',
    last_name: '',
    email: '',
    program_id: '',
  });

  const { data: programs = [] } = useQuery({
    ...allProgramsQueryOptions,
    enabled: open,
  });

  useEffect(() => {
    if (!open) return;

    if (defaultValues) {
      setForm(defaultValues);
    } else {
      setForm({
        name: '',
        last_name: '',
        email: '',
        program_id: defaultProgramId ?? '',
      });
    }
  }, [open, defaultValues, defaultProgramId]);

  const mutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      if (isEditing) {
        return Leads.update(leadId, data);
      }
      return Leads.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.LEADS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.EVENTS, 'leads'] });
      onOpenChange(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const isValid = form.name && form.last_name && form.email && form.program_id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Lead' : 'Nuevo Lead'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifica los datos del lead.'
              : 'Completa los datos para registrar un nuevo lead.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Nombre"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Apellido</Label>
              <Input
                id="last_name"
                placeholder="Apellido"
                value={form.last_name}
                onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electronico</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="program">Programa de interes</Label>
            <Select
              value={form.program_id}
              onValueChange={(value) => setForm((f) => ({ ...f, program_id: value }))}
              disabled={!!defaultProgramId}
            >
              <SelectTrigger id="program" className="w-full">
                <SelectValue placeholder="Selecciona un programa" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid || mutation.isPending}>
              {mutation.isPending
                ? 'Guardando...'
                : isEditing
                  ? 'Guardar cambios'
                  : 'Crear Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
