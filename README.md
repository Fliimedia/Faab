# FAAB - Founder as a Brand

A LinkedIn personal-branding engine for founders. Vite + React PWA.

## What it does
- **Founder**: capture brand elements (logo, company, personality).
- **Strategy**: pick funnel stages, generate tone of voice and keywords (AI).
- **Topics**: a news radar on your keywords, ready to turn into a post.
- **Post**: draft in your voice, tag a funnel stage, schedule on a calendar.

The funnel has five stages that double as post categories: Reach, Engagement, Followers, Revenue, Ambassadorship.

## Run locally
```
npm install
npm run dev
```

## Deploy on Vercel
Vercel auto-detects Vite (build `vite build`, output `dist`). For the AI features (tone of voice, radar, post drafting) set project environment variables:

- `ANTHROPIC_API_KEY` (required) - your Anthropic API key.
- `ANTHROPIC_MODEL` (optional) - overrides the model, defaults to `claude-sonnet-5`.

The client calls a serverless proxy at `/api/anthropic` (see `api/anthropic.js`) so the key stays server-side. Without the key the UI still works; only the AI-powered actions return an error state.

## Notes
- i18n: Dutch default with English toggle (browser-language detection).
- Data persists via localStorage (or the host storage API when embedded).
- Fonts: Fraunces (display), Inter (body), IBM Plex Mono (labels).
- Colors: paper `#F4F3F6`, ink `#171717`, blue `#0A66C2` primary, navy `#0C2F5A`, magenta `#E7235A` accent.
- Zero em-dashes and en-dashes across code and content.
