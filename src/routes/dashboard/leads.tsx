import { createFileRoute } from '@tanstack/react-router';
import { LeadsPage } from '#/modules/leads/pages/leads-page';

export const Route = createFileRoute('/dashboard/leads')({
  component: LeadsPage,
});
