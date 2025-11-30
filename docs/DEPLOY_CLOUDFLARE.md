# Deploy no Cloudflare Pages - GENTE COMUNIDADE

## Visão Geral

Este guia explica como fazer o deploy da plataforma GENTE COMUNIDADE no Cloudflare Pages, uma plataforma de hospedagem moderna, rápida e escalável.

---

## Pré-requisitos

Antes de começar, você precisará:

1. **Conta no Cloudflare**
   - Acesse [cloudflare.com](https://cloudflare.com)
   - Crie uma conta gratuita ou faça login

2. **Repositório GitHub**
   - O código já está no repositório: `objetivatech/gente-networking`
   - Certifique-se de ter acesso ao repositório

3. **Credenciais do Supabase**
   - URL: `https://wawnsuwrnsdfaowfhqjz.supabase.co`
   - Anon Key e Service Key (já configuradas)

---

## Arquitetura do Projeto

O projeto GENTE COMUNIDADE é uma aplicação full-stack que consiste em:

### Frontend
- **Framework**: React 19 + Vite
- **UI**: Tailwind CSS 4 + shadcn/ui
- **Roteamento**: Wouter
- **Build**: Vite (gera arquivos estáticos)

### Backend
- **Framework**: Express 4 + tRPC 11
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Manus OAuth
- **API**: tRPC procedures

### Estrutura de Deploy

```
┌─────────────────────────────────────┐
│     Cloudflare Pages (Frontend)     │
│   - Servir arquivos estáticos       │
│   - React SPA                       │
└──────────────┬──────────────────────┘
               │
               │ API Calls
               ▼
┌─────────────────────────────────────┐
│   Cloudflare Workers (Backend)      │
│   - Express + tRPC                  │
│   - Serverless Functions            │
└──────────────┬──────────────────────┘
               │
               │ Database Queries
               ▼
┌─────────────────────────────────────┐
│         Supabase (Database)         │
│   - PostgreSQL                      │
│   - Storage                         │
└─────────────────────────────────────┘
```

---

## Opções de Deploy

### Opção 1: Deploy Híbrido (Recomendado)

**Frontend**: Cloudflare Pages  
**Backend**: Manter no servidor atual ou migrar para Cloudflare Workers

**Vantagens**:
- Deploy mais simples e rápido
- Menor risco de problemas
- Backend continua funcionando normalmente

**Passos**:

1. **Build do Frontend**
   ```bash
   cd /home/ubuntu/gente-comunidade
   pnpm run build
   ```

2. **Deploy no Cloudflare Pages**
   - Acesse Cloudflare Dashboard
   - Vá em "Pages" > "Create a project"
   - Conecte ao GitHub: `objetivatech/gente-networking`
   - Configure:
     - **Build command**: `pnpm run build`
     - **Build output directory**: `client/dist`
     - **Root directory**: `/`

3. **Configurar Variáveis de Ambiente**
   - No Cloudflare Pages, vá em "Settings" > "Environment variables"
   - Adicione:
     ```
     VITE_API_URL=https://seu-backend.com/api
     VITE_APP_TITLE=GENTE COMUNIDADE
     ```

### Opção 2: Deploy Completo no Cloudflare

**Frontend**: Cloudflare Pages  
**Backend**: Cloudflare Workers

**Vantagens**:
- Tudo em uma plataforma
- Melhor performance global
- Escalabilidade automática

**Desafios**:
- Requer adaptação do código Express para Workers
- Mais complexo de configurar

---

## Passo a Passo: Deploy no Cloudflare Pages

### 1. Preparar o Projeto

```bash
cd /home/ubuntu/gente-comunidade

# Instalar dependências
pnpm install

# Build do frontend
pnpm run build

# Verificar se o build foi bem-sucedido
ls -la client/dist
```

### 2. Conectar ao GitHub

O código já está no repositório GitHub:
- **Repositório**: `objetivatech/gente-networking`
- **Branch**: `main`

### 3. Criar Projeto no Cloudflare Pages

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com)
2. No menu lateral, clique em **"Workers & Pages"**
3. Clique em **"Create application"**
4. Selecione **"Pages"**
5. Clique em **"Connect to Git"**

