import type { LeadInsert } from '../models/leads.models';
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

  static async getById(id: string) {
    const { data } = await supabase
      .from('leads')
      .select('*, programs(title)')
      .eq('id', id)
      .single()
      .throwOnError();

    return data;
  }

  static async create(lead: LeadInsert) {
    const { data } = await supabase
      .from('leads')
      .insert(lead)
      .select()
      .single()
      .throwOnError();

    return data;
  }

  static async update(id: string, lead: Partial<LeadInsert>) {
    const { data } = await supabase
      .from('leads')
      .update(lead)
      .eq('id', id)
      .select()
      .single()
      .throwOnError();

    return data;
  }

  static async delete(id: string) {
    await supabase.from('leads').delete().eq('id', id).throwOnError();
  }
}
