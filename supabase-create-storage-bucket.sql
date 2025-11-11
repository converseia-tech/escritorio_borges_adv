-- ============================================
-- CRIAR BUCKET DE STORAGE NO SUPABASE
-- ============================================
-- Execute este SQL no Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/qzcdkfaaivwpfdpxchpl/sql/new

-- 1. Criar bucket "images" com acesso público
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true, -- público
  5242880, -- 5MB em bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Política de acesso público para leitura
CREATE POLICY "Public Access for Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- 3. Política de upload (apenas autenticados ou service_role)
CREATE POLICY "Authenticated Upload for Images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- 4. Política de atualização
CREATE POLICY "Authenticated Update for Images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');

-- 5. Política de deleção
CREATE POLICY "Authenticated Delete for Images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Verificar se o bucket foi criado
SELECT * FROM storage.buckets WHERE id = 'images';

-- ============================================
-- APÓS EXECUTAR ESTE SQL:
-- ============================================
-- 1. Verifique se apareceu 1 linha no resultado
-- 2. Vá em Storage no painel do Supabase
-- 3. Deve aparecer o bucket "images"
-- 4. Reinicie o servidor: pnpm dev
-- 5. Teste fazer upload no admin
-- ============================================
