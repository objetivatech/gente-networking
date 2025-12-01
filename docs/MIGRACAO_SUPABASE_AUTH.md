# Migração para Supabase Auth - Concluída ✅

## Resumo

O sistema GENTE COMUNIDADE foi migrado de **Manus OAuth** para **Supabase Auth**, tornando-o completamente independente e pronto para produção.

## O Que Foi Alterado

### 1. Backend

- ✅ Criado módulo `server/_core/supabase-auth.ts` para gerenciar autenticação
- ✅ Atualizado `server/_core/context.ts` para usar Supabase Auth
- ✅ Removidas dependências de Manus OAuth (`sdk.ts`, `cookies.ts`)
- ✅ Adicionadas procedures tRPC:
  - `auth.register` - Registro de novos usuários
  - `auth.login` - Login com email/senha
  - `auth.logout` - Logout
  - `auth.resetPassword` - Recuperação de senha

### 2. Frontend

- ✅ Criado componente `LoginForm.tsx`
- ✅ Criado componente `RegisterForm.tsx`
- ✅ Criada página `/auth` para autenticação
- ✅ Atualizado `useAuth` hook para redirecionar para `/auth`
- ✅ Atualizado `DashboardLayout` para usar nova autenticação
- ✅ Removidas dependências de `getLoginUrl()` do Manus

### 3. Banco de Dados

- ✅ Criado trigger `handle_new_user()` para sincronizar `auth.users` com `public.users`
- ✅ Configuradas políticas RLS (Row Level Security)
- ✅ Habilitado Supabase Auth no projeto

### 4. Documentação

- ✅ Atualizado `.env.vercel.example` removendo variáveis Manus OAuth
- ✅ Criado script SQL `supabase-auth-setup.sql`
- ✅ Criada documentação de migração

## Como Funciona Agora

### Fluxo de Registro

1. Usuário acessa `/auth` e clica em "Registre-se"
2. Preenche nome, email e senha
3. Sistema chama `trpc.auth.register.mutate()`
4. Supabase cria usuário em `auth.users`
5. Trigger `handle_new_user()` cria registro em `public.users`
6. Cookies de sessão são definidos
7. Usuário é redirecionado para dashboard

### Fluxo de Login

1. Usuário acessa `/auth`
2. Preenche email e senha
3. Sistema chama `trpc.auth.login.mutate()`
4. Supabase valida credenciais
5. Cookies de sessão são definidos
6. Usuário é redirecionado para dashboard

### Fluxo de Autenticação em Requests

1. Cliente faz request para API tRPC
2. `context.ts` chama `getUserFromRequest()`
3. Sistema lê cookies `sb-access-token` e `sb-refresh-token`
4. Supabase valida sessão
5. Sistema busca usuário em `public.users` usando `open_id`
6. Usuário é injetado no contexto tRPC

### Fluxo de Logout

1. Usuário clica em "Sign out"
2. Sistema chama `trpc.auth.logout.mutate()`
3. Supabase invalida sessão
4. Cookies são limpos
5. Usuário é redirecionado para `/auth`

## Configuração no Supabase Dashboard

### 1. Site URL

```
Settings → Authentication → Site URL
https://seu-dominio.com.br
```

### 2. Redirect URLs

```
Settings → Authentication → URL Configuration → Redirect URLs
https://seu-dominio.com.br/auth/callback
https://seu-dominio.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

### 3. Email Templates (Opcional)

Customize os templates em:
```
Settings → Authentication → Email Templates
```

- Confirm signup
- Magic Link
- Change Email Address
- Reset Password

### 4. Providers (Opcional)

Habilite providers adicionais em:
```
Settings → Authentication → Providers
```

Opções:
- Google
- GitHub
- Facebook
- etc.

## Variáveis de Ambiente Necessárias

### Desenvolvimento (`.env.local`)

```bash
SUPABASE_URL=https://wawnsuwrnsdfaowfhqjz.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
```

### Produção (Vercel)

Mesmas variáveis acima, configuradas em:
```
Vercel Dashboard → Settings → Environment Variables
```

## Segurança

### Cookies

- `httpOnly: true` - Não acessível via JavaScript
- `secure: true` - Apenas HTTPS em produção
- `sameSite: 'lax'` - Proteção CSRF
- `maxAge: 7 dias` - Sessão válida por 7 dias

### Row Level Security (RLS)

Todas as tabelas principais têm políticas RLS:

- **users**: Usuários podem ler/atualizar apenas seus próprios dados
- **activities**: Usuários podem ler suas próprias atividades
- **scores**: Usuários podem ler seus próprios scores
- **groups**: Todos podem ler grupos ativos

Admins têm acesso completo a todos os dados.

## Testes

Para testar a autenticação:

1. Inicie o servidor: `pnpm dev`
2. Acesse `http://localhost:3000/auth`
3. Registre uma nova conta
4. Verifique email de confirmação (se habilitado)
5. Faça login
6. Teste logout

## Troubleshooting

### Erro: "Invalid login credentials"

- Verifique se o email está confirmado
- Verifique se a senha está correta
- Verifique se o usuário existe em `auth.users`

### Erro: "User not found"

- Verifique se o trigger `handle_new_user()` está ativo
- Verifique se há registro em `public.users` com `open_id` correspondente

### Cookies não persistem

- Verifique se `secure: true` está configurado corretamente
- Verifique se o domínio está correto
- Verifique configurações de CORS

## Próximos Passos

- [ ] Implementar recuperação de senha no frontend
- [ ] Adicionar providers sociais (Google, GitHub)
- [ ] Implementar verificação de email
- [ ] Adicionar 2FA (autenticação de dois fatores)
- [ ] Implementar rate limiting para login

## Benefícios da Migração

✅ **Independência**: Não depende mais do Manus  
✅ **Controle Total**: Gerenciamento completo da autenticação  
✅ **Escalabilidade**: Supabase Auth suporta milhões de usuários  
✅ **Segurança**: RLS, políticas granulares, cookies seguros  
✅ **Flexibilidade**: Fácil adicionar providers sociais  
✅ **Custo**: Gratuito até 50.000 usuários ativos/mês  

## Conclusão

A migração para Supabase Auth foi concluída com sucesso! O sistema agora é completamente independente e pronto para produção. 🎉
