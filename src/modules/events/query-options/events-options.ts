import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';
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

export const eventDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [QueryKeys.EVENTS, 'detail', id],
    queryFn: () => Events.getById(id),
    staleTime: Infinity,
  });

export const eventLeadsQueryOptions = (programId: string, search: string = '', page: number = 0) =>
  queryOptions({
    queryKey: [QueryKeys.EVENTS, 'leads', programId, search, page],
    queryFn: () => Events.getLeadsByProgramId(programId, search, page),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });
