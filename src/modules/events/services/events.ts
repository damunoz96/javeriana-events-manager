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
      data: events,
      nextPage: count !== null && to < count - 1 ? page + 1 : undefined,
    };
  }

  static async getById(id: string) {
    const { data } = await supabase
      .from('programs')
      .select()
      .eq('id', id)
      .single()
      .throwOnError();

    return data;
  }

  static async getLeadsByProgramId(programId: string, search: string = '', page: number = 0) {
    const from = page * 10;
    const to = from + 9;

    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .eq('program_id', programId);

    if (search) {
      query = query.or(`name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: leads, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)
      .throwOnError();

    return {
      data: leads ?? [],
      total: count ?? 0,
    };
  }
}
