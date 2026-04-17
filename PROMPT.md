# SalesArt Portal — Build Prompt for Claude Code

## WHAT IS THIS
SalesArt is WindMar Home's internal Canva — a self-service portal where sales reps and managers can generate branded marketing art on demand. Think Canva but locked to WindMar brand rules.

## THE VISION
- Reps/managers browse WindMar-approved templates
- They make limited, controlled customizations (text, contact info, product selection)
- The portal generates the final art using AI (via prompts + brand rules)
- Integration with Freepik or Getty for licensed images if needed
- Output formats: WhatsApp vertical, Instagram square, Instagram Story, etc.
- **If they want something beyond templates → escalate to designer (Pichu/Jaime)**
- Designer escalation opens a Teams chat: "Hey Jaime, [REP] needs help taking this art to the next level. Here's the base: [LINK]"

## STRICT LIMITS (non-negotiable)
1. Reps CANNOT deviate from brand colors, fonts, or logo rules
2. Reps CANNOT generate images from scratch — only modify pre-approved templates
3. They CANNOT upload their own images (only pick from approved asset library)
4. Text changes allowed: name, phone, product, CTA, location
5. Layout changes: NOT allowed — fixed templates only
6. If dissatisfied → escalate to designer, NOT iterate endlessly

## BRAND RULES (from windmar-brand skill)
- Font: Montserrat (Google Fonts) — Bold for headlines, Regular for body
- WH Blue: #1D429B (primary)
- WH Orange: #F89B24 (accent/CTA)
- WH Dark Blue: #21366B
- WH Light Blue: #A6C3E6
- WH Grey: #666666
- Background dark: #060A0F
- WindMar logo: NEVER alter colors, proportions, or place on busy backgrounds

## TEMPLATES TO BUILD (Phase 1 MVP)
1. **Solar one-pager** — 1 headline, 1 stat, contact info, CTA
2. **Roofing Claims one-pager** — urgency-focused, insurance angle
3. **Roofing Retail one-pager** — "replace your roof" angle
4. **Energía que Vale one-pager** — water purification product
5. **Tesla Powerwall card** — battery + solar bundle
6. **General contact card** — rep name, phone, products

## OUTPUT FORMATS
- WhatsApp (1080x1920 vertical)
- Instagram Feed (1080x1080 square)
- Instagram Story (1080x1920 vertical)
- Facebook Post (1200x630 horizontal)
- PDF one-pager (Letter size, print-ready)

## USER FLOW
```
1. Rep opens SalesArt Portal
2. Selects template category (Solar / Roofing / Water / General)
3. Selects specific template
4. Fills in ALLOWED fields only:
   - Their name
   - Their phone
   - Market (PR / FL)
   - Key message (pre-set options, not free text)
5. Preview generates instantly
6. Download in format they choose (WhatsApp, Instagram, etc.)
7. Share directly OR escalate to designer if needed
```

## ESCALATION TO DESIGNER
```javascript
// When rep clicks "I need more help"
// Creates Teams chat:
// Members: rep + jaime.diaz@windmarhome.com
// Message: "Hey Jaime! [REP_NAME] needs help taking this art to the next level for [PRODUCT]. 
//           Here's the base they generated: [PREVIEW_URL]
//           Can you help them polish it?"
// Token: ~/.openclaw/ms_tokens.json
// Graph API: POST /chats + POST /chats/{id}/messages
```

## TECH STACK
- **Frontend:** React + Vite (or plain HTML for MVP) on Vercel
- **Template rendering:** HTML/CSS canvas-to-image OR Placid API
- **AI text generation:** OpenRouter (mistral-nemo) for copy suggestions
- **Image library:** Freepik API or curated WindMar asset folder in SharePoint
- **Storage:** GitHub (Windmar-Home/salesart-portal) for templates
- **Output:** html2canvas + jsPDF for PDF, canvas.toBlob() for images
- **Auth:** Simple PIN/password for MVP
- **Escalation:** Microsoft Graph API (Teams chat)

## KEY CREDENTIALS
- OpenRouter: OPENROUTER_KEY_IN_ENV
- Vercel token: VERCEL_TOKEN_IN_ENV
- Vercel team: wind-mar-home
- GitHub PAT: in environment
- Teams token: ~/.openclaw/ms_tokens.json
- Jaime's email: jaime.diaz@windmarhome.com

## REPO
- GitHub: Windmar-Home/salesart-portal (already created)
- Deploy to: salesart-portal.vercel.app

## MVP SCOPE (build this first)
1. Template browser (6 templates above)
2. Customization form (5 controlled fields)
3. Live preview (HTML/CSS rendered)
4. Download button (PNG + PDF)
5. "Escalate to Jaime" button (Teams message)
6. Mobile responsive
7. WMH brand throughout

## QUALITY RULES
- QA before deploy (0 unclosed spans, 0 div mismatches)
- No secrets in HTML — all in Vercel env vars
- Brand colors ONLY — no custom color inputs for reps
- Test on mobile before deploy

## HOW TO RUN
```
Read this PROMPT.md and build the MVP for SalesArt portal.
Create the app in ~/projects/salesart-portal/
Use WMH brand guidelines strictly.
Deploy to Vercel: salesart-portal.vercel.app
Notify when done.
```

## SKILLS TO USE
- windmar-brand — brand colors/fonts
- copywriting — one-pager copy generation
- ad-creative — headlines and CTAs per product
- coding-agent — for complex rendering logic
