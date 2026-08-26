# vinext-starter

A clean full-stack app running on [vinext](https://github.com/cloudflare/vinext),
with Cloudflare infrastructure managed as Effect programs through
[Alchemy](https://alchemy.run).

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

`npm run dev` starts Alchemy's local Cloudflare environment, including the D1,
Images, and Assets bindings. This project does not use `wrangler.jsonc`.

## Cloudflare Infrastructure

Infrastructure is declared in `alchemy.run.ts`. The stack provisions a D1
database, binds Cloudflare Images, builds the vinext RSC/SSR environments, and
deploys the custom Worker entry with static assets.

Authenticate once with an Alchemy profile:

```bash
npx alchemy login
```

Then preview changes before applying them:

```bash
npm run infra:plan
npm run infra:deploy
```

Alchemy stores stack state in its Cloudflare state worker. The first command
that needs remote state may ask permission to bootstrap that worker. No
infrastructure is created by installing or building this repository.

To remove a stage's managed resources, review the target stage and run:

```bash
npm run infra:destroy
```

## Included Shape

- edit site code under `app/`
- `alchemy.run.ts` declares the Cloudflare Worker, D1, Images, and assets
- `vite.config.ts` guards the standalone Cloudflare plugin when Alchemy injects its managed instance
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the starter and verify its rendered loading skeleton
- `npm run db:generate`: generate Drizzle migrations after schema changes
- `npm run infra:plan`: preview Cloudflare infrastructure changes
- `npm run infra:deploy`: apply the reviewed plan
- `npm run infra:destroy`: remove the selected stage's managed resources

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
