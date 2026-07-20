-- Expand community price storage for blade ratings.
-- Safe to rerun after supabase-add-boosters-ratings.sql.

alter table public.equipment_ratings
drop constraint if exists equipment_ratings_user_price_check;

alter table public.equipment_ratings
add constraint equipment_ratings_user_price_check
check (user_price is null or user_price between 0 and 2000);
