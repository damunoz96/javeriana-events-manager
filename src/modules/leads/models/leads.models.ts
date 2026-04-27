import type { Tables, TablesInsert } from 'supabase/database/database.types';

export type Lead = Tables<'leads'>;
export type LeadInsert = TablesInsert<'leads'>;
export type LeadUpdate = Tables<'leads'>;
export type LeadDelete = { id: string };
