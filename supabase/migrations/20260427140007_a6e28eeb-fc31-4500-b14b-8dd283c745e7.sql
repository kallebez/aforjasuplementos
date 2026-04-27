CREATE TABLE IF NOT EXISTS public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;
CREATE POLICY "Anyone can view active categories"
ON public.categories
FOR SELECT
USING (active = true);

DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
CREATE POLICY "Admins manage categories"
ON public.categories
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP TRIGGER IF EXISTS set_categories_updated_at ON public.categories;
CREATE TRIGGER set_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_categories_active_sort ON public.categories(active, sort_order, name);

INSERT INTO public.categories (name, slug, sort_order)
VALUES
  ('Whey Protein', 'whey-protein', 10),
  ('Creatina', 'creatina', 20),
  ('Pré-Treinos', 'pre-treinos', 30),
  ('Vitaminas', 'vitaminas', 40),
  ('Bebidas', 'bebidas', 50),
  ('Eletrônicos', 'eletronicos', 60),
  ('Livros', 'livros', 70),
  ('Pasta de Amendoim', 'pasta-de-amendoim', 80),
  ('Suplementos', 'suplementos', 90),
  ('Vestuário', 'vestuario', 100),
  ('Acessórios para Academia', 'acessorios-para-academia', 110)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  active = true,
  sort_order = EXCLUDED.sort_order;