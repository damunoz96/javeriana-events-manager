import { infiniteQueryOptions } from '@tanstack/react-query';
import { Events } from '../services/events';
import type { LevelFilter } from '../services/events';
import { QueryKeys } from '#/constants/query-keys';

export const eventsQueryOptions = (level: LevelFilter = null, search: string = '') =>
  infiniteQueryOptions({
    queryKey: [QueryKeys.EVENTS, level, search],
    queryFn: ({ pageParam }) => Events.get(level, search, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: Infinity,
  });
