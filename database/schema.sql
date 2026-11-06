-- LumenCo authenticated backend. Apply as a Supabase migration.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (char_length(username) between 3 and 24),
  display_name text not null check (char_length(display_name) between 2 and 40),
  bio text not null default '' check (char_length(bio) <= 160),
  avatar_item text,
  tag_item text,
  frame_item text,
  premium_item text,
  premium_until timestamptz,
  xp integer not null default 0 check (xp >= 0),
  coins integer not null default 2100 check (coins >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 48),
  template text not null default 'blank' check (template in ('blank','portfolio','webapp')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  path text not null check (char_length(path) between 1 and 240),
  kind text not null check (kind in ('file','folder')),
  content text not null default '',
  updated_at timestamptz not null default now(),
  check (path !~ '(^/|(^|/)\.\.?(/|$))'),
  unique(project_id, path)
);

create table if not exists lessons (
  id text primary key,
  title text not null,
  track text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  level text not null,
  xp_reward integer not null check (xp_reward >= 0),
  coin_reward integer not null check (coin_reward >= 0),
  published boolean not null default false
);

create table if not exists lesson_completions (
  profile_id uuid not null references profiles(id) on delete cascade,
  lesson_id text not null references lessons(id),
  completed_at timestamptz not null default now(),
  primary key(profile_id, lesson_id)
);

create table if not exists shop_items (
  id text primary key,
  name text not null,
  category text not null,
  emoji text not null,
  description text not null,
  kind text not null check (kind in ('avatar','tag','frame','subscription')),
  coin_price integer not null check (coin_price > 0),
  duration_days integer check (duration_days is null or duration_days > 0),
  active boolean not null default true
);

create table if not exists inventory (
  profile_id uuid not null references profiles(id) on delete cascade,
  item_id text not null references shop_items(id),
  purchased_at timestamptz not null default now(),
  primary key(profile_id, item_id)
);

create table if not exists coin_ledger (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  delta integer not null check (delta <> 0),
  reason text not null,
  reference_id text,
  created_at timestamptz not null default now(),
  unique(profile_id, reason, reference_id)
);

create index if not exists projects_owner_updated_idx on projects(owner_id, updated_at desc);
create index if not exists project_files_project_path_idx on project_files(project_id, path);
create index if not exists coin_ledger_profile_created_idx on coin_ledger(profile_id, created_at desc);

insert into lessons(id, title, track, duration_minutes, level, xp_reward, coin_reward, published) values
  ('html-structure', 'HTML: page structure', 'HTML foundations', 12, 'Beginner', 50, 80, true),
  ('css-layout', 'CSS: balanced layouts', 'CSS design', 18, 'Beginner', 60, 90, true),
  ('js-dom', 'JavaScript: work with a page', 'JavaScript', 22, 'Intermediate', 80, 120, true),
  ('project-structure', 'Plan your project folders', 'Code architecture', 20, 'Intermediate', 90, 140, true),
  ('node-api', 'Node.js: your first API', 'Backend', 28, 'Intermediate', 110, 170, true),
  ('git-save', 'Git: save your changes', 'Git & teamwork', 15, 'Beginner', 70, 100, true)
on conflict (id) do update set title = excluded.title, track = excluded.track,
  duration_minutes = excluded.duration_minutes, level = excluded.level,
  xp_reward = excluded.xp_reward,
  coin_reward = excluded.coin_reward, published = excluded.published;

insert into shop_items(id, name, category, emoji, description, kind, coin_price, duration_days, active) values
  ('avatar-comet', 'Comet', 'Avatar', '☄️', 'A quick spark for your profile.', 'avatar', 260, null, true),
  ('avatar-cobalt', 'Cobalt', 'Avatar', '🔷', 'A calm shade with a bold look.', 'avatar', 340, null, true),
  ('tag-clean-code', 'Clean coder', 'Name tag', '✳', 'For people who love tidy code.', 'tag', 420, null, true),
  ('tag-night-owl', 'Night owl', 'Name tag', '🌙', 'For the late-night builders.', 'tag', 500, null, true),
  ('frame-orbit', 'Orbit frame', 'Profile frame', '◎', 'Give your profile an orbital edge.', 'frame', 680, null, true),
  ('premium-month', 'Lumen Plus · 1 month', 'Subscription', '✦', 'All learning paths and a larger workspace.', 'subscription', 2400, 30, true),
  ('premium-season', 'Lumen Plus · 3 months', 'Subscription', '✹', 'Three months of Plus access.', 'subscription', 6200, 90, true)
on conflict (id) do update set name = excluded.name, category = excluded.category,
  emoji = excluded.emoji, description = excluded.description, kind = excluded.kind,
  coin_price = excluded.coin_price, duration_days = excluded.duration_days, active = excluded.active;

