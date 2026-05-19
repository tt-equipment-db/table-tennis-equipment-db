create table if not exists public.equipment_comments (
  id uuid primary key default gen_random_uuid(),
  equipment_id text not null,
  client_id text not null,
  ip_prefix text not null,
  ip_hash text not null,
  edit_token text not null,
  content text not null check (char_length(content) between 1 and 60),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_edited_at timestamptz
);

create index if not exists equipment_comments_equipment_created_idx
on public.equipment_comments (equipment_id, created_at desc);

create index if not exists equipment_comments_equipment_updated_idx
on public.equipment_comments (equipment_id, updated_at desc);

create unique index if not exists equipment_comments_equipment_ip_hash_unique
on public.equipment_comments (equipment_id, ip_hash);

alter table public.equipment_comments enable row level security;

grant select, insert, update, delete on public.equipment_comments to anon;

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

drop policy if exists "comments can be updated hourly" on public.equipment_comments;
create policy "comments can be updated hourly"
on public.equipment_comments
for update
using (last_edited_at is null or last_edited_at < now() - interval '1 hour')
with check (char_length(content) between 1 and 60);

drop policy if exists "comments can be deleted by edit token" on public.equipment_comments;
create policy "comments can be deleted by edit token"
on public.equipment_comments
for delete
using (true);

create table if not exists public.equipment_comment_votes (
  comment_id uuid not null references public.equipment_comments(id) on delete cascade,
  client_id text not null,
  vote int not null check (vote in (-1, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (comment_id, client_id)
);

alter table public.equipment_comment_votes enable row level security;

grant select, insert, update on public.equipment_comment_votes to anon;

drop policy if exists "comment votes are readable" on public.equipment_comment_votes;
create policy "comment votes are readable"
on public.equipment_comment_votes
for select
using (true);

drop policy if exists "anonymous visitors can insert comment votes" on public.equipment_comment_votes;
create policy "anonymous visitors can insert comment votes"
on public.equipment_comment_votes
for insert
with check (vote in (-1, 1));

drop policy if exists "anonymous visitors can update comment votes" on public.equipment_comment_votes;
create policy "anonymous visitors can update comment votes"
on public.equipment_comment_votes
for update
using (true)
with check (vote in (-1, 1));