### 4. Configurar Repositório

1. Selecione **GitHub** como provedor
2. Autorize o Cloudflare a acessar seus repositórios
3. Selecione o repositório: **`objetivatech/gente-networking`**
4. Clique em **"Begin setup"**

### 5. Configurar Build

Preencha as configurações:

```
Project name: gente-comunidade
Production branch: main
```

**Build settings**:
```
Framework preset: None (ou Vite)
Build command: pnpm run build
Build output directory: client/dist
Root directory: /
```

**Environment variables** (clique em "Add variable"):
```
NODE_VERSION=22
VITE_APP_TITLE=GENTE COMUNIDADE
VITE_APP_LOGO=/logo.png
```

### 6. Deploy

1. Clique em **"Save and Deploy"**
2. Aguarde o build completar (2-5 minutos)
3. Você receberá uma URL: `https://gente-comunidade.pages.dev`

---

## Configurar Backend

### Opção A: Manter Backend Atual

Se você já tem um servidor rodando o backend:

1. **Configurar CORS** no backend para aceitar requisições do Cloudflare Pages
2. **Atualizar variáveis de ambiente** no Cloudflare Pages:
   ```
   VITE_API_URL=https://seu-backend-atual.com
   ```

### Opção B: Migrar para Cloudflare Workers

Para migrar o backend Express para Cloudflare Workers:

1. **Criar Worker**
   ```bash
   # Instalar Wrangler CLI
   npm install -g wrangler
   
   # Login no Cloudflare
   wrangler login
   
   # Criar novo Worker
   wrangler init gente-backend
   ```

2. **Adaptar Código**
   - Cloudflare Workers não suportam Express diretamente
   - Use `hono` ou `itty-router` como alternativa
   - Adapte as rotas tRPC para Workers

3. **Deploy do Worker**
   ```bash
   wrangler deploy
   ```

---

## Configurar Domínio Personalizado

### 1. Adicionar Domínio

1. No Cloudflare Pages, vá em **"Custom domains"**
2. Clique em **"Set up a custom domain"**
3. Digite seu domínio: `comunidade.gentenetworking.com.br`
4. Siga as instruções para configurar DNS

### 2. Configurar DNS

Se seu domínio já está no Cloudflare:
- O DNS será configurado automaticamente

Se seu domínio está em outro provedor:
1. Adicione um registro CNAME:
   ```
   Type: CNAME
   Name: comunidade
   Value: gente-comunidade.pages.dev
   ```

### 3. SSL/TLS

- O Cloudflare fornece SSL gratuito automaticamente
- Aguarde alguns minutos para o certificado ser emitido
- Acesse via HTTPS: `https://comunidade.gentenetworking.com.br`

---

## Variáveis de Ambiente

### Frontend (Cloudflare Pages)

Configure em: **Settings** > **Environment variables**

```bash
# Aplicação
VITE_APP_TITLE=GENTE COMUNIDADE
VITE_APP_LOGO=/logo.png

# API Backend
VITE_API_URL=https://api.gentenetworking.com.br

# Supabase (apenas chaves públicas)
VITE_SUPABASE_URL=https://wawnsuwrnsdfaowfhqjz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OAuth
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
```

### Backend (Cloudflare Workers)

Configure via `wrangler.toml` ou Dashboard:

```bash
# Supabase
SUPABASE_URL=https://wawnsuwrnsdfaowfhqjz.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (chave privada)

# OAuth
OAUTH_SERVER_URL=https://api.manus.im
JWT_SECRET=sua-chave-secreta

# Outros
NODE_ENV=production
```

---

## Monitoramento e Logs

### Cloudflare Pages

1. Acesse o projeto no dashboard
2. Vá em **"Deployments"** para ver histórico
3. Clique em um deployment para ver logs

### Cloudflare Workers

1. Acesse **"Workers & Pages"**
2. Selecione seu Worker
3. Vá em **"Logs"** para ver logs em tempo real

