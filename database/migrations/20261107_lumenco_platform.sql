-- LumenCo access, plans, curriculum and moderation hardening.
-- Safe to run against the original LumenCo schema; no user rows are deleted.
begin;

alter table public.profiles
  add column if not exists role text not null default 'user',
  add column if not exists is_banned boolean not null default false,
  add column if not exists plan text not null default 'free',
  add column if not exists plan_expires_at timestamptz,
  add column if not exists background_item text,
  add column if not exists editor_theme text,
  add column if not exists pet_name text not null default 'Lumi',
  add column if not exists pet_color text not null default 'cyan',
  add column if not exists pet_hat text not null default 'none',
  add column if not exists pet_glasses text not null default 'none',
  add column if not exists show_on_leaderboard boolean not null default true;

alter table public.profiles alter column coins set default 0;
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('user', 'admin'));
alter table public.profiles drop constraint if exists profiles_plan_check;
alter table public.profiles add constraint profiles_plan_check check (plan in ('free', 'pro', 'max'));
alter table public.profiles drop constraint if exists profiles_pet_color_check;
alter table public.profiles add constraint profiles_pet_color_check check (pet_color in ('cyan', 'lime', 'gold', 'purple'));
alter table public.profiles drop constraint if exists profiles_pet_name_check;
alter table public.profiles add constraint profiles_pet_name_check check (char_length(pet_name) between 1 and 20);

alter table public.lessons
  add column if not exists lesson_number integer,
  add column if not exists plan_tier text not null default 'free';
alter table public.lessons drop constraint if exists lessons_plan_tier_check;
alter table public.lessons add constraint lessons_plan_tier_check check (plan_tier in ('free', 'pro', 'max'));
create unique index if not exists lessons_number_unique_idx on public.lessons(lesson_number) where lesson_number is not null;

alter table public.shop_items add column if not exists access_plan text;
alter table public.shop_items drop constraint if exists shop_items_kind_check;
alter table public.shop_items add constraint shop_items_kind_check
  check (kind in ('avatar', 'tag', 'frame', 'background', 'theme', 'pet', 'subscription'));

-- Publish one consistent 350-step course. The original six placeholder seeds are
-- retained for old completion history but hidden from new learners.
update public.lessons set published = false
where id in ('html-structure', 'css-layout', 'js-dom', 'project-structure', 'node-api', 'git-save');

