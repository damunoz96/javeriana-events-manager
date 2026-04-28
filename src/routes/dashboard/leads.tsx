import { createFileRoute } from '@tanstack/react-router';
import { LeadsPage } from '#/modules/leads/pages/leads-page';
import { allProgramsQueryOptions } from '#/modules/events/query-options/events-options';

export const Route = createFileRoute('/dashboard/leads')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    await queryClient.ensureQueryData(allProgramsQueryOptions);
  },
  component: LeadsPage,
});
