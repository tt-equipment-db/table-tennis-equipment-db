-- Add booster rating dimensions and community price ratings.
-- Safe to rerun.

alter table public.equipment_ratings
add column if not exists user_price int;

alter table public.equipment_ratings
add column if not exists softening int;

alter table public.equipment_ratings
add column if not exists elasticity_boost int;

alter table public.equipment_ratings
add column if not exists drying_speed int;

alter table public.equipment_ratings
add column if not exists duration_score int;

alter table public.equipment_ratings
drop constraint if exists equipment_ratings_user_price_check;

alter table public.equipment_ratings
drop constraint if exists equipment_ratings_softening_check;

alter table public.equipment_ratings
drop constraint if exists equipment_ratings_elasticity_boost_check;

alter table public.equipment_ratings
drop constraint if exists equipment_ratings_drying_speed_check;

alter table public.equipment_ratings
drop constraint if exists equipment_ratings_duration_score_check;

alter table public.equipment_ratings
add constraint equipment_ratings_user_price_check
check (user_price is null or user_price between 0 and 2000);

alter table public.equipment_ratings
add constraint equipment_ratings_softening_check
check (softening is null or softening between 0 and 5);

alter table public.equipment_ratings
add constraint equipment_ratings_elasticity_boost_check
check (elasticity_boost is null or elasticity_boost between 0 and 5);

alter table public.equipment_ratings
add constraint equipment_ratings_drying_speed_check
check (drying_speed is null or drying_speed between 0 and 5);

alter table public.equipment_ratings
add constraint equipment_ratings_duration_score_check
check (duration_score is null or duration_score between 0 and 5);
