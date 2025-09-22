-- Create first admin user
-- Replace 'admin@costadelinmigrante.com' with your actual email
-- This user must first register through the normal signup process
-- Then run this script to promote them to admin

-- Update user role to admin (replace with your actual email)
update public.profiles 
set role = 'admin' 
where email = 'admin@costadelinmigrante.com';

-- If you want to create additional admin users, add them here:
-- update public.profiles set role = 'admin' where email = 'otro-admin@example.com';
-- update public.profiles set role = 'moderator' where email = 'moderador@example.com';
