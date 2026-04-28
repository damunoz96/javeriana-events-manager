import { useFieldContext } from '#/hooks/form-context';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';

export function TextField({
  label,
  placeholder,
  type = 'text',
}: {
  label: string;
  placeholder?: string;
  type?: string;
}) {
  const field = useFieldContext<string>();
  const errors = field.state.meta.isTouched ? field.state.meta.errors : [];

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        type={type}
        placeholder={placeholder}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={errors.length > 0}
      />
      {errors.length > 0 && <p className="text-xs text-destructive">{errors.join(', ')}</p>}
    </div>
  );
}
