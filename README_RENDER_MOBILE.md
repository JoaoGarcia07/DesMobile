# Ajuste DesMobile para Render

Arquivos alterados:

- `api.js`: força o app a usar `EXPO_PUBLIC_API_URL` ou, como fallback, `https://desbravadoresteste.onrender.com`.
- `app/index.tsx`: corrige a mensagem de erro para apontar para a API publicada.
- `package.json`: adiciona o script `build:web` com `expo export -p web`.
- `.env.example`: documenta a variável `EXPO_PUBLIC_API_URL`.

## Variáveis no Render Static Site

```env
EXPO_PUBLIC_API_URL=https://desbravadoresteste.onrender.com
NODE_VERSION=20
```

## Configuração do Render Static Site

- Build Command: `npm install && npm run build:web`
- Publish Directory: `dist`

## Rewrite recomendado

- Source: `/*`
- Destination: `/index.html`
- Action: `Rewrite`
