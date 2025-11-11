-- Migration: Adicionar campos de autor ao blog
-- Created: 2025-11-10
-- Description: Adiciona biografia e foto do autor aos posts do blog

-- Adicionar coluna author_bio (biografia do autor)
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS author_bio TEXT;

-- Adicionar coluna author_photo (foto do autor)
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS author_photo TEXT;

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'blogs' 
AND column_name IN ('author_bio', 'author_photo');