with tracks as (
  select n,
    case when n <= 20 then 'Web Foundations'
         when n <= 50 then 'CSS and Interface Design'
         when n <= 80 then 'JavaScript and Browser APIs'
         when n <= 100 then 'Clean Code and Architecture'
         when n <= 200 then 'AI and Machine Learning'
         else 'Full-stack Engineering and Security' end as track,
    case when n <= 20 then 'free' when n <= 100 then 'pro' else 'max' end as plan_tier,
    case when n <= 20 then 'Medium'
         when n <= 100 then 'Medium → solid'
         else 'Advanced' end as level,
    case when n <= 20 then 50 when n <= 50 then 60 when n <= 80 then 80
         when n <= 100 then 100 when n <= 200 then 150 else 200 end as base_reward
  from generate_series(1, 350) as series(n)
), curated as (
  select * from (values
    (1, 'Build a semantic HTML page'),
    (2, 'Use headings, paragraphs, and links'),
    (3, 'Add images and accessible descriptions'),
    (4, 'Organize lists and data tables'),
    (5, 'Create a form with labels and validation'),
    (6, 'Structure a page with semantic landmarks'),
    (7, 'Set page metadata and a useful title'),
    (8, 'Select elements and apply color tokens'),
    (9, 'Understand the CSS box model'),
    (10, 'Choose readable type and spacing'),
    (11, 'Lay out a page with Flexbox'),
    (12, 'Align and distribute interface elements'),
    (13, 'Create a responsive CSS Grid'),
    (14, 'Build a dashboard with grid areas'),
    (15, 'Reuse values with CSS custom properties'),
    (16, 'Add depth with shadows and gradients'),
    (17, 'Design hover and focus states'),
    (18, 'Adapt a layout for mobile screens'),
    (19, 'Plan a mobile-first interface'),
    (20, 'Ship a small portfolio page'),
    (21, 'Animate interface details with keyframes'),
    (22, 'Use transforms without breaking layout'),
    (23, 'Build layered surfaces with CSS'),
    (24, 'Compose utility classes consistently'),
    (25, 'Use SVG as a crisp interface asset'),
    (35, 'Name components and styles with BEM'),
    (50, 'Ship a responsive landing page'),
    (51, 'Use JavaScript values and types'),
    (52, 'Write functions and understand scope'),
    (53, 'Select and update DOM elements'),
    (54, 'Handle browser events safely'),
    (55, 'Transform data with array methods'),
    (56, 'Store small preferences in localStorage'),
    (65, 'Handle asynchronous work with promises'),
    (70, 'Read JSON from a web API'),
    (75, 'Draw an interactive scene on canvas'),
    (80, 'Split code into JavaScript modules'),
    (81, 'Model data with classes and objects'),
    (82, 'Keep each module focused on one job'),
    (83, 'Extend behavior without rewriting stable code'),
    (84, 'Use substitutions that preserve behavior'),
    (85, 'Keep interfaces small and specific'),
    (86, 'Depend on stable abstractions'),
    (90, 'Choose a pattern for a real problem'),
    (95, 'Write focused unit tests'),
    (100, 'Refactor a project into clear layers'),
    (101, 'Explain how a language model produces text'),
    (102, 'Write prompts with clear context and output rules'),
    (110, 'Classify a small dataset in the browser'),
    (130, 'Retrieve trusted context for a generated answer'),
    (150, 'Prepare text data for a language task'),
    (200, 'Design an agent that calls bounded tools'),
    (201, 'Trace a Node.js request through the event loop'),
    (210, 'Design a versioned REST API'),
    (225, 'Model relational data with PostgreSQL'),
    (250, 'Protect sessions and validate access tokens'),
    (280, 'Deliver updates over a WebSocket connection'),
    (310, 'Prevent injection and cross-site attacks'),
    (330, 'Package an app and automate delivery'),
    (350, 'Design a resilient full-stack service')
  ) as t(n, title)
)
insert into public.lessons(id, title, track, duration_minutes, level, xp_reward, coin_reward, published, lesson_number, plan_tier)
select 'lesson-' || tracks.n,
       coalesce(curated.title, tracks.track || ': practice lab ' || tracks.n),
       tracks.track,
       15 + (tracks.n % 4) * 5,
       tracks.level,
       tracks.base_reward + (tracks.n * 2),
       tracks.base_reward,
       true,
       tracks.n,
       tracks.plan_tier
from tracks left join curated using (n)
on conflict (id) do update set
  title = excluded.title, track = excluded.track, duration_minutes = excluded.duration_minutes,
  level = excluded.level, xp_reward = excluded.xp_reward, coin_reward = excluded.coin_reward,
  published = true, lesson_number = excluded.lesson_number, plan_tier = excluded.plan_tier;

