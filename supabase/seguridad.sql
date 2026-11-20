-- Reglas de acceso (RLS) de la base de AF Select.
-- Aplicadas el 2026-11-20 desde el SQL Editor de Supabase. Este archivo es la
-- referencia: si se recrea el proyecto, correrlo tal cual.
--
-- Antes: site_settings se podía modificar SIN login, y cualquier usuario
-- registrado (el registro estaba abierto) podía editar/borrar publicaciones y
-- leer las consultas de clientes.
--
-- Ahora:
--   · El público lee publicaciones y ajustes, y crea consultas (formularios).
--   · Solo la cuenta del CRM (Agustín) escribe, borra y lee consultas.
--   · Además, en Authentication → Sign In / Providers quedó APAGADO
--     "Allow new users to sign up".

begin;

-- Único usuario administrador: la cuenta de Agustín en Supabase Auth.
create or replace function public.es_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(auth.uid() = 'b23e8c51-38a7-4a4e-b74d-3daef730cf7d'::uuid, false)
$$;

-- site_settings: lectura pública (ya existía "public read"); escritura solo admin.
drop policy if exists "auth write" on public.site_settings;
create policy "solo admin escribe" on public.site_settings
  for all to authenticated using (public.es_admin()) with check (public.es_admin());

-- listings: lectura pública ("Allow public read access"); escritura solo admin.
drop policy if exists "Allow authenticated modifications" on public.listings;
create policy "solo admin escribe" on public.listings
  for all to authenticated using (public.es_admin()) with check (public.es_admin());

-- leads: el público solo inserta ("Allow public inserts"); el resto solo admin.
drop policy if exists "Allow authenticated read/write" on public.leads;
create policy "solo admin gestiona" on public.leads
  for all to authenticated using (public.es_admin()) with check (public.es_admin());

-- Storage (bucket público "listings"): los archivos se ven por URL pública sin
-- necesitar política; se quita el permiso de LISTAR el bucket entero.
drop policy if exists "Allow authenticated manage listings" on storage.objects;
create policy "solo admin gestiona listings" on storage.objects
  for all to authenticated
  using (bucket_id = 'listings' and public.es_admin())
  with check (bucket_id = 'listings' and public.es_admin());
drop policy if exists "Allow public read listings" on storage.objects;

commit;
