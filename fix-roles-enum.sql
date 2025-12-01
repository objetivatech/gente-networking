-- Correção do ENUM de roles na tabela users
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Verificar valores atuais
SELECT DISTINCT role FROM public.users;

-- 2. Atualizar valor 'member' para 'user' (se existir)
UPDATE public.users 
SET role = 'user' 
WHERE role = 'member';

-- 3. Remover a constraint antiga (se existir)
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_role_check;

-- 4. Adicionar nova constraint com todos os valores corretos
ALTER TABLE public.users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('admin', 'facilitator', 'user', 'guest'));

-- 5. Verificar se funcionou
SELECT id, name, email, role 
FROM public.users 
ORDER BY created_at DESC;

COMMENT ON COLUMN public.users.role IS 'Perfil do usuário: admin, facilitator, user, guest';
