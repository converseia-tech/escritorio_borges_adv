# 💬 Sistema de Chat/Pop-up - Guia de Uso

## 📋 Funcionalidades

O sistema permite adicionar um chat ou pop-up no site com **duas opções**:

1. **WhatsApp** - Botão flutuante verde com link direto para WhatsApp
2. **Script Personalizado** - Inserir código de chatbot/widget externo

---

## 🚀 Como Configurar

### 1️⃣ Acesse o Painel Admin

1. Vá para: `https://seu-site.com/admin`
2. Clique na aba **"Chat"**

---

### 2️⃣ Opção WhatsApp

**Configuração:**

1. Ative o switch "Habilitar Chat"
2. Selecione "WhatsApp"
3. Preencha:
   - **Número do WhatsApp**: `5548999999999` (com código do país + DDD)
   - **Mensagem Padrão** (opcional): Ex: "Olá! Gostaria de agendar uma consulta."
4. Clique em "Salvar Configurações"

**Resultado:**
- Botão flutuante verde no canto inferior direito
- Animação de pulso
- Tooltip ao passar o mouse
- Ao clicar, abre WhatsApp Web/App com mensagem preenchida

**Exemplo de número:**
```
Brasil: 5548999999999
  55 = Código do país
  48 = DDD
  999999999 = Número
```

---

### 3️⃣ Opção Script Personalizado

**Quando usar:**
- Chatbots como RA Chatbot Widget
- Live Chat (Zendesk, Intercom, Drift)
- Widgets de atendimento personalizados

**Configuração:**

1. Ative o switch "Habilitar Chat"
2. Selecione "Script Personalizado"
3. Cole o código fornecido pela plataforma

**Exemplo de script (RA Chatbot Widget):**
```html
<script>
  (function(e, t, n) {
    let a = document.createElement("ra-chatbot-widget");
    a.id = "ra_wc_chatbot";
    a.setAttribute("slug", "BQU7HJ8J7nypDjwquceLtHCqDfoGeLBsykgSAWng");
    document.body.appendChild(a);
    
    let d = e.scripts[e.scripts.length - 1],
        r = e.createElement("script");

    r.id = "ra_chatbot" + Math.floor(200 * Math.random());
    r.defer = true;
    r.src = "https://sitewidget.net/chatbot-sdk.js";

    r.onload = r.onreadystatechange = function() {
      let e = this.readyState;
      if (!e || e === "complete" || e === "loaded") {
        // Callback
      }
    };

    d.parentElement.insertBefore(r, d.nextSibling);
  })(document);
</script>
```

4. Clique em "Salvar Configurações"

**Resultado:**
- O script será injetado automaticamente no site
- O chatbot/widget aparecerá conforme configurado na plataforma

---

## ⚙️ Configurações Técnicas

### Banco de Dados

Execute a migration no Supabase:

```sql
-- Execute em: https://supabase.com/dashboard/project/SEU_PROJETO/sql

CREATE TABLE IF NOT EXISTS chat_settings (
  id SERIAL PRIMARY KEY,
  enabled SMALLINT NOT NULL DEFAULT 0,
  type VARCHAR(20) NOT NULL DEFAULT 'whatsapp',
  whatsapp_number VARCHAR(20),
  whatsapp_message TEXT,
  custom_script TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO chat_settings (enabled, type, whatsapp_number, whatsapp_message)
VALUES (0, 'whatsapp', '', 'Olá! Gostaria de mais informações.')
ON CONFLICT DO NOTHING;
```

**Ou execute localmente:**
```bash
npm run db:push
```

---

## 🎨 Personalização do WhatsApp

### Alterar Posição
Edite `client/src/components/ChatWidget.tsx`:

```tsx
// Trocar de direita para esquerda:
className="fixed bottom-6 left-6 ..."  // Era: right-6

// Alterar distância do rodapé:
className="fixed bottom-10 right-10 ..."  // Era: bottom-6
```

