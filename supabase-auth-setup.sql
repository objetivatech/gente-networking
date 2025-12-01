-- Configuração do Supabase Auth para GENTE COMUNIDADE
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Habilitar extensão UUID (se ainda não estiver)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Criar trigger para sincronizar auth.users com public.users
-- Quando um usuário se registra no Supabase Auth, automaticamente cria registro em public.users

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, open_id, name, email, login_method, role, created_at, updated_at, last_signed_in)
  VALUES (
    NEW.id::int,  -- Converte UUID para int (pode precisar ajustar)
    NEW.id::text, -- Usa UUID como open_id
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

-- 3. Criar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Configurar RLS (Row Level Security) para tabela users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ler seus próprios dados
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  USING (auth.uid()::text = open_id);

-- Política: Usuários podem atualizar seus próprios dados
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid()::text = open_id);

-- Política: Admins podem ler todos os dados
CREATE POLICY "Admins can read all data"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE open_id = auth.uid()::text
      AND role = 'admin'
    )
  );

-- 5. Configurar políticas para outras tabelas (opcional, mas recomendado)

-- Activities: Usuários podem ver suas próprias atividades e atividades públicas
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own activities"
  ON public.activities
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM public.users WHERE open_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can create activities"
  ON public.activities
  FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM public.users WHERE open_id = auth.uid()::text
    )
  );

-- Groups: Todos podem ler grupos ativos
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active groups"
  ON public.groups
  FOR SELECT
  USING (is_active = true);

-- Scores: Usuários podem ver seus próprios scores
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own scores"
  ON public.scores
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM public.users WHERE open_id = auth.uid()::text
    )
  );

-- 6. Configurar Email Templates (faça isso no Dashboard do Supabase)
-- Settings → Authentication → Email Templates
-- Customize os templates de:
-- - Confirm signup
-- - Magic Link
-- - Change Email Address
-- - Reset Password

-- 7. Configurar Site URL e Redirect URLs
-- Settings → Authentication → URL Configuration
-- Site URL: https://seu-dominio.com.br
-- Redirect URLs: 
--   - https://seu-dominio.com.br/auth/callback
--   - https://seu-dominio.vercel.app/auth/callback
--   - http://localhost:3000/auth/callback (desenvolvimento)

COMMENT ON FUNCTION public.handle_new_user() IS 'Sincroniza usuários do Supabase Auth com a tabela public.users';