-- Coin balansini mijoz bevosita o‘zgartirmaydi. Mukofot va xaridlar quyidagi
-- tranzaksiyali RPC funksiyalari orqali serverda qayd qilinadi.
alter table profiles enable row level security;
alter table projects enable row level security;
alter table project_files enable row level security;
alter table lessons enable row level security;
alter table lesson_completions enable row level security;
alter table shop_items enable row level security;
alter table inventory enable row level security;
alter table coin_ledger enable row level security;

create policy "profiles are private to their owner" on profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "users can create their own profile" on profiles
  for insert to authenticated with check (id = (select auth.uid()));
create policy "users can edit their own profile" on profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "projects belong to their owner" on projects
  for all to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "project files belong to their owner" on project_files
  for all to authenticated using (
    exists (select 1 from projects where projects.id = project_id and projects.owner_id = (select auth.uid()))
  ) with check (
    exists (select 1 from projects where projects.id = project_id and projects.owner_id = (select auth.uid()))
  );
create policy "published lessons are readable" on lessons
  for select to authenticated using (published);
create policy "users can read their lesson progress" on lesson_completions
  for select to authenticated using (profile_id = (select auth.uid()));
create policy "active shop items are readable" on shop_items
  for select to authenticated using (active);
create policy "users can read their inventory" on inventory
  for select to authenticated using (profile_id = (select auth.uid()));
create policy "users can read their coin history" on coin_ledger
  for select to authenticated using (profile_id = (select auth.uid()));

-- Table grants limit profile writes to public fields and prevent client-side
-- updates to coins and XP. Supabase service-role code can run these RPCs.
revoke all on profiles from anon, authenticated;
grant select on profiles to authenticated;
grant insert (id, username, display_name, bio) on profiles to authenticated;
grant update (username, display_name, bio) on profiles to authenticated;
revoke all on projects, project_files, lessons, lesson_completions, shop_items, inventory, coin_ledger from anon, authenticated;
grant select, insert, update, delete on projects, project_files to authenticated;
grant select on lessons, shop_items, lesson_completions, inventory, coin_ledger to authenticated;
revoke insert, update, delete on lessons, shop_items, lesson_completions, inventory, coin_ledger from anon, authenticated;

create schema if not exists lumenco_private;
revoke all on schema lumenco_private from public, anon, authenticated;
grant usage on schema lumenco_private to authenticated;

create or replace function lumenco_private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_base text;
  v_username text;
  v_display_name text;
begin
  v_base := regexp_replace(lower(coalesce(new.raw_user_meta_data ->> 'username', split_part(coalesce(new.email, ''), '@', 1))), '[^a-z0-9._]', '', 'g');
  if char_length(v_base) < 3 then v_base := 'builder'; end if;
  v_username := left(v_base, 24);
  v_display_name := left(coalesce(nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(coalesce(new.email, ''), '@', 1), 'Builder'), 40);
  insert into public.profiles(id, username, display_name, bio)
    values (new.id, v_username, v_display_name, 'Building one project at a time.')
    on conflict do nothing;
  if not found then
    v_username := left(v_base, 14) || '_' || left(replace(new.id::text, '-', ''), 8);
    insert into public.profiles(id, username, display_name, bio)
      values (new.id, v_username, v_display_name, 'Building one project at a time.')
      on conflict do nothing;
  end if;
  if found then
    insert into public.coin_ledger(profile_id, delta, reason, reference_id)
      values (new.id, 2100, 'welcome_bonus', new.id::text);
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function lumenco_private.handle_new_user();
revoke all on function lumenco_private.handle_new_user() from public, anon, authenticated;