### Alterar Cor
```tsx
// Trocar verde para azul:
className="bg-blue-500 hover:bg-blue-600 ..."  // Era: green-500
```

### Alterar Tamanho
```tsx
// Botão maior:
className="... p-6 ..."  // Era: p-4
<Phone className="h-8 w-8" />  // Era: h-6 w-6
```

---

## 🔒 Segurança

**⚠️ IMPORTANTE ao usar Script Personalizado:**

1. **Apenas use scripts de fontes confiáveis**
2. **Revise o código antes de inserir**
3. Scripts maliciosos podem:
   - Roubar dados dos visitantes
   - Modificar o conteúdo do site
   - Injetar malware

**Fontes confiáveis:**
- ✅ Plataformas oficiais (Zendesk, Intercom, Drift)
- ✅ Chatbots certificados
- ✅ Código revisado por desenvolvedor

**Fontes NÃO confiáveis:**
- ❌ Scripts de sites desconhecidos
- ❌ Código de terceiros não verificado
- ❌ Widgets "gratuitos" suspeitos

---

## 📊 Monitoramento

### Como Saber se Está Funcionando?

**WhatsApp:**
1. Abra o site (não logado no admin)
2. Deve aparecer botão verde flutuante
3. Clique e verifique se abre WhatsApp

**Script Personalizado:**
1. Abra o site
2. Verifique se o chatbot aparece
3. Teste enviar uma mensagem

### Console do Navegador
Pressione `F12` e verifique:
- Não deve haver erros em vermelho
- Para WhatsApp: Nada especial aparece (é apenas um link)
- Para Script: Deve aparecer logs do chatbot (ex: "Chatbot initialized")

---

## 🐛 Resolução de Problemas

### WhatsApp não abre

**Problema:** Número inválido
**Solução:** 
```
Formato correto: 5548999999999
NÃO use: +55, espaços, parênteses, hífens
```

**Problema:** Mensagem não aparece preenchida
**Solução:** Verifique se há caracteres especiais. Use apenas letras, números e pontuação básica.

---

### Script não funciona

**Problema:** Widget não aparece
**Solução:**
1. Verifique se salvou as configurações
2. Recarregue a página (Ctrl+F5)
3. Verifique no Console (F12) se há erros

**Problema:** Múltiplos widgets aparecem
**Solução:** Desabilite, aguarde 10 segundos, habilite novamente

---

### Chat aparece no admin

**Solução:** O chat aparece em todas as páginas. Para ocultar no admin, adicione:

```tsx
// Em App.tsx, altere:
<Route path={"/admin"} component={Admin} />

// Para:
<Route path={"/admin"}>
  <ChatWidget hide />
  <Admin />
</Route>
```

---

## 📱 Compatibilidade

**WhatsApp:**
- ✅ Desktop (abre WhatsApp Web)
- ✅ Mobile (abre WhatsApp App)
- ✅ Todos os navegadores

**Script Personalizado:**
- ⚠️ Depende do chatbot usado
- Teste em: Chrome, Firefox, Safari, Edge
- Teste em: Desktop e Mobile

---

## 💡 Dicas

### Mensagem WhatsApp Eficiente:
```
"Olá! Vi o site de vocês e gostaria de saber mais sobre [ÁREA DE ATUAÇÃO]. Poderia me ajudar?"
```

### Quando Desabilitar:
- Durante manutenção
- Para testar novos chatbots
- Se receber muitos spams

### Trocar de WhatsApp para Chatbot:
1. Desabilite o chat
2. Salve
3. Troque o tipo
4. Configure o novo
5. Habilite

---

## 📞 Suporte

**Dúvidas sobre configuração?**
- Consulte o desenvolvedor
- Execute os comandos SQL com atenção
- Teste em ambiente local primeiro

**Problemas técnicos?**
- Verifique logs do navegador (F12)
- Teste em modo anônimo
- Limpe cache do navegador
