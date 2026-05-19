create table if not exists public.equipment_ratings (
  id uuid primary key default gen_random_uuid(),
  equipment_id text not null,
  client_id text not null,
  weight int check (weight between 1 and 10),
  hardness int check (hardness between 1 and 10),
  release int check (release between 1 and 10),
  spin int check (spin between 1 and 10),
  speed int check (speed between 1 and 10),
  arc int check (arc between 1 and 10),
  power int check (power between 1 and 10),
  deformation int check (deformation between 1 and 10),
  feedback int check (feedback between 1 and 10),
  quick_block int check (quick_block between 1 and 10),
  power_threshold int check (power_threshold between 1 and 10),
  control_feel int check (control_feel between 1 and 10),
  short_game int check (short_game between 1 and 10),
  defense int check (defense between 1 and 10),
  balance int check (balance between 1 and 10),
  defense_borrow int check (defense_borrow between 1 and 10),
  second_bounce int check (second_bounce between 1 and 10),
  topsheet_life int check (topsheet_life between 1 and 10),
  sponge_life int check (sponge_life between 1 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (equipment_id, client_id)
);

alter table public.equipment_ratings enable row level security;

grant usage on schema public to anon;
grant select, insert, update on public.equipment_ratings to anon;

create policy "ratings are readable"
on public.equipment_ratings
for select
using (true);

create policy "anonymous visitors can insert ratings"
on public.equipment_ratings
for insert
with check (true);

create policy "anonymous visitors can update ratings"
on public.equipment_ratings
for update
using (true)
with check (true);

create table if not exists public.equipment_comments (
  id uuid primary key default gen_random_uuid(),
  equipment_id text not null,
  client_id text not null,
  ip_prefix text not null,
  content text not null check (char_length(content) between 1 and 60),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists equipment_comments_equipment_created_idx
on public.equipment_comments (equipment_id, created_at desc);

alter table public.equipment_comments enable row level security;

grant select, insert, update, delete on public.equipment_comments to anon;

create policy "comments are readable"
on public.equipment_comments
for select
using (true);

create policy "anonymous visitors can insert comments"
on public.equipment_comments
for insert
with check (char_length(content) between 1 and 60);

create policy "recent comments can be updated"
on public.equipment_comments
for update
using (created_at > now() - interval '5 minutes')
with check (char_length(content) between 1 and 60);

create policy "recent comments can be deleted"
on public.equipment_comments
for delete
using (created_at > now() - interval '5 minutes');
