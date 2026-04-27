import { useFormContext } from '#/hooks/form-context';
import { Button } from '#/components/ui/button';

export function SubmitButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel?: string;
}) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state: { canSubmit: boolean; isSubmitting: boolean }) => [state.canSubmit, state.isSubmitting]}>
      {(state) => {
        const [canSubmit, isSubmitting] = state;
        return (
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? (pendingLabel ?? 'Guardando...') : label}
          </Button>
        );
      }}
    </form.Subscribe>
  );
}
