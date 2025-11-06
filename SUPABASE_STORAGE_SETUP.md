# 📁 Configuração do Supabase Storage

Este documento explica como configurar e usar o Supabase Storage para upload de imagens no painel administrativo.

## 🎯 Passo 1: Criar Bucket no Supabase

1. Acesse o dashboard do Supabase: https://supabase.com/dashboard
2. Selecione seu projeto: **qzcdkfaaivwpfdpxchpl**
3. No menu lateral, clique em **Storage**
4. Clique em **New bucket**
5. Configure o bucket:
   - **Name**: `images`
   - **Public bucket**: ✅ Marque esta opção (para imagens públicas)
   - Clique em **Create bucket**

## 🔐 Passo 2: Configurar Permissões (RLS Policies)

Após criar o bucket, você precisa configurar as políticas de acesso:

### Opção A: Bucket Totalmente Público (Recomendado para imagens do site)

No dashboard do Supabase:
1. Vá em **Storage** > **Policies**
2. Selecione o bucket `images`
3. Clique em **New policy**
4. Escolha **Get started quickly** > **Allow public access**
5. Configure as seguintes políticas:

#### Política de SELECT (Leitura Pública)
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );
```

#### Política de INSERT (Upload)
```sql
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' AND auth.role() = 'authenticated' );
```

#### Política de DELETE (Remoção)
```sql
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' AND auth.role() = 'authenticated' );
```

### Opção B: Acesso Público Total (Mais Simples)

Se preferir acesso total sem autenticação:

```sql
-- Permitir leitura pública
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Permitir upload público
CREATE POLICY "Public Insert Access"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' );

-- Permitir remoção pública
CREATE POLICY "Public Delete Access"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' );
```

## 🔑 Passo 3: Obter Service Role Key

A Service Role Key já está configurada no arquivo `.env`:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANTE**: Esta chave tem acesso total ao banco de dados. Nunca a exponha no frontend!

## 📸 Como Usar

### Upload de Imagem no Painel Admin

1. Acesse o painel administrativo: http://localhost:3000/admin
2. Vá para qualquer seção (Hero, Áreas de Atuação, Equipe, etc.)
3. Clique em **Escolher arquivo** ou arraste uma imagem
4. A imagem será enviada automaticamente para o Supabase Storage
5. A URL pública será salva no banco de dados

### Formatos Aceitos

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- SVG (.svg)
- ICO (.ico) - para favicon

### Tamanho Máximo

- **10MB** por arquivo

## 🔧 Endpoints da API

### Upload de Arquivo Único
```
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: arquivo de imagem
- context: (opcional) contexto da imagem (ex: "borges-advogados-equipe")
```

**Resposta:**
```json
{
  "url": "https://qzcdkfaaivwpfdpxchpl.supabase.co/storage/v1/object/public/images/uploads/borges-advogados-12345678.jpg",
  "key": "uploads/borges-advogados-12345678.jpg",
  "message": "File uploaded successfully"
}
```

### Upload de Múltiplos Arquivos
```
POST /api/upload-multiple
Content-Type: multipart/form-data

Body:
- files[]: array de arquivos
```

### Deletar Arquivo
```
DELETE /api/upload/:path
```

## 🏗️ Arquitetura

### Fluxo de Upload

1. **Frontend** (`SiteSettingsManagement.tsx`, `PracticeAreasManagement.tsx`, etc.)
   - Usuário seleciona arquivo
   - Envia para `/api/upload` via FormData

2. **Backend** (`server/upload-routes.ts`)
   - Valida tipo e tamanho do arquivo
   - Chama `uploadImage()` do `image-upload.ts`

3. **Storage** (`server/supabase-storage.ts`)
   - Conecta ao Supabase Storage usando `@supabase/supabase-js`
   - Gera nome único para o arquivo
   - Faz upload do buffer
   - Retorna URL pública

4. **Database** (`server/db-mutations.ts`)
   - Salva URL no banco de dados PostgreSQL
   - Atualiza o registro correspondente

### Nomeação de Arquivos

Os arquivos são renomeados automaticamente para SEO:

**Padrão**: `{contexto}-{timestamp}-{random}.{extensão}`

**Exemplo**: `borges-advogados-equipe-1731234567-a1b2c3d4.jpg`

## 🔍 Verificar Uploads

### Via Dashboard Supabase

1. Acesse **Storage** > **images**
2. Navegue até a pasta `uploads/`
3. Você verá todos os arquivos enviados

### Via SQL

```sql
-- Ver todos os objetos no bucket
SELECT * FROM storage.objects 
WHERE bucket_id = 'images';
```

## ⚠️ Troubleshooting

### Erro: "Failed to upload file"

**Causa**: Bucket não existe ou permissões incorretas

**Solução**: 
1. Verifique se o bucket `images` foi criado
2. Confirme que as políticas RLS estão ativas
3. Verifique a Service Role Key no `.env`

### Erro: "Only image files are allowed"

**Causa**: Tentou fazer upload de arquivo não-imagem

**Solução**: Use apenas formatos permitidos (JPG, PNG, GIF, WebP, SVG, ICO)

### Erro: "File too large"

**Causa**: Arquivo maior que 10MB

**Solução**: Redimensione a imagem ou use ferramenta de compressão

## 📚 Referências

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase Storage JS Client](https://supabase.com/docs/reference/javascript/storage)
- [RLS Policies for Storage](https://supabase.com/docs/guides/storage/security/access-control)

## ✅ Checklist de Configuração

- [ ] Bucket `images` criado no Supabase
- [ ] Bucket configurado como público
- [ ] Políticas RLS configuradas
- [ ] Service Role Key no arquivo `.env`
- [ ] Servidor reiniciado após mudanças
- [ ] Teste de upload no painel admin funcionando
- [ ] URLs das imagens acessíveis publicamente

---

**Última atualização**: Janeiro 2025
