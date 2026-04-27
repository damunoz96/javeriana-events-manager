import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Leads } from '../services/leads';
import { QueryKeys } from '#/constants/query-keys';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog';

interface LeadDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string | null;
}

export function LeadDeleteDialog({ open, onOpenChange, leadId }: LeadDeleteDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!leadId) return;
      await Leads.delete(leadId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.LEADS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.EVENTS, 'leads'] });
      onOpenChange(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar lead</AlertDialogTitle>
          <AlertDialogDescription>
            Esta accion no se puede deshacer. El lead sera eliminado permanentemente del sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {mutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
