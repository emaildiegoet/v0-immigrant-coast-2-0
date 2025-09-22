-- Check current constraint and fix category values
-- First, let's see what constraint exists
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'services'::regclass 
AND contype = 'c';

-- Drop the existing constraint if it exists
ALTER TABLE services DROP CONSTRAINT IF EXISTS services_category_check;

-- Create a new constraint that allows all the categories used in the form
ALTER TABLE services ADD CONSTRAINT services_category_check 
CHECK (category IN (
  'construccion',
  'limpieza', 
  'jardineria',
  'plomeria',
  'electricidad',
  'pintura',
  'carpinteria',
  'mecanico',
  'veterinario',
  'medico',
  'abogado',
  'contador',
  'profesor',
  'restaurante',
  'supermercado',
  'farmacia',
  'otros'
));

-- Update any existing services with invalid categories to 'otros'
UPDATE services 
SET category = 'otros' 
WHERE category NOT IN (
  'construccion',
  'limpieza', 
  'jardineria',
  'plomeria',
  'electricidad',
  'pintura',
  'carpinteria',
  'mecanico',
  'veterinario',
  'medico',
  'abogado',
  'contador',
  'profesor',
  'restaurante',
  'supermercado',
  'farmacia',
  'otros'
);
