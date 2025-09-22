-- Create proper RLS policies for services deletion
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can delete their own services" ON services;
DROP POLICY IF EXISTS "Admins can delete any service" ON services;
DROP POLICY IF EXISTS "Allow service deletion" ON services;

-- Create a comprehensive delete policy that allows:
-- 1. Users to delete their own services
-- 2. Any authenticated user to delete services with null created_by (legacy services)
-- 3. Admins to delete any service
CREATE POLICY "Allow service deletion" ON services
FOR DELETE
TO authenticated
USING (
  -- User owns the service
  created_by = auth.uid()
  OR
  -- Service has no owner (legacy services)
  created_by IS NULL
  OR
  -- User is admin (check if user has admin role in profiles table)
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Also ensure we have proper select policy for the delete operation to work
DROP POLICY IF EXISTS "Allow service selection for deletion" ON services;
CREATE POLICY "Allow service selection for deletion" ON services
FOR SELECT
TO authenticated
USING (true); -- Allow reading all services for admin operations

-- Update existing services without owner to have the current admin as owner
-- This is optional but helps with future management
UPDATE services 
SET created_by = (
  SELECT id FROM profiles 
  WHERE role = 'admin' 
  LIMIT 1
)
WHERE created_by IS NULL;
