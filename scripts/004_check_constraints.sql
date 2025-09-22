-- Check the constraints on the properties table
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
JOIN pg_class cl ON cl.oid = c.conrelid
WHERE n.nspname = 'public' 
AND cl.relname = 'properties'
AND c.contype = 'c';

-- Also check what values currently exist in operation_type
SELECT DISTINCT operation_type 
FROM properties 
WHERE operation_type IS NOT NULL;
