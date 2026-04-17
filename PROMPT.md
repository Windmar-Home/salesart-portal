# SalesArt Portal — Full Build Prompt
## Powered by WindMar AI Marketing Agency

---

## WHAT IS THIS
SalesArt is WindMar Home's internal Canva — a self-service portal where sales reps and managers can generate branded marketing art on demand. Think Canva but LOCKED to WindMar brand rules. Zero creative freedom, full brand consistency.

---

## THE ONE-PAGER INTAKE SYSTEM (core UX pattern)
Before generating ANY art, the portal runs a 4-question intake. Always. No exceptions.

```
QUESTION 1: ¿Para qué producto es este arte?
→ Options: Solar PR, Solar FL, Roofing Claims, Roofing Retail, Energía que Vale, Powerwall, General

QUESTION 2: ¿A qué tipo de cliente va dirigido?
→ Options: Homeowner savings-focused, Homeowner resilience/storm, Price shopper, Insurance issue, New homeowner, Hispanic/PR community

QUESTION 3: ¿Para qué canal es el arte?
→ Options: WhatsApp (vertical 1080x1920), Instagram Feed (1080x1080), Instagram Story (1080x1920), Facebook Post (1200x630), One-Pager PDF (Letter), Contact Card

QUESTION 4: ¿Cuál es el mensaje clave?
→ Pre-set options based on product selected in Q1 (NOT free text)
   Solar: "Ahorra en tu factura de FPL" / "Independencia energética" / "Tesla Powerwall incluido" / "Solar + Roofing juntos"
   Roofing Claims: "Tu claim fue negado — tenemos la solución" / "No esperes la carta de non-renewal" / "Inspección gratis"
   etc.
```

After 4 questions → generate preview → user downloads or escalates to designer.

---

## AGENTS INVOLVED (AI Marketing Agency)
Deploy ALL agents to build this portal. Each owns a specific piece:

### Julian Barreto — Paid Media & Copy Generation
- **Role in portal:** Generates the headline and CTA text for each art piece
- **Skill:** `ad-creative`, `copywriting`
- **How:** When rep selects product + customer type → Julian's logic generates the headline (3 options to choose from)

### Daniela Lozano — Brand Voice & Messaging
- **Role in portal:** Ensures every piece of copy matches WindMar's brand voice (Sin Cuentos / honest / no fluff)
- **Skill:** `copy-editing`, `content-strategy`
- **How:** Post-processes Julian's copy to align with brand voice rules

### Felipe Arias + Beltrán — Analytics & Customer Targeting
- **Role in portal:** Pre-selects the right customer segment based on product + market
- **Skill:** `customer-research`, `analytics-tracking`
- **How:** Powers the Q2 (customer type) options with smart defaults

### Fercho Díaz — Sales Enablement
- **Role in portal:** Defines what reps are ALLOWED to change vs. locked
- **Skill:** `sales-enablement`
- **How:** Rule engine that enforces which fields are editable per template

### Miguel Bethencourt — Facilitator (you)
- **Role in portal:** PRD owner, escalation target for edge cases
- **Intake questions authored by Miguel** — these are his 4 questions, not AI-generated

---

## PRD TASKMASTER INTEGRATION
Use `prd-taskmaster` skill to:
1. Generate full technical PRD for this project before building
2. Break into tasks with Taskmaster
3. Execute tasks in order
4. Validate each task before moving to next

