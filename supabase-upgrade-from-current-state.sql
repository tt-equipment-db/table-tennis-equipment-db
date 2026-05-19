-- Upgrade from the current deployed comments schema.
-- This script is safe to rerun.

-- 1) Remove duplicate old comments before adding the one-IP-one-comment index.
-- Current old rows do not have ip_hash yet, so dedupe by equipment_id + client_id first.
with ranked_comments as (
  select
    id,
    row_number() over (
      partition by equipment_id, client_id
      order by updated_at desc, created_at desc, id desc
    ) as rn
  from public.equipment_comments
)
delete from public.equipment_comments
where id in (
  select id
  from ranked_comments
  where rn > 1
);

-- 2) Add new comment ownership and IP hash fields.
alter table public.equipment_comments
add column if not exists ip_hash text;

alter table public.equipment_comments
add column if not exists edit_token text;

alter table public.equipment_comments
add column if not exists last_edited_at timestamptz;

update public.equipment_comments
set ip_hash = coalesce(ip_hash, client_id),
    edit_token = coalesce(edit_token, client_id)
where ip_hash is null or edit_token is null;

-- 3) Dedupe again by the new target uniqueness rule, then enforce it.
with ranked_comments as (
  select
    id,
    row_number() over (
      partition by equipment_id, ip_hash
      order by updated_at desc, created_at desc, id desc
    ) as rn
  from public.equipment_comments
)
delete from public.equipment_comments
where id in (
  select id
  from ranked_comments
  where rn > 1
);

alter table public.equipment_comments
alter column ip_hash set not null;

alter table public.equipment_comments
alter column edit_token set not null;

drop index if exists public.equipment_comments_equipment_ip_hash_unique;

create unique index equipment_comments_equipment_ip_hash_unique
on public.equipment_comments (equipment_id, ip_hash);

create index if not exists equipment_comments_equipment_updated_idx
on public.equipment_comments (equipment_id, updated_at desc);

-- 4) Update comment policies for editable one-comment-per-IP behavior.
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
using (last_edited_at is null or last_edited_at < now() - interval '1 hour')
with check (char_length(content) between 1 and 60);

drop policy if exists "recent comments can be deleted" on public.equipment_comments;
drop policy if exists "comments can be deleted by edit token" on public.equipment_comments;
create policy "comments can be deleted by edit token"
on public.equipment_comments
for delete
using (true);

-- 5) Add comment votes.
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

-- 6) Convert old 1..10 rating values to the new -5..+5 tendency axis.
-- The database may be in a half-upgraded state if an earlier run failed, so drop
-- all rating CHECK constraints first, convert columns independently, then add
-- the final checks back.
do $$
declare
  col text;
  constraint_name text;
  has_old_values boolean;
begin
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.equipment_ratings'::regclass
      and contype = 'c'
  loop
    execute format(
      'alter table public.equipment_ratings drop constraint if exists %I',
      constraint_name
    );
  end loop;

  foreach col in array array[
    'weight', 'hardness', 'release', 'spin', 'speed', 'arc', 'power',
    'deformation', 'feedback', 'quick_block', 'power_threshold',
    'control_feel', 'short_game', 'defense', 'balance', 'defense_borrow',
    'second_bounce', 'topsheet_life', 'sponge_life'
  ]
  loop
    execute format(
      'select exists (select 1 from public.equipment_ratings where %I > 5 limit 1)',
      col
    )
    into has_old_values;

    if has_old_values then
      execute format(
        'update public.equipment_ratings set %I = %I - 5 where %I between 1 and 10',
        col, col, col
      );
    end if;
  end loop;

  foreach col in array array[
    'weight', 'hardness', 'release', 'spin', 'speed', 'arc', 'power',
    'deformation', 'feedback', 'quick_block', 'power_threshold',
    'control_feel', 'short_game', 'defense', 'balance', 'defense_borrow',
    'second_bounce', 'topsheet_life', 'sponge_life'
  ]
  loop
    execute format(
      'alter table public.equipment_ratings add constraint equipment_ratings_%I_check check (%I between -5 and 5)',
      col, col
    );
  end loop;
end $$;
