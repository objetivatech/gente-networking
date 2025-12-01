-- PARTE 1: Adicionar novos valores ao ENUM user_role
-- Execute APENAS esta parte primeiro, depois execute a parte 2

-- Adicionar 'admin' ao ENUM
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';

-- Adicionar 'facilitator' ao ENUM
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'facilitator';

-- Adicionar 'user' ao ENUM
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'user';

-- Adicionar 'guest' ao ENUM
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'guest';

-- Verificar valores adicionados
SELECT enum_range(NULL::user_role);

-- ✅ Após executar este script com sucesso, execute o fix-roles-part2.sql
