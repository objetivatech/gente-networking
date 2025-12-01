-- Script para criar usuários de teste no Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- IMPORTANTE: Este script usa a API Admin do Supabase
-- Você precisará executá-lo através do Dashboard ou usar a API REST

-- Usuário 1: Diogo Nunes - Admin
-- Email: somos@ranktopseo.com.br
-- Senha: Admin@2024
-- Role: admin

-- Usuário 2: Diogo Devitte - Facilitador  
-- Email: sou@oespecialistaseo.com.br
-- Senha: Facilitador@2024
-- Role: facilitator

-- Usuário 3: Rafael Nunes - Membro
-- Email: objetivatech@gmail.com
-- Senha: Membro@2024
-- Role: user

-- Usuário 4: Rafael Devitte - Convidado
-- Email: marketing@objetiva.tech
-- Senha: Convidado@2024
-- Role: guest

-- Como esses usuários precisam ser criados via Supabase Auth,
-- você tem duas opções:

-- OPÇÃO 1: Criar manualmente no Dashboard
-- 1. Acesse Authentication → Users
-- 2. Clique em "Add user"
-- 3. Preencha email e senha
-- 4. Marque "Auto Confirm User"
-- 5. Após criar, atualize o role na tabela public.users

-- OPÇÃO 2: Usar o script Node.js que vou criar
-- (Mais fácil e rápido)

-- Após criar os usuários via Auth, atualize os roles:

-- Atualizar role do Admin
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'somos@ranktopseo.com.br';

-- Atualizar role do Facilitador
UPDATE public.users 
SET role = 'facilitator' 
WHERE email = 'sou@oespecialistaseo.com.br';

-- Atualizar role do Membro (já é 'user' por padrão)
-- UPDATE public.users 
-- SET role = 'user' 
-- WHERE email = 'objetivatech@gmail.com';

-- Atualizar role do Convidado
UPDATE public.users 
SET role = 'guest' 
WHERE email = 'marketing@objetiva.tech';

-- Verificar usuários criados
SELECT id, name, email, role, created_at 
FROM public.users 
ORDER BY created_at DESC;