### Supabase

1. Acesse o painel do Supabase
2. Vá em **"Logs"** para ver queries
3. Use **"Database"** > **"Logs"** para debug

---

## Otimizações

### Performance

1. **Habilitar Caching**
   - Cloudflare Pages já faz cache automático
   - Configure cache headers no backend

2. **Minificar Assets**
   - Vite já faz minificação no build
   - Verifique se está habilitado em `vite.config.ts`

3. **Lazy Loading**
   - Implemente code splitting
   - Carregue componentes sob demanda

### SEO

1. **Meta Tags**
   - Configure `index.html` com meta tags apropriadas
   - Use Open Graph para redes sociais

2. **Sitemap**
   - Gere um sitemap.xml
   - Adicione em `public/sitemap.xml`

3. **robots.txt**
   - Configure em `public/robots.txt`

---

## Troubleshooting

### Build Falha

**Erro**: `Command failed with exit code 1`

**Solução**:
1. Verifique os logs de build
2. Confirme que `pnpm run build` funciona localmente
3. Verifique se todas as dependências estão no `package.json`

### Página em Branco

**Erro**: Página carrega mas fica em branco

**Solução**:
1. Abra o console do navegador (F12)
2. Verifique erros de JavaScript
3. Confirme que as variáveis de ambiente estão corretas
4. Verifique se o `base` no `vite.config.ts` está correto

### API Não Responde

**Erro**: Requisições para API falham

**Solução**:
1. Verifique se `VITE_API_URL` está correto
2. Confirme que o backend está rodando
3. Verifique CORS no backend
4. Teste a API diretamente (Postman/curl)

### Erro 404 em Rotas

**Erro**: Ao acessar `/grupos` diretamente, retorna 404

**Solução**:
1. Configure redirects no Cloudflare Pages
2. Crie arquivo `public/_redirects`:
   ```
   /* /index.html 200
   ```

---

## Rollback

Se algo der errado, você pode fazer rollback:

1. Acesse **"Deployments"** no Cloudflare Pages
2. Localize o deployment anterior que funcionava
3. Clique em **"⋯"** > **"Rollback to this deployment"**
4. Confirme a operação

---

## CI/CD Automático

O Cloudflare Pages faz deploy automático:

1. **Push para `main`**: Deploy em produção
2. **Pull Request**: Deploy de preview
3. **Outros branches**: Deploy de desenvolvimento

### Configurar Ambientes

1. **Production**: Branch `main`
2. **Staging**: Branch `staging`
3. **Development**: Outros branches

Configure variáveis diferentes para cada ambiente.

---

## Custos

### Cloudflare Pages

**Plano Free**:
- ✅ 500 builds por mês
- ✅ Banda ilimitada
- ✅ SSL gratuito
- ✅ DDoS protection

**Plano Pro** ($20/mês):
- 5,000 builds por mês
- Suporte prioritário
- Mais workers simultâneos

### Cloudflare Workers

**Plano Free**:
- 100,000 requisições/dia
- 10ms CPU time

**Plano Paid** ($5/mês):
- 10 milhões de requisições/mês
- 50ms CPU time

---

## Próximos Passos

Após o deploy:

1. **Testar Completamente**
   - Todas as funcionalidades
   - Em diferentes navegadores
   - Em dispositivos móveis

2. **Configurar Monitoramento**
   - Cloudflare Analytics
   - Supabase Logs
   - Alertas de erro

3. **Documentar**
   - URLs de produção
   - Credenciais de acesso
   - Procedimentos de manutenção

4. **Treinar Equipe**
   - Como fazer deploy
   - Como resolver problemas comuns
   - Quem contatar em caso de emergência

---

## Suporte

**Documentação Oficial**:
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Supabase Docs](https://supabase.com/docs)

**Comunidade**:
- [Cloudflare Community](https://community.cloudflare.com/)
- [Supabase Discord](https://discord.supabase.com/)

---

**Última atualização**: Novembro 2025  
**Versão**: 1.0.0
