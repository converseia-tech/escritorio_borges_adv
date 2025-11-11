# 🔧 GUIA: Configurar Upload de Imagens no Supabase

## ❌ Problema Atual
Ao fazer upload de imagem no painel admin, aparece o erro:
```
"Supabase não está configurado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_SERVICE_ROLE_KEY"
```

## ✅ Solução (3 Passos)

### 📋 PASSO 1: Criar Bucket no Supabase Storage

1. **Acesse o SQL Editor do Supabase:**
   - https://supabase.com/dashboard/project/qzcdkfaaivwpfdpxchpl/sql/new

2. **Copie e cole o SQL do arquivo:**
   - `supabase-create-storage-bucket.sql`

3. **Clique em "Run"**

4. **Verifique se funcionou:**
   - Deve aparecer 1 linha no resultado
   - Vá em **Storage** no menu lateral do Supabase
   - Deve aparecer o bucket **"images"**

---

### 🔄 PASSO 2: Atualizar Código (JÁ FEITO)

✅ O arquivo `server/supabase-storage.ts` já foi corrigido para usar:
- `process.env.VITE_SUPABASE_URL`
- `process.env.VITE_SUPABASE_SERVICE_ROLE_KEY`

---

### 🚀 PASSO 3: Configurar Variáveis no Render

**IMPORTANTE:** O Render precisa das variáveis de ambiente configuradas!

1. **Acesse o Dashboard do Render:**
   - https://dashboard.render.com

2. **Selecione seu serviço** (escritorio-borges-adv)

3. **Vá em "Environment"**

4. **Adicione as variáveis:**

   ```
   VITE_SUPABASE_URL=https://qzcdkfaaivwpfdpxchpl.supabase.co
   ```

   ```
   VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6Y2RrZmFhaXZ3cGZkcHhjaHBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDc1NzU5OSwiZXhwIjoyMDQ2MzMzNTk5fQ.1YJMN01hl9CXcOhpJOz33FdpxQFDy5yFdqfHWWWfMiQ
   ```

5. **Clique em "Save Changes"**

6. **O Render vai fazer redeploy automaticamente**

---

### 🧪 PASSO 4: Testar

#### **Teste Local:**

1. Certifique-se de que o `.env` tem as variáveis (JÁ TEM ✅)

2. Reinicie o servidor:
   ```powershell
   # Se estiver rodando, pare com Ctrl+C
   pnpm dev
   ```

3. Acesse: http://localhost:3000/admin

4. Vá em **"Página Sobre"**

5. Faça upload de uma imagem

6. **Deve funcionar sem erros!**

#### **Teste Produção:**

1. Aguarde o deploy do Render completar

2. Acesse: https://escritorio-borges-adv.onrender.com/admin

3. Vá em **"Página Sobre"**

4. Faça upload de uma imagem

5. **Deve funcionar sem erros!**

---

## 📊 Verificação de Logs

### **Logs Esperados (Sucesso):**
```
[Supabase Storage] Usando credenciais do ambiente
[Supabase Storage] Iniciando upload: uploads/1730758123-abc123.jpg para bucket: images
[Supabase Storage] Upload concluído
[Supabase Storage] URL pública gerada: https://qzcdkfaaivwpfdpxchpl.supabase.co/storage/v1/object/public/images/uploads/...
```

### **Logs de Erro Comuns:**

1. **"Bucket not found"**
   - Execute o SQL do PASSO 1

2. **"Supabase não está configurado"**
   - Verifique as variáveis de ambiente no Render (PASSO 3)

3. **"Access denied"**
   - Verifique se a service_role_key está correta

---

## 🎯 Resumo

**Checklist:**
- [x] Código corrigido (`supabase-storage.ts`)
- [ ] SQL executado no Supabase (criar bucket)
- [ ] Variáveis adicionadas no Render
- [ ] Servidor reiniciado
- [ ] Upload testado

**Após seguir todos os passos, o upload deve funcionar perfeitamente!** ✨
