# SalesArts V2 Migration Plan

Target: `Windmar-Home/SalesArtsV2` — pnpm monorepo (Next.js 16 + Supabase + Placid).
Source: `Windmar-Home/salesart-portal` (this repo) — Vite + React standalone.
Branch: `claude/salesart-portal-canva-nkz8r`.

## Why migrate at all

Both apps target the same end: sales reps generate on-brand marketing art. `salesart-portal` was built as proof of concept and ships live at `salesart-portal.vercel.app`. V2 is the production monorepo with Supabase + Placid + Zoho gating already wired.

Migrating the portal's contributions into V2 gives WindMar **one app** serving three user tiers:

- **Sales rep** → `/quick` (the 4-question intake, ported from portal)
- **Designer / admin** → `/editor` (existing Placid editor in SalesArts)
- **Employee** → `/browse` (library view, future)

## Contribution inventory — what the portal adds to V2

| Capability                                         | Source file (portal)                | Target path (V2)                                                 |
|----------------------------------------------------|-------------------------------------|------------------------------------------------------------------|
| 4-question intake flow, animated                   | `src/intake/Intake.jsx`             | `apps/web/src/app/[region]/[id]/quick/page.tsx`                  |
| Intake questions definition                        | `src/intake/questions.js`           | `apps/web/src/lib/intake/questions.ts`                           |
| Product, customer, channel, message tables         | `src/data/*.js`                     | `packages/shared/src/intake-spec.types.ts` (promoted to shared)  |
| Claude Haiku copy generation (6-skill system prompt)| `api/generate-copy.js`             | `apps/web/src/app/api/generate-copy/route.ts`                    |
| Brand voice post-processor + fallback headlines    | `src/copy/{voice,fallback,generate,segments}.js` | `apps/web/src/lib/copy/*.ts`                       |
| Editability rules engine                           | `src/rules/editable.js`             | `apps/web/src/lib/rules/editable.ts`                             |
| MS Graph escalation (client-credentials + Teams)   | `api/escalate.js` + `api/_lib/graphClient.js` | `apps/web/src/app/api/escalate/route.ts` + `apps/web/src/lib/graph/client.ts` |

## What gets dropped

- `src/templates/*.jsx` (6 hand-rolled CSS templates) — replaced by **Placid template UUIDs** via existing `SalesArt-API /templates/generate/:type/:userId` endpoint
- `src/export/{png,pdf}.js` (html2canvas + jsPDF) — replaced by Placid REST render + S3/Supabase Storage download URL
- `src/components/{WindmarSun,Preview}.jsx` — Preview rewritten; WindmarSun no longer needed (Placid templates carry brand asset)

## Key integration points in V2

### 1. Placid flow (already built in prod, keep as-is)
```
/quick page
  └─ POST /templates/generate/images/:zohoId  (SalesArt-API)
       ├─ axios to api.placid.app
       └─ webhook hits /templates/webhook/:id  when render done
            └─ DynamoDB update + socket.io 'placid_notification' to :zohoId
  └─ NotificationSocket listens → toast + redirect to history
```
V2 may swap DynamoDB → Supabase in the worker; my code is agnostic.

### 2. Template UUID mapping
Each row of `products × channels` maps to a Placid template UUID. Source of truth for UUIDs: tagged `active` + region (`PR`/`FL`) in Placid workspace (already filtered by `SalesArt-API findAll`). Table lives in `packages/shared/src/template-map.ts`, populated from Bryan's input or dynamically via `GET /templates/:region` at build time.

### 3. Copy generation (new to V2)
`POST /api/generate-copy` routes through Claude Haiku 4.5 with a 1529-token system prompt distilled from 6 skills-hub skills (windmar-brand, ad-creative, copywriting, copy-editing, customer-research, marketing-psychology). Output: 3 headline+CTA options per request. Cost: ~$0.001/generation. Falls back to pre-written headlines if `ANTHROPIC_API_KEY` missing.

