
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Tornar bucket privado para listagem (urls públicas individuais ainda funcionam via getPublicUrl)
UPDATE storage.buckets SET public = false WHERE id = 'product-images';

-- Remover policy de leitura ampla e recriar leitura objeto a objeto via signed/public urls geradas pelo SDK
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Anyone can read product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');
