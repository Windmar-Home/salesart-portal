# v2-migration/ — SalesArts V2 port scaffold

**Destination:** `Windmar-Home/SalesArtsV2` monorepo.
**Status:** Scaffolded, awaiting rsync + Placid template UUIDs.

## What's here

Files laid out exactly as they should land in `SalesArtsV2`. Run:

```bash
cd ~/projects/SalesArtsV2
rsync -av ~/projects/salesart-portal/v2-migration/ ./
pnpm install
pnpm --filter web dev
```

## Paths mapped

```
v2-migration/
├── packages/shared/src/
│   └── intake-spec.types.ts           # 4-question intake enums + defaults
│
├── apps/web/src/
│   ├── app/[region]/[id]/quick/
│   │   └── page.tsx                   # /quick route for sales reps
│   ├── app/api/generate-copy/
│   │   └── route.ts                   # Claude Haiku 4.5 copy gen
│   ├── app/api/escalate/
│   │   └── route.ts                   # Teams escalation (Graph direct)
│   └── lib/
│       ├── copy/
│       │   ├── generate.ts            # Client wrapper + voice post-process
│       │   ├── voice.ts               # Brand voice enforcement
│       │   └── fallback.ts            # Pre-written headlines (offline mode)
│       ├── rules/
│       │   └── editable.ts            # Which fields rep may edit per template
│       └── graph/
│           └── client.ts              # MS Graph client-credentials helper
│
└── supabase/migrations/
    └── 005_headline_generations.sql   # Analytics table for Haiku outputs
```

## Import aliases required in V2

Add to `apps/web/tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*":                    ["./src/*"],
      "@salesarts/shared/*":    ["../../packages/shared/src/*"]
    }
  }
}
```

## Env vars to set on V2 Vercel

```
ANTHROPIC_API_KEY=
MS_TENANT_ID=
MS_CLIENT_ID=
MS_CLIENT_SECRET=
ESCALATION_DESIGNER_EMAIL=jaime.diaz@windmarhome.com
ESCALATION_OWNER_EMAIL=miguel@windmarhome.com
MOCK_TEAMS=0
```

Same values as in `salesart-portal` — reusable.

## Still TODO after rsync

1. **Template UUID map** — `packages/shared/src/template-map.ts` (awaiting Bryan's Placid IDs).
2. **Placid render submit** — wire `QuickPreview` button to existing `GeneratePlacidImage/PDF` from the merged `SalesArts/src/lib/client.ts`.
3. **NotificationSocket hook** — listen on `placid_notification` to redirect rep to history after render.
4. **Zoho gate** — confirm `/quick` is accessible to `role=sales_rep` only. RLS on `headline_generations` uses `auth.jwt()->>'zoho_user_id'`; ensure V2 auth sets that claim.
5. **Admin consent** — Azure app `Chat.Create` + `ChatMessage.Send` needs tenant admin approval before `/api/escalate` works in Graph mode.
