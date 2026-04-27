import { createFileRoute } from '@tanstack/react-router';
import { EventsPage } from '#/modules/events/pages/events-page';

export const Route = createFileRoute('/dashboard/events')({
  component: EventsPage,
});
