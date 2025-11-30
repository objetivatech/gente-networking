# Guia do Administrador - GENTE COMUNIDADE

## Índice

1. [Visão Geral](#visão-geral)
2. [Acesso e Autenticação](#acesso-e-autenticação)
3. [Gerenciamento de Usuários](#gerenciamento-de-usuários)
4. [Gerenciamento de Grupos](#gerenciamento-de-grupos)
5. [Gerenciamento de Encontros](#gerenciamento-de-encontros)
6. [Gerenciamento de Conteúdos](#gerenciamento-de-conteúdos)
7. [Sistema de Gamificação](#sistema-de-gamificação)
8. [Relatórios e Estatísticas](#relatórios-e-estatísticas)
9. [Configurações Avançadas](#configurações-avançadas)
10. [Solução de Problemas](#solução-de-problemas)

---

## Visão Geral

A plataforma GENTE COMUNIDADE é um sistema completo de gerenciamento de comunidades de networking empresarial. Como administrador, você tem acesso total a todas as funcionalidades e é responsável por:

- Gerenciar usuários e suas permissões
- Criar e organizar grupos
- Agendar e gerenciar encontros
- Publicar conteúdos estratégicos
- Monitorar o desempenho da comunidade
- Garantir o bom funcionamento da plataforma

### Níveis de Acesso

A plataforma possui 4 níveis de acesso:

1. **Administrador** (você): Acesso total ao sistema
2. **Facilitador**: Pode gerenciar grupos e encontros
3. **Membro**: Acesso completo às funcionalidades da comunidade
4. **Convidado**: Acesso limitado, pode ser convertido em membro

---

## Acesso e Autenticação

### Primeiro Acesso

1. Acesse a URL da plataforma
2. Clique em "Entrar"
3. Use suas credenciais de administrador
4. Você será redirecionado para o dashboard principal

### Segurança

- **Nunca compartilhe suas credenciais** de administrador
- Use uma senha forte e única
- Faça logout ao terminar de usar o sistema
- Monitore regularmente os logs de acesso

---

## Gerenciamento de Usuários

### Visualizar Usuários

1. Acesse o menu **"Grupos"** no painel lateral
2. Visualize todos os membros da comunidade
3. Use os filtros para encontrar usuários específicos

### Alterar Permissões de Usuário

Para promover um usuário a facilitador ou administrador:

1. Acesse o banco de dados Supabase
2. Navegue até a tabela `users`
3. Localize o usuário pelo email ou nome
4. Altere o campo `role` para:
   - `admin` - Administrador
   - `facilitator` - Facilitador
   - `member` - Membro
   - `guest` - Convidado

### Converter Convidado em Membro

1. Acesse **"Grupos"** > **"Convidados"**
2. Localize o convidado
3. No banco de dados, altere o `role` de `guest` para `member`
4. O usuário terá acesso completo à plataforma

### Remover Usuário

⚠️ **Atenção**: Esta ação não pode ser desfeita.

1. Acesse o banco de dados Supabase
2. Navegue até a tabela `users`
3. Delete o registro do usuário
4. Todas as atividades relacionadas serão mantidas para histórico

---

## Gerenciamento de Grupos

### Criar Novo Grupo

1. Acesse **"Grupos"** no menu lateral
2. Clique em **"Novo Grupo"**
3. Preencha as informações:
   - **Nome do Grupo**: Nome descritivo
   - **Descrição**: Objetivo e características do grupo
4. Clique em **"Criar Grupo"**

### Adicionar Membros ao Grupo

1. Acesse o grupo desejado
2. Clique em **"Adicionar Membro"**
3. Selecione os membros da lista
4. Confirme a adição

### Definir Facilitadores

1. Acesse o grupo
2. Localize o membro que será facilitador
3. Marque a opção **"Facilitador"**
4. O membro terá permissões especiais neste grupo

### Desativar Grupo

1. Acesse o banco de dados Supabase
2. Navegue até a tabela `groups`
3. Altere o campo `is_active` para `false`
4. O grupo não aparecerá mais na listagem

---

## Gerenciamento de Encontros

### Agendar Novo Encontro

1. Acesse **"Encontros"** no menu lateral
2. Clique em **"Novo Encontro"**
3. Preencha as informações:
   - **Título**: Nome do encontro
   - **Descrição**: Detalhes e agenda
   - **Data e Hora**: Quando acontecerá
   - **Local**: Endereço ou link online
   - **Grupo** (opcional): Vincular a um grupo específico
4. Clique em **"Criar Encontro"**

### Adicionar Convidados ao Encontro

1. Acesse o encontro
2. Clique em **"Ver Convidados"**
3. Clique em **"Adicionar Convidado"**
4. Preencha os dados:
   - Nome
   - Email
   - Telefone
   - Empresa
   - Observações
5. Confirme a adição

### Copiar Convidados Entre Encontros

Esta funcionalidade permite reaproveitar a lista de convidados:

1. Acesse o encontro de origem
2. Clique em **"Copiar Convidados"**
3. Selecione o encontro de destino
4. Confirme a operação

### Marcar Encontro como Realizado

1. Acesse o encontro
2. Clique em **"Marcar como Realizado"**
3. Registre a presença dos convidados
4. O encontro será marcado com status "Realizado"

---

## Gerenciamento de Conteúdos

### Publicar Novo Conteúdo

1. Acesse **"Conteúdos"** no menu lateral
2. Clique em **"Novo Conteúdo"**
3. Preencha as informações:
   - **Título**: Nome do conteúdo
   - **Descrição**: Resumo do que será compartilhado
   - **Tipo**: Vídeo, Documento, Apresentação ou Link
   - **URL**: Link para o arquivo ou recurso
   - **Categoria**: Classificação do conteúdo
4. Clique em **"Publicar"**

### Tipos de Conteúdo

- **Vídeo**: Links do YouTube, Vimeo, etc.
- **Documento**: PDFs, artigos, ebooks
- **Apresentação**: Slides, PowerPoint
- **Link**: Páginas web, recursos online

### Organizar Conteúdos

Use categorias para organizar:
- Treinamentos
- Ferramentas
- Networking
- Gestão
- Marketing
- Vendas

### Remover Conteúdo

1. Acesse o banco de dados Supabase
2. Navegue até a tabela `contents`
3. Delete o registro ou altere `is_active` para `false`

---

## Sistema de Gamificação

### Como Funciona

O sistema de gamificação incentiva a participação através de pontos:

| Atividade | Pontos |
|-----------|--------|
| Indicação de Contato | 10 pontos |
| Novo Negócio | 50 pontos |
| Reunião 1 a 1 (Gente em Ação) | 20 pontos |
| Depoimento/Agradecimento | 15 pontos |

### Ranking Mensal

- Os pontos são contabilizados mensalmente
- No início de cada mês, o ranking é resetado
- Os membros competem pelo topo do ranking
- Você pode criar prêmios e reconhecimentos

### Ajustar Pontuação

Para alterar a pontuação de atividades:

1. Acesse `server/routers.ts`
2. Localize a função `calculatePoints`
3. Ajuste os valores conforme necessário
4. Reinicie o servidor

### Visualizar Estatísticas

1. Acesse **"Ranking"** no menu lateral
2. Visualize o ranking completo do mês
3. Veja estatísticas detalhadas:
   - Total de pontos
   - Número de indicações
   - Número de negócios
   - Valor total de negócios
   - Reuniões realizadas
   - Depoimentos recebidos

---

## Relatórios e Estatísticas

### Dashboard Principal

O dashboard mostra:
- Seu desempenho pessoal
- Top 5 membros do mês
- Feed de atividades recentes

### Relatórios Disponíveis

1. **Ranking Mensal**: Desempenho de todos os membros
2. **Atividades por Membro**: Histórico individual
3. **Grupos**: Membros e facilitadores
4. **Encontros**: Histórico e presença

### Exportar Dados

Para exportar dados do Supabase:

1. Acesse o painel do Supabase
2. Navegue até a tabela desejada
3. Use a opção **"Export to CSV"**
4. Analise os dados em Excel ou Google Sheets

---

## Configurações Avançadas

### Banco de Dados Supabase

**URL**: https://wawnsuwrnsdfaowfhqjz.supabase.co

**Acesso ao Painel**:
1. Acesse o Supabase Dashboard
2. Faça login com suas credenciais
3. Selecione o projeto GENTE COMUNIDADE

**Tabelas Principais**:
- `users` - Usuários do sistema
- `profiles` - Perfis detalhados
- `groups` - Grupos da comunidade
- `group_members` - Membros de cada grupo
- `activities` - Registro de atividades
- `scores` - Pontuação mensal
- `meetings` - Encontros agendados
- `guests` - Convidados
- `meeting_guests` - Convidados por encontro
- `contents` - Conteúdos publicados
- `notifications` - Notificações do sistema

### Backup e Segurança

**Backup Automático**:
- O Supabase faz backup automático diário
- Retenção de 7 dias
- Acesse em: Supabase > Database > Backups

**Backup Manual**:
1. Acesse o painel do Supabase
2. Vá em **Database** > **Backups**
3. Clique em **"Create Backup"**
4. Aguarde a conclusão

**Restaurar Backup**:
1. Acesse **Database** > **Backups**
2. Selecione o backup desejado
3. Clique em **"Restore"**
4. Confirme a operação

### Variáveis de Ambiente

As seguintes variáveis estão configuradas:

```
SUPABASE_URL=https://wawnsuwrnsdfaowfhqjz.supabase.co
SUPABASE_ANON_KEY=[chave pública]
SUPABASE_SERVICE_KEY=[chave privada]
```

⚠️ **Nunca compartilhe a SERVICE_KEY publicamente**

---

## Solução de Problemas

### Usuário Não Consegue Fazer Login

1. Verifique se o email está correto no banco
2. Confirme que o `role` não é `guest`
3. Verifique os logs de autenticação

### Atividades Não Aparecem no Feed

1. Verifique se a atividade foi criada com sucesso
2. Confirme que o `created_at` está correto
3. Atualize a página (F5)

### Pontuação Não Está Atualizando

1. Verifique a tabela `scores` no Supabase
2. Confirme que o mês e ano estão corretos
3. Verifique se a atividade foi criada corretamente

### Erro ao Criar Encontro

1. Verifique se todos os campos obrigatórios estão preenchidos
2. Confirme que a data está no formato correto
3. Verifique os logs do servidor

### Conteúdo Não Aparece

1. Verifique se `is_active` está como `true`
2. Confirme que a URL está acessível
3. Atualize a página

### Problemas de Performance

1. Verifique a conexão com internet
2. Limpe o cache do navegador
3. Verifique o status do Supabase
4. Entre em contato com o suporte técnico

---

## Contato e Suporte

Para questões técnicas ou suporte:

- **Email**: suporte@gentenetworking.com.br
- **Telefone**: (XX) XXXX-XXXX
- **Documentação Técnica**: `/docs/README.md`

---

## Boas Práticas

1. **Faça backup regularmente** dos dados importantes
2. **Monitore o ranking** e incentive a participação
3. **Publique conteúdos relevantes** regularmente
4. **Organize encontros** com frequência
5. **Reconheça os membros ativos** publicamente
6. **Mantenha os dados atualizados** no sistema
7. **Responda rapidamente** às solicitações de acesso
8. **Promova a cultura** de networking e colaboração

---

**Última atualização**: Novembro 2025  
**Versão**: 1.0.0
