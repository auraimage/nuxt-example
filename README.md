# AuraImage Nuxt Example

[![Images powered by AuraImage](https://img.shields.io/badge/Images%20powered%20by-AuraImage-0b0b0b?style=flat-square)](https://auraimage.ai)

A minimal Nuxt 3 app that uploads images to AuraImage and displays
transformed variants. Built with Nuxt 3, Vue 3 (Composition API),
TypeScript, and Tailwind CSS v4. Self-contained — no separate backend
needed.

---

## Prerequisites

- **Node.js** 20 or later — check with `node --version`
- An **AuraImage account** — [sign up here](https://auraimage.ai)
- A **project** with at least one **secret key** — you'll create this in step 2

---

## Quick start

### Step 1 — Clone

```bash
git clone https://github.com/auraimage/nuxt-example
cd nuxt-example
```

### Step 2 — Create a project and secret key

**Option A (recommended)**: Let the CLI do everything.

```bash
npx aura init
```

It will create a project, generate a secret key, and write `.env` for you.

**Option B (manual)**: Create `.env` yourself.

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```
AURAIMAGE_SECRET_KEY=sk_live_your_actual_key
AURAIMAGE_PROJECT_NAME=your_project_name
```

> **Never commit `.env`.** It's already in `.gitignore`.

### Step 3 — Install

```bash
npm install
```

### Step 4 — Start

```bash
npm run dev
```

You should see output ending with something like:

```
✔ Nitro built in XXX ms
```

### Step 5 — Try it

Open `http://localhost:3000` in your browser. You should see:

1. **"AuraImage Nuxt Example"** heading
2. Green **"Server: Connected"** indicator
3. A file input button

Pick an image. You'll see:

- **"Uploading..."** while uploading
- Three cards showing your image at different sizes:
  - **Thumbnail 200w WebP** — cropped, WebP
  - **Medium 600w AVIF** — medium, AVIF format
  - **Full 1200w** — full resolution
- Each card shows the CDN URL with transform parameters

---

## What if something goes wrong?

| Problem | What to check |
|---|---|
| Red "Server: Not running" | `.env` is missing or has wrong values — redo step 2 |
| "Upload failed" | Secret key is invalid/revoked, or project name is wrong |
| Tailwind styles not working | Run `npx nuxi prepare` to regenerate types |
| Port 3000 in use | Nuxt will pick another port — watch the terminal output |

---

## How it works

This app is **self-contained** — the API routes (Nitro handlers) that sign
upload tokens run inside Nuxt's Nitro server. No separate backend needed.

1. On load, the page calls `GET /api/health` — the handler in
   `server/api/health.get.ts` responds with `{ status: "ok" }`
2. When you pick a file, the page calls `POST /api/upload-token` — the handler
   in `server/api/upload-token.post.ts` uses `@auraimage/sdk` to sign an
   HMAC token with your secret key
3. `@auraimage/sdk/client` (in the browser) uploads the image directly to the
   AuraImage CDN with the token in the `X-Aura-Signature` header
4. The CDN returns a URL — three transform presets display as labeled cards

```
Browser ──GET /api/health────────────► Nitro handler → { status: "ok" }
Browser ──POST /api/upload-token─────► Nitro handler → signs with SDK → { token }
Browser ──POST /v1/upload (to CDN)───► AuraImage CDN → { url, key, ... }
```

---

## Project structure

```
nuxt-example/
├── .env.example              # Template for your secret key + project name
├── package.json
├── tsconfig.json
├── nuxt.config.ts            # Nuxt config + Tailwind v4 via PostCSS
├── LICENSE
├── README.md
├── app.vue                   # Root component
├── assets/
│   └── css/
│       └── main.css          # Tailwind CSS import
├── components/
│   └── Upload.vue            # Upload UI (Composition API)
└── server/
    └── api/
        ├── health.get.ts     # GET /api/health
        └── upload-token.post.ts  # POST /api/upload-token
```

---

## Links

- [AuraImage docs](https://auraimage.ai/docs)
- [Dashboard](https://app.auraimage.ai)
- [@auraimage/sdk on npm](https://www.npmjs.com/package/@auraimage/sdk)

---

Images powered by [AuraImage](https://auraimage.ai) — the image CDN that
installs itself. Set it up in any project with `npx aura init`, or from your
AI agent with [Agent Skills](https://github.com/auraimage/skills) and the
[MCP server](https://github.com/auraimage/mcp-server).

### Contributing

This repository is generated from the AuraImage monorepo, so pull requests
opened here are overwritten on the next sync. Please
[open an issue](https://github.com/auraimage/nuxt-example/issues) instead — bugs
in this example are fixed upstream and mirrored back within minutes.
