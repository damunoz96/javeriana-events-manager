import type { Enums } from 'supabase/database/database.types';
import { supabase } from '#/integrations/supabase/client';

export type LevelFilter = Enums<'level_type'> | null;

const PAGE_SIZE = 6;

export class Events {
  static async get(level: LevelFilter = null, search: string = '', page: number = 0) {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase.from('programs').select('*', { count: 'exact' });

    if (level) {
      query = query.eq('level', level);
    }

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data: events, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)
      .throwOnError();

    return {
      data: events ?? [],
      nextPage: count !== null && to < count - 1 ? page + 1 : undefined,
    };
  }
}
