create table if not exists public.contact_settings (
	id integer primary key check (id = 1),
	settings jsonb not null default '{}'::jsonb,
	updated_at timestamptz not null default now()
);

alter table public.contact_settings enable row level security;

drop policy if exists "Public can read contact settings" on public.contact_settings;
create policy "Public can read contact settings"
	on public.contact_settings for select
	using (true);

drop policy if exists "Admin can manage contact settings" on public.contact_settings;
create policy "Admin can manage contact settings"
	on public.contact_settings for all to authenticated
	using ((auth.jwt() ->> 'email') = 'englishpractice265@gmail.com')
	with check ((auth.jwt() ->> 'email') = 'englishpractice265@gmail.com');

insert into public.contact_settings (id, settings)
values (1, '{"location":"Addis Ababa, Ethiopia","mapQuery":"Addis Ababa, Ethiopia"}'::jsonb)
on conflict (id) do nothing;

create table if not exists public.contact_inquiries (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	email text not null,
	occasion text,
	project_type text,
	budget text,
	timeline text,
	message text not null,
	created_at timestamptz not null default now()
);

alter table public.contact_inquiries enable row level security;

drop policy if exists "Anyone can submit contact inquiries" on public.contact_inquiries;
create policy "Anyone can submit contact inquiries"
	on public.contact_inquiries for insert
	with check (true);

drop policy if exists "Admin can read contact inquiries" on public.contact_inquiries;
create policy "Admin can read contact inquiries"
	on public.contact_inquiries for select to authenticated
	using ((auth.jwt() ->> 'email') = 'englishpractice265@gmail.com');
