-- Check what values are allowed for operation_type in the properties table
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_namespace n ON t.relnamespace = n.oid
WHERE t.relname = 'properties' 
AND n.nspname = 'public'
AND conname = 'properties_operation_type_check';

-- Also check if there are any existing values in the table
SELECT DISTINCT operation_type FROM properties WHERE operation_type IS NOT NULL;
