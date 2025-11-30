# 🚀 Guia Rápido de Deploy - Cloudflare Pages

Este guia apresenta o passo a passo para fazer deploy da plataforma GENTE COMUNIDADE no Cloudflare Pages.

---

## 📋 Pré-requisitos

- Conta no [Cloudflare](https://dash.cloudflare.com)
- Repositório GitHub: `objetivatech/gente-networking`
- Credenciais do Supabase configuradas

---

## 🎯 Passo 1: Criar Projeto no Cloudflare Pages

1. Acesse o [Dashboard do Cloudflare](https://dash.cloudflare.com)
2. No menu lateral, clique em **Pages**
3. Clique em **Create a project**
4. Selecione **Connect to Git**
5. Autorize o acesso ao GitHub
6. Selecione o repositório: `objetivatech/gente-networking`
7. Clique em **Begin setup**

---

## ⚙️ Passo 2: Configurar Build Settings

Na tela de configuração do projeto, preencha:

### Build Configuration

| Campo | Valor |
|-------|-------|
| **Project name** | `gente-comunidade` |
| **Production branch** | `main` |
| **Framework preset** | `None` (ou `Vite`) |
| **Build command** | `pnpm install && pnpm build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` |

### Node.js Version

- Adicione variável de ambiente: `NODE_VERSION` = `22.13.0`

---

## 🔐 Passo 3: Configurar Variáveis de Ambiente

Clique em **Environment variables** e adicione as seguintes variáveis:

### Variáveis Obrigatórias do Supabase

```bash
SUPABASE_URL=https://wawnsuwrnsdfaowfhqjz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd25zdXdybnNkZmFvd2ZocWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4ODk0MzQsImV4cCI6MjA0ODQ2NTQzNH0.KdVIwRvXIBEWL2Zt7_tXNqmWJGgXhCzE9DcVBqCvdqE
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd25zdXdybnNkZmFvd2ZocWp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjg4OTQzNCwiZXhwIjoyMDQ4NDY1NDM0fQ.4JLnWiGHZnxLdZaLKFhxTYRjqRjXPNdVlJQbDPNvMqg
```

### Variáveis de Autenticação (Manus OAuth)

```bash
JWT_SECRET=sua-chave-secreta-jwt-aqui
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=seu-app-id-aqui
OWNER_OPEN_ID=seu-open-id-aqui
OWNER_NAME=Seu Nome
```

### Variáveis de API (Manus Forge)

```bash
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-chave-api-aqui
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua-chave-frontend-aqui
```

### Variáveis de Aplicação

```bash
VITE_APP_TITLE=GENTE Comunidade
VITE_APP_LOGO=https://gentenetworking.com.br/logo.png
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=seu-website-id-aqui
```

### Variáveis de Banco de Dados

```bash
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Importante:** Substitua `[PROJECT_REF]` e `[PASSWORD]` pelos valores corretos do seu projeto Supabase.

---

## 🚀 Passo 4: Iniciar Deploy

1. Revise todas as configurações
2. Clique em **Save and Deploy**
3. Aguarde o build completar (leva cerca de 3-5 minutos)
4. Após conclusão, você verá a URL do projeto: `https://gente-comunidade.pages.dev`

---

## ✅ Passo 5: Verificar Deploy

Após o deploy, verifique:

1. **Página inicial carrega corretamente**
   - Acesse: `https://gente-comunidade.pages.dev`
   - Deve exibir a tela de login

2. **Autenticação funciona**
   - Faça login com sua conta
   - Verifique se o dashboard carrega

3. **Conexão com Supabase**
   - Teste criar um grupo ou atividade
   - Verifique se os dados são salvos

---

## 🔧 Configurações Adicionais

### Domínio Customizado

1. No Cloudflare Pages, vá em **Custom domains**
2. Clique em **Set up a custom domain**
3. Digite seu domínio (ex: `comunidade.gentenetworking.com.br`)
4. Siga as instruções para configurar DNS

### Configurar CORS no Supabase

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Vá em **Settings** → **API**
3. Em **CORS Configuration**, adicione:
   ```
   https://gente-comunidade.pages.dev
   https://seu-dominio-customizado.com.br
   ```

### Configurar RLS (Row Level Security) no Supabase

Para garantir segurança, configure políticas RLS:

1. Acesse **Database** → **Tables**
2. Para cada tabela, clique em **RLS** e ative
3. Crie políticas básicas:

```sql
-- Exemplo: Permitir leitura para usuários autenticados
CREATE POLICY "Usuários podem ler dados"
ON public.users
FOR SELECT
TO authenticated
USING (true);

-- Exemplo: Permitir atualização apenas do próprio perfil
CREATE POLICY "Usuários podem atualizar próprio perfil"
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());
```

---

## 🔄 Atualizações Futuras

Após o deploy inicial, qualquer push para a branch `main` no GitHub irá automaticamente:

1. Disparar um novo build no Cloudflare Pages
2. Executar os testes
3. Fazer deploy da nova versão
4. Manter a URL antiga funcionando até o deploy completar

---

## 🐛 Troubleshooting

### Build Falha

**Erro:** `Command failed with exit code 1`

**Solução:**
- Verifique se todas as variáveis de ambiente estão configuradas
- Confirme que `NODE_VERSION=22.13.0` está definida
- Revise os logs de build no Cloudflare

### Erro de Conexão com Supabase

**Erro:** `Failed to connect to database`

**Solução:**
- Verifique se `SUPABASE_URL` e `SUPABASE_SERVICE_KEY` estão corretas
- Confirme que o IP do Cloudflare está permitido no Supabase
- Teste a conexão localmente primeiro

### Página em Branco

**Solução:**
- Abra o Console do navegador (F12)
- Verifique erros de CORS
- Confirme que todas as variáveis `VITE_*` estão configuradas

---

## 📞 Suporte

Para problemas ou dúvidas:

- **Documentação Cloudflare Pages:** https://developers.cloudflare.com/pages
- **Documentação Supabase:** https://supabase.com/docs
- **Repositório GitHub:** https://github.com/objetivatech/gente-networking

---

## 📝 Checklist Final

Antes de considerar o deploy completo, verifique:

- [ ] Site acessível via URL do Cloudflare Pages
- [ ] Login funcionando corretamente
- [ ] Dashboard carregando dados do Supabase
- [ ] Criação de grupos/encontros/atividades funcionando
- [ ] Ranking e gamificação atualizando
- [ ] Domínio customizado configurado (se aplicável)
- [ ] CORS configurado no Supabase
- [ ] RLS (Row Level Security) ativado
- [ ] Variáveis de ambiente de produção configuradas
- [ ] Testes passando no pipeline

---

**🎉 Parabéns! Sua plataforma GENTE COMUNIDADE está no ar!**
