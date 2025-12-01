-- Instruções: Execute cada comando SEPARADAMENTE, um de cada vez
-- Copie e cole UMA LINHA por vez no SQL Editor

-- 1. Adicionar 'admin' (execute esta linha sozinha)
ALTER TYPE user_role ADD VALUE 'admin';

-- 2. Adicionar 'facilitator' (execute esta linha sozinha, DEPOIS da anterior)
ALTER TYPE user_role ADD VALUE 'facilitator';

-- 3. Adicionar 'user' (execute esta linha sozinha, DEPOIS da anterior)
ALTER TYPE user_role ADD VALUE 'user';

-- 4. Adicionar 'guest' (execute esta linha sozinha, DEPOIS da anterior)
ALTER TYPE user_role ADD VALUE 'guest';

-- 5. Verificar valores adicionados (execute esta linha sozinha)
SELECT enum_range(NULL::user_role);

-- 6. Atualizar dados existentes (execute esta linha sozinha, DEPOIS de todas as anteriores)
UPDATE public.users SET role = 'user' WHERE role = 'member';

-- 7. Verificar resultado final
SELECT id, name, email, role FROM public.users ORDER BY created_at DESC;

-- IMPORTANTE: Se algum valor já existir, você receberá erro "already exists"
-- Isso é normal! Apenas pule para o próximo comando.
