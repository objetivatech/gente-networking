# ✅ Variáveis de Ambiente Completas para Vercel

## 🚨 Problema

O site está carregando mas não funciona porque faltam variáveis de ambiente que começam com `VITE_`. Essas variáveis são substituídas durante o **build** e precisam estar configuradas **antes** do deploy.

---

## 📋 Variáveis Obrigatórias

Adicione TODAS estas variáveis no Vercel:

### 1. SUPABASE_URL
```
Key: SUPABASE_URL
Value: https://wawnsuwrnsdfaowfhqjz.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```

### 2. SUPABASE_ANON_KEY
```
Key: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd25zdXdybnNkZmFvd2ZocWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4ODk0MzQsImV4cCI6MjA0ODQ2NTQzNH0.KdVIwRvXIBEWL2Zt7_tXNqmWJGgXhCzE9DcVBqCvdqE
Environments: ✅ Production ✅ Preview ✅ Development
```

### 3. SUPABASE_SERVICE_KEY
```
Key: SUPABASE_SERVICE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd25zdXdybnNkZmFvd2ZocWp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjg4OTQzNCwiZXhwIjoyMDQ4NDY1NDM0fQ.4JLnWiGHZnxLdZaLKFhxTYRjqRjXPNdVlJQbDPNvMqg
Environments: ✅ Production ✅ Preview ✅ Development
```

### 4. VITE_APP_TITLE
```
Key: VITE_APP_TITLE
Value: GENTE Comunidade
Environments: ✅ Production ✅ Preview ✅ Development
```

### 5. VITE_APP_LOGO
```
Key: VITE_APP_LOGO
Value: https://gentenetworking.com.br/logo.png
Environments: ✅ Production ✅ Preview ✅ Development
```

### 6. VITE_ANALYTICS_ENDPOINT (Pode deixar vazio por enquanto)
```
Key: VITE_ANALYTICS_ENDPOINT
Value: (deixe vazio ou coloque: https://analytics.manus.im)
Environments: ✅ Production ✅ Preview ✅ Development
```

### 7. VITE_ANALYTICS_WEBSITE_ID (Pode deixar vazio por enquanto)
```
Key: VITE_ANALYTICS_WEBSITE_ID
Value: (deixe vazio)
Environments: ✅ Production ✅ Preview ✅ Development
```

---

## 🔧 Como Adicionar no Vercel

### Passo 1: Acessar Environment Variables
1. Acesse https://vercel.com/dashboard
2. Selecione o projeto **gente-networking**
3. Clique em **Settings**
4. No menu lateral, clique em **Environment Variables**

### Passo 2: Adicionar Cada Variável
Para cada variável acima:
1. Clique em **Add New**
2. Cole o **Key** (nome da variável)
3. Cole o **Value** (valor da variável)
4. Marque **✅ Production, ✅ Preview, ✅ Development**
5. Clique em **Save**

### Passo 3: Fazer Redeploy
**IMPORTANTE:** Após adicionar TODAS as variáveis:
1. Vá em **Deployments**
2. Clique no deployment mais recente
3. Clique nos **3 pontinhos** (⋯)
4. Selecione **Redeploy**
5. **NÃO marque** "Use existing Build Cache" (precisa rebuildar)
6. Clique em **Redeploy**

---

## ✅ Checklist

Antes de fazer redeploy, confirme que adicionou:

- [ ] SUPABASE_URL
- [ ] SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_KEY
- [ ] VITE_APP_TITLE
- [ ] VITE_APP_LOGO
- [ ] VITE_ANALYTICS_ENDPOINT (pode deixar vazio)
- [ ] VITE_ANALYTICS_WEBSITE_ID (pode deixar vazio)

---

## 🎯 Resultado Esperado

Após o redeploy com TODAS as variáveis:
- ✅ Site carrega completamente
- ✅ Mostra tela de login
- ✅ Permite fazer login com as credenciais de teste
- ✅ Sem erros no console do navegador

---

## ⚠️ Importante

1. **Variáveis VITE_*** são substituídas durante o build
2. Se adicionar/alterar variáveis VITE_*, sempre faça redeploy **SEM** cache
3. Variáveis sem VITE_ são server-side e podem usar cache no redeploy

---

**Última atualização:** 01/12/2025
