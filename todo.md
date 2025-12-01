# GENTE COMUNIDADE - TODO

## Estrutura do Banco de Dados
- [x] Criar schema completo com todas as tabelas necessárias
- [x] Definir relacionamentos entre tabelas
- [x] Adicionar índices para performance
- [x] Executar migrations no banco de dados

## Sistema de Autenticação e Perfis
- [x] Estender tabela de usuários com perfis (Administrador, Facilitador, Membro, Convidado)
- [x] Implementar controle de acesso baseado em perfis
- [ ] Criar página de perfil do usuário
- [ ] Implementar recuperação de senha
- [ ] Adicionar formulário de solicitação de acesso para convidados

## Módulo de Grupos e Membros
- [x] Criar tabela de grupos
- [x] Implementar associação de membros a grupos
- [x] Criar página de listagem de grupos e membros
- [x] Implementar gestão de facilitadores por grupo
- [ ] Adicionar funcionalidade de conversão de convidado para membro

## Registro de Atividades
- [x] Criar tabela de atividades
- [x] Implementar formulário de indicação de contatos
- [x] Implementar formulário de registro de novo negócio
- [x] Implementar formulário de reunião 1 a 1 (Gente em Ação)
- [x] Implementar formulário de depoimento/agradecimento
- [x] Criar feed de atividades no dashboard

## Sistema de Gamificação
- [x] Criar tabela de pontuações
- [x] Implementar sistema de contabilização de pontos
- [x] Criar ranking mensal de membros
- [ ] Implementar reset mensal de pontuações
- [ ] Criar badges e conquistas
- [x] Exibir estatísticas de gamificação no perfil

## Gestão de Encontros e Convidados
- [x] Criar tabela de encontros
- [x] Criar tabela de convidados
- [x] Implementar vinculação de convidados a encontros
- [ ] Adicionar funcionalidade de copiar convidados entre encontros
- [x] Criar página de listagem de encontros
- [ ] Implementar notificações de encontros

## Sistema de Conteúdos Estratégicos
- [x] Criar tabela de conteúdos
- [ ] Implementar upload de vídeos, documentos e apresentações
- [x] Criar página de listagem de conteúdos
- [ ] Implementar busca e filtros de conteúdos
- [x] Adicionar controle de acesso (apenas membros)
- [ ] Criar página de visualização de conteúdo individual

## Integrações Externas
- [ ] Integrar formulário de cadastro com RD Station API
- [ ] Configurar envio de emails via Resend
- [ ] Implementar notificações por email para todas as ações
- [ ] Criar sistema de notificações internas

## Dashboard e Relatórios
- [x] Criar dashboard principal com feed de atividades
- [x] Implementar página de estatísticas com gráficos
- [x] Criar relatórios de desempenho por membro
- [ ] Implementar filtros por período e grupo
- [ ] Adicionar exportação de relatórios

## Interface e Experiência do Usuário
- [x] Definir identidade visual baseada no site GENTE
- [x] Criar layout responsivo
- [x] Implementar menu de navegação
- [x] Adicionar atalhos rápidos para ações
- [ ] Implementar estados de loading e erro
- [ ] Adicionar validação de formulários

## Testes e Qualidade
- [x] Escrever testes para procedures principais
- [x] Testar fluxos de autenticação
- [x] Testar permissões de acesso
- [ ] Validar integrações externas
- [ ] Testar responsividade

## Documentação
- [x] Documentar estrutura do banco de dados
- [x] Documentar APIs e procedures
- [ ] Criar guia de uso para administradores
- [ ] Documentar processo de deploy
- [x] Adicionar README completo

## Configuração e Deploy
- [x] Configurar variáveis de ambiente
- [x] Preparar repositório GitHub
- [ ] Configurar CI/CD
- [ ] Realizar deploy inicial
- [ ] Configurar monitoramento

