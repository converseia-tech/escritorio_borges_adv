# 📝 Correção da Formatação do Blog - Checklist

## ✅ Problemas Resolvidos

### 1. **Editor de Blog Funcionando** (React 19 compatível)
- ❌ Removido: React Quill (incompatível)
- ✅ Criado: Editor nativo com contentEditable
- ✅ Toolbar com: H1, H2, H3, negrito, itálico, sublinhado, listas, citações, links

### 2. **Formatação Renderizada no Site**
- ❌ Antes: HTML era salvo mas não aparecia formatado
- ✅ Agora: Todos os estilos aparecem corretamente no site
- ✅ CSS específico para cada elemento HTML

### 3. **Upload de Imagens Corrigido**
- ❌ Antes: Usava `VITE_SUPABASE_URL` no backend (erro!)
- ✅ Agora: Usa `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
- ✅ Backend com service_role_key (bypass RLS)

---

## 🧪 Como Testar Localmente

### 1. Testar Editor de Blog

```bash
# Rodar o servidor
npm run dev
```

1. Acesse: `http://localhost:5000/admin`
2. Vá para aba **"Blogs"**
3. Clique em **"Novo Post"** ou edite um existente

**Teste no editor:**
- [ ] Escreva texto normal
- [ ] Clique H1, H2, H3 - texto deve ficar maior/menor
- [ ] Selecione texto e clique **B** (negrito) - deve ficar em negrito
- [ ] Selecione texto e clique **I** (itálico) - deve ficar inclinado
- [ ] Selecione texto e clique **U** (sublinhado) - deve aparecer linha
- [ ] Clique no ícone de lista - deve criar bullets
- [ ] Clique no ícone de lista numerada - deve criar números
- [ ] Clique no ícone de citação - deve adicionar borda lateral
- [ ] Clique no ícone de link - deve abrir popup para URL

**Salvar:**
- [ ] Preencha título, slug, resumo
- [ ] Faça upload de imagem (featured)
- [ ] Ative "Publicado"
- [ ] Clique "Salvar"

---

### 2. Testar Renderização no Site

1. Vá para: `http://localhost:5000/blog`
2. Clique no post que você criou/editou

**Verificar se aparece formatado:**
- [ ] **H1** - Grande, cinza escuro, negrito
- [ ] **H2** - Médio, amarelo (#d97706), negrito
- [ ] **H3** - Menor que H2, cinza médio, negrito
- [ ] **Negrito** - Texto mais escuro e grosso
- [ ] **Itálico** - Texto inclinado
- [ ] **Sublinhado** - Linha embaixo do texto
- [ ] **Listas com bullets** - Bolinhas pretas na frente
- [ ] **Listas numeradas** - Números (1, 2, 3...)
- [ ] **Citações** - Borda amarela à esquerda, fundo amarelo claro
- [ ] **Links** - Texto amarelo, sublinhado, hover escurece

---

### 3. Testar Upload de Imagens

**ANTES de testar, verifique:**
1. Bucket `images` existe no Supabase Storage
   - https://supabase.com/dashboard/project/qzcdkfaaivwpfdpxchpl/storage/buckets
   - Se não existir: **New bucket** → Nome: `images`, Public: ✅

**Teste upload em Admin:**

1. `/admin` → **Equipe** → Adicionar membro
   - [ ] Upload de foto funciona
   - [ ] Imagem aparece no preview
   - [ ] Imagem aparece no site (`/equipe`)

2. `/admin` → **Página Sobre**
   - [ ] Upload de imagem hero funciona
   - [ ] Upload de imagem history funciona
   - [ ] Imagens aparecem no preview
   - [ ] Imagens aparecem no site (`/sobre`)

3. `/admin` → **Blogs** → Novo Post → Aba "Imagens"
   - [ ] Upload de featured image funciona
   - [ ] Upload de foto do autor funciona
   - [ ] Imagens aparecem no preview
   - [ ] Imagens aparecem no post (`/blog/slug-do-post`)

**Verificar logs no console do navegador (F12):**
- ✅ Deve aparecer: `[About] 📤 Fazendo upload de imagem...`
- ✅ Deve aparecer: `Toast: "Imagem enviada com sucesso!"`
- ❌ NÃO deve aparecer: `Erro no upload`

---

## 🚀 Deploy no Render

### Variáveis de Ambiente Obrigatórias

Vá para: **Render Dashboard → Seu Serviço → Environment**

**Adicione (se ainda não adicionou):**

```bash
# Backend Supabase (SEM VITE_)
SUPABASE_URL=https://qzcdkfaaivwpfdpxchpl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...seu_token...

# Frontend Supabase (COM VITE_) - já devem estar
VITE_SUPABASE_URL=https://qzcdkfaaivwpfdpxchpl.supabase.co
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...seu_token...

# Database
DATABASE_URL=postgresql://postgres.qzcdkfaaivwpfdpxchpl:ConverseIA2025%21@aws-1-us-east-2.pooler.supabase.com:6543/postgres

# JWT
JWT_SECRET=your-secret-key-change-this-in-production-borges-2024-secure-key
```

### Push para GitHub

```bash
git push origin main
```

**Aguardar deploy automático no Render** (5-10 minutos)

---

## 🐛 Troubleshooting

### Editor não aparece formatação

**Causa:** CSS não carregado ou navegador cacheado  
**Solução:**
1. Limpe cache: `Ctrl + Shift + R` (Windows) / `Cmd + Shift + R` (Mac)
2. Verifique console (F12) se há erros CSS

---

### Formatação não aparece no site

**Causa:** Conteúdo antigo sem HTML  
**Solução:**
1. Edite o post no admin
2. Re-salve (mesmo sem mudar nada)
3. Verifique se agora aparece formatado

---

### Upload de imagem falha

**Causa 1:** Bucket `images` não existe  
**Solução:** Criar bucket no Supabase Dashboard

**Causa 2:** Variáveis de ambiente erradas no Render  
**Solução:**
1. Verifique se `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` existem (SEM VITE_)
2. Faça novo deploy após adicionar

**Causa 3:** Service role key errada  
**Solução:**
1. Vá para Supabase Dashboard → Settings → API
2. Copie **service_role key** (não anon key!)
3. Atualize variável `SUPABASE_SERVICE_ROLE_KEY`

---

## 📊 Commits Realizados

1. `263eec9` - Remove React Quill, cria editor nativo (React 19 compatível)
2. `e2e3ff3` - Corrige upload com SERVICE_ROLE_KEY (backend sem VITE_)
3. `c9e7d83` - Documentação variáveis Render
4. `4bef7dd` - Melhora renderização de formatação do blog

---

## ✅ Checklist Final (antes de mostrar ao cliente)

- [ ] Editor de blog abre sem erros
- [ ] Toolbar funciona (H1, H2, negrito, etc.)
- [ ] Conteúdo salva corretamente
- [ ] Formatação aparece no site público
- [ ] Upload de imagens funciona (equipe, sobre, blog)
- [ ] Imagens aparecem no site
- [ ] Deploy no Render concluído
- [ ] Site em produção funcionando 100%

---

## 🎉 Pronto!

Se todos os itens acima funcionarem, o sistema está **100% operacional**!

**Próximo passo:** Configurar chat/pop-up no admin (se ainda não fez) 💬
