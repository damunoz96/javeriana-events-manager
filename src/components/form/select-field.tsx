import { useFieldContext } from '#/hooks/form-context';
import { Label } from '#/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';

export function SelectField({
  label,
  placeholder,
  options,
  disabled,
}: {
  label: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  const field = useFieldContext<string>();
  const errors = field.state.meta.isTouched ? field.state.meta.errors : [];

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Select
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
        disabled={disabled}
      >
        <SelectTrigger id={field.name} className="w-full" aria-invalid={errors.length > 0}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.length > 0 && <p className="text-xs text-destructive">{errors.join(', ')}</p>}
    </div>
  );
}
