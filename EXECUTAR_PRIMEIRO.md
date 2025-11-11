# ⚠️ CONFIGURAÇÃO OBRIGATÓRIA DO SUPABASE STORAGE

## 🚨 ERRO ATUAL: Bucket 'images' não existe

O sistema está tentando fazer upload de imagens mas o bucket não foi criado no Supabase.

## 📋 SOLUÇÃO (Executar AGORA):

### 1️⃣ Abra o Supabase Dashboard:
https://supabase.com/dashboard/project/qzcdkfaaivwpfdpxchpl/storage/buckets

### 2️⃣ Clique em "New bucket"

### 3️⃣ Preencha:
- **Name**: `images`
- **Public bucket**: ✅ MARCAR (importante!)
- **File size limit**: 5 MB
- **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/gif,image/webp`

### 4️⃣ Clique em "Create bucket"

### 5️⃣ Configure as Políticas de Acesso

Vá em Storage > Policies e adicione:

#### Política 1: SELECT (leitura pública)
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');
```

#### Política 2: INSERT (upload autenticado)
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');
```

#### Política 3: UPDATE (atualização autenticada)
```sql
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');
```

#### Política 4: DELETE (deleção autenticada)
```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');
```

---

## ✅ OU use o SQL automático:

Copie e cole no **SQL Editor** do Supabase:

```sql
-- Criar bucket 'images' se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB em bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso
CREATE POLICY IF NOT EXISTS "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY IF NOT EXISTS "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

CREATE POLICY IF NOT EXISTS "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');

CREATE POLICY IF NOT EXISTS "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');
```

---

## 🧪 Teste após executar:

1. Reinicie o servidor: `npm run dev`
2. Tente fazer upload de uma imagem de membro da equipe
3. Verifique se aparece "✅ Upload concluído" no console

---

## 📝 Checklist:

- [ ] Bucket 'images' criado
- [ ] Bucket marcado como público
- [ ] Políticas de acesso configuradas
- [ ] Servidor reiniciado
- [ ] Upload testado e funcionando

