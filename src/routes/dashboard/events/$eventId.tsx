import { createFileRoute } from '@tanstack/react-router';
import { EventDetailPage } from '#/modules/events/pages/event-detail-page';

export const Route = createFileRoute('/dashboard/events/$eventId')({
  component: () => {
    const { eventId } = Route.useParams();
    return <EventDetailPage eventId={eventId} />;
  },
});
