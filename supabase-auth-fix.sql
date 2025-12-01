-- Correção do Trigger de Sincronização Supabase Auth
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Remover trigger antigo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Criar função corrigida
-- Agora o ID é auto-increment, então não precisamos converter UUID para INT
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (open_id, name, email, login_method, role, created_at, updated_at, last_signed_in)
  VALUES (
    NEW.id::text, -- Usa UUID como open_id (texto)
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    'supabase',
    'user',
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (open_id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, users.name),
    last_signed_in = NOW(),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recriar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Testar o trigger manualmente (opcional)
-- Você pode criar um usuário de teste no Supabase Dashboard
-- Authentication → Users → Add user
-- E verificar se ele aparece em public.users

COMMENT ON FUNCTION public.handle_new_user() IS 'Sincroniza usuários do Supabase Auth com a tabela public.users (CORRIGIDO)';
