-- Check current RLS policies for services table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'services';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON services;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON services;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON services;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON services;

-- Create comprehensive RLS policies for services
-- Allow all users to read services
CREATE POLICY "Enable read access for all users" ON services
    FOR SELECT USING (true);

-- Allow authenticated users to insert services
CREATE POLICY "Enable insert for authenticated users only" ON services
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own services or allow service role
CREATE POLICY "Enable update for users based on user_id" ON services
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role' OR
        auth.jwt() ->> 'role' = 'admin'
    );

-- Allow users to delete their own services or allow service role
CREATE POLICY "Enable delete for users based on user_id" ON services
    FOR DELETE USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role' OR
        auth.jwt() ->> 'role' = 'admin'
    );

-- Ensure RLS is enabled
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Check the updated policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'services';
