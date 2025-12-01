#!/usr/bin/env node
/**
 * Script para criar usuários de teste no Supabase
 * 
 * Uso:
 * node seed-users.mjs
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórios');
  console.error('Configure as variáveis de ambiente no arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const users = [
  {
    email: 'somos@ranktopseo.com.br',
    password: 'Admin@2024',
    name: 'Diogo Nunes',
    role: 'admin',
  },
  {
    email: 'sou@oespecialistaseo.com.br',
    password: 'Facilitador@2024',
    name: 'Diogo Devitte',
    role: 'facilitator',
  },
  {
    email: 'objetivatech@gmail.com',
    password: 'Membro@2024',
    name: 'Rafael Nunes',
    role: 'user',
  },
  {
    email: 'marketing@objetiva.tech',
    password: 'Convidado@2024',
    name: 'Rafael Devitte',
    role: 'guest',
  },
];

async function createUsers() {
  console.log('🚀 Iniciando criação de usuários de teste...\n');

  for (const user of users) {
    console.log(`📝 Criando usuário: ${user.name} (${user.email})...`);

    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirmar email
        user_metadata: {
          name: user.name,
        },
      });

      if (authError) {
        console.error(`   ❌ Erro ao criar usuário no Auth: ${authError.message}`);
        continue;
      }

      console.log(`   ✅ Usuário criado no Auth (ID: ${authData.user.id})`);

      // Aguardar trigger criar registro em public.users
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Atualizar role na tabela public.users
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: user.role })
        .eq('open_id', authData.user.id);

      if (updateError) {
        console.error(`   ⚠️  Erro ao atualizar role: ${updateError.message}`);
      } else {
        console.log(`   ✅ Role atualizado para: ${user.role}`);
      }

      console.log('');
    } catch (error) {
      console.error(`   ❌ Erro inesperado: ${error.message}\n`);
    }
  }

  // Listar usuários criados
  console.log('📊 Usuários criados:\n');
  const { data: allUsers } = await supabase
    .from('users')
    .select('id, name, email, role, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  if (allUsers) {
    console.table(allUsers);
  }

  console.log('\n✅ Processo concluído!');
  console.log('\n📋 Credenciais de acesso:');
  console.log('━'.repeat(60));
  users.forEach(user => {
    console.log(`\n${user.name} (${user.role.toUpperCase()})`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Senha: ${user.password}`);
  });
  console.log('\n' + '━'.repeat(60));
  console.log('\n⚠️  Recomendação: Altere as senhas após o primeiro login!');
}

createUsers().catch(console.error);
