-- Create sellers table
CREATE TABLE IF NOT EXISTS public.sellers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    description TEXT,
    email TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id)
);

-- Add RLS policies
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read all sellers
CREATE POLICY "Anyone can view active sellers" ON public.sellers
    FOR SELECT USING (is_active = true);

-- Policy for authenticated users to manage sellers (admin only)
CREATE POLICY "Authenticated users can manage sellers" ON public.sellers
    FOR ALL USING (auth.role() = 'authenticated');

-- Add seller_id column to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES public.sellers(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_properties_seller_id ON public.properties(seller_id);
CREATE INDEX IF NOT EXISTS idx_sellers_active ON public.sellers(is_active);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sellers_updated_at 
    BEFORE UPDATE ON public.sellers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
