-- Modificar tabla de servicios: eliminar email y website, cambiar address por ciudad
-- Costa del Inmigrante 2.0

-- Eliminar columnas email y website
ALTER TABLE public.services DROP COLUMN IF EXISTS contact_email;
ALTER TABLE public.services DROP COLUMN IF EXISTS website;

-- Renombrar address a ciudad
ALTER TABLE public.services RENAME COLUMN address TO ciudad;

-- Agregar comentario para documentar el cambio
COMMENT ON COLUMN public.services.ciudad IS 'Ciudad donde se encuentra el servicio (anteriormente address)';
