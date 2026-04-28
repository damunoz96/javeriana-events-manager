import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Leads } from '../services/leads';
import { useAppForm } from '#/hooks/form';
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

  const { data: programs = [] } = useQuery({
    ...allProgramsQueryOptions,
    enabled: open,
  });

  const programOptions = programs.map((p) => ({ value: p.id, label: p.title }));

  const mutation = useMutation({
    mutationFn: async (data: { name: string; last_name: string; email: string; program_id: string }) => {
      return Leads.upsert({
        ...(leadId ? { id: leadId } : {}),
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.LEADS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.EVENTS, 'leads'] });
      onOpenChange(false);
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: '',
      last_name: '',
      email: '',
      program_id: defaultProgramId ?? '',
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });

  useEffect(() => {
    if (!open) return;

    if (defaultValues) {
      form.reset(defaultValues);
    } else {
      form.reset({
        name: '',
        last_name: '',
        email: '',
        program_id: defaultProgramId ?? '',
      });
    }
  }, [open, defaultValues, defaultProgramId]);

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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <form.AppField
              name="name"
              validators={{
                onBlur: ({ value }) => (!value ? 'El nombre es requerido' : undefined),
                onSubmit: ({ value }) => (!value ? 'El nombre es requerido' : undefined),
              }}
            >
              {(field) => <field.TextField label="Nombre" placeholder="Nombre" />}
            </form.AppField>

            <form.AppField
              name="last_name"
              validators={{
                onBlur: ({ value }) => (!value ? 'El apellido es requerido' : undefined),
                onSubmit: ({ value }) => (!value ? 'El apellido es requerido' : undefined),
              }}
            >
              {(field) => <field.TextField label="Apellido" placeholder="Apellido" />}
            </form.AppField>
          </div>

          <form.AppField
            name="email"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return 'El correo es requerido';
                if (!/^[^\s@]+@javeriana\.edu\.co$/i.test(value))
                  return 'Solo se permiten correos @javeriana.edu.co';
                return undefined;
              },
              onSubmit: ({ value }) => {
                if (!value) return 'El correo es requerido';
                if (!/^[^\s@]+@javeriana\.edu\.co$/i.test(value))
                  return 'Solo se permiten correos @javeriana.edu.co';
                return undefined;
              },
            }}
          >
            {(field) => (
              <field.TextField
                label="Correo electronico"
                placeholder="correo@javeriana.edu.co"
                type="email"
              />
            )}
          </form.AppField>

          <form.AppField
            name="program_id"
            validators={{
              onBlur: ({ value }) => (!value ? 'Selecciona un programa' : undefined),
              onSubmit: ({ value }) => (!value ? 'Selecciona un programa' : undefined),
            }}
          >
            {(field) => (
              <field.SelectField
                label="Programa de interes"
                placeholder="Selecciona un programa"
                options={programOptions}
                disabled={!!defaultProgramId}
              />
            )}
          </form.AppField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <form.AppForm>
              <form.SubmitButton
                label={isEditing ? 'Guardar cambios' : 'Crear Lead'}
                pendingLabel="Guardando..."
              />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
