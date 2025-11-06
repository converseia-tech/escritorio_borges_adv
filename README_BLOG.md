# 📰 Sistema de Blog - Borges Advogados

## ✅ Implementado

### 📄 Páginas Criadas

1. **`/blog`** - Listagem de artigos
   - Grid responsivo com cards de artigos
   - Informações: título, excerpt, data, autor
   - Imagem destacada (se houver)
   - Link para ler artigo completo

2. **`/blog/:slug`** - Artigo individual
   - Layout completo do artigo
   - Imagem destacada
   - Metadados (autor, data)
   - Conteúdo HTML renderizado
   - Botão de compartilhamento
   - Call-to-action para contato
   - Artigos relacionados
   - Botão voltar para blog

### 🎨 Componentes

- ✅ Layout responsivo e moderno
- ✅ Tipografia otimizada para leitura
- ✅ Cards com hover effects
- ✅ Badges e ícones
- ✅ Formatação de datas em português
- ✅ Renderização de HTML no conteúdo

### 🔗 Integração

- ✅ Rota `/blog` adicionada na Navbar
- ✅ Rotas configuradas no App.tsx
- ✅ Conectado ao tRPC para buscar artigos
- ✅ Sincronizado com painel admin

### 📝 Conteúdos de Exemplo

Foram criados 5 artigos jurídicos completos:

1. **Fraudes Bancárias com RMC**
   - Como identificar fraudes
   - Direitos das vítimas
   - Como recuperar valores

2. **Guia Completo sobre Pensão Alimentícia**
   - Quem tem direito
   - Como calcular o valor
   - Como solicitar

3. **Direitos Trabalhistas na Demissão**
   - Tipos de demissão
   - Direitos de cada tipo
   - Quando procurar advogado

4. **Negativação Indevida**
   - Como limpar o nome
   - Direito à indenização
   - Valores e prazos

5. **Aposentadoria por Idade**
   - Requisitos após Reforma da Previdência
   - Como calcular benefício
   - Como fazer o pedido

## 🔄 Sincronização com Admin

### Painel Administrativo

O blog está totalmente integrado ao painel admin em `/admin`:

**Aba "Blogs":**
- ✅ Listar todos os blogs (publicados e rascunhos)
- ✅ Criar novo blog
- ✅ Editar blog existente
- ✅ Deletar blog
- ✅ Publicar/Despublicar
- ✅ Upload de imagem destacada
- ✅ Editor de conteúdo

### Campos Disponíveis

- **Título**: Título principal do artigo
- **Slug**: URL amigável (gerado automaticamente)
- **Conteúdo**: HTML completo do artigo
- **Excerpt**: Resumo para listagem
- **Imagem Destacada**: Upload via Supabase Storage
- **Autor**: Nome do autor
- **Publicado**: Status (0=rascunho, 1=publicado)
- **Data de Publicação**: Timestamp

## 🗄️ Banco de Dados

### Tabela `blogs`

```sql
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author VARCHAR(255),
  published SMALLINT DEFAULT 0 CHECK (published IN (0, 1)),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### Inserir Dados

Execute o arquivo `supabase-setup.sql` atualizado que já contém os 5 artigos de exemplo.

Ou execute manualmente no SQL Editor do Supabase:

```sql
-- Os INSERT statements já estão no supabase-setup.sql
-- Basta executar o arquivo completo
```

## 🎯 Como Usar

### Para Visitantes do Site

1. Acesse http://localhost:3000
2. Clique em **"BLOG"** na navbar
3. Navegue pelos artigos
4. Clique em um artigo para ler completo
5. Compartilhe via botão de compartilhar

### Para Administradores

1. Acesse http://localhost:3000/admin
2. Vá na aba **"Blogs"**
3. Clique em **"Adicionar Blog"**
4. Preencha:
   - Título
   - Slug (opcional, será gerado automaticamente)
   - Conteúdo (use HTML)
   - Excerpt (resumo)
   - Autor
   - Marque "Publicado" para tornar visível
5. Faça upload da imagem destacada
6. Clique em **"Salvar"**

## 📝 Criando Conteúdo

### Dicas para Escrever Artigos

1. **Título atrativo**: 60-70 caracteres
2. **Excerpt**: 150-160 caracteres
3. **Conteúdo**: Estruturado com H2, H3, listas
4. **Imagens**: 1200x630px (formato landscape)

### Estrutura Recomendada

```html
<h2>Introdução</h2>
<p>Parágrafo introdutório...</p>

<h2>Tópico Principal 1</h2>
<p>Conteúdo...</p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<h2>Tópico Principal 2</h2>
<p>Conteúdo...</p>

<h2>Conclusão</h2>
<p>Como podemos ajudar...</p>
```

### Formatação HTML

O conteúdo suporta:
- `<h2>`, `<h3>` - Títulos
- `<p>` - Parágrafos
- `<ul>`, `<ol>`, `<li>` - Listas
- `<strong>`, `<em>` - Negrito e itálico
- `<a href="">` - Links

## 🔍 SEO

### URLs Amigáveis

Cada artigo tem uma URL única:
- ✅ `/blog/entenda-seus-direitos-fraude-bancaria-rmc`
- ✅ `/blog/guia-completo-pensao-alimenticia`
- ✅ `/blog/direitos-trabalhistas-demissao`

### Metadados

- ✅ Título otimizado
- ✅ Descrição (excerpt)
- ✅ Data de publicação
- ✅ Autor
- ✅ Imagem destacada

## 📱 Responsivo

O blog é totalmente responsivo:
- ✅ Mobile (< 768px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (> 1024px)

## 🚀 Funcionalidades Futuras (Opcional)

### Sugestões de Melhorias

- [ ] Categorias de artigos
- [ ] Tags/palavras-chave
- [ ] Busca de artigos
- [ ] Comentários
- [ ] Artigos relacionados inteligentes
- [ ] Newsletter
- [ ] RSS Feed
- [ ] Contagem de visualizações
- [ ] Tempo de leitura estimado
- [ ] Índice automático (table of contents)

## 🐛 Troubleshooting

### Artigos não aparecem

**Causa**: Campo `published` está em 0 (rascunho)

**Solução**: No painel admin, edite o artigo e marque "Publicado"

### Imagem não carrega

**Causa**: Bucket do Supabase não criado ou URL incorreta

**Solução**: 
1. Crie bucket `images` no Supabase
2. Faça upload da imagem
3. Copie URL pública

### Data em formato errado

**Causa**: Biblioteca date-fns não instalada

**Solução**: `npm install date-fns`

### Conteúdo HTML não renderiza

**Causa**: Uso de `dangerouslySetInnerHTML` incorreto

**Solução**: Já está implementado corretamente no BlogPost.tsx

## 📊 Estatísticas Atuais

- ✅ 5 artigos publicados
- ✅ 2 páginas criadas
- ✅ 100% sincronizado com admin
- ✅ 100% responsivo

## 🎉 Pronto para Usar!

O sistema de blog está completamente funcional e pronto para uso. Basta:

1. ✅ Executar o SQL atualizado no Supabase
2. ✅ Acessar /blog para ver os artigos
3. ✅ Usar /admin para gerenciar conteúdo

---

**Data**: Novembro 6, 2025  
**Versão**: 2.1.0  
**Status**: ✅ Totalmente Funcional
