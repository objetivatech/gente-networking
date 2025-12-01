# Configurar Variáveis de Ambiente no Vercel

## 🚨 Problema Atual

O site está carregando mas mostrando apenas skeletons porque as **variáveis de ambiente do Supabase não estão configuradas** no Vercel.

## ✅ Solução: Adicionar Variáveis de Ambiente

### Passo 1: Acessar Configurações do Projeto

1. Acesse https://vercel.com/dashboard
2. Selecione o projeto **gente-networking**
3. Clique em **Settings** (Configurações)
4. No menu lateral, clique em **Environment Variables**

### Passo 2: Adicionar Variáveis Obrigatórias

Adicione as seguintes variáveis **uma por uma**:

#### 1. SUPABASE_URL
- **Key:** `SUPABASE_URL`
- **Value:** `https://wawnsuwrnsdfaowfhqjz.supabase.co`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### 2. SUPABASE_ANON_KEY
- **Key:** `SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd25zdXdybnNkZmFvd2ZocWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MDc5OTcsImV4cCI6MjA0ODQ4Mzk5N30.Ywz8Xhkf0Xp5sDJxYHdGPVpJGkVRqvZYKZcbRLwYLvU`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

#### 3. SUPABASE_SERVICE_KEY
- **Key:** `SUPABASE_SERVICE_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd25zdXdybnNkZmFvd2ZocWp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjkwNzk5NywiZXhwIjoyMDQ4NDgzOTk3fQ.BqIJvyxQxYp6TqPWGHZqGLKkPJVZYKZcbRLwYLvUxYz`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### Passo 3: Fazer Redeploy

Após adicionar todas as variáveis:

1. Vá em **Deployments** (no menu superior)
2. Clique no deployment mais recente
3. Clique nos **3 pontinhos** (⋯) no canto superior direito
4. Selecione **Redeploy**
5. Marque **Use existing Build Cache** (opcional, mais rápido)
6. Clique em **Redeploy**

### Passo 4: Aguardar Deploy

- O deploy leva ~2-3 minutos
- Aguarde a mensagem "Ready" aparecer
- Acesse https://app.gentenetworking.com.br novamente

---

## 🔍 Como Verificar se Funcionou

Após o redeploy, o site deve:
- ✅ Carregar completamente (sem skeletons infinitos)
- ✅ Mostrar a tela de login
- ✅ Permitir fazer login com as credenciais de teste

---

## ⚠️ Notas Importantes

1. **Nunca commite as variáveis de ambiente no código**
2. As variáveis são secretas e devem ficar apenas no Vercel
3. Se precisar alterar alguma variável, edite no Vercel e faça redeploy
4. As variáveis são aplicadas em todos os ambientes (Production, Preview, Development)

---

## 🆘 Se Ainda Não Funcionar

Verifique:
1. Se todas as 3 variáveis foram adicionadas corretamente
2. Se o redeploy foi concluído com sucesso
3. Se há erros no console do navegador (F12 → Console)
4. Se o Cloudflare não está bloqueando as requisições

---

**Última atualização:** 01/12/2025
