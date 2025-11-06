# Configuração do Supabase - Passo a Passo

## 1. Execute o SQL no Supabase

1. Acesse o painel do Supabase: https://supabase.com/dashboard/project/qzcdkfaaivwpfdpxchpl
2. No menu lateral, clique em "SQL Editor"
3. Cole todo o conteúdo do arquivo `supabase-setup.sql`
4. Clique em "Run" para executar

O SQL criará automaticamente todas as tabelas e inserirá dados de exemplo.

## 2. Variáveis de Ambiente Configuradas

As variáveis de ambiente já foram configuradas no arquivo `.env`:

```env
DATABASE_URL=postgresql://postgres.qzcdkfaaivwpfdpxchpl:Trento2025!!@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

## 3. Schema Atualizado

O projeto agora usa:
- PostgreSQL (ao invés de MySQL)
- Snake_case nos nomes das colunas (padrão PostgreSQL)
- Novo schema em `drizzle/schema-pg.ts`

## 4. Reiniciar o Servidor

Após executar o SQL no Supabase, reinicie o servidor de desenvolvimento:

```powershell
# Pare o servidor atual (Ctrl+C)
# Depois execute:
npm run dev
```

## 5. Verificar no Navegador

Acesse http://localhost:3000 e verifique:
- ✅ Seção "Áreas de Atuação" deve exibir os cards
- ✅ Seção "Equipe" deve exibir os membros
- ✅ Todas as outras seções devem funcionar

## 6. Acessar o Painel Admin

Acesse http://localhost:3000/admin para gerenciar o conteúdo.

## Troubleshooting

### Se as áreas de atuação ainda não aparecerem:

1. Verifique os logs do servidor no terminal
2. Abra o DevTools do navegador (F12) e veja se há erros no console
3. Verifique se as tabelas foram criadas no Supabase:
   - Vá para "Table Editor" no painel do Supabase
   - Deve haver 9 tabelas criadas

### Se houver erro de conexão:

Verifique se a URL de conexão está correta no `.env`:
```env
DATABASE_URL=postgresql://postgres.qzcdkfaaivwpfdpxchpl:Trento2025!!@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

## Credenciais do Supabase

- **URL**: https://qzcdkfaaivwpfdpxchpl.supabase.co
- **Anon Public**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- **Service Role**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

(As chaves completas estão no email/dashboard do Supabase)