PRD should cover:
- Template rendering system (HTML canvas → image export)
- Intake form flow (4 questions → preview → download)
- Escalation system (Teams API)
- Asset management (where templates live, how they're versioned)
- Brand enforcement layer (what can/cannot be changed)
- Auth system (PIN for MVP)

---

## STRICT BRAND RULES (from windmar-brand skill — ENFORCE THESE)
```css
/* The ONLY colors allowed */
--wh-blue: #1D429B;
--wh-blue-dark: #21366B;
--wh-blue-light: #A6C3E6;
--wh-orange: #F89B24;
--wh-grey: #666666;
--white: #FFFFFF;
--dark: #060A0F;

/* Font: Montserrat ONLY */
font-family: 'Montserrat', sans-serif;

/* Sizes locked — reps cannot change */
headline: font-weight: 900, font-size: template-defined
body: font-weight: 400-600
```

NEVER allow:
- Custom colors from reps
- Font changes
- Logo alterations
- Layout modifications
- Free-text headlines (only pre-approved options)

---

## TEMPLATES (Phase 1 — 6 templates)
Build these as HTML/CSS components that render to canvas:

1. **Solar One-Pager** — Hero stat ($400 FPL bill → $X with solar), Tesla Powerwall badge, rep contact
2. **Roofing Claims Card** — "Your roof birthday is the most important date on your insurance policy", urgency hook, free inspection CTA
3. **Roofing Retail Card** — "Built for Florida", 15-year clock messaging, contact
4. **Energía que Vale** — Water quality, health angle, product benefits
5. **Tesla Powerwall** — Energy independence, storm resilience, battery backup
6. **Rep Contact Card** — Name, phone, market (PR/FL), products they sell

---

## OUTPUT FORMATS
Use html2canvas + jsPDF for rendering:
- WhatsApp: 1080x1920 PNG
- Instagram Feed: 1080x1080 PNG
- Instagram Story: 1080x1920 PNG
- Facebook: 1200x630 PNG
- PDF One-Pager: Letter size (8.5x11")

---

## USER FLOW
```
1. Open portal (no login for MVP — secret URL)
2. START → 4 intake questions (animated, one at a time like a quiz)
3. Rep fills in their details (name, phone — these are the ONLY custom fields)
4. Preview generates instantly
5. Choose format → Download
6. "Need more? → Talk to Jaime" button → Teams chat opens
```

---

## ESCALATION TO DESIGNER
```javascript
// POST to Graph API
// Token: process.env.TEAMS_TOKEN (from ~/openclaw/ms_tokens.json)
// Create chat between rep + Jaime + Miguel
// Message template:
"Hey Jaime! [REP_NAME] needs help taking this art to the next level.
Product: [PRODUCT] | Customer: [CUSTOMER_TYPE] | Format: [FORMAT]
Here's their generated base: [PREVIEW_URL]
Can you help them?"
// Jaime's email: jaime.diaz@windmarhome.com
```

---

## TECH STACK
- **Framework:** React + Vite (component per template)
- **Rendering:** html2canvas for PNG, jsPDF for PDF
- **AI copy generation:** OpenRouter API (use mistral-nemo $0.02/1M)
- **Storage:** GitHub (Windmar-Home/salesart-portal) for templates + assets
- **Deploy:** Vercel (salesart-portal.vercel.app)
- **Teams integration:** Microsoft Graph API
- **Image assets:** Curated folder in repo /assets/approved/

---

## SKILLS TO USE (all of them)
From `~/.claude/agents/skills/` — USE ALL RELEVANT:
- `windmar-brand` — brand enforcement
- `ad-creative` — headline generation
- `copywriting` — body copy
- `copy-editing` — brand voice check
- `customer-research` — customer segment logic
- `sales-enablement` — rep permissions layer
- `content-strategy` — template content planning
- `analytics-tracking` — usage tracking setup
- `onboarding-cro` — intake flow UX optimization
- `prd-taskmaster` — PRD + task execution

From `~/.claude/skills/`:
- `prd-taskmaster` — PRD generator + Taskmaster execution

---

## HOW TO BUILD (instruction to Claude Code)

**Step 1 — Read all context:**
```
Read this PROMPT.md fully.
Read ~/.claude/agents/skills/windmar-brand/SKILL.md
Read ~/.claude/agents/skills/ad-creative/SKILL.md
Read ~/.claude/agents/skills/sales-enablement/SKILL.md
Read ~/.claude/skills/prd-taskmaster/SKILL.md
Read ~/projects/ai-marketing-agency/.agents/team/*.md (all team profiles)
```

**Step 2 — Generate PRD using prd-taskmaster:**
Generate a full technical PRD for SalesArt Portal covering all sections above.
Break into Taskmaster tasks.

**Step 3 — Build MVP with ALL agents active:**
- Julian writes the copy (3 headline options per product+customer combo)
- Daniela reviews copy for brand voice
- Felipe/Beltrán define customer segment logic
- Fercho defines the rules engine (what reps can/cannot do)

**Step 4 — Build the 4-question intake as the FIRST screen**
Animated, one question at a time, clean and fast.

**Step 5 — Build 6 template renderers**
HTML/CSS components that export to PNG/PDF.

**Step 6 — Add escalation**
Teams message to Jaime when rep needs more.

**Step 7 — QA + Deploy**
```bash
# QA check (must pass)
python3 -c "import re; html=open('index.html').read(); ..."

# Deploy
cd ~/projects/salesart-portal
git add -A && git commit -m "SalesArt MVP"
npx vercel --yes --token VERCEL_TOKEN_IN_ENV --scope wind-mar-home --prod
```

**Step 8 — Notify:**
```
openclaw system event --text "SalesArt Portal MVP deployed at salesart-portal.vercel.app" --mode now
```

---

## ENVIRONMENT VARIABLES (set in Vercel)
- `OPENROUTER_API_KEY` — for copy generation
- `TEAMS_TOKEN` — Microsoft Graph token for escalation
- `GITHUB_PAT` — for template fetching

---

## SUCCESS CRITERIA
- [ ] 4-question intake flow works perfectly
- [ ] All 6 templates render correctly
- [ ] Export to all 5 formats works
- [ ] Brand rules enforced (no custom colors, no font changes)
- [ ] Escalation to Jaime fires correctly
- [ ] Mobile responsive
- [ ] Deploys to salesart-portal.vercel.app