## Correções de Bugs
- [x] Corrigir erro de aninhamento de tags <a> na página inicial
- [x] Corrigir queries tRPC retornando HTML em vez de JSON
- [x] Verificar roteamento do servidor tRPC
## Migração para Supabase
- [x] Extrair credenciais do Supabase das instruções
- [x] Configurar conexão com Supabase Database
- [x] Reescrever db.ts para usar Supabase Client
- [x] Reescrever todos os testes para Supabase
- [x] Corrigir erros de TypeScript
- [x] Testar todas as funcionalidades com Supabase
- [ ] Configurar Supabase Storage para arquivos (futuro)## Documentação do Sistema
- [x] Criar guia completo para administradores
- [x] Criar guia para facilitadores
- [x] Criar guia para membros
- [ ] Documentar processo de deploy no Cloudflare
- [ ] Criar FAQ e troubleshooting

## Preparação para Cloudflare Pages
- [ ] Verificar compatibilidade do projeto com Cloudflare Pages
- [ ] Configurar build para Cloudflare Pages
- [ ] Testar integração MCP com Cloudflare
- [ ] Preparar variáveis de ambiente para produção
- [ ] Documentar processo de deploy

## Melhorias de Interface - Formulários Modais
- [x] Criar modal de criação de grupo
- [x] Criar modal de criação de encontro
- [x] Criar modal de adição de convidado
- [x] Integrar modais nas páginas correspondentes
- [x] Adicionar validação de formulários

## Sistema de Upload com Supabase Storage
- [ ] Configurar bucket no Supabase Storage
- [ ] Criar helpers de upload no backend
- [ ] Implementar upload de foto de perfil
- [ ] Implementar upload de documentos/vídeos para conteúdos
- [ ] Adicionar preview de arquivos

## Página de Listagem de Atividades
- [x] Criar página /activities com listagem completa
- [x] Implementar filtros por tipo de atividade
- [x] Implementar filtros por período (data)
- [x] Implementar filtros por membro (busca)
- [x] Mostrar detalhes expandidos de cada atividade
- [ ] Adicionar paginação (futuro)

## Correção de Deploy Cloudflare
- [ ] Criar arquivo wrangler.jsonc para configurar deploy
- [ ] Ajustar build output para Cloudflare Pages
- [ ] Atualizar documentação de deploy
- [ ] Testar deploy no Cloudflare Pages

## Preparação para Deploy Vercel
- [x] Criar vercel.json
- [x] Criar api/index.js (serverless function)
- [x] Criar .vercelignore
- [ ] Criar guia de deploy Vercel
- [ ] Configurar variáveis de ambiente
- [ ] Fazer deploy inicial
- [ ] Testar funcionalidades

## Migração para Supabase Auth
- [x] Configurar Supabase Auth no banco de dados
- [x] Reescrever middleware de autenticação
- [x] Atualizar context.ts para usar Supabase Auth
- [x] Atualizar routers tRPC (auth.register, auth.login, auth.logout, auth.resetPassword)
- [x] Criar componentes de login/registro no frontend
- [x] Atualizar useAuth hook
- [x] Remover dependências do Manus OAuth
- [x] Atualizar documentação de deploy
- [x] Atualizar variáveis de ambiente
- [x] Sistema funcionando e pronto para deploy

## Correção de Deploy Vercel
- [x] Corrigir vercel.json com runtime correto
- [x] Fazer commit e push
- [ ] Validar deploy no Vercel

## Correção de Carregamento no Vercel
- [ ] Investigar problema de carregamento infinito
- [ ] Analisar console e erros do navegador
- [ ] Corrigir problema identificado
- [ ] Validar correção no Vercel

## Refatoração para Vercel Serverless
- [ ] Analisar estrutura atual do servidor
- [ ] Criar adapter para serverless function
- [ ] Ajustar build para gerar arquivos corretos
- [ ] Atualizar vercel.json
- [ ] Testar localmente
- [ ] Deploy e validação
