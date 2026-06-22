# OniBus Express

![React](https://img.shields.io/badge/React-18.3-blue?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-blue?logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-1.6-blue?logo=vitest&logoColor=white)

OniBus Express é um frontend de reserva de passagens rodoviárias montado com React e Vite. O foco é entregar um fluxo completo de busca, seleção de assentos, checkout e gestão de reserva com uma base enxuta e pronta para evolução.

## Pré-requisitos

- Node.js 20+
- npm 10+
- Docker Desktop opcional para execução containerizada

## Demonstração

### Home



### Busca de viagens



### Seleção de assentos



### Checkout



### Consulta de reserva



## Funcionalidades implementadas

- Busca de passagens
- Autocomplete de cidades
- Inversão de origem e destino
- Seleção de assentos
- Checkout
- Geração de reserva
- Persistência local com localStorage
- Responsividade
- Acessibilidade básica
- Testes automatizados
- Docker + Nginx

### Funcionalidade bônus

- Consulta de reserva por código
- Cancelamento de reserva

## Fluxo da aplicação

- Buscar viagem
- Selecionar assento
- Realizar checkout
- Gerar reserva
- Consultar reserva
- Cancelar reserva

## Stack utilizada

- React
- TypeScript
- Vite
- React Router
- Zustand
- React Hook Form
- Zod
- Tailwind CSS
- Vitest
- React Testing Library
- Docker
- Nginx

## Arquitetura

O projeto é organizado por features para manter o fluxo de usuário claro e isolado.

- `src/features` contém as páginas e lógicas de cada etapa do fluxo.
- `src/shared` agrupa componentes reutilizáveis, serviços e tipos.
- `src/stores` centraliza apenas o estado necessário para compartilhar dados entre telas.
- `src/shared/services` usa mocks e armazenamento local para simular o backend sem adicionar complexidade extra.

A concepção é propositalmente simples: cada feature possui responsabilidade única e a camada de serviços permanece desacoplada da UI.

### Estratégia de estado

- Estado global apenas para dados compartilhados entre telas, como o trip selecionado, assento selecionado e reserva atual.
- Estado local para comportamentos específicos de componentes e interações de formulário.
- Persistência de reserva usando `localStorage` para manter o histórico e permitir consulta/cancelamento mesmo sem backend.

## Decisões técnicas

- Zustand: escolhido para estado global leve, mantendo apenas o mínimo necessário — viagem selecionada, assento selecionado e reserva. Isso evita a complexidade de estados distribuídos e mantém o fluxo previsível.
- React Hook Form + Zod: combinação usada para validação de formulário com regras declarativas, payload tipado e experiência de formulário consistente no checkout.
- Tailwind: optou-se por utilitários CSS para acelerar a composição de interfaces e facilitar ajustes responsivos sem sobrecarregar com CSS customizado.
- Mocks: as APIs são simuladas com serviços locais (`localStorage` e dados em memória), o que permite desenvolver o frontend sem backend pronto e ainda manter o fluxo de reserva funcional.
- Docker + Nginx: containerização para produção garante ambiente consistente e permite servir a aplicação estática de forma eficiente, com fallback de rota SPA para refresh em páginas internas.

## Como executar localmente

```bash
npm install
npm run dev
```

## Executar testes

```bash
npm run test
```

## Build de produção

```bash
npm run build
```

## Executar com Docker

```bash
docker compose up --build
```

Acesso:

```bash
http://localhost:8080
```

## Estrutura de pastas

- `src/`
  - `app/` - configuração de rotas e layout
  - `features/` - páginas e fluxos de negócio
  - `shared/` - componentes UI, serviços e tipos
  - `stores/` - estado global mínimo
- `public/` - ativos estáticos
- `Dockerfile` - build multi-stage para produção
- `nginx.conf` - configuração de fallback SPA
- `docker-compose.yml` - orquestração local

## Melhorias futuras

- Integração com API real para busca e gerenciamento de reservas
- Persistência de dados em backend
- Histórico de reservas do usuário
- Filtros avançados por horário, preço e duração da viagem
- Seleção de múltiplos passageiros e assentos
- Integração com gateway de pagamento
- Notificações e envio de comprovante de reserva

## Considerações finais

Este projeto foi desenvolvido priorizando simplicidade, experiência do usuário, manutenibilidade e escalabilidade progressiva. A arquitetura evita abstrações desnecessárias, mantém o domínio do fluxo claro e deixa espaço para evolução sem comprometer a entrega atual.
