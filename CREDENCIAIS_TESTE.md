# Credenciais de Teste - GENTE COMUNIDADE

## 🔐 Usuários Criados

Os seguintes usuários foram criados no Supabase para teste de funcionalidades e permissões:

---

### 👑 Administrador

**Nome:** Diogo Nunes  
**Email:** somos@ranktopseo.com.br  
**Senha:** Admin@2024  
**Perfil:** Admin  
**Permissões:**
- Acesso total ao sistema
- Gerenciar usuários e perfis
- Criar e editar grupos
- Criar e gerenciar encontros
- Gerenciar conteúdos estratégicos
- Visualizar todos os relatórios e estatísticas

---

### 🎯 Facilitador

**Nome:** Diogo Devitte  
**Email:** sou@oespecialistaseo.com.br  
**Senha:** Facilitador@2024  
**Perfil:** Facilitator  
**Permissões:**
- Gerenciar grupos atribuídos
- Criar e gerenciar encontros
- Registrar atividades dos membros
- Visualizar relatórios do seu grupo
- Adicionar convidados aos encontros

---

### 👤 Membro

**Nome:** Rafael Nunes  
**Email:** objetivatech@gmail.com  
**Senha:** Membro@2024  
**Perfil:** User (Membro)  
**Permissões:**
- Registrar suas próprias atividades
- Visualizar ranking e gamificação
- Acessar conteúdos estratégicos
- Participar de encontros
- Visualizar seu histórico e pontuação

---

### 🎫 Convidado

**Nome:** Rafael Devitte  
**Email:** marketing@objetiva.tech  
**Senha:** Convidado@2024  
**Perfil:** Guest  
**Permissões:**
- Acesso limitado ao sistema
- Visualizar informações básicas
- Participar de encontros específicos
- Solicitar conversão para membro

---

## ⚠️ Importante

1. **Altere as senhas após o primeiro login!**
2. Estas credenciais são apenas para teste
3. Não compartilhe estas senhas com terceiros
4. Em produção, crie usuários reais com senhas seguras

---

## 🧪 Testes Recomendados

### Como Admin (Diogo Nunes)
- [ ] Criar um novo grupo
- [ ] Adicionar membros ao grupo
- [ ] Definir facilitador do grupo
- [ ] Criar um encontro
- [ ] Adicionar convidados ao encontro
- [ ] Visualizar dashboard completo
- [ ] Acessar relatórios de todos os grupos

### Como Facilitador (Diogo Devitte)
- [ ] Visualizar grupos atribuídos
- [ ] Criar encontro para seu grupo
- [ ] Registrar atividade de um membro
- [ ] Visualizar ranking do grupo
- [ ] Adicionar convidado ao encontro

### Como Membro (Rafael Nunes)
- [ ] Registrar indicação de contato
- [ ] Registrar novo negócio
- [ ] Registrar reunião 1 a 1
- [ ] Criar depoimento/agradecimento
- [ ] Visualizar sua pontuação
- [ ] Acessar conteúdos estratégicos
- [ ] Ver ranking mensal

### Como Convidado (Rafael Devitte)
- [ ] Fazer login no sistema
- [ ] Visualizar informações básicas
- [ ] Solicitar conversão para membro
- [ ] Verificar limitações de acesso

---

## 📊 Estrutura de Perfis

```
┌─────────────────┬──────────────┬────────────────────────────────┐
│ Perfil          │ Código       │ Descrição                      │
├─────────────────┼──────────────┼────────────────────────────────┤
│ Administrador   │ admin        │ Acesso total ao sistema        │
│ Facilitador     │ facilitator  │ Gerencia grupos específicos    │
│ Membro          │ user         │ Usuário padrão da comunidade   │
│ Convidado       │ guest        │ Acesso limitado temporário     │
└─────────────────┴──────────────┴────────────────────────────────┘
```

---

## 🔄 Fluxo de Conversão

```
Convidado → Solicita acesso → Admin aprova → Membro
```

---

**Data de Criação:** 01/12/2025  
**Ambiente:** Desenvolvimento/Teste  
**Banco de Dados:** Supabase PostgreSQL
