import { Clock, MapPin } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import type { Event } from '../models/events.models';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card';

const modalityLabels: Record<Event['modality'], string> = {
  online: 'En linea',
  in_person: 'Presencial',
  hybrid: 'Hibrido',
};

export function ProgramCard({ program }: { program: Event }) {
  return (
    <Link to="/dashboard/events/$eventId" params={{ eventId: program.id }} className="block">
      <Card className="group cursor-pointer pt-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-4/3 overflow-hidden rounded-t-xl">
          <img
            src={program.cover_image_url}
            alt={program.title}
            decoding="async"
            width={400}
            height={300}
            className="size-full object-cover will-change-transform transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
            {program.category}
          </span>
        </div>
        <CardHeader>
          <CardTitle className="text-lg font-bold leading-tight line-clamp-2">
            {program.title}
          </CardTitle>
          <CardDescription className="line-clamp-3 leading-relaxed">
            {program.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {program.duration_weeks} semanas
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" />
              {modalityLabels[program.modality]}
            </span>
          </div>
          {program.tags && program.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {program.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function FeaturedProgramCard({ program }: { program: Event }) {
  return (
    <Link to="/dashboard/events/$eventId" params={{ eventId: program.id }} className="block">
      <Card className="group cursor-pointer pt-0 transition-shadow hover:shadow-md sm:flex-row sm:overflow-hidden sm:py-0">
        <div className="relative aspect-4/3 overflow-hidden rounded-t-xl sm:aspect-auto sm:h-80 sm:w-1/2 sm:shrink-0 sm:rounded-l-xl sm:rounded-tr-none">
          <img
            src={program.cover_image_url}
            alt={program.title}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            width={640}
            height={320}
            className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/20 to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gold-foreground">
            Destacado
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-center sm:w-1/2">
          <CardHeader>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              {program.category}
            </span>
            <CardTitle className="text-2xl font-bold leading-tight">{program.title}</CardTitle>
            <CardDescription className="leading-relaxed">{program.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                {program.duration_weeks} semanas
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" />
                {modalityLabels[program.modality]}
              </span>
            </div>
            {program.tags && program.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {program.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
