# Borges Advogados Associados - Website

Site institucional para o escritório Borges Advogados Associados, desenvolvido com React, TypeScript, Vite e tRPC.

## 🚀 Tecnologias

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Wouter (roteamento)
- **Backend**: Express, tRPC, Drizzle ORM
- **Banco de Dados**: MySQL
- **Build**: Vite 7, esbuild

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- npm ou pnpm
- MySQL (v8 ou superior)

## 🔧 Instalação

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd escritorio_borges_adv
```

2. Instale as dependências
```bash
npm install --legacy-peer-deps
```

3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e ajuste as configurações:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL=mysql://usuario:senha@localhost:3306/borges_advogados

# JWT Secret (use uma chave forte em produção)
JWT_SECRET=sua-chave-secreta-aqui

# App Configuration
VITE_APP_TITLE=Borges Advogados Associados
VITE_APP_LOGO=https://placehold.co/128x128/E1E7EF/1F2937?text=BA
```

4. Configure o banco de dados

Execute as migrações:

```bash
npm run db:push
```

5. (Opcional) Popule o banco com dados de exemplo

```bash
npm run seed
```

## 🎯 Modo de Desenvolvimento

Para executar o servidor de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

### Acesso ao Painel Admin

**Modo Local (sem OAuth configurado):**
- Acesse `http://localhost:3000/admin`
- O sistema funcionará em modo de desenvolvimento local
- Você verá um badge "Modo Local" no cabeçalho

**Modo OAuth (em produção):**
- Configure as variáveis `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL` e `VITE_APP_ID`
- O sistema utilizará autenticação OAuth

## 🏗️ Build para Produção

```bash
npm run build
```

Os arquivos compilados estarão na pasta `dist/`.

Para executar em produção:

```bash
npm start
```

## 📁 Estrutura do Projeto

```
escritorio_borges_adv/
├── client/               # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas/Rotas
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilitários
│   └── public/          # Arquivos estáticos
├── server/              # Backend Express + tRPC
│   ├── _core/          # Configuração do servidor
│   ├── routers.ts      # Rotas tRPC
│   └── db.ts           # Configuração do banco
├── drizzle/            # Migrações e schema do DB
└── shared/             # Código compartilhado
```

## 🎨 Funcionalidades

### Páginas Públicas
- **Home**: Página principal com todas as seções
- **Áreas de Atuação**: Detalhes de cada área de prática
- **Equipe**: Perfis dos advogados
- **Formulário de Contato**: Integrado com cada seção

### Painel Administrativo (`/admin`)
- Gerenciamento de Hero Section
- Gerenciamento de Áreas de Atuação
- Gerenciamento de Membros da Equipe
- Gerenciamento de Conteúdo "Sobre Nós"
- Gerenciamento de Blogs (em desenvolvimento)
- Configurações do Site

## 🔐 Autenticação

O sistema suporta dois modos de autenticação:

1. **Modo Local**: Para desenvolvimento, não requer configuração OAuth
2. **Modo OAuth**: Para produção, utilizando servidor OAuth externo

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm start` - Inicia servidor em produção
- `npm run check` - Verifica tipos TypeScript
- `npm run format` - Formata código com Prettier
- `npm run test` - Executa testes
- `npm run db:push` - Executa migrações do banco

## 🐛 Solução de Problemas

### Erro "NODE_ENV não é reconhecido" no Windows
✅ **Resolvido**: O projeto agora usa `cross-env` para compatibilidade com Windows.

### Erro "Invalid URL" no painel admin
✅ **Resolvido**: O sistema agora funciona em modo local sem necessitar OAuth configurado.

### Outras páginas não abrem
✅ **Resolvido**: 
- Links de navegação corrigidos para usar âncoras (`/#sobre-nos`, `/#contato`)
- Rotas de áreas de atuação corrigidas para `/area/:slug`

### npm install com erros de dependência
Use o flag `--legacy-peer-deps`:
```bash
npm install --legacy-peer-deps
```

## 📞 Suporte

Para questões ou problemas, entre em contato com a equipe de desenvolvimento.

## 📄 Licença

MIT
