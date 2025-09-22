-- Add profile_photo column to sellers table
ALTER TABLE public.sellers 
ADD COLUMN IF NOT EXISTS profile_photo TEXT;

-- Add comment to document the column
COMMENT ON COLUMN public.sellers.profile_photo IS 'URL of the seller profile photo stored in Vercel Blob';
