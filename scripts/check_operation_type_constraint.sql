-- Check the constraint definition for operation_type
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'properties_operation_type_check';

-- Also check what values currently exist in the database
SELECT DISTINCT operation_type 
FROM properties 
WHERE operation_type IS NOT NULL;