create or replace function lumenco_private.complete_lesson(p_lesson_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_lesson public.lessons%rowtype;
  v_balance integer;
begin
  if v_user_id is null then raise exception 'authentication_required'; end if;
  select * into v_lesson from public.lessons where id = p_lesson_id and published;
  if not found then raise exception 'lesson_not_found'; end if;
  perform 1 from public.profiles where id = v_user_id for update;
  if not found then raise exception 'profile_not_found'; end if;
  insert into public.lesson_completions(profile_id, lesson_id)
  values (v_user_id, p_lesson_id)
  on conflict do nothing;
  if not found then raise exception 'lesson_already_completed'; end if;
  update public.profiles set xp = xp + v_lesson.xp_reward, coins = coins + v_lesson.coin_reward, updated_at = now()
    where id = v_user_id returning coins into v_balance;
  insert into public.coin_ledger(profile_id, delta, reason, reference_id)
    values (v_user_id, v_lesson.coin_reward, 'lesson_complete', p_lesson_id);
  return jsonb_build_object('coins', v_balance, 'xp_reward', v_lesson.xp_reward, 'coin_reward', v_lesson.coin_reward);
end;
$$;

create or replace function lumenco_private.purchase_shop_item(p_item_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_item public.shop_items%rowtype;
  v_balance integer;
  v_expiry timestamptz;
begin
  if v_user_id is null then raise exception 'authentication_required'; end if;
  select * into v_item from public.shop_items where id = p_item_id and active;
  if not found then raise exception 'shop_item_not_found'; end if;
  select coins, premium_until into v_balance, v_expiry from public.profiles where id = v_user_id for update;
  if not found then raise exception 'profile_not_found'; end if;
  if v_balance < v_item.coin_price then raise exception 'insufficient_coins'; end if;
  if v_item.kind = 'subscription' then
    update public.profiles set premium_item = p_item_id,
      premium_until = greatest(coalesce(v_expiry, now()), now()) + make_interval(days => v_item.duration_days),
      coins = coins - v_item.coin_price, updated_at = now()
      where id = v_user_id returning coins into v_balance;
  else
    insert into public.inventory(profile_id, item_id) values (v_user_id, p_item_id) on conflict do nothing;
    if not found then raise exception 'item_already_owned'; end if;
    update public.profiles set coins = coins - v_item.coin_price, updated_at = now()
      where id = v_user_id returning coins into v_balance;
    if v_item.kind = 'avatar' then update public.profiles set avatar_item = p_item_id where id = v_user_id; end if;
    if v_item.kind = 'tag' then update public.profiles set tag_item = p_item_id where id = v_user_id; end if;
    if v_item.kind = 'frame' then update public.profiles set frame_item = p_item_id where id = v_user_id; end if;
  end if;
  insert into public.coin_ledger(profile_id, delta, reason, reference_id)
    values (v_user_id, -v_item.coin_price, 'shop_purchase', p_item_id || ':' || gen_random_uuid()::text);
  return jsonb_build_object('coins', v_balance, 'item_id', p_item_id, 'premium_until', (select premium_until from public.profiles where id = v_user_id));
end;
$$;

create or replace function lumenco_private.equip_shop_item(p_item_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_item public.shop_items%rowtype;
begin
  if v_user_id is null then raise exception 'authentication_required'; end if;
  select si.* into v_item from public.shop_items si
    join public.inventory i on i.item_id = si.id
    where si.id = p_item_id and i.profile_id = v_user_id;
  if not found then raise exception 'item_not_owned'; end if;
  if v_item.kind = 'avatar' then update public.profiles set avatar_item = p_item_id, updated_at = now() where id = v_user_id; end if;
  if v_item.kind = 'tag' then update public.profiles set tag_item = p_item_id, updated_at = now() where id = v_user_id; end if;
  if v_item.kind = 'frame' then update public.profiles set frame_item = p_item_id, updated_at = now() where id = v_user_id; end if;
  if v_item.kind = 'subscription' then raise exception 'subscription_is_not_equippable'; end if;
  return jsonb_build_object('item_id', p_item_id, 'kind', v_item.kind);
end;
$$;

grant execute on function lumenco_private.complete_lesson(text) to authenticated;
grant execute on function lumenco_private.purchase_shop_item(text) to authenticated;
grant execute on function lumenco_private.equip_shop_item(text) to authenticated;
revoke all on function lumenco_private.complete_lesson(text) from public, anon;
revoke all on function lumenco_private.purchase_shop_item(text) from public, anon;
revoke all on function lumenco_private.equip_shop_item(text) from public, anon;

-- These invoker wrappers form the narrow API surface while privileged logic
-- stays in the non-exposed schema above.
create or replace function public.complete_lesson(p_lesson_id text)
returns jsonb language sql security invoker set search_path = ''
as $$ select lumenco_private.complete_lesson(p_lesson_id); $$;
create or replace function public.purchase_shop_item(p_item_id text)
returns jsonb language sql security invoker set search_path = ''
as $$ select lumenco_private.purchase_shop_item(p_item_id); $$;
create or replace function public.equip_shop_item(p_item_id text)
returns jsonb language sql security invoker set search_path = ''
as $$ select lumenco_private.equip_shop_item(p_item_id); $$;

revoke all on function public.complete_lesson(text) from public, anon, authenticated;
revoke all on function public.purchase_shop_item(text) from public, anon, authenticated;
revoke all on function public.equip_shop_item(text) from public, anon, authenticated;
grant execute on function public.complete_lesson(text) to authenticated;
grant execute on function public.purchase_shop_item(text) to authenticated;
grant execute on function public.equip_shop_item(text) to authenticated;

create index if not exists inventory_item_idx on inventory(item_id);
create index if not exists lesson_completions_lesson_idx on lesson_completions(lesson_id);

