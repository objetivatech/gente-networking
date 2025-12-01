-- PARTE 2: Atualizar dados existentes
-- Execute esta parte DEPOIS de executar a parte 1 com sucesso

-- Atualizar valores existentes de 'member' para 'user'
UPDATE public.users 
SET role = 'user' 
WHERE role = 'member';

-- Verificar resultado
SELECT id, name, email, role, created_at 
FROM public.users 
ORDER BY created_at DESC;

-- ✅ Pronto! Agora você pode executar o script de criação de usuários
