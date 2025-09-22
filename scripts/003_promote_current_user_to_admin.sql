-- Promote the most recently created user to admin
-- This is useful when you've just registered and want to become admin

UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id 
  FROM public.profiles 
  ORDER BY created_at DESC 
  LIMIT 1
);

-- Alternative: If you know your email, uncomment and modify this line:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'tu-email@example.com';

-- Verify the change
SELECT email, role, created_at 
FROM public.profiles 
WHERE role IN ('admin', 'moderator') 
ORDER BY created_at DESC;