insert into public.shop_items(id, name, category, emoji, description, kind, coin_price, duration_days, active) values
  ('frame-yalpiz', 'Yalpiz', 'Frames', '✦', 'A soft mint glow for your profile.', 'frame', 100, null, true),
  ('frame-okean', 'Okean', 'Frames', '◉', 'A calm blue orbit around your avatar.', 'frame', 150, null, true),
  ('frame-olov', 'Olov', 'Frames', '✹', 'A warm animated edge.', 'frame', 200, null, true),
  ('frame-shafaq', 'Shafaq', 'Frames', '✧', 'A dusk-colored profile frame.', 'frame', 250, null, true),
  ('frame-kiber', 'Kiber', 'Frames', '⌘', 'A bright neon pulse.', 'frame', 300, null, true),
  ('frame-noyob', 'Noyob', 'Frames', '⬡', 'A rare amber frame.', 'frame', 500, null, true),
  ('bg-yalpiz', 'Mint field', 'Backgrounds', '◌', 'A quiet mint profile background.', 'background', 150, null, true),
  ('bg-konfet', 'Soft color', 'Backgrounds', '◌', 'A gentle color field.', 'background', 200, null, true),
  ('bg-shom', 'Dusk', 'Backgrounds', '◌', 'A deep evening gradient.', 'background', 250, null, true),
  ('bg-okean', 'Ocean', 'Backgrounds', '◌', 'A dark blue profile background.', 'background', 250, null, true),
  ('bg-nuqtalar', 'Dots', 'Backgrounds', '◌', 'A measured geometric texture.', 'background', 300, null, true),
  ('bg-ogohlantirish', 'Signal', 'Backgrounds', '◌', 'A bold striped pattern.', 'background', 350, null, true),
  ('bg-tolqinlar', 'Waves', 'Backgrounds', '◌', 'A repeating wave pattern.', 'background', 400, null, true),
  ('bg-laboratoriya', 'Workshop', 'Backgrounds', '◌', 'A subtle code-grid texture.', 'background', 500, null, true),
  ('theme-dracula', 'Dracula', 'Editor themes', '⌘', 'A dark violet editor palette.', 'theme', 100, null, true),
  ('theme-monokai', 'Monokai', 'Editor themes', '⌘', 'A bright, high-contrast palette.', 'theme', 100, null, true),
  ('theme-night-owl', 'Night Owl', 'Editor themes', '⌘', 'A low-glare night palette.', 'theme', 120, null, true),
  ('theme-cobalt2', 'Cobalt', 'Editor themes', '⌘', 'A vivid blue editor palette.', 'theme', 150, null, true),
  ('theme-claude', 'Warm dark', 'Editor themes', '⌘', 'A softer dark palette.', 'theme', 150, null, true),
  ('theme-nord', 'Nord', 'Editor themes', '⌘', 'A cool, muted editor palette.', 'theme', 180, null, true),
  ('theme-github-dark', 'GitHub Dark', 'Editor themes', '⌘', 'A familiar dark coding palette.', 'theme', 180, null, true),
  ('theme-oceanic', 'Oceanic', 'Editor themes', '⌘', 'A deep blue-green palette.', 'theme', 200, null, true),
  ('avatar-cat', 'Pixel cat', 'Avatars', '◈', 'A small pixel companion.', 'avatar', 200, null, true),
  ('avatar-ninja', 'Night runner', 'Avatars', '◈', 'A quiet night-time avatar.', 'avatar', 250, null, true),
  ('avatar-robot', 'Workshop robot', 'Avatars', '◈', 'A little builder avatar.', 'avatar', 300, null, true),
  ('pet-wizard', 'Lumi cap', 'Pet', '✦', 'A wizard hat for Lumi.', 'pet', 150, null, true),
  ('pet-vr', 'Lumi headset', 'Pet', '⌁', 'A headset for Lumi.', 'pet', 150, null, true),
  ('pet-crown', 'Lumi crown', 'Pet', '♛', 'A crown for Lumi.', 'pet', 300, null, true)
on conflict (id) do update set name = excluded.name, category = excluded.category, emoji = excluded.emoji,
  description = excluded.description, kind = excluded.kind, coin_price = excluded.coin_price,
  duration_days = excluded.duration_days, active = true;

create index if not exists profiles_plan_expiry_idx on public.profiles(plan, plan_expires_at);
create index if not exists profiles_leaderboard_idx on public.profiles(xp desc) where show_on_leaderboard and not is_banned;

create or replace function lumenco_private.enforce_project_quota()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare v_is_banned boolean;
begin
  if new.owner_id <> auth.uid() then raise exception 'project_owner_mismatch'; end if;
  select p.is_banned into v_is_banned from public.profiles p where p.id = new.owner_id for update;
  if not found or v_is_banned then raise exception 'account_unavailable'; end if;
  if (select count(*) from public.projects p where p.owner_id = new.owner_id and p.id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)) >= 100 then
    raise exception 'project_limit_reached';
  end if;
  return new;
end;
$$;
revoke all on function lumenco_private.enforce_project_quota() from public, anon, authenticated;
drop trigger if exists projects_quota_guard on public.projects;
create trigger projects_quota_guard before insert on public.projects
for each row execute function lumenco_private.enforce_project_quota();

