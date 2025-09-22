-- Create site_config table for site configuration management
CREATE TABLE IF NOT EXISTS public.site_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Create policies for site_config
-- Only admins can read site config
CREATE POLICY "site_config_select_admin"
  ON public.site_config FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update site config
CREATE POLICY "site_config_update_admin"
  ON public.site_config FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can insert site config
CREATE POLICY "site_config_insert_admin"
  ON public.site_config FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert default configuration values
INSERT INTO public.site_config (key, value, description) VALUES
('site_name', '"Costa del Inmigrante"', 'Nombre del sitio web'),
('site_description', '"Portal inmobiliario y de servicios para la comunidad"', 'Descripción del sitio'),
('contact_email', '"info@costadelinmigrante.com"', 'Email de contacto'),
('contact_phone', '""', 'Teléfono de contacto'),
('whatsapp_number', '""', 'Número de WhatsApp'),
('social_facebook', '""', 'URL de Facebook'),
('social_instagram', '""', 'URL de Instagram'),
('google_maps_api_key', '""', 'Clave API de Google Maps')
ON CONFLICT (key) DO NOTHING;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_site_config_key ON public.site_config(key);
