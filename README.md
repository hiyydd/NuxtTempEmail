# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


# 部署 email-worker
# 进入 email-worker 目录
cd server/workers/email-worker

# 登录 Cloudflare（如果尚未登录）
npx wrangler login

# 创建 KV 命名空间（如果尚未创建）
npx wrangler kv:namespace create "tempEmail"

# 修改 wrangler.toml 文件
# 将 KV 绑定名修改为 "tempEmail"（当前配置是 "temp-email"）
# 使用刚才创建的 KV 命名空间 ID

# 部署 Worker
npx wrangler deploy