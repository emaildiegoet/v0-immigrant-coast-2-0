-- Check the constraint definition for operation_type in properties table
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

-- Also check what values currently exist in the operation_type column
SELECT DISTINCT operation_type 
FROM properties 
WHERE operation_type IS NOT NULL;

-- Check if there are any existing properties to see the pattern
SELECT COUNT(*) as total_properties FROM properties;
