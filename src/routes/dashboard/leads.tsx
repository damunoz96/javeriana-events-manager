import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/leads')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/leads"!</div>;
}
