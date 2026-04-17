# SalesArt Portal — MVP Build Spec

Internal Canva for WindMar Home. Sales reps generate on-brand marketing art via a 4-question intake. Zero creative freedom, 100% brand consistency.

---

## MVP SCOPE (v0.1 — what ships first)

Ship only this. Everything else is Phase 2.

- 4-question intake flow (animated, one question at a time)
- **2 templates:** Solar One-Pager, Roofing Claims Card
- **3 output formats:** Instagram Feed (1080×1080 PNG), Instagram Story (1080×1920 PNG), PDF Letter
- 2 editable fields per template: rep name, rep phone (everything else locked)
- Preview + download
- Teams escalation button (fires a real MS Graph chat message)
- No login. Unlisted URL for MVP.

**Phase 2 (not in MVP):** 4 more templates (Roofing Retail, Energía que Vale, Powerwall, Contact Card) + WhatsApp + Facebook formats + PIN auth + usage analytics.

---

## CORE UX: 4-QUESTION INTAKE

```
Q1 — Producto:        Solar PR · Solar FL · Roofing Claims · Roofing Retail · EQV · Powerwall · General
Q2 — Cliente:         Savings-focused · Storm resilience · Price shopper · Insurance issue · New homeowner · Hispanic/PR
Q3 — Canal:           IG Feed · IG Story · PDF  (MVP)
Q4 — Mensaje clave:   Pre-set list derived from Q1 — NO free text
                      Solar:           "Ahorra en tu factura FPL" · "Independencia energética" · "Powerwall incluido" · "Solar + Roofing"
                      Roofing Claims:  "Tu claim fue negado — tenemos la solución" · "No esperes la carta de non-renewal" · "Inspección gratis"
```

After Q4 → render preview → download or escalate.

---

## FUNCTIONAL MODULES (replaces agent names)

Each module is a plain JS file. No personas, just functions.

| Module              | File                    | Responsibility                                                              |
|---------------------|-------------------------|-----------------------------------------------------------------------------|
| `copy`              | `src/copy/generate.js`  | Produce 3 headline+CTA options from `{product, customer, channel, message}` |
| `brandVoice`        | `src/copy/voice.js`     | Enforce "Sin Cuentos" voice: honest, no fluff, no superlatives              |
| `segments`          | `src/copy/segments.js`  | Recommend default customer segment per product                              |
| `rules`             | `src/rules/editable.js` | Gate which fields a rep may edit per template (MVP: only name + phone)      |

**Copy generation** uses the Anthropic SDK directly (Claude Haiku 4.5 for speed, prompt-cached brand voice system prompt). No OpenRouter. Cost: ~$0.001/generation with caching.

---

## BRAND RULES (locked, enforce in CSS)

```css
:root {
  --wh-blue:       #1D429B;
  --wh-blue-dark:  #21366B;
  --wh-blue-light: #A6C3E6;
  --wh-orange:     #F89B24;
  --wh-grey:       #666666;
  --white:         #FFFFFF;
  --dark:          #060A0F;
}
* { font-family: 'Montserrat', sans-serif; }
.headline { font-weight: 900; }
.body     { font-weight: 400; }
.emphasis { font-weight: 600; }
```

**Never allow:** custom colors, font changes, logo alteration, layout edits, free-text headlines.

---

## INTEGRATIONS (direct, no wrappers)

### Anthropic API (copy generation)
- Env: `ANTHROPIC_API_KEY`
- Model: `claude-haiku-4-5-20251001`
- Prompt caching on the brand voice system prompt (5-min ephemeral cache)
- Server-side only — never expose key to browser. Calls route through a Vercel serverless function at `/api/generate-copy`.

### Microsoft Graph (Teams escalation)
- Env: `MS_TENANT_ID`, `MS_CLIENT_ID`, `MS_CLIENT_SECRET` (app-only auth, client credentials flow)
- Endpoint: `POST /chats` then `POST /chats/{id}/messages`
- Recipients: rep email (from intake) + `jaime.diaz@windmarhome.com` + `miguel@windmarhome.com`
- Message body includes: product, customer, channel, key message, generated headline, preview URL
- Routed through `/api/escalate` serverless function.

