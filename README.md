# GENTE COMUNIDADE

Plataforma de gerenciamento de comunidade de networking empresarial para o grupo GENTE.

## 📋 Sobre o Projeto

O GENTE COMUNIDADE é uma plataforma web desenvolvida para facilitar o gerenciamento de grupos de networking empresarial, permitindo o registro de atividades, gamificação, gestão de encontros e compartilhamento de conteúdos estratégicos entre os membros.

## 🚀 Funcionalidades Principais

### Sistema de Atividades
- **Indicação de Contatos**: Registre indicações feitas para outros membros (10 pontos)
- **Novo Negócio**: Registre negócios fechados através da rede (20 pontos)
- **Reunião 1 a 1 (Gente em Ação)**: Registre reuniões com outros membros (15 pontos)
- **Depoimentos**: Agradeça ou elogie outros membros (5 pontos)

### Gamificação
- Sistema de pontuação mensal
- Ranking de membros mais ativos
- Estatísticas individuais de desempenho
- Contabilização de valor em negócios gerados

### Gestão de Grupos
- Criação e gerenciamento de grupos de networking
- Associação de membros a grupos
- Designação de facilitadores por grupo

### Encontros e Eventos
- Agendamento de encontros
- Gestão de convidados
- Vinculação de convidados a encontros específicos
- Controle de presença

### Conteúdos Estratégicos
- Biblioteca de vídeos, documentos e apresentações
- Acesso exclusivo para membros
- Categorização de conteúdos
- Links externos

### Controle de Acesso
- **Administrador**: Acesso total ao sistema
- **Facilitador**: Gerenciamento de grupos e encontros
- **Membro**: Acesso às funcionalidades principais
- **Convidado**: Acesso limitado

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19**: Biblioteca para construção da interface
- **TypeScript**: Tipagem estática
- **Tailwind CSS 4**: Framework de estilos
- **shadcn/ui**: Componentes de interface
- **Wouter**: Roteamento
- **TanStack Query**: Gerenciamento de estado e cache
- **date-fns**: Manipulação de datas

### Backend
- **Node.js**: Runtime JavaScript
- **Express**: Framework web
- **tRPC 11**: Type-safe API
- **Supabase Client**: Cliente PostgreSQL type-safe
- **Zod**: Validação de schemas
- **SuperJSON**: Serialização de dados

### Banco de Dados
- **Supabase (PostgreSQL)**: Banco de dados relacional
- **Supabase Client**: Cliente JavaScript para PostgreSQL

### Autenticação
- **Manus OAuth**: Sistema de autenticação integrado

## 📦 Estrutura do Projeto

```
gente-comunidade/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── lib/           # Utilitários e configurações
│   │   └── App.tsx        # Componente principal
│   └── index.html
├── server/                # Backend tRPC
│   ├── _core/            # Configurações do servidor
│   ├── db.ts             # Funções de banco de dados
│   ├── routers.ts        # Rotas tRPC
│   └── *.test.ts         # Testes unitários
├── drizzle/              # Schemas e migrations
│   └── schema.ts         # Definição das tabelas
└── shared/               # Código compartilhado
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

- **users**: Usuários do sistema
- **profiles**: Perfis estendidos dos usuários
- **groups**: Grupos de networking
- **groupMembers**: Associação entre usuários e grupos
- **activities**: Registro de atividades (indicações, negócios, reuniões, depoimentos)
- **scores**: Pontuações mensais dos usuários
- **meetings**: Encontros e eventos
- **guests**: Convidados para encontros
- **meetingGuests**: Associação entre convidados e encontros
- **contents**: Conteúdos estratégicos
- **notifications**: Notificações do sistema

## 🚀 Como Executar

### Pré-requisitos
- Node.js 22+
- pnpm
- Banco de dados Supabase (PostgreSQL)

### Instalação

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente do Supabase
# (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY)

# Executar schema SQL no Supabase
# (use o arquivo supabase-schema.sql no SQL Editor do Supabase)

# Iniciar servidor de desenvolvimento
pnpm dev
```

### Testes

```bash
# Executar todos os testes
pnpm test

# Verificar tipos TypeScript
pnpm check
```

## 🔐 Variáveis de Ambiente

As seguintes variáveis são gerenciadas automaticamente pela plataforma Manus:

- `DATABASE_URL`: String de conexão com o banco de dados
- `JWT_SECRET`: Segredo para assinatura de tokens
- `VITE_APP_ID`: ID da aplicação Manus OAuth
- `OAUTH_SERVER_URL`: URL do servidor OAuth
- `VITE_OAUTH_PORTAL_URL`: URL do portal de login

## 📝 Integrações Planejadas

### RD Station
- Integração com CRM para gestão de leads
- Sincronização de contatos
- Automação de marketing

### Resend
- Envio de emails transacionais
- Notificações por email
- Templates personalizados

## 🎨 Identidade Visual

O projeto utiliza a identidade visual do GENTE:

- **Cor Primária**: Azul (#0080FF)
- **Cor Secundária**: Laranja/Amarelo (#FFA500)
- **Fonte**: Poppins

## 📊 Sistema de Pontuação

| Atividade | Pontos |
|-----------|--------|
| Indicação de Contato | 10 |
| Novo Negócio | 20 |
| Reunião 1 a 1 | 15 |
| Depoimento | 5 |

## 🧪 Testes

O projeto inclui testes unitários para as principais funcionalidades:

- Testes de autenticação
- Testes de atividades
- Testes de gamificação
- Testes de grupos

Todos os testes utilizam Vitest e cobrem os cenários principais de uso.

## 📖 Documentação

### Guias de Usuário
- [Guia do Administrador](docs/GUIA_ADMINISTRADOR.md)
- [Guia do Facilitador](docs/GUIA_FACILITADOR.md)
- [Guia do Membro](docs/GUIA_MEMBRO.md)

### Documentação Técnica
- [Deploy no Cloudflare Pages](docs/DEPLOY_CLOUDFLARE.md)
- [Especificação Técnica](/home/ubuntu/especificacao_tecnica_gente_comunidade.md)
- [Análise Visual e Fluxos](/home/ubuntu/analise_visual_fluxos.md)

## 🤝 Contribuindo

Este é um projeto privado da comunidade GENTE. Para contribuir:

1. Clone o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados à comunidade GENTE.

## 👥 Equipe

Desenvolvido para a comunidade GENTE Networking Empresarial.

## 📞 Suporte

Para suporte e dúvidas, entre em contato através do site oficial: https://gentenetworking.com.br
