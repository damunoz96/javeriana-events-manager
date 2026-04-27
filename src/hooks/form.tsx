import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from './form-context';
import { TextField } from '#/components/form/text-field';
import { SelectField } from '#/components/form/select-field';
import { SubmitButton } from '#/components/form/submit-button';

export { fieldContext, formContext, useFieldContext, useFormContext } from './form-context';

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