### Rendering
- `html2canvas@1.4.1` → PNG at native pixel density (deviceScale = targetWidth / renderedWidth)
- `jspdf@2.5` → Letter-size PDF (8.5×11", 150 DPI)

### Deploy
- Vercel. `vercel --prod` from the repo. Env vars set via `vercel env add`.

---

## TECH STACK

- **Vite + React 18** — component per template, one canvas per format
- **No router** — single-page state machine (intake → preview → download)
- **No state library** — `useReducer` is enough
- **Fonts** — Montserrat via `@fontsource/montserrat` (weights 400, 600, 900 only)

---

## PROJECT STRUCTURE

```
salesart-portal/
├── api/
│   ├── generate-copy.js      # Vercel serverless, calls Anthropic
│   └── escalate.js           # Vercel serverless, calls MS Graph
├── src/
│   ├── main.jsx
│   ├── App.jsx               # state machine
│   ├── intake/
│   │   ├── Intake.jsx
│   │   ├── Question.jsx
│   │   └── questions.js      # Q1–Q4 definitions
│   ├── templates/
│   │   ├── Solar.jsx
│   │   └── RoofingClaims.jsx
│   ├── copy/
│   │   ├── generate.js
│   │   ├── voice.js
│   │   └── segments.js
│   ├── rules/
│   │   └── editable.js
│   ├── export/
│   │   ├── png.js            # html2canvas wrapper
│   │   └── pdf.js            # jsPDF wrapper
│   ├── escalate/
│   │   └── client.js         # fetch('/api/escalate')
│   └── styles/
│       ├── brand.css
│       └── app.css
├── public/
│   └── logo-windmar.svg      # placeholder, swap for real asset
├── .env.local                # dev secrets (gitignored)
├── vercel.json
├── vite.config.js
├── package.json
└── PROMPT.md
```

---

## CLAUDE CODE SKILLS APPLIED

| Skill             | Used for                                                                    |
|-------------------|-----------------------------------------------------------------------------|
| `claude-api`      | `src/copy/generate.js` + `api/generate-copy.js` — prompt caching, model IDs |
| `security-review` | Pre-deploy scan: secret handling, escalation rate limit, input validation   |
| `simplify`        | Post-build dedupe pass on templates + modules                               |
| `review`          | PR review once branch is pushed                                             |
| `init`            | Generate `CLAUDE.md` with repo conventions after MVP lands                  |

---

## SECRETS / ENV

Never commit. `.env.local` for dev, Vercel env for prod.

```
ANTHROPIC_API_KEY=sk-ant-...
MS_TENANT_ID=...
MS_CLIENT_ID=...
MS_CLIENT_SECRET=...
```

Rep identity (for escalation) comes from the intake form in MVP. Phase 2: SSO or PIN.

---

## SECURITY (MVP floor)

- All API keys server-side only
- Rate limit `/api/escalate` to 5 req/min per IP (simple in-memory map is fine for MVP traffic)
- Validate all intake input against an enum allowlist before sending to Graph
- `.env.local` in `.gitignore`
- No PII logged

---

## QA GATES

Before push:
1. `npm run build` passes
2. `npm run dev` loads, intake completes end-to-end
3. Each template exports to each supported format without clipping
4. `/api/escalate` posts a test message to a sandbox chat (or is mocked with `MOCK_TEAMS=1`)
5. Lighthouse mobile score ≥ 85

---

## SUCCESS CRITERIA (MVP)

- [ ] 4-question intake: ≤ 20 seconds from land to preview
- [ ] Solar + Roofing Claims render pixel-perfect at IG Feed, IG Story, PDF
- [ ] Only rep name + phone editable; all other fields locked
- [ ] Escalation posts a real Teams message to Jaime + rep
- [ ] Mobile responsive (iPhone SE width 375px)
- [ ] Deployed at `salesart-portal.vercel.app`

---

## TOKENS NEEDED FROM USER

To finish integrations, user must provide:

1. `ANTHROPIC_API_KEY` — for copy generation (set via `vercel env add` or `.env.local`)
2. `MS_TENANT_ID` + `MS_CLIENT_ID` + `MS_CLIENT_SECRET` — Azure app registration with `Chat.Create` and `ChatMessage.Send` app permissions
3. `VERCEL_TOKEN` — for `vercel deploy --prod` (optional; user can deploy manually)

Until tokens arrive: copy generation uses a local fallback (pre-written headlines per product×customer×message), and `/api/escalate` logs to console with `MOCK_TEAMS=1`.
