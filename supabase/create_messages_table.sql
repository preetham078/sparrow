-- Run this in Supabase SQL editor to create the messages table
create table if not exists public.messages (
  id bigserial primary key,
  "user" text,
  text text,
  time timestamptz default now()
);

-- Add RLS policy if you want auth-based access. For public anon insert, allow inserts from anon key:
-- grant insert, select on public.messages to authenticated;
