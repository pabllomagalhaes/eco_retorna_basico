# EcoRetorna — Plataforma de Incentivo à Reciclagem (Participante)

O **EcoRetorna** é uma plataforma web voltada ao engajamento cidadão e à conscientização ambiental através da logística reversa e reciclagem de embalagens (garrafas PET e latas de alumínio).

Este repositório contém o ambiente do **Participante**, projetado para que o cidadão acompanhe o saldo de pontos gerados por suas entregas, simule novas reciclagens, visualize seu impacto ambiental estimado, com destaque para a estimativa de CO₂e evitado, localize ecopontos no mapa interativo e participe de desafios sustentáveis.

---

## 🔗 Projeto Complementar

A plataforma EcoRetorna é composta por duas aplicações web complementares e integradas:

1. **EcoRetorna Participante** (este repositório):  
   [https://github.com/pabllomagalhaes/eco_retorna_basico](https://github.com/pabllomagalhaes/eco_retorna_basico)
2. **EcoRetorna Admin**:  
   [https://github.com/pabllomagalhaes/eco-retorna-admin](https://github.com/pabllomagalhaes/eco-retorna-admin)

As duas aplicações compartilham:
- **Firebase Authentication**: gestão de identidades e sessões;
- **Cloud Firestore**: banco de dados NoSQL unificado;
- **Modelo de Dados Canônico**: entidades padronizadas para materiais, registros de reciclagem, campanhas e configurações;
- **Regras de Segurança (`firestore.rules`)**: controle estrito de autorização baseado em perfil (`role`).

---

## 🏛️ Arquitetura e Persistência

- **Autenticação Real**: O acesso à área do participante requer autenticação via Firebase Authentication (Email/Password). Somente contas com `role="participant"` e `active=true` no Firestore (`users/{uid}`) possuem autorização para acessar o painel do participante.
- **Persistência Principal**: O Cloud Firestore é a fonte primária de dados. Leituras e gravações ocorrem diretamente na nuvem conforme as regras de segurança declarativas.
- **Camada de Fallback Local**: Caso as credenciais do Firebase não sejam configuradas no arquivo `.env`, a aplicação ativa automaticamente um modo de demonstração local em `localStorage`, garantindo operacionalidade offline.
- **Eventos Externos de Coleta**: O participante **não** cria documentos de reciclagem manualmente. Os registros (`recyclingRecords`) representam eventos externos de reciclagem. No protótipo acadêmico, essa origem externa é simulada por um script técnico, sem integração real com equipamentos físicos.
- **Simulador Didático**: A funcionalidade disponível na tela **Simular** é uma ferramenta didática que calcula projeções de impacto e estimativas de pontuação, sem alterar saldo ou histórico do participante.

---

## 📱 Principais Funcionalidades

- **Dashboard**: Painel consolidado com saldo de pontos, equivalência demonstrativa em reais (R$), resumo de embalagens recicladas e acesso rápido às ações.
- **Simular**: Calculadora educativa de embalagens (PET e latas de alumínio) com projeção instantânea de pontos e impacto ambiental (não altera saldo).
- **Histórico**: Extrato cronológico detalhado das entregas registradas, informando material, ecoponto, pontuação base e bônus aplicados.
- **Meu Impacto**: Métricas ecológicas transparentes estimando emissões de CO₂e evitadas, água e energia elétrica poupadas.
- **Estatísticas**: Análise gráfica da evolução mensal de descartes e distribuição por categoria de material.
- **Postos & Mapa**: Mapa interativo com Leaflet e OpenStreetMap, com geolocalização dos ecopontos, horários de atendimento e filtros por materiais aceitos.
- **Ranking de Impacto**: Classificação comunitária baseada exclusivamente no impacto ambiental estimado (kg de CO₂e evitado).
- **Desafios & Badges**: Sistema de conquistas e marcos sustentáveis derivados diretamente do histórico real de reciclagem.
- **Benefícios**: Catálogo de resgate de créditos acumulados e destinação para iniciativas socioambientais demonstrativas.
- **Eventos & Alertas**: Comunicados comunitários, oficinas ecológicas e mutirões de sustentabilidade.
- **Perfil**: Gerenciamento de dados cadastrais, visualização de identificação e preferências de uso.

---

## 🗂️ Estrutura de Diretórios

O projeto segue arquitetura modular desacoplada com TypeScript e React:

```
src/
├── components/                  # Componentes reutilizáveis (BottomNav, Header, LeafletMap, ProtectedRoute, etc.)
├── context/                     # Estado global da aplicação
│   └── EcoContext.tsx               # Provedor central com autenticação, sincronização e ações do participante
├── data/                        # Dados mockados para modo offline/demonstrativo
│   └── mockData.ts                  # Participante base, histórico, postos e conquistas locais
├── firebase/                    # Configuração e inicialização do Firebase Client SDK
│   └── config.ts                    # Inicialização condicional (detecta presença de variáveis no .env)
├── layouts/                     # Estruturas de página (AppLayout com Header, Sidebar e BottomNav)
├── pages/                       # Rotas e telas da aplicação
│   ├── PublicHomePage.tsx           # Página pública institucional
│   ├── LoginPage.tsx                # Tela de autenticação do participante
│   ├── RegisterPage.tsx             # Cadastro de novos participantes
│   ├── AdminLoginPlaceholderPage.tsx# Informativo de redirecionamento para o EcoRetorna Admin
│   ├── DashboardPage.tsx            # Painel principal do participante
│   ├── SimulatePage.tsx             # Calculadora didática de simulação
│   ├── HistoryPage.tsx              # Extrato de coletas registradas
│   ├── ImpactPage.tsx               # Métricas de impacto ecológico
│   ├── StatsPage.tsx                # Estatísticas e evolução mensal
│   ├── CollectionPointsPage.tsx     # Postos de coleta e mapa interativo
│   ├── RankingPage.tsx              # Ranking comunitário por CO₂e evitado
│   ├── BadgesPage.tsx               # Conquistas e desafios ecológicos
│   ├── BenefitsPage.tsx             # Resgates e doações de pontos
│   ├── EventsPage.tsx               # Eventos ecológicos e alertas
│   └── ProfilePage.tsx              # Gestão do perfil do participante
├── services/                    # Camada de serviços e persistência
│   ├── authService.ts               # Autenticação e validação estrita de perfis (role="participant")
│   ├── participantService.ts        # Leitura e atualização do perfil do participante no Firestore
│   ├── recyclingService.ts          # Consulta ao extrato de coletas externas
│   ├── materialService.ts           # Consulta a materiais ativos e fatores ecológicos
│   ├── campaignService.ts           # Consulta a campanhas promocionais vigentes
│   ├── settingsService.ts           # Consulta aos parâmetros do sistema (valor do ponto em R$)
│   ├── benefitService.ts            # Gestão de resgates e doações
│   ├── collectionPointService.ts    # Consulta aos ecopontos e locais de entrega
│   ├── eventService.ts              # Consulta a eventos e comunicados
│   └── storage.ts                   # Persistência em localStorage para modo de fallback local
├── types/                       # Interfaces e tipos TypeScript centrais
│   └── index.ts                     # Modelos de Participant, Material, Campaign, RecyclingRecord, etc.
└── utils/                       # Funções puras de cálculo e formatação
    ├── environmental.ts             # Cálculos de CO₂e, litros de água e kWh poupados
    ├── gamification.ts              # Regras de avaliação de badges e conquistas
    └── scoring.ts                   # Conversão de pontos e equivalência monetária (BRL)
scripts/
└── simulateRecycling.ts         # Script técnico para simulação externa de reciclagem via Firebase Admin
```

---

## 🛠️ Tecnologias Utilizadas

- **React 19** com **TypeScript**
- **Vite** para build e empacotamento rápido
- **Firebase Authentication** para autenticação segura
- **Cloud Firestore** para banco de dados NoSQL reativo
- **Leaflet** & **OpenStreetMap** para mapas e geolocalização
- **Tailwind CSS** para estilização utilitária e responsiva
- **Lucide React** para iconografia semântica

---

## ♿ Acessibilidade e IHC

- **Compatibilidade Responsiva**: Interface otimizada para uso em telas a partir de **360px** de largura, sem rolagem horizontal indesejada.
- **Foco e Navegação por Teclado**: Elementos interativos com estados claros de `:focus-visible`.
- **Contraste e Legibilidade**: A interface adota boas práticas de contraste e escolha de cores para assegurar legibilidade adequada entre textos e elementos de fundo.
- **Áreas de Toque Adequadas**: Botões e alvos de toque com dimensão mínima recomendada de **44 × 44 pixels** em dispositivos móveis.
- **HTML Semântico**: Uso estruturado de `<header>`, `<main>`, `<nav>`, `<section>` e atributos ARIA.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **npm**

### 1. Clonar o Repositório
```bash
git clone https://github.com/pabllomagalhaes/eco_retorna_basico.git
cd eco_retorna_basico
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Copie o arquivo de exemplo e preencha com as credenciais do seu projeto Firebase:
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
VITE_APP_TITLE="EcoRetorna"
VITE_FIREBASE_API_KEY="sua-api-key"
VITE_FIREBASE_AUTH_DOMAIN="seu-projeto.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="seu-projeto"
VITE_FIREBASE_STORAGE_BUCKET="seu-projeto.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="seu-sender-id"
VITE_FIREBASE_APP_ID="seu-app-id"
```

> **Nota:** Caso o arquivo `.env` não seja configurado, a aplicação iniciará automaticamente em **modo de demonstração local** utilizando `localStorage`.

### 4. Executar em Desenvolvimento
```bash
npm run dev
```
Abra o navegador em `http://localhost:5173`.

### 5. Verificação de Tipagem (Lint)
```bash
npm run lint
```

### 6. Compilar para Produção (Build)
```bash
npm run build
```
Os arquivos otimizados serão gerados no diretório `dist/`.

### 7. Simulador Técnico de Reciclagem (Opcional para Demonstração)
Para simular tecnicamente a entrada de um registro de reciclagem externo via Admin SDK (requer credencial de conta de serviço):
```bash
# Modo de teste (sem gravar no banco):
npm run demo:recycling -- --email participante@email.com --material pet_2l --quantity 20 --collection-point "Nome do Ecoponto" --dry-run
```

---

## 📄 Licença

Este projeto é desenvolvido para fins educacionais e de demonstração tecnológica. Consulte os termos de uso na plataforma.