### 4. Escalation (new to V2)
`POST /api/escalate` creates a Teams group chat via Microsoft Graph (Chat.Create + ChatMessage.Send, app-only auth). Falls through to n8n webhook or MOCK_TEAMS if Graph unconfigured.

### 5. New Supabase migration — `005_headline_generations.sql`
Logs each Haiku generation for future analytics (which options reps pick, per product/customer/segment).

## Migration execution — two paths

### Path A — Direct PRs to V2
Preconditions:
- Claude read+write scope extended to `windmar-home/SalesArtsV2` in Claude Code project settings
- This conversation session restarted after scope change

Execution: each phase below lands as a separate PR in V2.

### Path B — Scaffold in portal, openclaw relocates (chosen)
Portal repo ships `v2-migration/` folder mirroring V2's layout. Openclaw runs:
```bash
cd ~/projects/SalesArtsV2
rsync -av ~/projects/salesart-portal/v2-migration/ ./
pnpm install
pnpm --filter web dev  # smoke test
git checkout -b feat/quick-intake
git add . && git commit -m "Port 4-question intake + copy generation from salesart-portal"
git push -u origin feat/quick-intake
gh pr create --title "feat: /quick intake flow + Claude Haiku copy generation" --body-file ../salesart-portal/docs/v2-migration-plan.md --base main
```

## Phases

| Phase | Deliverable                                                           | Status  |
|-------|-----------------------------------------------------------------------|---------|
| 1     | Shared types (intake-spec), copy modules, rules                       | Scaffolded in `v2-migration/` |
| 2     | API routes (generate-copy, escalate) as Next.js Route Handlers        | Scaffolded |
| 3     | `/quick` page + component wiring to Placid via existing `lib/client`  | Scaffolded |
| 4     | Supabase migration 005 + RLS                                          | Scaffolded |
| 5     | Template UUID map (awaiting Bryan's Placid template IDs)              | Placeholder |
| 6     | Delete `salesart-portal` Vercel deploy + archive repo                 | After V2 is live |

## Secrets to set in V2 Vercel env

Reusable from portal (same values):
- `ANTHROPIC_API_KEY`
- `MS_TENANT_ID`, `MS_CLIENT_ID`, `MS_CLIENT_SECRET`
- `ESCALATION_DESIGNER_EMAIL`, `ESCALATION_OWNER_EMAIL`

New for V2:
- `NEXT_PUBLIC_API_URL_SA` — pointing to SalesArt-API (already set in SalesArts prod)
- `NEXT_PUBLIC_API_KEY` — same x-api-key as SalesArts
- `NEXT_PUBLIC_PLACID_SDK_TOKEN` — **extract from hardcode** in `usePlacidEditor.ts:196` and env it

## Security items flagged for the team

1. **Placid SDK access token is hardcoded** in `SalesArts/src/hooks/usePlacidEditor.ts` line 196 (JWT, scope `templates:read`, expires 2026-04-28). Should move to `process.env.NEXT_PUBLIC_PLACID_SDK_TOKEN`. Not catastrophic (read-only SDK scope) but poor hygiene.
2. **Azure admin consent pending** for `Chat.Create` + `ChatMessage.Send` app permissions. Until a Global Admin grants consent, `/api/escalate` fails to create Teams chats.

## Open questions

1. **Bryan — Placid template UUIDs:** which templates map to `solar_pr × ig_feed`, `roofing_claims × pdf`, etc. `GET /templates/:region` returns all active, but I need the mapping per `product × channel`.
2. **Zoho role → tier mapping:** which Zoho field indicates `sales_rep` vs `admin` vs `employee`? Needed for `/quick` (reps only) vs `/editor` (admins) routing.
3. **V2 — does worker handle copy generation?** Currently my plan puts Haiku in a Next.js Route Handler. If worker is preferred for async, migrate easily.

## Contact

- Portal work by Claude (remote, this session)
- Openclaw (local on Miguel's Mac Mini) for relocations, credentials, and Placid/Zoho liaison
- Human owner: Miguel Bethencourt
