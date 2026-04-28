import { useState } from 'react';
import { Search } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FeaturedProgramCard, ProgramCard } from '../components/ProgramCard';
import { eventsQueryOptions } from '../query-options/events-options';
import type { LevelFilter } from '../services/events';
import { useDebounce } from '#/hooks/use-debounce';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Skeleton } from '#/components/ui/skeleton';
import { Card } from '#/components/ui/card';

const levels: { label: string; value: LevelFilter }[] = [
  { label: 'Todos', value: null },
  { label: 'Pregrado', value: 'pregrado' },
  { label: 'Posgrado', value: 'posgrado' },
  { label: 'Educacion Continua', value: 'educacion continua' },
];

export function EventsPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [activeLevel, setActiveLevel] = useState<LevelFilter>(null);
  const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery(eventsQueryOptions(activeLevel, debouncedSearch));

  const programs = data?.pages.flatMap((page) => page.data) ?? [];
  const featured = programs.at(0);
  const rest = programs.slice(1);
  const isInitialLoading = isLoading;
  const isFiltering = isFetching && !isFetchingNextPage && !isLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-3xl font-bold tracking-tight">Catalogo Academico</h2>
        <p className="mt-1 text-muted-foreground">
          Explora nuestra oferta de excelencia educativa. Programas disenados para transformar el
          futuro a traves de la investigacion y el conocimiento.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar programas por nombre, facultad o palabra clave..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Level tabs */}
      <div className="flex gap-1">
        {levels.map((level) => (
          <Button
            key={level.label}
            variant={activeLevel === level.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveLevel(level.value)}
          >
            {level.label}
          </Button>
        ))}
      </div>

      {/* Initial loading skeletons */}
      {isInitialLoading && (
        <div className="space-y-5">
          <FeaturedCardSkeleton />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProgramCardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {!isInitialLoading && (
        <div className={isFiltering ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
          {featured && <FeaturedProgramCard program={featured} />}

          {rest.length > 0 ? (
            <InfiniteScroll
              dataLength={rest.length}
              next={fetchNextPage}
              hasMore={!!hasNextPage}
              loader={
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <ProgramCardSkeleton key={i} />
                  ))}
                </div>
              }
              scrollThreshold={0.8}
              style={{ overflow: 'visible' }}
            >
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            </InfiniteScroll>
          ) : (
            !featured && (
              <div className="py-12 text-center text-muted-foreground">
                No se encontraron programas.
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

function ProgramCardSkeleton() {
  return (
    <Card className="pt-0 overflow-hidden">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </Card>
  );
}

function FeaturedCardSkeleton() {
  return (
    <Card className="overflow-hidden pt-0 sm:flex-row sm:py-0">
      <Skeleton className="aspect-4/3 w-full rounded-none sm:aspect-auto sm:h-80 sm:w-1/2" />
      <div className="flex flex-1 flex-col justify-center space-y-4 p-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </Card>
  );
}
