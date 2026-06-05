# 🎵 Playlists

Busque músicas de verdade, monte suas playlists e ouça prévias de 30 segundos. Um mini-player completo, sem cadastro e sem servidor de música.

![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Server Actions](https://img.shields.io/badge/Server_Actions-000?logo=nextdotjs&logoColor=white)

## O que faz

- **Busca de músicas reais** com capa, artista e álbum
- **Player** que toca a **prévia de 30s** com play/pause, anterior/próxima e barra de progresso clicável
- **Várias playlists** — crie, selecione e organize
- Adicionar e remover faixas, tocar a playlist inteira em sequência
- **Salva sozinho** no navegador — suas playlists continuam lá
- 100% **responsivo**

## O diferencial técnico

A busca acontece numa **Next.js Server Action** (`app/actions.ts`) que consulta a **iTunes Search API** no servidor — assim o navegador não esbarra em CORS e devolve só o necessário (título, artista, capa e a URL da prévia). O áudio toca direto no `<audio>` do navegador, com a fila de reprodução controlada por estado em React.

A iTunes Search API é **gratuita e sem token**, então o projeto roda na Vercel sem nenhuma variável de ambiente. As prévias de 30s são fornecidas pela própria Apple.

## Stack

Next.js 16 (App Router + Server Actions) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide. Sem banco — as playlists ficam no `localStorage`.

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`.

## Deploy

Pronto pra Vercel — importe o repositório, build padrão (`next build`), zero variáveis de ambiente.

---

Feito por [@joaomanfre3](https://github.com/joaomanfre3).
