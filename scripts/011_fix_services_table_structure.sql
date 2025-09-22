-- Eliminar las columnas contact_email y website de la tabla services
-- Renombrar address a ciudad

-- Primero eliminar las columnas que no necesitamos
ALTER TABLE services DROP COLUMN IF EXISTS contact_email;
ALTER TABLE services DROP COLUMN IF EXISTS website;

-- Renombrar address a ciudad
ALTER TABLE services RENAME COLUMN address TO ciudad;

-- Verificar la estructura final
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'services' 
AND table_schema = 'public'
ORDER BY ordinal_position;
