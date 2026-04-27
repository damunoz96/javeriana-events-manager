import type { Tables, TablesInsert } from 'supabase/database/database.types';

export type Event = Tables<'programs'>;
export type EventInsert = TablesInsert<'programs'>;
export type EventUpdate = Tables<'programs'>;
export type EventDelete = { id: string };
