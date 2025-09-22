-- Check what operation_type values currently exist in the database
SELECT DISTINCT operation_type, COUNT(*) as count
FROM properties 
WHERE operation_type IS NOT NULL
GROUP BY operation_type
ORDER BY count DESC;

-- Also check for any NULL or empty values
SELECT 
  COUNT(*) as total_properties,
  COUNT(operation_type) as non_null_operation_types,
  COUNT(*) - COUNT(operation_type) as null_operation_types
FROM properties;
