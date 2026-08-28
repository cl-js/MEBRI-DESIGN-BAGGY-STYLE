create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sort_order integer not null,
  images jsonb not null default '[]'::jsonb,
  data jsonb not null,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects
add column if not exists slug text;

alter table public.projects
add column if not exists title text;

alter table public.projects
add column if not exists sort_order integer;

alter table public.projects
add column if not exists data jsonb;

alter table public.projects
add column if not exists images jsonb not null default '[]'::jsonb;

alter table public.projects
add column if not exists is_deleted boolean not null default false;

alter table public.projects
add column if not exists created_at timestamptz not null default now();

alter table public.projects
add column if not exists updated_at timestamptz not null default now();

update public.projects
set slug = 'legacy-' || id::text
where slug is null;

update public.projects
set sort_order = ordered.row_number
from (
  select id, row_number() over (order by created_at nulls first, id) as row_number
  from public.projects
  where sort_order is null
) ordered
where public.projects.id = ordered.id;

update public.projects
set data = '{}'::jsonb
where data is null;

update public.projects
set images = coalesce(data->'images', '[]'::jsonb)
where images is null;

update public.projects
set title = coalesce(nullif(data->>'title', ''), 'Untitled project')
where title is null or title = '';

alter table public.projects
alter column slug set not null;

alter table public.projects
alter column title set not null;

alter table public.projects
alter column sort_order set not null;

alter table public.projects
alter column data set not null;

alter table public.projects
alter column images set not null;

create unique index if not exists projects_slug_idx on public.projects (slug);
create index if not exists projects_sort_order_idx on public.projects (sort_order);

alter table public.projects enable row level security;

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
  on public.projects for select
  using (true);

drop policy if exists "Admin can insert projects" on public.projects;
create policy "Admin can insert projects"
  on public.projects for insert to authenticated
  with check ((auth.jwt() ->> 'email') = 'englishpractice265@gmail.com');

drop policy if exists "Admin can update projects" on public.projects;
create policy "Admin can update projects"
  on public.projects for update to authenticated
  using ((auth.jwt() ->> 'email') = 'englishpractice265@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'englishpractice265@gmail.com');

drop policy if exists "Admin can delete projects" on public.projects;
create policy "Admin can delete projects"
  on public.projects for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'englishpractice265@gmail.com');

create or replace function public.set_projects_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
before update on public.projects
for each row execute function public.set_projects_updated_at();
