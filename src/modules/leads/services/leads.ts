import { supabase } from '#/integrations/supabase/client';

export const LEADS_PAGE_SIZE = 10;

export class Leads {
  static async get(search: string = '', page: number = 0) {
    const from = page * LEADS_PAGE_SIZE;
    const to = from + LEADS_PAGE_SIZE - 1;

    let query = supabase
      .from('leads')
      .select('*, programs(title)', { count: 'exact' });

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
