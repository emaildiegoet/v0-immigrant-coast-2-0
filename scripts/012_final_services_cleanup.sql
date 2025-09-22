-- Script final para limpiar la tabla services
-- Eliminar columnas innecesarias y renombrar address a ciudad

-- Verificar estructura actual
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'services' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Eliminar columnas que no necesitamos
ALTER TABLE services DROP COLUMN IF EXISTS contact_email;
ALTER TABLE services DROP COLUMN IF EXISTS website;

-- Renombrar address a ciudad (solo si existe la columna address)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' 
        AND column_name = 'address'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE services RENAME COLUMN address TO ciudad;
    END IF;
END $$;

-- Verificar estructura final
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'services' 
AND table_schema = 'public'
ORDER BY ordinal_position;