create or replace function lumenco_private.enforce_project_file_limits()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  v_owner uuid;
  v_is_banned boolean;
  v_file_count integer;
  v_folder_count integer;
  v_bytes integer;
begin
  if new.path ~ '(^/|(^|/)\.\.?(/|$))' or new.path like '%\\%' then raise exception 'invalid_project_path'; end if;
  if octet_length(new.content) > 180000 then raise exception 'file_too_large'; end if;
  select p.owner_id, pr.is_banned into v_owner, v_is_banned
    from public.projects p join public.profiles pr on pr.id = p.owner_id
    where p.id = new.project_id for update of p, pr;
  if not found or v_owner <> auth.uid() or v_is_banned then raise exception 'account_unavailable'; end if;
  select count(*) filter (where f.kind = 'file'), count(*) filter (where f.kind = 'folder'),
         coalesce(sum(octet_length(f.content)) filter (where f.kind = 'file'), 0)
    into v_file_count, v_folder_count, v_bytes
  from public.project_files f where f.project_id = new.project_id and f.id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid);
  if new.kind = 'file' and v_file_count >= 200 then raise exception 'file_limit_reached'; end if;
  if new.kind = 'folder' and v_folder_count >= 100 then raise exception 'folder_limit_reached'; end if;
  if new.kind = 'file' and v_bytes + octet_length(new.content) > 2000000 then raise exception 'project_too_large'; end if;
  return new;
end;
$$;
revoke all on function lumenco_private.enforce_project_file_limits() from public, anon, authenticated;
drop trigger if exists project_files_limits_guard on public.project_files;
create trigger project_files_limits_guard before insert or update on public.project_files
for each row execute function lumenco_private.enforce_project_file_limits();

create or replace function lumenco_private.is_active_user()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.profiles p where p.id = auth.uid() and not p.is_banned); $$;

create or replace function lumenco_private.active_plan()
returns text language sql stable security definer set search_path = ''
as $$
  select case
    when p.role = 'admin' then 'max'
    when p.plan in ('pro', 'max') and p.plan_expires_at > now() then p.plan
    else 'free'
  end
  from public.profiles p where p.id = auth.uid() and not p.is_banned;
$$;

create or replace function lumenco_private.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin' and not p.is_banned); $$;

create or replace function lumenco_private.require_active_user()
returns uuid language plpgsql stable security definer set search_path = ''
as $$
declare v_user uuid := auth.uid();
begin
  if v_user is null then raise exception 'authentication_required'; end if;
  if not exists(select 1 from public.profiles p where p.id = v_user and not p.is_banned) then raise exception 'account_unavailable'; end if;
  return v_user;
end;
$$;

revoke all on function lumenco_private.is_active_user() from public, anon;
revoke all on function lumenco_private.active_plan() from public, anon;
revoke all on function lumenco_private.is_admin() from public, anon;
revoke all on function lumenco_private.require_active_user() from public, anon;
grant usage on schema lumenco_private to authenticated;
grant execute on function lumenco_private.is_active_user() to authenticated;
grant execute on function lumenco_private.active_plan() to authenticated;
grant execute on function lumenco_private.is_admin() to authenticated;

drop policy if exists "profiles are private to their owner" on public.profiles;
drop policy if exists "users can create their own profile" on public.profiles;
drop policy if exists "users can edit their own profile" on public.profiles;
create policy "profiles are private to their active owner" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "users can edit public profile fields" on public.profiles
  for update to authenticated using (id = (select auth.uid()) and lumenco_private.is_active_user())
  with check (id = (select auth.uid()) and lumenco_private.is_active_user());
drop policy if exists "projects belong to their owner" on public.projects;
create policy "active users own their projects" on public.projects
  for all to authenticated using (owner_id = (select auth.uid()) and lumenco_private.is_active_user())
  with check (owner_id = (select auth.uid()) and lumenco_private.is_active_user());
