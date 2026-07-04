# FAAB - Founder as a Brand

A LinkedIn personal-branding engine for founders. Single-file React app.

## What it does
- **Founder**: capture brand elements (logo, company, personality).
- **Strategy**: pick funnel stages, generate tone of voice and keywords (AI).
- **Topics**: a news radar on your keywords, ready to turn into a post.
- **Post**: draft in your voice, tag a funnel stage, schedule on a calendar.

The funnel has five stages that double as post categories: Reach, Engagement, Followers, Revenue, Ambassadorship.

## Stack and notes
- Single-file React component (`faab.jsx`), no Tailwind, inline SVG icons.
- Fonts: Fraunces (display), Inter (body), IBM Plex Mono (labels).
- i18n: Dutch default with English toggle (browser-language detection).
- Data persists via the artifact storage API.
- AI (tone, radar, drafts) runs through the Anthropic API from the client.
- Zero em-dashes and en-dashes across code and content.
