# 🚀 Guia de Deploy - Vercel

**Projeto:** GENTE COMUNIDADE  
**Data:** 01/12/2025  
**Tempo Estimado:** 20 minutos

---

## 📋 Pré-requisitos

- ✅ Conta no [Vercel](https://vercel.com) (gratuita)
- ✅ Repositório GitHub: `objetivatech/gente-networking`
- ✅ Credenciais do Supabase
- ✅ Supabase Auth configurado

---

## 🎯 Passo 1: Criar Conta no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **Sign Up**
3. Escolha **Continue with GitHub**
4. Autorize o Vercel a acessar seus repositórios

**Tempo:** 2 minutos

---

## 📦 Passo 2: Importar Projeto do GitHub

1. No Dashboard do Vercel, clique em **Add New** → **Project**
2. Na lista de repositórios, encontre `objetivatech/gente-networking`
3. Clique em **Import**

**Tempo:** 1 minuto

---

## ⚙️ Passo 3: Configurar Projeto

### Build & Development Settings

O Vercel detectará automaticamente as configurações do `vercel.json`, mas confirme:

| Campo | Valor |
|-------|-------|
| **Framework Preset** | Other |
| **Build Command** | `pnpm build` |
| **Output Directory** | `dist/public` |
| **Install Command** | `pnpm install` |
| **Development Command** | `pnpm dev` |

### Root Directory

Deixe como **`.`** (raiz do projeto)

**Tempo:** 2 minutos

---

## 🔐 Passo 4: Configurar Variáveis de Ambiente

Clique em **Environment Variables** e adicione as seguintes variáveis:

### Supabase (Obrigatório)

```
SUPABASE_URL=https://wawnsuwrnsdfaowfhqjz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd25zdXdybnNkZmFvd2ZocWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4ODk0MzQsImV4cCI6MjA0ODQ2NTQzNH0.KdVIwRvXIBEWL2Zt7_tXNqmWJGgXhCzE9DcVBqCvdqE
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhd25zdXdybnNkZmFvd2ZocWp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjg4OTQzNCwiZXhwIjoyMDQ4NDY1NDM0fQ.4JLnWiGHZnxLdZaLKFhxTYRjqRjXPNdVlJQbDPNvMqg
```

### Autenticação (Supabase Auth)

✅ **Não é necessário configurar Manus OAuth!**

A autenticação agora é gerenciada pelo **Supabase Auth**. As credenciais do Supabase já foram configuradas acima.

### Aplicação (Obrigatório)

```
VITE_APP_TITLE=GENTE Comunidade
VITE_APP_LOGO=https://gentenetworking.com.br/logo.png
```

### Analytics (Opcional)

```
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=seu-website-id-aqui
```

### Resend (Opcional - para emails)

```
RESEND_API_KEY=re_sua_chave_aqui
```

### RD Station (Opcional - para CRM)

```
RD_STATION_TOKEN=seu-token-aqui
```

**Importante:** Para cada variável, selecione todos os ambientes:
- ✅ Production
- ✅ Preview
- ✅ Development

**Tempo:** 10 minutos

---

## 🚀 Passo 5: Fazer Deploy

1. Revise todas as configurações
2. Clique em **Deploy**
3. Aguarde o build completar (3-5 minutos)

O Vercel irá:
- Instalar dependências (`pnpm install`)
- Executar build (`pnpm build`)
- Fazer deploy do frontend e backend

**Tempo:** 5 minutos

---

## ✅ Passo 6: Verificar Deploy

Após o deploy, você verá:

### URL do Projeto

```
https://gente-networking.vercel.app
```

### Testar Funcionalidades

1. **Página Inicial**
   - Acesse a URL
   - Deve carregar a tela de login

2. **Autenticação**
   - Clique em "Entrar" ou "Registre-se"
   - Faça login com email/senha
   - Deve redirecionar para o dashboard

3. **Dashboard**
   - Verifique se os cards carregam
   - Teste criar uma atividade
   - Verifique o ranking

4. **Grupos e Encontros**
   - Teste criar um grupo
   - Teste criar um encontro
   - Verifique se os dados são salvos

**Tempo:** 5 minutos

---

## 🌐 Passo 7: Configurar Domínio Personalizado (Opcional)

### Adicionar Domínio

1. No Dashboard do Vercel, vá em **Settings** → **Domains**
2. Clique em **Add**
3. Digite seu domínio: `comunidade.gentenetworking.com.br`
4. Clique em **Add**

### Configurar DNS

O Vercel fornecerá os registros DNS. No seu provedor DNS:

**Para Subdomínio (Recomendado):**
```
Tipo: CNAME
Nome: comunidade
Valor: cname.vercel-dns.com
TTL: 3600
```

**Para Domínio Raiz:**
```
Tipo: A
Nome: @
Valor: 76.76.21.21
TTL: 3600
```

### SSL Automático

O Vercel provisiona o certificado SSL automaticamente em 1-5 minutos.

**Tempo:** 10 minutos (incluindo propagação DNS)

---

## 🔧 Configurações Adicionais

### Configurar CORS no Supabase

1. Acesse [Dashboard do Supabase](https://supabase.com/dashboard)
2. Vá em **Settings** → **API**
3. Em **CORS Configuration**, adicione:
   ```
   https://gente-networking.vercel.app
   https://seu-dominio-customizado.com.br
   ```

### Configurar Redirect URLs no Supabase

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Vá em **Authentication** → **URL Configuration**
3. Adicione as URLs de callback:
   ```
   https://gente-networking.vercel.app/auth/callback
   https://seu-dominio-customizado.com.br/auth/callback
   ```

---

## 🔄 Atualizações Futuras

Após o deploy inicial, qualquer push para a branch `main` no GitHub irá:

1. ✅ Disparar build automático
2. ✅ Executar testes (se configurados)
3. ✅ Fazer deploy da nova versão
4. ✅ Manter a versão anterior ativa até o deploy completar

### Preview Deployments

Cada Pull Request gera um deploy de preview automático:
- URL única para teste
- Não afeta produção
- Perfeito para testar mudanças

---

## 🐛 Troubleshooting

### Build Falha

**Erro:** `Command "pnpm build" exited with 1`

**Soluções:**
1. Verifique se todas as variáveis de ambiente estão configuradas
2. Revise os logs de build no Vercel
3. Teste o build localmente: `pnpm build`

### Erro 500 nas APIs

**Erro:** `Internal Server Error`

**Soluções:**
1. Verifique os logs em **Deployments** → **Functions**
2. Confirme que `SUPABASE_URL` e `SUPABASE_SERVICE_KEY` estão corretas
3. Verifique se o Supabase está acessível

### Página em Branco

**Soluções:**
1. Abra o Console do navegador (F12)
2. Verifique erros de JavaScript
3. Confirme que todas as variáveis `VITE_*` estão configuradas
4. Verifique se o build gerou os arquivos em `dist/public`

### Timeout nas Functions

**Erro:** `Function execution timed out`

**Soluções:**
1. Otimize queries do banco de dados
2. Adicione índices no Supabase
3. Considere upgrade para Vercel Pro (60s timeout)

### Login Não Funciona

**Soluções:**
1. Verifique se as redirect URLs estão configuradas no Supabase
2. Confirme que `SUPABASE_URL` e `SUPABASE_ANON_KEY` estão corretas
3. Verifique se o usuário confirmou o email (se obrigatório)

---

## 📊 Monitoramento

### Logs em Tempo Real

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Ver logs
vercel logs gente-networking --follow
```

### Métricas

No Dashboard do Vercel:
- **Deployments:** Histórico de deploys
- **Functions:** Execuções e erros
- **Analytics:** Tráfego (Pro)

---

## 💰 Custos

### Plano Hobby (Gratuito)

Suficiente para:
- ~2.500 usuários ativos/mês
- ~100.000 requisições API
- Domínios ilimitados
- SSL gratuito

### Quando Fazer Upgrade?

Considere Vercel Pro ($20/mês) quando:
- Bandwidth > 100 GB/mês
- Functions > 100 GB-Hrs/mês
- Precisa de analytics integrado
- Precisa de team members

---

## 📋 Checklist Final

Antes de considerar o deploy completo:

- [ ] Site acessível via URL do Vercel
- [ ] Login funcionando corretamente
- [ ] Dashboard carregando dados do Supabase
- [ ] Criação de grupos/encontros/atividades funcionando
- [ ] Ranking e gamificação atualizando
- [ ] Domínio customizado configurado (se aplicável)
- [ ] CORS configurado no Supabase
- [ ] Redirect URLs configuradas no Manus OAuth
- [ ] Variáveis de ambiente de produção configuradas
- [ ] Logs sem erros críticos

---

## 🎓 Dicas Profissionais

### Performance

1. **Otimize Imagens**
   - Use Vercel Image Optimization
   - Compacte imagens antes do upload

2. **Cache Agressivo**
   - Vercel faz cache automático de assets estáticos
   - Configure headers de cache para APIs

3. **Code Splitting**
   - Vite já faz automaticamente
   - Verifique se chunks estão otimizados

### Segurança

1. **Variáveis Sensíveis**
   - Nunca commite `.env` no Git
   - Use apenas variáveis de ambiente do Vercel

2. **Rate Limiting**
   - Implemente no código
   - Considere Vercel Edge Config

3. **CORS**
   - Configure apenas domínios necessários
   - Não use `*` em produção

### Backup

1. **Banco de Dados**
   - Supabase faz backup automático
   - Configure backup manual adicional

2. **Código**
   - Git é seu backup
   - Mantenha branches organizadas

---

## 📞 Suporte

### Documentação

- **Vercel:** https://vercel.com/docs
- **Supabase:** https://supabase.com/docs
- **tRPC:** https://trpc.io/docs

### Comunidade

- **Vercel Discord:** https://vercel.com/discord
- **Supabase Discord:** https://discord.supabase.com

---

## 🎉 Conclusão

Parabéns! Sua plataforma GENTE COMUNIDADE está no ar no Vercel!

**Próximos passos sugeridos:**
1. Monitorar logs nos primeiros dias
2. Configurar domínio personalizado
3. Adicionar analytics (Google Analytics ou similar)
4. Implementar sistema de notificações
5. Adicionar mais funcionalidades conforme necessário

---

**Elaborado por:** Manus AI  
**Data:** 01/12/2025  
**Versão:** 1.0