drop policy if exists "project files belong to their owner" on public.project_files;
create policy "active users own project files" on public.project_files
  for all to authenticated using (
    lumenco_private.is_active_user() and exists(select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  ) with check (
    lumenco_private.is_active_user() and exists(select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
  );
drop policy if exists "published lessons are readable" on public.lessons;
create policy "active users can read published lessons" on public.lessons
  for select to authenticated using (published and lumenco_private.is_active_user());
drop policy if exists "users can read their lesson progress" on public.lesson_completions;
create policy "active users can read their lesson progress" on public.lesson_completions
  for select to authenticated using (profile_id = (select auth.uid()) and lumenco_private.is_active_user());
drop policy if exists "active shop items are readable" on public.shop_items;
create policy "active users can read shop items" on public.shop_items
  for select to authenticated using (active and lumenco_private.is_active_user());
drop policy if exists "users can read their inventory" on public.inventory;
create policy "active users can read their inventory" on public.inventory
  for select to authenticated using (profile_id = (select auth.uid()) and lumenco_private.is_active_user());
drop policy if exists "users can read their coin history" on public.coin_ledger;
create policy "active users can read their coin history" on public.coin_ledger
  for select to authenticated using (profile_id = (select auth.uid()) and lumenco_private.is_active_user());

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant insert (id, username, display_name, bio) on public.profiles to authenticated;
grant update (username, display_name, bio) on public.profiles to authenticated;
revoke insert, update, delete on public.projects, public.project_files from anon, authenticated;
grant select, insert, update, delete on public.projects, public.project_files to authenticated;
revoke all on public.lessons, public.lesson_completions, public.shop_items, public.inventory, public.coin_ledger from anon, authenticated;
grant select on public.lessons, public.shop_items, public.lesson_completions, public.inventory, public.coin_ledger to authenticated;

create or replace function lumenco_private.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
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
  return new;
end;
$$;
revoke all on function lumenco_private.handle_new_user() from public, anon, authenticated;

create or replace function lumenco_private.complete_lesson(p_lesson_id text)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  v_user_id uuid := lumenco_private.require_active_user();
  v_lesson public.lessons%rowtype;
  v_plan text := coalesce(lumenco_private.active_plan(), 'free');
  v_limit integer;
  v_count integer;
  v_balance integer;
begin
  select case v_plan when 'max' then 350 when 'pro' then 100 else 20 end into v_limit;
  select * into v_lesson from public.lessons where id = p_lesson_id and published;
  if not found then raise exception 'lesson_not_found'; end if;
  if v_lesson.lesson_number is null or v_lesson.lesson_number > v_limit then raise exception 'plan_upgrade_required'; end if;
  perform 1 from public.profiles where id = v_user_id for update;
  if not found then raise exception 'profile_not_found'; end if;
  select count(*) into v_count from public.lesson_completions where profile_id = v_user_id;
  if v_count >= v_limit then raise exception 'lesson_limit_reached'; end if;
  insert into public.lesson_completions(profile_id, lesson_id) values (v_user_id, p_lesson_id) on conflict do nothing;
  if not found then raise exception 'lesson_already_completed'; end if;
  update public.profiles set xp = xp + v_lesson.xp_reward, coins = coins + v_lesson.coin_reward, updated_at = now()
    where id = v_user_id returning coins into v_balance;
  insert into public.coin_ledger(profile_id, delta, reason, reference_id)
    values (v_user_id, v_lesson.coin_reward, 'lesson_complete', p_lesson_id);
  return jsonb_build_object('coins', v_balance, 'xp_reward', v_lesson.xp_reward, 'coin_reward', v_lesson.coin_reward, 'plan', v_plan);
end;
$$;

create or replace function lumenco_private.purchase_shop_item(p_item_id text)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  v_user_id uuid := lumenco_private.require_active_user();
  v_item public.shop_items%rowtype;
  v_balance integer;
begin
  select * into v_item from public.shop_items where id = p_item_id and active;
  if not found then raise exception 'shop_item_not_found'; end if;
  select coins into v_balance from public.profiles where id = v_user_id for update;
  if v_balance < v_item.coin_price then raise exception 'insufficient_coins'; end if;
  if v_item.kind = 'subscription' then raise exception 'use_plan_checkout'; end if;
  insert into public.inventory(profile_id, item_id) values (v_user_id, p_item_id) on conflict do nothing;
  if not found then raise exception 'item_already_owned'; end if;
  update public.profiles set coins = coins - v_item.coin_price, updated_at = now() where id = v_user_id returning coins into v_balance;
  if v_item.kind = 'avatar' then update public.profiles set avatar_item = p_item_id where id = v_user_id; end if;
  if v_item.kind = 'tag' then update public.profiles set tag_item = p_item_id where id = v_user_id; end if;
  if v_item.kind = 'frame' then update public.profiles set frame_item = p_item_id where id = v_user_id; end if;
  if v_item.kind = 'background' then update public.profiles set background_item = p_item_id where id = v_user_id; end if;
  if v_item.kind = 'theme' then update public.profiles set editor_theme = p_item_id where id = v_user_id; end if;
  insert into public.coin_ledger(profile_id, delta, reason, reference_id)
    values (v_user_id, -v_item.coin_price, 'shop_purchase', p_item_id || ':' || gen_random_uuid()::text);
  return jsonb_build_object('coins', v_balance, 'item_id', p_item_id);
end;
$$;

create or replace function lumenco_private.equip_shop_item(p_item_id text)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  v_user_id uuid := lumenco_private.require_active_user();
  v_item public.shop_items%rowtype;
begin
  select si.* into v_item from public.shop_items si join public.inventory i on i.item_id = si.id
    where si.id = p_item_id and i.profile_id = v_user_id;
  if not found then raise exception 'item_not_owned'; end if;
  if v_item.kind = 'avatar' then update public.profiles set avatar_item = p_item_id, updated_at = now() where id = v_user_id; end if;
  if v_item.kind = 'tag' then update public.profiles set tag_item = p_item_id, updated_at = now() where id = v_user_id; end if;
  if v_item.kind = 'frame' then update public.profiles set frame_item = p_item_id, updated_at = now() where id = v_user_id; end if;
  if v_item.kind = 'background' then update public.profiles set background_item = p_item_id, updated_at = now() where id = v_user_id; end if;
  if v_item.kind = 'theme' then update public.profiles set editor_theme = p_item_id, updated_at = now() where id = v_user_id; end if;
  if v_item.kind = 'pet' then
    update public.profiles set
      pet_hat = case when p_item_id = 'pet-wizard' then 'wizard' when p_item_id = 'pet-crown' then 'crown' else pet_hat end,
      pet_glasses = case when p_item_id = 'pet-vr' then 'vr' else pet_glasses end,
      updated_at = now() where id = v_user_id;
  end if;
  if v_item.kind = 'subscription' then raise exception 'subscription_is_not_equippable'; end if;
  return jsonb_build_object('item_id', p_item_id, 'kind', v_item.kind);
end;
$$;

create or replace function lumenco_private.subscribe_plan(p_plan text)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  v_user_id uuid := lumenco_private.require_active_user();
  v_price integer;
  v_balance integer;
  v_expiry timestamptz;
begin
  if p_plan = 'pro' then v_price := 900;
  elsif p_plan = 'max' then v_price := 3000;
  else raise exception 'invalid_plan'; end if;
  select coins, plan_expires_at into v_balance, v_expiry from public.profiles where id = v_user_id for update;
  if v_balance < v_price then raise exception 'insufficient_coins'; end if;
  update public.profiles set plan = p_plan,
    plan_expires_at = greatest(coalesce(plan_expires_at, now()), now()) + interval '30 days',
    coins = coins - v_price, updated_at = now()
    where id = v_user_id returning coins, plan_expires_at into v_balance, v_expiry;
  insert into public.coin_ledger(profile_id, delta, reason, reference_id)
    values (v_user_id, -v_price, 'plan_subscription', p_plan || ':' || gen_random_uuid()::text);
  return jsonb_build_object('plan', p_plan, 'coins', v_balance, 'expires_at', v_expiry);
end;
$$;

create or replace function lumenco_private.save_pet_config(p_name text, p_color text)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare v_user_id uuid := lumenco_private.require_active_user();
begin
  if coalesce(lumenco_private.active_plan(), 'free') <> 'max' then raise exception 'max_plan_required'; end if;
  if p_name is null or char_length(btrim(p_name)) < 1 or char_length(btrim(p_name)) > 20 then raise exception 'invalid_pet_name'; end if;
  if p_color is null or p_color not in ('cyan', 'lime', 'gold', 'purple') then raise exception 'invalid_pet_color'; end if;
  update public.profiles set pet_name = btrim(p_name), pet_color = p_color, updated_at = now() where id = v_user_id;
  return jsonb_build_object('name', btrim(p_name), 'color', p_color);
end;
$$;

create or replace function lumenco_private.admin_list_users()
returns table(id uuid, name text, username text, email text, role text, plan text, coins integer, xp integer, is_banned boolean, created_at timestamptz)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not lumenco_private.is_admin() then raise exception 'admin_required'; end if;
  return query select p.id, p.display_name, p.username, u.email,
    p.role,
    case when p.role = 'admin' then 'max' when p.plan <> 'free' and p.plan_expires_at > now() then p.plan else 'free' end,
    p.coins, p.xp, p.is_banned, p.created_at
  from public.profiles p join auth.users u on u.id = p.id
  order by p.created_at desc limit 200;
end;
$$;

create or replace function lumenco_private.admin_set_ban(p_user_id uuid, p_is_banned boolean)
returns jsonb language plpgsql security definer set search_path = ''
as $$
begin
  if not lumenco_private.is_admin() then raise exception 'admin_required'; end if;
  if p_user_id is null or p_is_banned is null then raise exception 'invalid_ban_request'; end if;
  if p_user_id = auth.uid() then raise exception 'cannot_change_own_access'; end if;
  update public.profiles set is_banned = p_is_banned, updated_at = now() where id = p_user_id;
  if not found then raise exception 'user_not_found'; end if;
  return jsonb_build_object('user_id', p_user_id, 'is_banned', p_is_banned);
end;
$$;

create or replace function lumenco_private.admin_set_plan(p_user_id uuid, p_plan text)
returns jsonb language plpgsql security definer set search_path = ''
as $$
begin
  if not lumenco_private.is_admin() then raise exception 'admin_required'; end if;
  if p_user_id is null or p_plan is null or p_plan not in ('free', 'pro', 'max') then raise exception 'invalid_plan'; end if;
  update public.profiles set plan = p_plan,
    plan_expires_at = case when p_plan = 'free' then null else now() + interval '30 days' end,
    updated_at = now() where id = p_user_id;
  if not found then raise exception 'user_not_found'; end if;
  return jsonb_build_object('user_id', p_user_id, 'plan', p_plan);
end;
$$;

create or replace function lumenco_private.admin_adjust_coins(p_user_id uuid, p_amount integer)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare v_balance integer;
begin
  if not lumenco_private.is_admin() then raise exception 'admin_required'; end if;
  if p_user_id is null or p_amount is null or p_amount < 1 or p_amount > 5000 then raise exception 'invalid_amount'; end if;
  update public.profiles set coins = coins + p_amount, updated_at = now() where id = p_user_id returning coins into v_balance;
  if not found then raise exception 'user_not_found'; end if;
  insert into public.coin_ledger(profile_id, delta, reason, reference_id)
    values (p_user_id, p_amount, 'admin_adjustment', gen_random_uuid()::text);
  return jsonb_build_object('user_id', p_user_id, 'coins', v_balance);
end;
$$;

create or replace function lumenco_private.leaderboard()
returns table(name text, username text, xp integer, plan text, frame text)
language sql stable security definer set search_path = ''
as $$
  select p.display_name, p.username, p.xp,
    case when p.role = 'admin' then 'max' when p.plan <> 'free' and p.plan_expires_at > now() then p.plan else 'free' end,
    p.frame_item
  from public.profiles p
  where p.show_on_leaderboard and not p.is_banned and p.xp > 0
  order by p.xp desc, p.created_at asc limit 50;
$$;

revoke all on function lumenco_private.complete_lesson(text) from public, anon, authenticated;
revoke all on function lumenco_private.purchase_shop_item(text) from public, anon, authenticated;
revoke all on function lumenco_private.equip_shop_item(text) from public, anon, authenticated;
revoke all on function lumenco_private.subscribe_plan(text) from public, anon, authenticated;
revoke all on function lumenco_private.save_pet_config(text, text) from public, anon, authenticated;
revoke all on function lumenco_private.admin_list_users() from public, anon, authenticated;
revoke all on function lumenco_private.admin_set_ban(uuid, boolean) from public, anon, authenticated;
revoke all on function lumenco_private.admin_set_plan(uuid, text) from public, anon, authenticated;
revoke all on function lumenco_private.admin_adjust_coins(uuid, integer) from public, anon, authenticated;
revoke all on function lumenco_private.leaderboard() from public, anon, authenticated;
grant execute on function lumenco_private.complete_lesson(text), lumenco_private.purchase_shop_item(text), lumenco_private.equip_shop_item(text), lumenco_private.subscribe_plan(text), lumenco_private.save_pet_config(text, text), lumenco_private.admin_list_users(), lumenco_private.admin_set_ban(uuid, boolean), lumenco_private.admin_set_plan(uuid, text), lumenco_private.admin_adjust_coins(uuid, integer), lumenco_private.leaderboard() to authenticated;

create or replace function public.complete_lesson(p_lesson_id text) returns jsonb language sql security invoker set search_path = '' as $$ select lumenco_private.complete_lesson(p_lesson_id); $$;
create or replace function public.purchase_shop_item(p_item_id text) returns jsonb language sql security invoker set search_path = '' as $$ select lumenco_private.purchase_shop_item(p_item_id); $$;
create or replace function public.equip_shop_item(p_item_id text) returns jsonb language sql security invoker set search_path = '' as $$ select lumenco_private.equip_shop_item(p_item_id); $$;
create or replace function public.subscribe_plan(p_plan text) returns jsonb language sql security invoker set search_path = '' as $$ select lumenco_private.subscribe_plan(p_plan); $$;
create or replace function public.save_pet_config(p_name text, p_color text) returns jsonb language sql security invoker set search_path = '' as $$ select lumenco_private.save_pet_config(p_name, p_color); $$;
create or replace function public.admin_list_users() returns table(id uuid, name text, username text, email text, role text, plan text, coins integer, xp integer, is_banned boolean, created_at timestamptz) language sql security invoker set search_path = '' as $$ select * from lumenco_private.admin_list_users(); $$;
create or replace function public.admin_set_ban(p_user_id uuid, p_is_banned boolean) returns jsonb language sql security invoker set search_path = '' as $$ select lumenco_private.admin_set_ban(p_user_id, p_is_banned); $$;
create or replace function public.admin_set_plan(p_user_id uuid, p_plan text) returns jsonb language sql security invoker set search_path = '' as $$ select lumenco_private.admin_set_plan(p_user_id, p_plan); $$;
create or replace function public.admin_adjust_coins(p_user_id uuid, p_amount integer) returns jsonb language sql security invoker set search_path = '' as $$ select lumenco_private.admin_adjust_coins(p_user_id, p_amount); $$;
create or replace function public.leaderboard() returns table(name text, username text, xp integer, plan text, frame text) language sql security invoker set search_path = '' as $$ select * from lumenco_private.leaderboard(); $$;

revoke all on function public.complete_lesson(text), public.purchase_shop_item(text), public.equip_shop_item(text), public.subscribe_plan(text), public.save_pet_config(text, text), public.admin_list_users(), public.admin_set_ban(uuid, boolean), public.admin_set_plan(uuid, text), public.admin_adjust_coins(uuid, integer), public.leaderboard() from public, anon, authenticated;
grant execute on function public.complete_lesson(text), public.purchase_shop_item(text), public.equip_shop_item(text), public.subscribe_plan(text), public.save_pet_config(text, text), public.admin_list_users(), public.admin_set_ban(uuid, boolean), public.admin_set_plan(uuid, text), public.admin_adjust_coins(uuid, integer), public.leaderboard() to authenticated;

commit;
