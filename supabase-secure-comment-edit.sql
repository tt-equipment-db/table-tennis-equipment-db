-- Harden short comments after the first comments migration.
-- Run this once in Supabase SQL Editor. It is safe to rerun.

alter table public.equipment_comments enable row level security;

revoke select (edit_token) on public.equipment_comments from anon;
revoke select (edit_token) on public.equipment_comments from authenticated;

grant select (
  id,
  equipment_id,
  client_id,
  ip_prefix,
  content,
  created_at,
  updated_at,
  last_edited_at
) on public.equipment_comments to anon;

grant insert (
  equipment_id,
  client_id,
  ip_prefix,
  ip_hash,
  edit_token,
  content
) on public.equipment_comments to anon;

grant update (
  content,
  updated_at,
  last_edited_at
) on public.equipment_comments to anon;

grant delete on public.equipment_comments to anon;

drop policy if exists "comments are readable" on public.equipment_comments;
create policy "comments are readable"
on public.equipment_comments
for select
using (true);

drop policy if exists "anonymous visitors can insert comments" on public.equipment_comments;
create policy "anonymous visitors can insert comments"
on public.equipment_comments
for insert
with check (char_length(content) between 1 and 60);

drop policy if exists "recent comments can be updated" on public.equipment_comments;
drop policy if exists "comments can be updated hourly" on public.equipment_comments;
create policy "comments can be updated hourly"
on public.equipment_comments
for update
using (
  edit_token = coalesce(nullif(current_setting('request.headers', true), '')::jsonb ->> 'x-edit-token', '')
  and (last_edited_at is null or last_edited_at < now() - interval '1 hour')
)
with check (
  char_length(content) between 1 and 60
  and last_edited_at is not null
  and last_edited_at >= now() - interval '5 minutes'
);

drop policy if exists "recent comments can be deleted" on public.equipment_comments;
drop policy if exists "comments can be deleted by edit token" on public.equipment_comments;
create policy "comments can be deleted by edit token"
on public.equipment_comments
for delete
using (
  edit_token = coalesce(nullif(current_setting('request.headers', true), '')::jsonb ->> 'x-edit-token', '')
);

grant delete on public.equipment_comment_votes to anon;

drop policy if exists "anonymous visitors can delete own comment votes" on public.equipment_comment_votes;
create policy "anonymous visitors can delete own comment votes"
on public.equipment_comment_votes
for delete
using (true);
