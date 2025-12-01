-- Correção do ENUM user_role no PostgreSQL
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Verificar o tipo ENUM atual
-- SELECT enum_range(NULL::user_role);

-- 2. Adicionar novos valores ao ENUM (se não existirem)
DO $$ 
BEGIN
    -- Adicionar 'admin' se não existir
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'admin' AND enumtypid = 'user_role'::regtype) THEN
        ALTER TYPE user_role ADD VALUE 'admin';
    END IF;
    
    -- Adicionar 'facilitator' se não existir
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'facilitator' AND enumtypid = 'user_role'::regtype) THEN
        ALTER TYPE user_role ADD VALUE 'facilitator';
    END IF;
    
    -- Adicionar 'user' se não existir
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'user' AND enumtypid = 'user_role'::regtype) THEN
        ALTER TYPE user_role ADD VALUE 'user';
    END IF;
    
    -- Adicionar 'guest' se não existir
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'guest' AND enumtypid = 'user_role'::regtype) THEN
        ALTER TYPE user_role ADD VALUE 'guest';
    END IF;
END $$;

-- 3. Atualizar valores existentes de 'member' para 'user'
UPDATE public.users 
SET role = 'user' 
WHERE role = 'member';

-- 4. Verificar resultado
SELECT id, name, email, role, created_at 
FROM public.users 
ORDER BY created_at DESC;

-- 5. Verificar valores do ENUM
SELECT enum_range(NULL::user_role);
