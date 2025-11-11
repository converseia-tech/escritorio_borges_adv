# 🚀 Variáveis de Ambiente no Render

## ⚠️ CRÍTICO - Adicione estas variáveis no Render

Vá para: **Dashboard do Render → Seu Serviço → Environment**

### 📋 Variáveis Obrigatórias

```bash
# Database (já deve estar configurada)
DATABASE_URL=postgresql://postgres.qzcdkfaaivwpfdpxchpl:ConverseIA2025%21@aws-1-us-east-2.pooler.supabase.com:6543/postgres

# JWT Secret
JWT_SECRET=your-secret-key-change-this-in-production-borges-2024-secure-key

# ✅ SUPABASE BACKEND (SEM VITE_) - ADICIONE AGORA!
SUPABASE_URL=https://qzcdkfaaivwpfdpxchpl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6Y2RrZmFhaXZ3cGZkcHhjaHBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDc1NzU5OSwiZXhwIjoyMDQ2MzMzNTk5fQ.1YJMN01hl9CXcOhpJOz33FdpxQFDy5yFdqfHWWWfMiQ

# ✅ SUPABASE FRONTEND (COM VITE_) - Já devem estar configuradas
VITE_SUPABASE_URL=https://qzcdkfaaivwpfdpxchpl.supabase.co
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6Y2RrZmFhaXZ3cGZkcHhjaHBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDc1NzU5OSwiZXhwIjoyMDQ2MzMzNTk5fQ.1YJMN01hl9CXcOhpJOz33FdpxQFDy5yFdqfHWWWfMiQ

# Analytics (opcional)
VITE_META_PIXEL_ID=XXXXXXXXX
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXX
```

---

## 🔍 Por que preciso de DUAS versões das variáveis?

### `VITE_` = Frontend (React)
- Lidas pelo Vite durante build
- Injetadas no código JavaScript do navegador
- Exemplo: `import.meta.env.VITE_SUPABASE_URL`

### SEM `VITE_` = Backend (Node.js)
- Lidas pelo Node.js em runtime
- NUNCA expostas ao navegador
- Exemplo: `process.env.SUPABASE_URL`

---

## ✅ Checklist de Configuração no Render

- [ ] Adicionei `SUPABASE_URL` (sem VITE_)
- [ ] Adicionei `SUPABASE_SERVICE_ROLE_KEY` (sem VITE_)
- [ ] Mantive `VITE_SUPABASE_URL` (com VITE_)
- [ ] Mantive `VITE_SUPABASE_SERVICE_ROLE_KEY` (com VITE_)
- [ ] Salvei as mudanças no Render
- [ ] Fazer novo deploy (ou aguardar auto-deploy)

---

## 🐛 Como Verificar se Funcionou

Após deploy:

1. Acesse `/admin` no site
2. Tente fazer upload de uma imagem
3. Verifique os logs do Render:
   - ✅ Deve aparecer: `[Supabase Storage] ✅ Cliente inicializado com SERVICE_ROLE_KEY`
   - ✅ Deve aparecer: `[Supabase Storage] 📤 Upload iniciado`
   - ✅ Deve aparecer: `[Supabase Storage] ✅ Upload concluído`

4. Se der erro `Bucket 'images' not found`:
   - Vá para Supabase Dashboard
   - Storage → New bucket
   - Nome: `images`
   - Public: ✅ Sim

---

## 🔒 Segurança

⚠️ **SERVICE_ROLE_KEY tem poderes de ADMIN!**

- ✅ DEVE estar APENAS no backend (variáveis sem VITE_)
- ❌ NUNCA exponha no frontend
- ✅ Render guarda com segurança (não expõe no build)

---

## 📝 Resumo do Problema Resolvido

**Antes:**
```typescript
// ❌ Backend tentava ler VITE_SUPABASE_URL
const url = process.env.VITE_SUPABASE_URL; // undefined no Node.js!
```

**Depois:**
```typescript
// ✅ Backend lê variável correta
const url = process.env.SUPABASE_URL; // funciona!
```

---

## 🎯 Resposta para a pessoa que te ajudou

**Situação:** Opção 2 - Upload acontece no BACKEND

**Backend:** Node.js + Express (tRPC)

**Correção aplicada:**
- ✅ Backend usa `SUPABASE_SERVICE_ROLE_KEY` (não anon_key)
- ✅ Cliente criado com `createClient(url, service_role_key)`
- ✅ Upload via `supabase.storage.from('images').upload()`
- ✅ Bypass RLS automático com service_role

**Arquivos corrigidos:**
1. `server/supabase-storage.ts` - Cliente Supabase com service_role
2. `server/storage-test-routes.ts` - Testes de storage
3. `client/src/components/admin/AboutPageManagement.tsx` - Upload via tRPC

**Próximo passo:** Adicionar variáveis no Render (sem VITE_) e fazer deploy!
