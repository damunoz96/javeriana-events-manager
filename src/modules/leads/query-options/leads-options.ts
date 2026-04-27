import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { Leads } from '../services/leads';
import { QueryKeys } from '#/constants/query-keys';

export const leadsQueryOptions = (search: string = '', page: number = 0) =>
  queryOptions({
    queryKey: [QueryKeys.LEADS, search, page],
    queryFn: () => Leads.get(search, page),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });
