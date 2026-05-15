# Racha Votos ⚽

Sistema de avaliação mensal de jogadores de futebol amador.

## Stack

- **Vue 3** + Composition API
- **Pinia** — gerenciamento de estado
- **Vue Router 4** — navegação com guards
- **Supabase** — banco de dados e realtime
- **Vite 8** — bundler
- **Netlify** — deploy

## Setup

```bash
npm install
cp .env.example .env
# Preencha .env com suas credenciais do Supabase
npm run dev
```

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anon do Supabase |
| `VITE_ADMIN_PASS` | Senha para acesso ao painel admin |
| `VITE_VOTE_THRESHOLD` | Mínimo de votos para habilitar compartilhamento (default: 12) |

> ⚠️ **Nunca versione o arquivo `.env`**

## Deploy

O projeto é deployado automaticamente no Netlify. O build é feito localmente com as variáveis do `.env` e o `dist/` é publicado diretamente.
