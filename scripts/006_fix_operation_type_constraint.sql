-- First, let's see what the current constraint looks like
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_namespace n ON t.relnamespace = n.oid
WHERE t.relname = 'properties' 
  AND n.nspname = 'public'
  AND contype = 'c'
  AND conname LIKE '%operation_type%';

-- Drop the existing constraint if it exists
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_operation_type_check;

-- Add the correct constraint with Spanish values
ALTER TABLE properties 
ADD CONSTRAINT properties_operation_type_check 
CHECK (operation_type IN ('venta', 'alquiler', 'alquiler_temporal'));

-- Verify the new constraint
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_namespace n ON t.relnamespace = n.oid
WHERE t.relname = 'properties' 
  AND n.nspname = 'public'
  AND contype = 'c'
  AND conname LIKE '%operation_type%';
