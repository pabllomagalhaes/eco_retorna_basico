# EcoRetorna — Plataforma de Incentivo à Reciclagem

O **EcoRetorna** é uma plataforma web voltada ao engajamento cidadão e à conscientização ambiental através da logística reversa e reciclagem de embalagens (garrafas PET e latas de alumínio).

A plataforma permite que o participante acompanhe o saldo de pontos gerados pelas suas entregas, simule novas reciclagens, visualize seu impacto ambiental direto (redução de emissões de CO₂e, economia de água e energia), encontre postos de coleta e participe de desafios sustentáveis comunitários.

---

## 📋 Proposta do Projeto

- **Foco no Participante**: Interface projetada com foco nas necessidades do cidadão, tornando a reciclagem uma atividade transparente, recompensadora e educativa.
- **Transparência de Impacto**: Fórmulas ambientais claras baseadas em fatores científicos para PET e alumínio, com aviso explícito de que os valores são estimativas demonstrativas.
- **Simulação e Pontuação**: Mecanismo didático que calcula pontos gerados e valor referencial em créditos de benefícios (`1 ponto = R$ 0,125`).
- **IHC & Acessibilidade**: Usabilidade aprimorada, foco visível para navegação via teclado, áreas de toque adequadas (mínimo 44px), contraste conforme WCAG AA e compatibilidade total a partir de 360px de largura de tela.
- **Escopo Delimitado**:
  - ❌ Sem administrador
  - ❌ Sem backend de servidor ou banco externo nesta etapa
  - ❌ Sem máquina física (vending machine)
  - ❌ Sem transferências Pix reais (simulação demonstrativa)
  - ❌ Sem inteligência artificial

---

## 🗂️ Estrutura de Diretórios

O projeto segue arquitetura modular e desacoplada em React com TypeScript:

```
src/
├── components/          # Componentes reutilizáveis
│   ├── BottomNav.tsx        # Navegação inferior mobile (Início | Simular | Impacto | Benefícios | Mais)
│   ├── DisclaimerNotice.tsx # Aviso legal sobre dados demonstrativos e estimativas ambientais
│   ├── Header.tsx           # Cabeçalho com identificação do participante e saldo
│   ├── LeafletMap.tsx       # Mapa interativo de postos de coleta com OpenStreetMap
│   ├── MoreMenuModal.tsx    # Modal acessível do menu "Mais" para mobile
│   ├── Sidebar.tsx          # Barra lateral de navegação fixa para desktop
│   └── StatCard.tsx         # Card de métrica reutilizável com ícone e destaque
├── context/             # Gerenciamento de estado global
│   └── EcoContext.tsx       # Provedor central com sincronização e ações do participante
├── data/                # Dados mockados iniciais
│   └── mockData.ts          # Participante demonstrativo, histórico, postos, conquistas e rankings
├── layouts/             # Modelos de estrutura de página
│   └── AppLayout.tsx        # Layout mestre integrando Sidebar, Header, Main e BottomNav
├── pages/               # Páginas e rotas da aplicação
│   ├── DashboardPage.tsx    # Início: painel geral, saldo e resumo de impacto
│   ├── SimulatePage.tsx     # Simular: calculadora de embalagens e projeção de impacto
│   ├── HistoryPage.tsx      # Histórico: extrato detalhado de reciclagens anteriores
│   ├── ImpactPage.tsx       # Impacto: detalhes de CO₂e evitado, água e energia poupadas
│   ├── StatsPage.tsx        # Minhas Estatísticas: comparativos e evolução mensal
│   ├── CollectionPointsPage.tsx # Postos & Mapa: localização dos postos e horários
│   ├── RankingPage.tsx      # Ranking de Impacto: tabela comunitária por CO₂e evitado
│   ├── BadgesPage.tsx       # Desafios & Badges: metas ecológicas e medalhas desbloqueadas
│   ├── BenefitsPage.tsx     # Benefícios: simulação de resgate e doação de créditos
│   ├── EventsPage.tsx       # Eventos & Alertas: oficinas e mutirões ecológicos
│   ├── ProfilePage.tsx      # Perfil: dados cadastrais e preferências de acessibilidade
│   └── LoginPage.tsx        # Acesso demonstrativo para alternar usuário ou sessão
├── services/            # Serviços de persistência
│   └── storage.ts           # Gerenciador de armazenamento no LocalStorage com fallback
├── types/               # Definições de tipagem TypeScript
│   └── index.ts             # Interfaces para Participante, Embalagens, Impacto e Conquistas
└── utils/               # Funções auxiliares e de cálculo
    ├── environmental.ts     # Fatores e cálculos de CO₂e, litros d'água e energia
    └── scoring.ts           # Regras de conversão de pontos e formatação de moeda (pt-BR)
```

---

## 📱 Navegação e Responsividade

### Mobile (< 1024px)
Navegação inferior com 5 itens principais:
1. **Início** (`/`)
2. **Simular** (`/simular`)
3. **Impacto** (`/impacto`)
4. **Benefícios** (`/beneficios`)
5. **Mais** (abre modal em gaveta acessível com navegação por teclado e foco automático)

Dentro do menu **Mais**:
- Histórico (`/historico`)
- Minhas Estatísticas (`/estatisticas`)
- Postos & Mapa (`/postos`)
- Ranking de Impacto (`/ranking`)
- Desafios & Badges (`/conquistas`)
- Eventos & Alertas (`/eventos`)
- Perfil (`/perfil`)

### Desktop (≥ 1024px)
- Sidebar vertical fixa com navegação categorizada (`Principal`, `Meu Impacto`, `Explorar`, `Benefícios`, `Conta`).
- Cabeçalho exibindo título contextual, saldo em pontos, equivalente em reais e avatar do participante.

---

## ♿ Princípios de IHC e Acessibilidade Aplicados

- **Sem Rolagem Horizontal**: Design responsivo testado a partir de **360px** de largura (inclusive dispositivos compactos).
- **Contraste de Cores**: Relação de contraste de cores atendendo ao nível AA da WCAG (mínimo de 4.5:1 para textos corporais normais e 3:1 para títulos e elementos de destaque).
- **Foco Visível**: Estilos de `:focus-visible` aplicados para navegação por tabulação/teclado.
- **Áreas de Toque**: Todos os botões, links e itens interativos respeitam o padrão mínimo de **44 × 44 pixels** em interfaces móveis.
- **HTML Semântico**: Estrutura orientada por `<header>`, `<main>`, `<nav>`, `<aside>`, `<section>` e atributos `aria-label`, `aria-expanded` e `role`.
- **Prevenção de Erros e Disclaimers**: Avisos contextuais esclarecendo o caráter estimativo e demonstrativo dos valores ecológicos e pontuações.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm (ou gerenciador de pacotes equivalente)

### Instalação de Dependências
```bash
npm install
```

### Executar em Ambiente de Desenvolvimento
```bash
npm run dev
```
Acesse no seu navegador através de:
```
http://localhost:3000
```

### Verificação de Tipagem e Linter
```bash
npm run lint
```

### Compilar para Produção (Build)
```bash
npm run build
```
Os arquivos estáticos otimizados serão gerados na pasta `dist/`.
