# OniBus Express

![React](https://img.shields.io/badge/React-18.3-blue?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-blue?logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-1.6-blue?logo=vitest&logoColor=white)

OniBus Express é um frontend de reserva de passagens rodoviárias montado com React e Vite. O foco é entregar um fluxo completo de busca, seleção de assentos, checkout e gestão de reserva com uma base enxuta e pronta para evolução.

## 🚀 Demo

Acesse a aplicação publicada:

https://onibus-express-alpha.vercel.app/

## Pré-requisitos

- Node.js 20+
- npm 10+
- Docker Desktop opcional para execução containerizada

## Demonstração

### Home
<img width="1903" height="940" alt="home" src="https://github.com/user-attachments/assets/537c0759-6d10-478d-b312-615f5d3597d7" />


### Busca de viagens
<img width="1898" height="923" alt="busca de viagens" src="https://github.com/user-attachments/assets/009c68c4-3ca7-417f-ad74-7c025160b6b8" />


### Seleção de assentos
<img width="1893" height="920" alt="seleção de assentos" src="https://github.com/user-attachments/assets/85e34228-7eb2-494a-adfa-828f74d31b31" />


### Checkout
<img width="1896" height="942" alt="checkout" src="https://github.com/user-attachments/assets/7938fd81-8617-44ae-99e7-b6a6cc7d58c7" />


### Consulta de reserva
<img width="1895" height="882" alt="consulta de reserva" src="https://github.com/user-attachments/assets/e012b53b-16a3-4044-9862-16b977d9cbde" />


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
- React Number Format
- Tailwind CSS
- Lucide React
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

* **Zustand**: escolhido para estado global leve, mantendo apenas o mínimo necessário — viagem selecionada, assento selecionado e reserva. Isso evita a complexidade de estados distribuídos e mantém o fluxo previsível.

* **React Hook Form + Zod**: combinação utilizada para gerenciamento e validação de formulários com regras declarativas, tipagem segura e integração simples com a experiência de checkout.

* **React Number Format**: utilizado para aplicar máscara de CPF durante a digitação, melhorando a experiência do usuário sem comprometer a validação e o armazenamento dos dados.

* **Tailwind CSS**: escolhido para acelerar a construção da interface, facilitar a responsividade e manter consistência visual sem a necessidade de grandes arquivos CSS customizados.

* **Lucide React**: adotado para fornecer ícones leves, consistentes e facilmente customizáveis, reforçando a comunicação visual da aplicação sem aumentar significativamente o bundle.

* **Arquitetura por features**: o projeto foi organizado por domínio de negócio, isolando responsabilidades e facilitando manutenção, escalabilidade e evolução do fluxo de reserva.

* **Mocks locais**: as APIs são simuladas através de serviços locais (`localStorage` e dados em memória), permitindo desenvolver e validar todo o fluxo sem dependência de backend.

* **Docker + Nginx**: utilizados para containerização e distribuição da aplicação, garantindo ambiente consistente e suporte adequado ao roteamento SPA em produção.

* **Responsividade e UX**: a interface foi desenvolvida priorizando experiência do usuário em desktop e dispositivos móveis, com foco em clareza visual, acessibilidade básica e consistência entre as etapas do fluxo.


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
- Internacionalização (i18n) para múltiplos idiomas

## Considerações finais

Este projeto foi desenvolvido priorizando simplicidade, experiência do usuário, manutenibilidade e escalabilidade progressiva. A arquitetura evita abstrações desnecessárias, mantém o domínio do fluxo claro e deixa espaço para evolução sem comprometer a entrega atual.
