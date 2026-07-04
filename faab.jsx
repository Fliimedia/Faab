import React, { useState, useEffect, useRef } from 'react';

/*
  FAAB - Founder as a Brand
  Light, blue-dominant. Navy slogan highlight. Magenta only as the wordmark dot.
  i18n: Dutch default, English via browser detection + footer toggle. All UI text via t().
  Persistence via window.storage. News radar via Anthropic API + web_search.
*/

// ---------- Icons ----------
const I = {
  user: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>),
  target: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>),
  radar: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18.364 5.636a9 9 0 1 0 1.417 11.315"/><path d="M15.536 8.464a5 5 0 1 0 .719 6.44"/><path d="M12 12l6-3"/></svg>),
  calendar: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M16 3v4M8 3v4M4 11h16"/></svg>),
  tag: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/><path d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592-5.592a2.41 2.41 0 0 0 0-3.408l-7.71-7.71A2 2 0 0 0 11.172 3H6a3 3 0 0 0-3 3"/></svg>),
  spark: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/><path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>),
  plus: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>),
  x: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>),
  upload: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M7 9l5-5 5 5M12 4v12"/></svg>),
  arrow: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>),
  refresh: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 11a8 8 0 1 0-2.3 5.6"/><path d="M20 5v6h-6"/></svg>),
  check: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12l5 5L20 7"/></svg>),
  edit: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3"/><path d="M13.5 6.5l3 3"/></svg>),
  trash: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/></svg>),
  link: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 15l6-6"/><path d="M11 6l.5-.5a4 4 0 0 1 6 6l-.5.5"/><path d="M13 18l-.5.5a4 4 0 0 1-6-6l.5-.5"/></svg>),
  shield: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>),
  eye: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0"/><path d="M21 12c-2.4 4-5.4 6-9 6s-6.6-2-9-6c2.4-4 5.4-6 9-6s6.6 2 9 6"/></svg>),
  mail: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>),
  message: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8 9h8M8 13h5"/><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"/></svg>),
  chevL: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 6l-6 6 6 6"/></svg>),
  chevR: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 6l6 6-6 6"/></svg>),
  linkedin: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z"/></svg>),
};

// ---------- i18n ----------
const STR = {
  nl: {
    connect: 'Verbinden',
    nav_home: 'Home', nav_founder: 'Founder', nav_strategy: 'Strategie', nav_topics: 'Onderwerpen', nav_post: 'Posts',
    tagline: 'Van founders merken maken.', cta_funnel: 'Bekijk de funnel',
    slogan_a: 'Van Founder naar ', slogan_b: 'Merk.',
    eb_service: 'De dienst', service_h2a: 'Jij bent het meest overtuigende', service_h2b: 'kanaal dat je bedrijf heeft.',
    service_lead: 'FAAB is een personal-brandingmotor voor founders, alleen voor LinkedIn. Het maakt van wie je bent en wat je denkt een gestage stroom posts die klinken als jij, reageren op wat nu speelt, en de reputatie bouwen waar je bedrijf op leunt.',
    svc1_t: 'Stem', svc1_d: 'Bedrijf, persoonlijkheid en toon worden een stemmodel. Elke draft begint bij wie je bent.',
    svc2_t: 'Radar', svc2_d: 'Onderwerpen scant actueel nieuws op jouw thema\u0027s en geeft je de verhalen die een mening waard zijn.',
    svc3_t: 'Ritme', svc3_d: 'Schrijf, koppel aan een funnelfase en plan in op een kalender. Consistentie zonder gedoe.',
    eb_funnel: 'De funnel', funnel_h2a: 'Van bereik tot ambassadeurschap,', funnel_h2b: 'in vijf fasen.',
    funnel_lead: 'Personal branding is niet een doel, het is een route. FAAB beweegt je publiek door vijf fasen, en elke fase is ook een postcategorie om voor te plannen. Tik op een fase om er direct voor te schrijven.',
    eb_practice: 'In de praktijk', practice_h2a: 'Van profiel tot webcare,', practice_h2b: 'in vijf stappen.',
    practice_lead: 'Zo ziet je week eruit met FAAB. Vijf stappen, van wie je bent tot het warm houden van het gesprek.',
    eb_knowledge: 'Kennisbank', knowledge_h2a: 'De principes achter persoonlijke', knowledge_h2b: 'branding die werkt.',
    knowledge_lead: 'FAAB is uitgesproken software. Dit zijn de basisprincipes van persoonlijke social-media-branding waar het op gebouwd is, dezelfde die wij toepassen bij het opzetten van founderprofielen die aandacht verdienen.',
    eb_control: 'Menselijke controle', control_h2: 'AI schrijft. Jij beslist.',
    control_lead: 'Reputatie is niets om weg te automatiseren. FAAB houdt een menselijk beoordelingsmoment op elk punt waar jouw naam op het spel staat.',
    ctrl1_t: 'Jij bepaalt de stem', ctrl1_d: 'Toon, thema\u0027s en templates stel jij in, niet stiekem aangeleerd. Verander ze wanneer je wilt.',
    ctrl2_t: 'Jij keurt elk verhaal goed', ctrl2_d: 'Onderwerpen stelt voor, kiest nooit voor je. Jij bepaalt welk nieuws jouw mening verdient.',
    ctrl3_t: 'Jij bewerkt elke draft', ctrl3_d: 'Elke post opent in een editor met live preview. Herschrijf, scherp aan of gooi weg.',
    ctrl4_t: 'Jij drukt op publiceren', ctrl4_d: 'FAAB plant en schrijft, plaatst nooit namens jou. De definitieve tekst publiceer je zelf.',
    eb_contact: 'Contact', contact_h2a: 'Praat met ons over', contact_h2b: 'jouw founder-merk.',
    contact_lead: 'Hulp nodig bij je positionering, of een done-with-you traject naast de app? Stuur ons een bericht.',
    foot_tag: 'Van founders merken maken.', foot_app: 'App', foot_learn: 'Leer',
    foot_the_funnel: 'De funnel', foot_kb: 'Kennisbank', foot_contact: 'Contact',
    foot_base: 'FAAB. Gebouwd voor founders die met intentie posten. Alleen voor LinkedIn.',
    f_h2: 'Jouw merkelementen', f_p: 'Wie je bent is de bron van elke post. Dit is het fundament.',
    f_logo: 'Logo', f_upload_logo: 'Logo uploaden',
    f_name: 'Naam', f_role: 'Rol', f_company: 'Bedrijf',
    f_company_desc: 'Beschrijf je bedrijf', f_company_desc_hint: 'wat het doet, voor wie', f_company_desc_ph: 'Wij helpen ... door ...',
    f_pers_desc: 'Beschrijf je persoonlijkheid', f_pers_desc_hint: 'hoe je overkomt', f_pers_desc_ph: 'Direct, nieuwsgierig, een tikje eigenwijs ...',
    ph_role: 'Founder', ph_company: 'Je bedrijf',
    s_funnel_h2: 'Funnelfocus', s_funnel_p: 'Kies de fasen waar je je publiek doorheen wilt bewegen. Tik om te wisselen.',
    s_goal_h2: 'Doel en aanpak', s_goal_p: 'Beschrijf wat je met LinkedIn wilt bereiken en hoe. FAAB maakt hier een tone of voice en keywords van.',
    s_goal_label: 'Doel en aanpak', s_goal_hint: 'voorbeeld hieronder',
    s_goal_ph: 'Voorbeeld: dé stem worden over praktische AI voor kleine bureaus. Twee scherpe meningen per week op nieuws, een bouwles, en lezers langzaam omzetten in demo-aanvragen.',
    s_generate: 'Genereer toon en keywords', s_generating: 'Genereren...', s_gen_err: 'Kon niet genereren. Probeer opnieuw.',
    s_tone_label: 'Tone of voice', s_tone_ph: 'Wordt hier gegenereerd, volledig bewerkbaar.',
    s_keywords: 'Keywords', s_add_kw_ph: 'Voeg een keyword toe, dan Enter', s_add: 'Toevoegen', s_suggestions: 'Suggesties',
    s_tpl_h2: 'Templates', s_tpl_p: 'Poststructuren voor Onderwerpen en Posts. Haakjes zoals {hook} worden ingevuld.',
    s_new_tpl: 'Nieuwe template', s_upload_tpl: 'Template uploaden', s_new_tpl_name: 'Nieuwe template',
    t_h2: 'Trending onderwerpen', t_p: 'Nieuwstrends op je keywords, klaar om in te plannen als post.',
    t_refresh: 'Ververs', t_scanning: 'Scannen...', t_empty: 'Voeg eerst keywords toe in Strategie en ververs dan.',
    t_go_strategy: 'Naar Strategie', t_source: 'Bron', t_create_post: 'Maak post',
    p_cal: 'Kalender', p_scheduled_h2: 'Geplande posts', p_none: 'Nog niets gepland.', p_scheduled_count: 'gepland',
    p_add_new: 'Nieuwe post toevoegen', p_untitled: 'Naamloze draft', p_your_scheduled: 'Je geplande posts verschijnen hier.',
    c_edit: 'Post bewerken', c_new: 'Nieuwe post', c_write_schedule: 'Schrijf en plan in',
    c_category: 'Funnelcategorie', c_template: 'Template', c_idea: 'Idee', c_idea_hint: 'waar gaat deze post over', c_idea_ph: 'Een korte prompt voor de draft',
    c_draft: 'Schrijf post', c_drafting: 'Schrijven...', c_draft_again: 'Opnieuw schrijven', c_draft_err: 'Schrijven mislukte. Probeer opnieuw.',
    c_post_text: 'Posttekst', c_post_text_ph: 'Je post verschijnt hier. Vrij te bewerken.',
    c_date: 'Datum', c_time: 'Tijd', c_schedule: 'Post inplannen', c_update: 'Planning bijwerken',
    c_preview: 'Voorbeeld', c_draft_hint: 'Schrijf een post om het voorbeeld te zien.',
    li_public: 'Openbaar', li_like: 'Leuk', li_comment: 'Reageren', li_share: 'Delen', li_first: '1e',
    err_no_stories: 'Geen verhalen gevonden. Pas je keywords aan in Strategie.', err_radar: 'De radar kon geen nieuws laden. Probeer opnieuw.',
    lang_word: 'Taal',
  },
  en: {
    connect: 'Connect',
    nav_home: 'Home', nav_founder: 'Founder', nav_strategy: 'Strategy', nav_topics: 'Topics', nav_post: 'Post',
    tagline: 'Turning founders into brands.', cta_funnel: 'Explore the funnel',
    slogan_a: 'Brand ', slogan_b: 'yourself.',
    eb_service: 'The service', service_h2a: 'You are the most convincing', service_h2b: 'channel your company has.',
    service_lead: 'FAAB is a personal branding engine for founders, built only for LinkedIn. It turns who you are and what you think into a steady stream of posts that sound like you, react to what is happening now, and build the reputation your company borrows from.',
    svc1_t: 'Voice', svc1_d: 'Company, personality and tone become a voice model. Every draft starts from who you are.',
    svc2_t: 'Radar', svc2_d: 'Topics scans current news on your themes and hands you the stories worth a take.',
    svc3_t: 'Rhythm', svc3_d: 'Draft, categorize by funnel stage and schedule on a calendar. Consistency without the grind.',
    eb_funnel: 'The funnel', funnel_h2a: 'From reach to ambassadorship,', funnel_h2b: 'in five stages.',
    funnel_lead: 'Personal branding is not one goal, it is a path. FAAB moves your audience down five stages, and every stage is also a post category you can plan for. Tap a stage to draft for it.',
    eb_practice: 'In practice', practice_h2a: 'From profile to webcare,', practice_h2b: 'in five steps.',
    practice_lead: 'This is your week with FAAB. Five steps, from who you are to keeping the conversation warm.',
    eb_knowledge: 'Knowledge bank', knowledge_h2a: 'The principles behind personal', knowledge_h2b: 'branding that works.',
    knowledge_lead: 'FAAB is opinionated software. These are the base principles of personal social media branding it is built on, the same ones we apply when setting up founder profiles that earn attention.',
    eb_control: 'Human control', control_h2: 'AI drafts. You decide.',
    control_lead: 'Reputation is not something to automate away. FAAB keeps a human review moment at every point where your name is on the line.',
    ctrl1_t: 'You define the voice', ctrl1_d: 'Tone, themes and templates are set by you, not learned behind your back. Change them any time.',
    ctrl2_t: 'You approve every story', ctrl2_d: 'Topics suggests, it never selects for you. You choose which news deserves your take.',
    ctrl3_t: 'You edit every draft', ctrl3_d: 'Each post opens in an editor with a live preview. Rewrite, sharpen or discard.',
    ctrl4_t: 'You press publish', ctrl4_d: 'FAAB schedules and drafts, it never posts on your behalf. You publish the final text yourself.',
    eb_contact: 'Contact', contact_h2a: 'Talk to us about', contact_h2b: 'your founder brand.',
    contact_lead: 'Want help setting up your positioning, or a done-with-you program next to the app? Send us a note.',
    foot_tag: 'Turning founders into brands.', foot_app: 'App', foot_learn: 'Learn',
    foot_the_funnel: 'The funnel', foot_kb: 'Knowledge bank', foot_contact: 'Contact',
    foot_base: 'FAAB. Built for founders who post with intent. Only for LinkedIn.',
    f_h2: 'Your brand elements', f_p: 'Who you are is the source of every post. This is the foundation.',
    f_logo: 'Logo', f_upload_logo: 'Upload logo',
    f_name: 'Name', f_role: 'Role', f_company: 'Company',
    f_company_desc: 'Describe your company', f_company_desc_hint: 'what it does, who it serves', f_company_desc_ph: 'We help ... by ...',
    f_pers_desc: 'Describe your personality', f_pers_desc_hint: 'how you come across', f_pers_desc_ph: 'Direct, curious, a bit contrarian ...',
    ph_role: 'Founder', ph_company: 'Your company',
    s_funnel_h2: 'Funnel focus', s_funnel_p: 'Select the stages you want to move your audience through. Tap to toggle.',
    s_goal_h2: 'Goal and approach', s_goal_p: 'Describe what you want your LinkedIn presence to achieve and how. FAAB turns this into a tone of voice and keywords.',
    s_goal_label: 'Goal and approach', s_goal_hint: 'example below',
    s_goal_ph: 'Example: become the go-to voice on practical AI for small agencies. Two sharp takes a week reacting to news, one build lesson, and slowly turn readers into demo requests.',
    s_generate: 'Generate tone and keywords', s_generating: 'Generating...', s_gen_err: 'Could not generate. Try again.',
    s_tone_label: 'Tone of voice', s_tone_ph: 'Generated here, fully editable.',
    s_keywords: 'Keywords', s_add_kw_ph: 'Add a keyword, then Enter', s_add: 'Add', s_suggestions: 'Suggestions',
    s_tpl_h2: 'Templates', s_tpl_p: 'Post structures used across Topics and Post. Placeholders like {hook} get filled in.',
    s_new_tpl: 'New template', s_upload_tpl: 'Upload template', s_new_tpl_name: 'New template',
    t_h2: 'Trending topics', t_p: 'News trends on your keywords, ready to turn into a scheduled post.',
    t_refresh: 'Refresh', t_scanning: 'Scanning...', t_empty: 'Add keywords in Strategy first, then refresh.',
    t_go_strategy: 'Go to Strategy', t_source: 'Source', t_create_post: 'Create post',
    p_cal: 'Calendar', p_scheduled_h2: 'Scheduled posts', p_none: 'Nothing scheduled yet.', p_scheduled_count: 'scheduled',
    p_add_new: 'Add new post', p_untitled: 'Untitled draft', p_your_scheduled: 'Your scheduled posts will appear here.',
    c_edit: 'Edit post', c_new: 'New post', c_write_schedule: 'Write and schedule',
    c_category: 'Funnel category', c_template: 'Template', c_idea: 'Idea', c_idea_hint: 'what is this post about', c_idea_ph: 'A short prompt for the draft',
    c_draft: 'Draft post', c_drafting: 'Drafting...', c_draft_again: 'Draft again', c_draft_err: 'Drafting failed. Try again.',
    c_post_text: 'Post text', c_post_text_ph: 'Your post appears here. Edit freely.',
    c_date: 'Date', c_time: 'Time', c_schedule: 'Schedule post', c_update: 'Update schedule',
    c_preview: 'Preview', c_draft_hint: 'Draft a post to see the preview.',
    li_public: 'Public', li_like: 'Like', li_comment: 'Comment', li_share: 'Share', li_first: '1st',
    err_no_stories: 'No stories found. Adjust your keywords in Strategy.', err_radar: 'The radar could not load news. Try again.',
    lang_word: 'Language',
  },
};
const MONTHS = {
  nl: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
const WD = { nl: ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'], en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] };

// ---------- Data ----------
const uid = () => Math.random().toString(36).slice(2, 9);

const FUNNEL = [
  { id: 'reach', n: '01', t: { nl: 'Bereik', en: 'Reach' }, d: { nl: 'Kom in beeld bij de juiste mensen op LinkedIn.', en: 'Get in front of the right people on LinkedIn.' }, intent: 'maximize reach and get discovered by new people', c: '#6BA3E0', w: 100 },
  { id: 'engagement', n: '02', t: { nl: 'Interactie', en: 'Engagement' }, d: { nl: 'Zet passieve views om in reacties en gesprek.', en: 'Turn passive views into comments and conversation.' }, intent: 'spark comments, replies and conversation', c: '#3E86D6', w: 84 },
  { id: 'followers', n: '03', t: { nl: 'Volgers', en: 'Followers' }, d: { nl: 'Zet aandacht om in een publiek dat terugkomt.', en: 'Convert attention into an audience that returns.' }, intent: 'give a clear reason to follow and come back', c: '#0A66C2', w: 68 },
  { id: 'revenue', n: '04', t: { nl: 'Omzet', en: 'Revenue' }, d: { nl: 'Zet vertrouwen om in inbound, pipeline en verkoop.', en: 'Turn trust into inbound, pipeline and sales.' }, intent: 'build trust that softly leads to inbound and sales', c: '#0B4E96', w: 52 },
  { id: 'ambassadorship', n: '05', t: { nl: 'Ambassadeurschap', en: 'Ambassadorship' }, d: { nl: 'Volgers worden ambassadeurs die je merk verspreiden.', en: 'Followers become advocates who carry your brand.' }, intent: 'make existing fans want to share and advocate', c: '#06356C', w: 38 },
];
const phaseById = (id) => FUNNEL.find((f) => f.id === id) || FUNNEL[0];

const KNOWLEDGE = [
  { t: { nl: 'De founder is de funnel', en: 'The founder is the funnel' }, d: { nl: 'Mensen kopen van mensen. Een founderprofiel verslaat consequent de bedrijfspagina in bereik en vertrouwen, omdat het algoritme en het publiek allebei gezichten boven logo\u0027s verkiezen.', en: 'People buy from people. A founder profile consistently beats the company page on reach and trust, because the algorithm and the audience both favor faces over logos.' } },
  { t: { nl: 'Positionering verslaat posten', en: 'Positioning beats posting' }, d: { nl: 'Willekeurig posten bouwt ruis, geen merk. Claim twee of drie thema\u0027s. Herhaling op een smal set onderwerpen laat een publiek onthouden waar je voor staat.', en: 'Random posting builds noise, not a brand. Own two or three themes. Repetition on a narrow set of topics is what makes an audience remember what you stand for.' } },
  { t: { nl: 'De hook beslist alles', en: 'The hook decides everything' }, d: { nl: 'LinkedIn toont twee tot drie regels boven de vouw. Als de eerste regel geen spanning of nieuwsgierigheid wekt, wordt de rest nooit gelezen. Elke FAAB-template is hook-first.', en: 'LinkedIn shows two to three lines before the fold. If the first line creates no tension or curiosity, the rest is never read. Every FAAB template is hook-first.' } },
  { t: { nl: 'Reageer sneller dan de feed', en: 'React faster than the feed' }, d: { nl: 'Het grootste bereik gaat naar wie een scherpe mening aan nieuws toevoegt terwijl het nog nieuws is. Vroeg zijn positioneert je als bron, niet als volger. Daar is Onderwerpen voor.', en: 'The biggest reach goes to people who add a sharp take to news while it is still news. Being early positions you as a source, not a follower. That is what Topics is for.' } },
  { t: { nl: 'Consistentie stapelt op', en: 'Consistency compounds' }, d: { nl: 'Twee tot drie posts per week, elke week, verslaat er tien in een week en dan stilte. Het algoritme beloont ritme. Inplannen laat ritme een founderagenda overleven.', en: 'Two to three posts a week, every week, beats ten in one week then silence. The algorithm rewards rhythm. Scheduling makes rhythm survive a founder calendar.' } },
  { t: { nl: 'Authenticiteit is een systeem', en: 'Authenticity is a system' }, d: { nl: 'Klinken als jezelf op schaal is ontwerp, geen geluk: een vaste tone of voice, ik-vorm, je eigen lessen. AI schrijft de structuur, jij levert de overtuiging.', en: 'Sounding like yourself at scale is design, not luck: a defined tone of voice, first-person writing, your own lessons. AI drafts the structure, you supply the conviction.' } },
];

const USERFLOW = [
  { k: 'founder', ic: I.user, t: { nl: 'Founderprofiel', en: 'Founder profile' }, d: { nl: 'Leg je merkelementen vast: wie je bent, je bedrijf en je persoonlijkheid.', en: 'Capture your brand elements: who you are, your company and personality.' } },
  { k: 'strategy', ic: I.target, t: { nl: 'Strategie', en: 'Strategy' }, d: { nl: 'Kies je funnelfasen en genereer je tone of voice en keywords.', en: 'Pick your funnel stages and generate your tone of voice and keywords.' } },
  { k: 'topics', ic: I.radar, t: { nl: 'Actuele onderwerpen', en: 'Current topics' }, d: { nl: 'De radar vindt actueel nieuws op jouw thema\u0027s om op te reageren.', en: 'The radar finds current news on your themes to react to.' } },
  { k: 'posting', ic: I.calendar, t: { nl: 'Posting', en: 'Posting' }, d: { nl: 'Schrijf in jouw stem, koppel aan een funnelfase en plan in op de kalender.', en: 'Draft in your voice, tag a funnel stage and schedule on the calendar.' } },
  { k: 'webcare', ic: I.message, t: { nl: 'Webcare', en: 'Webcare' }, d: { nl: 'Volg reacties op en houd het gesprek warm, zo groeien volgers naar ambassadeurs.', en: 'Follow up on comments and keep the conversation warm, so followers grow into advocates.' } },
];

const SUGGESTED = {
  nl: ['AI', 'Ondernemerschap', 'Leiderschap', 'SaaS', 'Groei', 'Marketing', 'Productiviteit', 'Bedrijfscultuur', 'Fundraising', 'Innovatie', 'Sales', 'Werving'],
  en: ['AI', 'Entrepreneurship', 'Leadership', 'SaaS', 'Growth', 'Marketing', 'Productivity', 'Company culture', 'Fundraising', 'Innovation', 'Sales', 'Hiring'],
};

function makeTemplates(lang) {
  if (lang === 'nl') return [
    { id: 'tpl-news', name: 'Nieuwsduiding', body: '{hook}\n\nWat er speelt: {kern}\n\nWaarom dit ertoe doet voor founders: {inzicht}\n\n{vraag}' },
    { id: 'tpl-hot', name: 'Hot take', body: 'Onpopulaire mening: {stelling}\n\n{onderbouwing}\n\n{vraag}' },
    { id: 'tpl-lesson', name: 'Les geleerd', body: '{hook}\n\nWat ik leerde: {les}\n\nHoe ik het toepas: {toepassing}\n\n{cta}' },
  ];
  return [
    { id: 'tpl-news', name: 'News take', body: '{hook}\n\nWhat is happening: {core}\n\nWhy this matters for founders: {insight}\n\n{question}' },
    { id: 'tpl-hot', name: 'Hot take', body: 'Unpopular opinion: {statement}\n\n{reasoning}\n\n{question}' },
    { id: 'tpl-lesson', name: 'Lesson learned', body: '{hook}\n\nWhat I learned: {lesson}\n\nHow I apply it: {application}\n\n{cta}' },
  ];
}

// ---------- Environment shim ----------
// Inside the Claude artifact, window.storage exists and the Anthropic endpoint is proxied for us.
// On a normal deploy (e.g. Vercel) we fall back to localStorage and a serverless proxy at /api/anthropic.
const IN_ARTIFACT = typeof window !== 'undefined' && !!window.storage;
const API_URL = IN_ARTIFACT ? 'https://api.anthropic.com/v1/messages' : '/api/anthropic';
const store = {
  async get(k) {
    if (IN_ARTIFACT) { try { return await window.storage.get(k); } catch (e) { return null; } }
    try { const v = localStorage.getItem(k); return v ? { value: v } : null; } catch (e) { return null; }
  },
  async set(k, v) {
    if (IN_ARTIFACT) { try { return await window.storage.set(k, v); } catch (e) { return null; } }
    try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } return null;
  },
};

// ---------- API helpers ----------
async function callClaude(messages, tools) {
  const body = { model: 'claude-sonnet-4-6', max_tokens: 1000, messages };
  if (tools) body.tools = tools;
  const res = await fetch(API_URL, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('API returned status ' + res.status);
  const data = await res.json();
  return data.content || [];
}
const textOf = (content) => content.filter((b) => b.type === 'text').map((b) => b.text).join('\n');
function stripDashes(t) { return t.replace(/\s*[\u2014\u2013]\s*/g, ', ').replace(/,\s*,/g, ',').trim(); }
function extractJson(text, kind) {
  let s = text.replace(/```json/gi, '').replace(/```/g, '');
  const o = kind === 'array' ? ['[', ']'] : ['{', '}'];
  const a = s.indexOf(o[0]); const b = s.lastIndexOf(o[1]);
  if (a === -1 || b === -1) throw new Error('No JSON found');
  return JSON.parse(s.slice(a, b + 1));
}

// ---------- Date helpers ----------
const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());

// ---------- Small UI ----------
function Chip({ active, onClick, children, removable, onRemove, dot }) {
  return (
    <button type="button" className={'chip' + (active ? ' chip-on' : '')} onClick={onClick}>
      {dot && <span className="chip-dot" style={{ background: dot }} />}
      {children}
      {removable && <span className="chip-x" onClick={(e) => { e.stopPropagation(); onRemove(); }}><I.x width="13" height="13" /></span>}
    </button>
  );
}
function Field({ label, hint, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}{hint && <span className="field-hint">{hint}</span>}</span>
      {children}
    </label>
  );
}

// ---------- App ----------
export default function App() {
  const [lang, setLang] = useState('nl');
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState('home');
  const [tab, setTab] = useState('founder');
  const [menu, setMenu] = useState(false);

  const [founder, setFounder] = useState({ name: '', role: '', company: '', logo: '', companyDesc: '', personalityDesc: '' });
  const [strategy, setStrategy] = useState({ phases: ['reach', 'engagement', 'followers'], goal: '', tone: '', keywords: [] });
  const [stratState, setStratState] = useState('idle');
  const [kwInput, setKwInput] = useState('');
  const [templates, setTemplates] = useState(() => makeTemplates('nl'));
  const [templatesDirty, setTemplatesDirty] = useState(false);
  const tplUpRef = useRef(null);
  const logoRef = useRef(null);

  const [news, setNews] = useState([]);
  const [newsState, setNewsState] = useState('idle');
  const [newsErr, setNewsErr] = useState('');

  const [posts, setPosts] = useState([]);
  const [composer, setComposer] = useState(null);

  const t = (k) => (STR[lang] && STR[lang][k]) || STR.en[k] || k;
  const langLabel = lang === 'nl' ? 'Dutch' : 'English';

  // Load persisted state + browser language detection
  useEffect(() => {
    let langSet = false;
    (async () => {
      try {
        const r = await store.get('faab:data');
        if (r && r.value) {
          const d = JSON.parse(r.value);
          if (d.founder) setFounder(d.founder);
          if (d.strategy) setStrategy(d.strategy);
          if (Array.isArray(d.templates)) setTemplates(d.templates);
          if (typeof d.templatesDirty === 'boolean') setTemplatesDirty(d.templatesDirty);
          if (Array.isArray(d.posts)) setPosts(d.posts);
          if (d.lang) { setLang(d.lang); langSet = true; }
        }
      } catch (e) { /* ignore */ }
      if (!langSet) {
        try {
          const bl = (navigator.language || 'nl').toLowerCase();
          setLang(bl.startsWith('en') ? 'en' : 'nl');
        } catch (e) { /* keep nl */ }
      }
      setLoaded(true);
    })();
  }, []);

  // Retranslate default templates when language changes, unless user edited them
  useEffect(() => {
    if (!loaded) return;
    if (!templatesDirty) setTemplates(makeTemplates(lang));
  }, [lang, loaded]);

  // Persist
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await store.set('faab:data', JSON.stringify({ founder, strategy, templates, templatesDirty, posts, lang }));
      } catch (e) { /* ignore */ }
    })();
  }, [founder, strategy, templates, templatesDirty, posts, lang, loaded]);

  useEffect(() => {
    if (view === 'app' && tab === 'topics' && news.length === 0 && newsState === 'idle') fetchNews();
  }, [view, tab]);
  useEffect(() => { document.body.style.overflow = menu ? 'hidden' : ''; }, [menu]);

  const go = (v, tb) => { setView(v); if (tb) setTab(tb); setMenu(false); };
  const changeLang = (l) => { setLang(l); };

  function setF(k, v) { setFounder((p) => ({ ...p, [k]: v })); }
  function setS(k, v) { setStrategy((p) => ({ ...p, [k]: v })); }
  function togglePhase(id) { setStrategy((p) => ({ ...p, phases: p.phases.includes(id) ? p.phases.filter((x) => x !== id) : [...p.phases, id] })); }
  const editTemplates = (fn) => { setTemplatesDirty(true); setTemplates(fn); };

  function addKeyword(val) {
    const s = (val || '').trim();
    if (!s || strategy.keywords.some((k) => k.toLowerCase() === s.toLowerCase())) return;
    setS('keywords', [...strategy.keywords, s]);
  }
  function toggleKeyword(s) {
    setS('keywords', strategy.keywords.some((k) => k.toLowerCase() === s.toLowerCase())
      ? strategy.keywords.filter((x) => x.toLowerCase() !== s.toLowerCase())
      : [...strategy.keywords, s]);
  }

  function onLogo(e) {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => setF('logo', String(r.result)); r.readAsDataURL(f);
  }
  function onTplUpload(e) {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => editTemplates((arr) => [...arr, { id: uid(), name: f.name.replace(/\.[^.]+$/, ''), body: stripDashes(String(r.result)) }]);
    r.readAsText(f);
  }

  async function generateStrategy() {
    setStratState('loading');
    try {
      const prompt = `You are a senior LinkedIn personal-branding strategist for founders. You know the fundamentals cold: the founder profile outperforms the company page, positioning on two or three themes beats random posting, the first line is a hook that decides everything, reacting fast to news wins reach, consistency compounds, and authentic first-person writing is what builds trust.

Founder context:
- Company: ${founder.company || 'unknown'}
- Company description: ${founder.companyDesc || 'n/a'}
- Founder personality: ${founder.personalityDesc || 'n/a'}
- Goal and approach: ${strategy.goal || 'n/a'}
- Funnel focus: ${strategy.phases.map((p) => phaseById(p).t.en).join(', ') || 'n/a'}

Define the tone of voice this specific founder should use on LinkedIn. Make it concrete and usable, grounded in their real personality and goal, not a generic template.

Return ONLY a JSON object with these fields:
- tone: 3 to 4 short lines in ${langLabel}. Cover, in plain language: the voice in a few sharp adjectives, the sentence rhythm and structure, the point of view, and one thing to lean into plus one thing to avoid. No buzzwords, no filler.
- keywords: array of 6 sharp content themes in ${langLabel} (1 to 2 words each) that this founder can credibly own and repeat.

No markdown, no prose outside the JSON. Do not use em-dashes or en-dashes.`;
      const out = extractJson(textOf(await callClaude([{ role: 'user', content: prompt }])), 'object');
      setStrategy((p) => ({
        ...p,
        tone: stripDashes(String(out.tone || p.tone)),
        keywords: Array.from(new Set([...(p.keywords || []), ...((out.keywords || []).map((k) => stripDashes(String(k))))])).slice(0, 10),
      }));
      setStratState('done');
    } catch (e) { setStratState('error'); }
  }

  async function fetchNews() {
    if (strategy.keywords.length === 0) { setNewsState('empty'); return; }
    setNewsState('loading'); setNewsErr('');
    try {
      const prompt = `You are a news radar for LinkedIn thought leadership. Find current news from the past two weeks matching these founder themes: ${strategy.keywords.join(', ')}.

Return exactly 5 items. Each object: title (short), source (publication name), url (link if known else ""), summary (1 short sentence), angle (1 sentence on why it matters for a founder on LinkedIn), keyword (best matching theme). Write title, summary and angle in ${langLabel}.

Reply ONLY with a JSON array, no markdown. Do not use em-dashes or en-dashes.`;
      const content = await callClaude([{ role: 'user', content: prompt }], [{ type: 'web_search_20250305', name: 'web_search' }]);
      const items = extractJson(textOf(content), 'array').map((it) => ({
        id: uid(), title: stripDashes(String(it.title || '')), source: stripDashes(String(it.source || 'Web')),
        url: String(it.url || ''), summary: stripDashes(String(it.summary || '')),
        angle: stripDashes(String(it.angle || '')), keyword: stripDashes(String(it.keyword || '')),
      })).filter((it) => it.title);
      setNews(items); setNewsState(items.length ? 'done' : 'error');
      if (!items.length) setNewsErr('err_no_stories');
    } catch (e) { setNewsState('error'); setNewsErr('err_radar'); }
  }

  function newPost(preset) {
    const now = new Date(); now.setDate(now.getDate() + 1);
    setComposer({ id: null, source: preset && preset.source ? preset.source : null, category: (preset && preset.category) || strategy.phases[0] || 'reach', tplId: templates[0] ? templates[0].id : '', date: (preset && preset.date) || ymd(now), time: '09:00', text: '', notes: '', gen: 'idle' });
    setView('app'); setTab('post');
  }
  function editPost(p) {
    setComposer({ id: p.id, source: p.source || null, category: p.category, tplId: templates[0] ? templates[0].id : '', date: p.date, time: p.time, text: p.text, notes: '', gen: 'idle' });
  }
  function savePost() {
    if (!composer) return;
    const rec = { id: composer.id || uid(), source: composer.source, category: composer.category, date: composer.date, time: composer.time, text: composer.text, status: 'scheduled' };
    setPosts((arr) => composer.id ? arr.map((x) => x.id === rec.id ? rec : x) : [...arr, rec]);
    setComposer(null); setTab('post'); setView('app');
  }
  function deletePost(id) { setPosts((arr) => arr.filter((x) => x.id !== id)); }

  async function generateComposer() {
    if (!composer) return;
    setComposer((c) => ({ ...c, gen: 'loading' }));
    try {
      const tpl = templates.find((x) => x.id === composer.tplId) || templates[0];
      const ph = phaseById(composer.category);
      const who = founder.name + (founder.role ? ', ' + founder.role : '') + (founder.company ? ' at ' + founder.company : '');
      const src = composer.source ? `Topic (news): ${composer.source.title}\nCore: ${composer.source.summary || ''}\nRelevance: ${composer.source.angle || ''}` : `Idea: ${composer.notes || 'a valuable insight for my audience'}`;
      const prompt = `You are an expert LinkedIn ghostwriter for founders. You write posts that stop the scroll and build a personal brand, and you never sound like generic AI content.

Author: ${who}.
${strategy.tone ? 'Tone of voice to match exactly:\n' + strategy.tone + '\n' : ''}${founder.personalityDesc ? 'Founder personality: ' + founder.personalityDesc + '\n' : ''}${founder.companyDesc ? 'Company: ' + founder.companyDesc + '\n' : ''}
Funnel stage: ${ph.t.en}. Goal of this post: ${ph.intent}.

${src}

Structure to follow (fill the placeholders naturally and drop the braces):
${tpl.body}

Write in ${langLabel}. Craft rules:
- Line 1 is a scroll-stopping hook: a bold claim, a surprising fact, a sharp question or a specific number. Never a generic wind-up.
- One idea per post. Cut everything that does not serve it.
- Very short paragraphs, often a single sentence, with a blank line between them so it scans on mobile.
- Be concrete: real detail, numbers and lived experience over vague advice.
- Sound human and first person. No corporate jargon, no buzzwords, no cliches like a fast-paced world.
- End with 1 clear call to action or a question that invites comments.
- Add 2 to 3 relevant, specific hashtags on the last line.
- Do NOT use em-dashes or en-dashes. Use a regular hyphen or a comma.
- Return only the post text, nothing else.`;
      const text = stripDashes(textOf(await callClaude([{ role: 'user', content: prompt }])));
      setComposer((c) => ({ ...c, text, gen: 'done' }));
    } catch (e) { setComposer((c) => ({ ...c, gen: 'error' })); }
  }

  const MENU = [
    { k: 'home', label: t('nav_home'), act: () => go('home') },
    { k: 'founder', label: t('nav_founder'), act: () => go('app', 'founder') },
    { k: 'strategy', label: t('nav_strategy'), act: () => go('app', 'strategy') },
    { k: 'topics', label: t('nav_topics'), act: () => go('app', 'topics') },
    { k: 'post', label: t('nav_post'), act: () => go('app', 'post') },
  ];
  const TABS = [
    { k: 'founder', label: t('nav_founder'), ic: I.user },
    { k: 'strategy', label: t('nav_strategy'), ic: I.target },
    { k: 'topics', label: t('nav_topics'), ic: I.radar },
    { k: 'post', label: t('nav_post'), ic: I.calendar },
  ];

  return (
    <div className="faab">
      <style>{CSS}</style>

      <header className="topbar">
        <button className="brand" onClick={() => go('home')}>
          <span className="wordmark">FAAB<span className="wm-dot">.</span></span>
        </button>
        <button className={'burger' + (menu ? ' burger-on' : '')} onClick={() => setMenu((m) => !m)} aria-label="Menu" aria-expanded={menu}>
          <span className="burger-bar b1" /><span className="burger-bar b2" /><span className="burger-bar b3" />
        </button>
      </header>

      <div className={'menu' + (menu ? ' menu-on' : '')} aria-hidden={!menu}>
        <nav className="menu-nav">
          {MENU.map((m, i) => (
            <button key={m.k} className="menu-item" style={{ '--i': i }} onClick={m.act}>
              <span className="menu-i">0{i + 1}</span>
              <span className="menu-label">{m.label}</span>
              <I.arrow width="26" height="26" />
            </button>
          ))}
        </nav>
        <div className="menu-foot" style={{ '--i': 5 }}>
          <button className="btn btn-blue" onClick={() => go('app', 'founder')}><I.linkedin width="18" height="18" /> {t('connect')}</button>
        </div>
      </div>

      {view === 'home' && <Home t={t} lang={lang} go={go} onPhase={(id) => newPost({ category: id })} />}

      {view === 'app' && (
        <main className="wrap app">
          <div className="tabbar">
            {TABS.map((tb) => (
              <button key={tb.k} className={'tabbtn' + (tab === tb.k ? ' tab-on' : '')} onClick={() => setTab(tb.k)}>
                {tb.ic({ width: 17, height: 17 })}<span>{tb.label}</span>
              </button>
            ))}
          </div>

          {tab === 'founder' && <FounderTab t={t} founder={founder} setF={setF} logoRef={logoRef} onLogo={onLogo} />}
          {tab === 'strategy' && (
            <StrategyTab t={t} lang={lang}
              strategy={strategy} setS={setS} togglePhase={togglePhase}
              kwInput={kwInput} setKwInput={setKwInput} addKeyword={addKeyword} toggleKeyword={toggleKeyword}
              onGenerate={generateStrategy} stratState={stratState}
              templates={templates} editTemplates={editTemplates} tplUpRef={tplUpRef} onTplUpload={onTplUpload} />
          )}
          {tab === 'topics' && (
            <TopicsTab t={t} strategy={strategy} news={news} newsState={newsState} newsErr={newsErr}
              onRefresh={fetchNews} onSchedule={(it) => newPost({ source: it, category: strategy.phases[0] || 'reach' })}
              goStrategy={() => setTab('strategy')} />
          )}
          {tab === 'post' && (
            <PostTab t={t} lang={lang} posts={posts} onAdd={(date) => newPost(date ? { date } : {})} onEdit={editPost} onDelete={deletePost} />
          )}
        </main>
      )}

      {composer && (
        <Composer t={t} lang={lang} composer={composer} setComposer={setComposer} founder={founder} strategy={strategy}
          templates={templates} onGenerate={generateComposer} onSave={savePost} onClose={() => setComposer(null)} />
      )}

      <footer className="foot">
        <div className="foot-grid">
          <div>
            <span className="wordmark sm">FAAB<span className="wm-dot">.</span></span>
            <p className="foot-tag">{t('foot_tag')}</p>
          </div>
          <div className="foot-col">
            <span className="foot-h">{t('foot_app')}</span>
            <button className="foot-link" onClick={() => go('app', 'founder')}>{t('nav_founder')}</button>
            <button className="foot-link" onClick={() => go('app', 'strategy')}>{t('nav_strategy')}</button>
            <button className="foot-link" onClick={() => go('app', 'topics')}>{t('nav_topics')}</button>
            <button className="foot-link" onClick={() => go('app', 'post')}>{t('nav_post')}</button>
          </div>
          <div className="foot-col">
            <span className="foot-h">{t('foot_learn')}</span>
            <a className="foot-link" href="#funnel">{t('foot_the_funnel')}</a>
            <a className="foot-link" href="#knowledge">{t('foot_kb')}</a>
            <a className="foot-link" href="#contact">{t('foot_contact')}</a>
          </div>
        </div>
        <div className="foot-base">
          <span>{t('foot_base')}</span>
          <div className="lang-toggle" role="group" aria-label={t('lang_word')}>
            <button className={lang === 'nl' ? 'lang-on' : ''} onClick={() => changeLang('nl')}>NL</button>
            <button className={lang === 'en' ? 'lang-on' : ''} onClick={() => changeLang('en')}>EN</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ---------- Home ----------
function Home({ t, lang, go, onPhase }) {
  return (
    <main>
      <section className="hero wrap">
        <h1 className="slogan">{t('slogan_a')}<span className="hl">{t('slogan_b')}</span></h1>
        <p className="tagline">{t('tagline')}</p>
        <div className="hero-cta">
          <button className="btn btn-blue lg" onClick={() => go('app', 'founder')}><I.linkedin width="19" height="19" /> {t('connect')}</button>
          <a className="btn btn-ghost lg" href="#funnel">{t('cta_funnel')}</a>
        </div>
      </section>

      <section id="service" className="sect wrap">
        <div className="eyebrow">{t('eb_service')}</div>
        <h2 className="h2">{t('service_h2a')}<br className="bk" /> {t('service_h2b')}</h2>
        <p className="sect-lead">{t('service_lead')}</p>
        <div className="cards3">
          {[[I.user, 'svc1_t', 'svc1_d'], [I.radar, 'svc2_t', 'svc2_d'], [I.calendar, 'svc3_t', 'svc3_d']].map(([ic, tk, dk]) => (
            <div className="card" key={tk}>
              <div className="card-head">
                <span className="card-ic">{ic({ width: 22, height: 22 })}</span>
                <h3>{t(tk)}</h3>
              </div>
              <p>{t(dk)}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="funnel" className="sect wrap">
        <div className="eyebrow">{t('eb_funnel')}</div>
        <h2 className="h2">{t('funnel_h2a')}<br className="bk" /> {t('funnel_h2b')}</h2>
        <p className="sect-lead">{t('funnel_lead')}</p>
        <div className="funnel">
          {FUNNEL.map((f) => (
            <button className="f-seg" key={f.id} style={{ '--fw': f.w + '%', background: f.c }} onClick={() => onPhase(f.id)}>
              <span className="f-n">{f.n}</span>
              <span className="f-body"><span className="f-t">{f.t[lang]}</span><span className="f-d">{f.d[lang]}</span></span>
              <span className="f-go"><I.arrow width="16" height="16" /></span>
            </button>
          ))}
        </div>
      </section>

      <section id="flow" className="sect wrap">
        <div className="eyebrow">{t('eb_practice')}</div>
        <h2 className="h2">{t('practice_h2a')}<br className="bk" /> {t('practice_h2b')}</h2>
        <p className="sect-lead">{t('practice_lead')}</p>
        <div className="flow">
          {USERFLOW.map((s, i) => (
            <React.Fragment key={s.k}>
              <div className="flow-step">
                <span className="flow-ic">{s.ic({ width: 22, height: 22 })}</span>
                <span className="flow-n">0{i + 1}</span>
                <h3>{s.t[lang]}</h3>
                <p>{s.d[lang]}</p>
              </div>
              {i < USERFLOW.length - 1 && <span className="flow-arrow"><I.arrow width="22" height="22" /></span>}
            </React.Fragment>
          ))}
        </div>
      </section>

      <section id="knowledge" className="sect wrap">
        <div className="eyebrow">{t('eb_knowledge')}</div>
        <h2 className="h2">{t('knowledge_h2a')}<br className="bk" /> {t('knowledge_h2b')}</h2>
        <p className="sect-lead">{t('knowledge_lead')}</p>
        <div className="kb-grid">
          {KNOWLEDGE.map((k) => (<article className="kb" key={k.t.en}><h3>{k.t[lang]}</h3><p>{k.d[lang]}</p></article>))}
        </div>
      </section>

      <section id="control" className="sect wrap">
        <div className="ctrl">
          <div className="ctrl-head">
            <span className="ctrl-ic"><I.shield width="26" height="26" /></span>
            <div><div className="eyebrow">{t('eb_control')}</div><h2 className="h2">{t('control_h2')}</h2></div>
          </div>
          <p className="sect-lead">{t('control_lead')}</p>
          <div className="ctrl-grid">
            {[[I.user, 'ctrl1_t', 'ctrl1_d'], [I.eye, 'ctrl2_t', 'ctrl2_d'], [I.edit, 'ctrl3_t', 'ctrl3_d'], [I.linkedin, 'ctrl4_t', 'ctrl4_d']].map(([ic, tk, dk]) => (
              <div className="ctrl-item" key={tk}>
                <span className="ctrl-item-ic">{ic({ width: 19, height: 19 })}</span>
                <div><h3>{t(tk)}</h3><p>{t(dk)}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="sect wrap">
        <div className="contact">
          <div>
            <div className="eyebrow">{t('eb_contact')}</div>
            <h2 className="h2">{t('contact_h2a')}<br />{t('contact_h2b')}</h2>
            <p className="sect-lead">{t('contact_lead')}</p>
          </div>
          <div className="contact-card">
            <a className="contact-row" href="mailto:hello@faab.app"><I.mail width="18" height="18" /> hello@faab.app</a>
            <a className="contact-row" href="https://www.linkedin.com" target="_blank" rel="noreferrer"><I.linkedin width="18" height="18" /> FAAB on LinkedIn</a>
            <button className="btn btn-blue" onClick={() => go('app', 'founder')}><I.linkedin width="17" height="17" /> {t('connect')}</button>
          </div>
        </div>
      </section>
    </main>
  );
}

// ---------- Founder tab ----------
function FounderTab({ t, founder, setF, logoRef, onLogo }) {
  return (
    <section className="panel">
      <div className="panel-head"><h2>{t('f_h2')}</h2><p>{t('f_p')}</p></div>
      <div className="prof-grid">
        <div className="ava-block">
          <div className="ava" style={founder.logo ? { backgroundImage: `url(${founder.logo})` } : {}} onClick={() => logoRef.current && logoRef.current.click()}>
            {!founder.logo && <span className="ava-hint">{t('f_logo')}</span>}
          </div>
          <button className="btn btn-ghost sm" onClick={() => logoRef.current && logoRef.current.click()}><I.upload width="15" height="15" /> {t('f_upload_logo')}</button>
          <input ref={logoRef} type="file" accept="image/*" hidden onChange={onLogo} />
        </div>
        <div className="prof-fields">
          <div className="row2">
            <Field label={t('f_name')}><input className="input" value={founder.name} onChange={(e) => setF('name', e.target.value)} placeholder="Sten Bossong" /></Field>
            <Field label={t('f_role')}><input className="input" value={founder.role} onChange={(e) => setF('role', e.target.value)} placeholder={t('ph_role')} /></Field>
          </div>
          <Field label={t('f_company')}><input className="input" value={founder.company} onChange={(e) => setF('company', e.target.value)} placeholder={t('ph_company')} /></Field>
          <Field label={t('f_company_desc')} hint={t('f_company_desc_hint')}><textarea className="input textarea" rows={3} value={founder.companyDesc} onChange={(e) => setF('companyDesc', e.target.value)} placeholder={t('f_company_desc_ph')} /></Field>
          <Field label={t('f_pers_desc')} hint={t('f_pers_desc_hint')}><textarea className="input textarea" rows={3} value={founder.personalityDesc} onChange={(e) => setF('personalityDesc', e.target.value)} placeholder={t('f_pers_desc_ph')} /></Field>
        </div>
      </div>
    </section>
  );
}

// ---------- Strategy tab ----------
function StrategyTab({ t, lang, strategy, setS, togglePhase, kwInput, setKwInput, addKeyword, toggleKeyword, onGenerate, stratState, templates, editTemplates, tplUpRef, onTplUpload }) {
  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-head"><h2>{t('s_funnel_h2')}</h2><p>{t('s_funnel_p')}</p></div>
        <div className="mini-funnel">
          {FUNNEL.map((f) => {
            const on = strategy.phases.includes(f.id);
            return (
              <button key={f.id} className={'mf-seg' + (on ? ' mf-on' : '')} style={on ? { background: f.c, borderColor: f.c } : {}} onClick={() => togglePhase(f.id)}>
                <span className="mf-n">{f.n}</span><span className="mf-t">{f.t[lang]}</span>{on && <I.check width="16" height="16" />}
              </button>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>{t('s_goal_h2')}</h2><p>{t('s_goal_p')}</p></div>
        <Field label={t('s_goal_label')} hint={t('s_goal_hint')}>
          <textarea className="input textarea" rows={4} value={strategy.goal} onChange={(e) => setS('goal', e.target.value)} placeholder={t('s_goal_ph')} />
        </Field>
        <div className="gen-row">
          <button className="btn btn-blue" onClick={onGenerate} disabled={stratState === 'loading'}><I.spark width="17" height="17" /> {stratState === 'loading' ? t('s_generating') : t('s_generate')}</button>
          {stratState === 'error' && <span className="mini-err">{t('s_gen_err')}</span>}
        </div>
        <Field label={t('s_tone_label')}><textarea className="input textarea" rows={4} value={strategy.tone} onChange={(e) => setS('tone', e.target.value)} placeholder={t('s_tone_ph')} /></Field>
        <div className="field-label mt">{t('s_keywords')}</div>
        <div className="kw-add">
          <input className="input" value={kwInput} onChange={(e) => setKwInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { addKeyword(kwInput); setKwInput(''); } }} placeholder={t('s_add_kw_ph')} />
          <button className="btn btn-blue sm" onClick={() => { addKeyword(kwInput); setKwInput(''); }}><I.plus width="16" height="16" /> {t('s_add')}</button>
        </div>
        {strategy.keywords.length > 0 && (
          <div className="chips selected">{strategy.keywords.map((k) => <Chip key={k} active removable onRemove={() => setS('keywords', strategy.keywords.filter((x) => x !== k))}>{k}</Chip>)}</div>
        )}
        <div className="field-label mt">{t('s_suggestions')}</div>
        <div className="chips">{SUGGESTED[lang].map((s) => <Chip key={s} active={strategy.keywords.some((k) => k.toLowerCase() === s.toLowerCase())} onClick={() => toggleKeyword(s)}>{s}</Chip>)}</div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>{t('s_tpl_h2')}</h2><p>{t('s_tpl_p')}</p></div>
        <div className="tpl-list">
          {templates.map((tp) => (
            <div className="tpl" key={tp.id}>
              <div className="tpl-top">
                <input className="input tpl-name" value={tp.name} onChange={(e) => editTemplates((arr) => arr.map((x) => x.id === tp.id ? { ...x, name: e.target.value } : x))} />
                {templates.length > 1 && <button className="icon-btn" onClick={() => editTemplates((arr) => arr.filter((x) => x.id !== tp.id))} aria-label="x"><I.x width="16" height="16" /></button>}
              </div>
              <textarea className="input textarea mono" rows={4} value={tp.body} onChange={(e) => editTemplates((arr) => arr.map((x) => x.id === tp.id ? { ...x, body: e.target.value } : x))} />
            </div>
          ))}
        </div>
        <div className="tpl-actions">
          <button className="btn btn-ghost sm" onClick={() => editTemplates((arr) => [...arr, { id: uid(), name: t('s_new_tpl_name'), body: '{hook}\n\n{core}\n\n{question}' }])}><I.plus width="16" height="16" /> {t('s_new_tpl')}</button>
          <button className="btn btn-ghost sm" onClick={() => tplUpRef.current && tplUpRef.current.click()}><I.upload width="16" height="16" /> {t('s_upload_tpl')}</button>
          <input ref={tplUpRef} type="file" accept=".txt,.md" hidden onChange={onTplUpload} />
        </div>
      </section>
    </div>
  );
}

// ---------- Topics tab ----------
function TopicsTab({ t, strategy, news, newsState, newsErr, onRefresh, onSchedule, goStrategy }) {
  return (
    <section className="panel">
      <div className="topics-head">
        <div className="panel-head nomb"><h2>{t('t_h2')}</h2><p>{t('t_p')}</p></div>
        <button className="btn btn-blue sm" onClick={onRefresh} disabled={newsState === 'loading'}><I.refresh width="16" height="16" /> {newsState === 'loading' ? t('t_scanning') : t('t_refresh')}</button>
      </div>
      <div className="kw-strip">{strategy.keywords.map((k) => <span className="kw-pill" key={k}><I.tag width="12" height="12" /> {k}</span>)}</div>

      {newsState === 'empty' && <div className="empty"><I.target width="26" height="26" /><p>{t('t_empty')}</p><button className="btn btn-ghost sm" onClick={goStrategy}>{t('t_go_strategy')}</button></div>}
      {newsState === 'loading' && <div className="news-grid">{[0, 1, 2, 3].map((i) => <div className="news-card skeleton" key={i} />)}</div>}
      {newsState === 'error' && <div className="empty"><I.radar width="26" height="26" /><p>{t(newsErr)}</p><button className="btn btn-ghost sm" onClick={onRefresh}>{t('t_refresh')}</button></div>}
      {newsState === 'done' && (
        <div className="news-grid">
          {news.map((it) => (
            <article className="news-card" key={it.id}>
              <div className="news-top"><span className="src">{it.source}</span>{it.keyword && <span className="kw-pill sm"><I.tag width="11" height="11" /> {it.keyword}</span>}</div>
              <h3 className="news-title">{it.title}</h3>
              <p className="news-sum">{it.summary}</p>
              {it.angle && <p className="news-angle"><I.spark width="14" height="14" /> {it.angle}</p>}
              <div className="news-foot">
                {it.url && <a className="news-link" href={it.url} target="_blank" rel="noreferrer"><I.link width="14" height="14" /> {t('t_source')}</a>}
                <button className="btn btn-blue sm push" onClick={() => onSchedule(it)}><I.calendar width="15" height="15" /> {t('t_create_post')}</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

// ---------- Post tab ----------
function PostTab({ t, lang, posts, onAdd, onEdit, onDelete }) {
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const y = month.getFullYear(), m = month.getMonth();
  const firstDow = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  const byDate = {};
  posts.forEach((p) => { (byDate[p.date] = byDate[p.date] || []).push(p); });
  const todayStr = ymd(new Date());
  const upcoming = [...posts].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <section className="stack">
      <div className="panel">
        <div className="cal-head">
          <h2>{MONTHS[lang][m]} {y}</h2>
          <div className="cal-nav">
            <button className="icon-btn" onClick={() => setMonth(new Date(y, m - 1, 1))} aria-label="prev"><I.chevL width="18" height="18" /></button>
            <button className="icon-btn" onClick={() => setMonth(new Date(y, m + 1, 1))} aria-label="next"><I.chevR width="18" height="18" /></button>
          </div>
        </div>
        <div className="cal">
          {WD[lang].map((w) => <div className="cal-wd" key={w}>{w}</div>)}
          {cells.map((d, i) => {
            if (!d) return <div className="cal-cell empty-cell" key={'e' + i} />;
            const ds = y + '-' + pad(m + 1) + '-' + pad(d);
            const list = byDate[ds] || [];
            return (
              <button className={'cal-cell' + (ds === todayStr ? ' cal-today' : '')} key={ds} onClick={() => onAdd(ds)}>
                <span className="cal-d">{d}</span>
                <span className="cal-dots">
                  {list.slice(0, 3).map((p) => <span key={p.id} className="cal-dot" style={{ background: phaseById(p.category).c }} />)}
                  {list.length > 3 && <span className="cal-more">+{list.length - 3}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head nomb"><h2>{t('p_scheduled_h2')}</h2><p>{upcoming.length ? upcoming.length + ' ' + t('p_scheduled_count') : t('p_none')}</p></div>
        <div className="sched-list">
          {upcoming.map((p) => {
            const ph = phaseById(p.category);
            return (
              <div className="sched" key={p.id}>
                <div className="sched-date"><span className="sd-d">{p.date.slice(8)}</span><span className="sd-m">{MONTHS[lang][Number(p.date.slice(5, 7)) - 1].slice(0, 3)}</span></div>
                <div className="sched-body">
                  <div className="sched-meta"><span className="cat-pill" style={{ background: ph.c }}>{ph.t[lang]}</span><span className="sched-time">{p.time}</span></div>
                  <p className="sched-text">{p.text ? p.text.split('\n')[0] : t('p_untitled')}</p>
                </div>
                <div className="sched-actions">
                  <button className="icon-btn" onClick={() => onEdit(p)} aria-label="edit"><I.edit width="16" height="16" /></button>
                  <button className="icon-btn" onClick={() => onDelete(p.id)} aria-label="delete"><I.trash width="16" height="16" /></button>
                </div>
              </div>
            );
          })}
          {!upcoming.length && <div className="empty small"><I.calendar width="24" height="24" /><p>{t('p_your_scheduled')}</p></div>}
        </div>
        <button className="btn btn-blue add-btn" onClick={() => onAdd()}><I.plus width="18" height="18" /> {t('p_add_new')}</button>
      </div>
    </section>
  );
}

// ---------- Composer ----------
function Composer({ t, lang, composer, setComposer, founder, strategy, templates, onGenerate, onSave, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, []);
  const set = (k, v) => setComposer((c) => ({ ...c, [k]: v }));
  const ph = phaseById(composer.category);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="composer" onClick={(e) => e.stopPropagation()}>
        <div className="comp-head">
          <div><div className="eyebrow">{composer.id ? t('c_edit') : t('c_new')}</div><h2 className="comp-title">{composer.source ? composer.source.title : t('c_write_schedule')}</h2></div>
          <button className="icon-btn" onClick={onClose} aria-label="close"><I.x width="18" height="18" /></button>
        </div>

        <div className="comp-body">
          <div className="comp-left">
            <Field label={t('c_category')}>
              <div className="chips">{FUNNEL.map((f) => <Chip key={f.id} active={composer.category === f.id} dot={f.c} onClick={() => set('category', f.id)}>{f.t[lang]}</Chip>)}</div>
            </Field>
            <Field label={t('c_template')}>
              <div className="chips">{templates.map((tp) => <Chip key={tp.id} active={composer.tplId === tp.id} onClick={() => set('tplId', tp.id)}>{tp.name}</Chip>)}</div>
            </Field>
            {!composer.source && <Field label={t('c_idea')} hint={t('c_idea_hint')}><input className="input" value={composer.notes} onChange={(e) => set('notes', e.target.value)} placeholder={t('c_idea_ph')} /></Field>}
            <button className="btn btn-blue" onClick={onGenerate} disabled={composer.gen === 'loading'}><I.spark width="17" height="17" /> {composer.gen === 'loading' ? t('c_drafting') : composer.text ? t('c_draft_again') : t('c_draft')}</button>
            {composer.gen === 'error' && <div className="mini-err">{t('c_draft_err')}</div>}
            <Field label={t('c_post_text')}><textarea className="input textarea tall" value={composer.text} onChange={(e) => set('text', e.target.value)} placeholder={t('c_post_text_ph')} /></Field>
            <div className="row2">
              <Field label={t('c_date')}><input className="input" type="date" value={composer.date} onChange={(e) => set('date', e.target.value)} /></Field>
              <Field label={t('c_time')}><input className="input" type="time" value={composer.time} onChange={(e) => set('time', e.target.value)} /></Field>
            </div>
            <button className="btn btn-blue" onClick={onSave} disabled={!composer.text}><I.calendar width="17" height="17" /> {composer.id ? t('c_update') : t('c_schedule')}</button>
          </div>

          <div className="comp-right">
            <div className="field-label">{t('c_preview')}</div>
            <div className="li-card">
              <div className="li-top">
                <span className="ava-mini" style={founder.logo ? { backgroundImage: `url(${founder.logo})` } : {}}>{!founder.logo && (founder.name[0] || 'F').toUpperCase()}</span>
                <div className="li-meta">
                  <div className="li-name">{founder.name || 'Founder'} <span className="li-first">{t('li_first')}</span></div>
                  <div className="li-role">{[founder.role, founder.company].filter(Boolean).join(' at ') || 'Founder'}</div>
                  <div className="li-time">{composer.date} . <span className="li-globe">{t('li_public')}</span></div>
                </div>
                <span className="li-in"><I.linkedin width="18" height="18" /></span>
              </div>
              <div className="li-text">{composer.text || t('c_draft_hint')}</div>
              <div className="li-cat"><span className="cat-pill" style={{ background: ph.c }}>{ph.t[lang]}</span></div>
              <div className="li-react"><span className="li-emos">+</span><span>{t('li_like')}</span><span>{t('li_comment')}</span><span>{t('li_share')}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- CSS ----------
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

.faab { --paper:#F4F3F6; --white:#FFFFFF; --ink:#171717; --mut:#585563; --dim:#8B8794; --line:#E4E2EA;
  --blue:#0A66C2; --blue-d:#084F98; --blue-soft:rgba(10,102,194,0.08); --blue-tint:#EAF1FA; --navy:#0C2F5A; --mag:#E7235A;
  background:var(--white); color:var(--ink); font-family:Inter,system-ui,sans-serif; min-height:100vh; }
.faab * { box-sizing:border-box; }
.faab button { font-family:inherit; cursor:pointer; }
.faab a { color:inherit; text-decoration:none; }
.faab :focus-visible { outline:2px solid var(--blue); outline-offset:2px; border-radius:8px; }

.eyebrow { display:inline-flex; align-items:center; gap:7px; font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:var(--blue); }
.eyebrow.light { color:#9CC2EC; }
.field-label { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.13em; text-transform:uppercase; color:var(--dim); display:flex; gap:8px; align-items:baseline; }
.field-label.mt { display:block; margin:20px 0 10px; }
.field-hint { text-transform:none; letter-spacing:0; font-family:Inter; font-size:11.5px; color:var(--dim); }

.topbar { display:flex; align-items:center; justify-content:space-between; padding:16px 26px; border-bottom:1px solid var(--line); position:sticky; top:0; z-index:60; background:rgba(255,255,255,0.9); backdrop-filter:blur(14px); }
.brand { background:none; border:none; padding:0; }
.wordmark { font-family:'Fraunces',serif; font-weight:500; font-size:26px; letter-spacing:0.01em; color:var(--ink); }
.wordmark.sm { font-size:21px; }
.wm-dot { color:var(--mag); }

.burger { position:relative; width:40px; height:40px; border:1px solid var(--line); border-radius:12px; background:var(--white); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:5px; }
.burger:hover { border-color:var(--blue); }
.burger-bar { width:18px; height:2px; background:var(--ink); border-radius:2px; transition:transform .34s cubic-bezier(.6,.05,.1,1), opacity .2s ease; }
.burger-on .b1 { transform:translateY(7px) rotate(45deg); }
.burger-on .b2 { opacity:0; transform:scaleX(0.4); }
.burger-on .b3 { transform:translateY(-7px) rotate(-45deg); }

.menu { position:fixed; inset:0; z-index:50; background:var(--blue); color:#fff; padding:96px 26px 40px;
  opacity:0; visibility:hidden; transform:scale(1.02); transition:opacity .4s ease, transform .5s cubic-bezier(.6,.05,.1,1), visibility 0s .45s; display:flex; flex-direction:column; justify-content:center; }
.menu-on { opacity:1; visibility:visible; transform:scale(1); transition:opacity .4s ease, transform .5s cubic-bezier(.6,.05,.1,1), visibility 0s; }
.menu-nav { max-width:1120px; margin:0 auto; width:100%; }
.menu-item { display:flex; align-items:center; gap:20px; width:100%; background:none; border:none; padding:14px 0; color:#fff; border-bottom:1px solid rgba(255,255,255,0.18);
  opacity:0; transform:translateY(24px); transition:opacity .5s ease, transform .5s cubic-bezier(.6,.05,.1,1); }
.menu-on .menu-item { opacity:1; transform:translateY(0); transition-delay:calc(var(--i) * 60ms + 120ms); }
.menu-i { font-family:'IBM Plex Mono',monospace; font-size:13px; color:rgba(255,255,255,0.6); width:34px; }
.menu-label { font-family:'Fraunces',serif; font-weight:400; font-size:clamp(32px,7vw,58px); letter-spacing:-0.01em; flex:1; text-align:left; }
.menu-item svg { color:rgba(255,255,255,0.55); transition:transform .3s ease; }
.menu-item:hover svg { transform:translateX(6px); color:#fff; }
.menu-foot { max-width:1120px; margin:34px auto 0; width:100%; opacity:0; transform:translateY(24px); transition:opacity .5s ease, transform .5s ease; }
.menu-on .menu-foot { opacity:1; transform:translateY(0); transition-delay:calc(var(--i) * 60ms + 120ms); }
.menu-foot .btn-blue { background:#fff; color:var(--blue); box-shadow:none; }
.menu-foot .btn-blue:hover { background:var(--blue-tint); }

.btn { display:inline-flex; align-items:center; gap:9px; border:none; border-radius:999px; padding:13px 22px; font-size:15px; font-weight:600; transition:transform .15s ease, box-shadow .2s ease, background .2s; }
.btn.sm { padding:9px 15px; font-size:13.5px; }
.btn.lg { padding:15px 26px; font-size:16px; }
.btn-blue { background:var(--blue); color:#fff; box-shadow:0 6px 18px rgba(10,102,194,0.22); }
.btn-blue:hover { background:var(--blue-d); transform:translateY(-1px); }
.btn-blue:disabled { opacity:0.45; transform:none; box-shadow:none; cursor:not-allowed; }
.btn-ghost { background:var(--paper); color:var(--ink); border:1px solid var(--line); }
.btn-ghost:hover { border-color:var(--blue); color:var(--blue); }
.btn-ghost:disabled { opacity:0.4; cursor:not-allowed; }
.icon-btn { background:var(--white); border:1px solid var(--line); color:var(--mut); width:36px; height:36px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; flex:none; }
.icon-btn:hover { color:var(--blue); border-color:var(--blue); }

.wrap { max-width:1120px; margin:0 auto; padding:0 26px; }

.hero { padding-top:96px; padding-bottom:90px; text-align:center; }
.slogan { font-family:'Fraunces',serif; font-weight:400; font-size:clamp(52px,11vw,132px); line-height:0.95; letter-spacing:-0.03em; margin:0; text-wrap:balance; }
.slogan .hl { font-style:italic; color:var(--navy); }
.tagline { font-family:'Fraunces',serif; font-style:italic; font-size:clamp(18px,3vw,26px); color:var(--mut); margin:22px 0 34px; }
.hero-cta { display:flex; gap:13px; justify-content:center; flex-wrap:wrap; }

.sect { padding-top:88px; }
.h2 { font-family:'Fraunces',serif; font-weight:400; font-size:clamp(28px,4vw,42px); letter-spacing:-0.02em; line-height:1.12; margin:14px 0 16px; text-wrap:balance; }
.h2.on-dark { color:#fff; margin-bottom:0; }
.sect-lead { font-size:16.5px; line-height:1.65; color:var(--mut); max-width:64ch; margin:0 0 34px; text-wrap:pretty; }

.cards3 { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
.card { background:var(--paper); border:1px solid var(--line); border-radius:18px; padding:26px; }
.card-head { display:flex; align-items:center; gap:13px; margin-bottom:12px; }
.card-ic { display:inline-flex; width:44px; height:44px; align-items:center; justify-content:center; border-radius:12px; background:var(--blue-soft); color:var(--blue); flex:none; }
.card h3 { font-family:'Fraunces',serif; font-weight:500; font-size:22px; margin:0; }
.card p { color:var(--mut); font-size:14.5px; line-height:1.55; margin:0; }

.funnel { display:flex; flex-direction:column; align-items:center; gap:12px; margin-top:8px; }
.f-seg { width:100%; max-width:var(--fw,100%); display:flex; align-items:center; gap:18px; padding:20px 26px; border:none; border-radius:16px; color:#fff; text-align:left; transition:transform .16s ease, box-shadow .2s; box-shadow:0 8px 22px rgba(10,102,194,0.14); }
.f-seg:hover { transform:translateY(-2px); box-shadow:0 12px 28px rgba(10,102,194,0.24); }
.f-n { font-family:'IBM Plex Mono',monospace; font-size:13px; opacity:0.72; flex:none; }
.f-body { display:flex; flex-direction:column; gap:3px; flex:1; }
.f-t { font-family:'Fraunces',serif; font-weight:500; font-size:21px; }
.f-d { font-size:13.5px; opacity:0.85; }
.f-go { opacity:0.75; flex:none; }

.flow { display:flex; align-items:stretch; gap:10px; margin-top:8px; }
.flow-step { flex:1; min-width:0; background:var(--paper); border:1px solid var(--line); border-radius:18px; padding:24px 20px; display:flex; flex-direction:column; gap:10px; }
.flow-ic { width:46px; height:46px; border-radius:13px; background:var(--blue); color:#fff; display:inline-flex; align-items:center; justify-content:center; }
.flow-n { font-family:'IBM Plex Mono',monospace; font-size:12px; letter-spacing:0.12em; color:var(--blue); }
.flow-step h3 { font-family:'Fraunces',serif; font-weight:500; font-size:18px; margin:0; line-height:1.2; }
.flow-step p { color:var(--mut); font-size:13.5px; line-height:1.55; margin:0; }
.flow-arrow { display:flex; align-items:center; justify-content:center; color:var(--dim); flex:none; }

.band-in { background:var(--ink); color:var(--paper); border-radius:24px; padding:48px; display:grid; grid-template-columns:1fr 1fr; gap:36px; align-items:center; }
.band-copy p { color:rgba(244,243,246,0.78); font-size:16px; line-height:1.65; margin:0 0 14px; }
.band-copy p:last-child { margin-bottom:0; }

.kb-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
.kb { background:var(--white); border:1px solid var(--line); border-left:3px solid var(--blue); border-radius:14px; padding:22px; }
.kb h3 { font-family:'Fraunces',serif; font-weight:500; font-size:18px; margin:0 0 9px; }
.kb p { color:var(--mut); font-size:14px; line-height:1.6; margin:0; }

.ctrl { background:var(--blue-tint); border:1px solid var(--line); border-radius:24px; padding:44px; }
.ctrl-head { display:flex; gap:18px; align-items:center; margin-bottom:14px; }
.ctrl-ic { display:inline-flex; width:56px; height:56px; align-items:center; justify-content:center; border-radius:16px; background:var(--blue); color:#fff; flex:none; }
.ctrl-head .h2 { margin:8px 0 0; }
.ctrl-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:18px; }
.ctrl-item { display:flex; gap:14px; background:var(--white); border:1px solid var(--line); border-radius:14px; padding:18px; }
.ctrl-item-ic { display:inline-flex; width:36px; height:36px; align-items:center; justify-content:center; border-radius:10px; background:var(--blue-soft); color:var(--blue); flex:none; }
.ctrl-item h3 { font-family:'Fraunces',serif; font-weight:500; font-size:16.5px; margin:0 0 5px; }
.ctrl-item p { color:var(--mut); font-size:13.5px; line-height:1.55; margin:0; }

.contact { display:grid; grid-template-columns:1.1fr 0.9fr; gap:36px; align-items:center; }
.contact-card { background:var(--paper); border:1px solid var(--line); border-radius:20px; padding:28px; display:flex; flex-direction:column; gap:14px; align-items:flex-start; }
.contact-row { display:inline-flex; align-items:center; gap:11px; font-size:15.5px; font-weight:500; }
.contact-row svg { color:var(--blue); }
.contact-row:hover { color:var(--blue); }

.app { padding-top:26px; padding-bottom:60px; }
.tabbar { display:flex; gap:6px; background:var(--paper); border:1px solid var(--line); border-radius:14px; padding:6px; margin-bottom:22px; position:sticky; top:73px; z-index:20; }
.tabbtn { flex:1; display:inline-flex; align-items:center; justify-content:center; gap:8px; border:none; background:none; color:var(--mut); font-size:14px; font-weight:600; padding:11px 10px; border-radius:10px; }
.tabbtn:hover { color:var(--ink); }
.tab-on { background:var(--blue); color:#fff; box-shadow:0 4px 12px rgba(10,102,194,0.22); }

.stack { display:flex; flex-direction:column; gap:18px; }
.panel { background:var(--white); border:1px solid var(--line); border-radius:20px; padding:28px; box-shadow:0 8px 24px rgba(23,23,23,0.04); }
.panel-head { margin-bottom:22px; }
.panel-head.nomb { margin-bottom:0; }
.panel-head h2 { font-family:'Fraunces',serif; font-weight:500; font-size:23px; margin:0 0 6px; letter-spacing:-0.01em; }
.panel-head p { color:var(--mut); font-size:14.5px; margin:0; }

.field { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.row2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.input { background:var(--paper); border:1px solid var(--line); border-radius:11px; padding:12px 14px; color:var(--ink); font-size:15px; font-family:inherit; width:100%; }
.input::placeholder { color:var(--dim); }
.input:focus { border-color:var(--blue); outline:none; background:var(--white); }
.textarea { resize:vertical; line-height:1.5; }
.textarea.mono { font-family:'IBM Plex Mono',monospace; font-size:13px; }
.textarea.tall { min-height:200px; }

.prof-grid { display:grid; grid-template-columns:130px 1fr; gap:26px; }
.ava-block { display:flex; flex-direction:column; align-items:center; gap:12px; }
.ava { width:104px; height:104px; border-radius:20px; background:var(--paper) center/cover; border:1px solid var(--line); display:flex; align-items:center; justify-content:center; color:var(--dim); cursor:pointer; }
.ava:hover { border-color:var(--blue); }
.ava-hint { font-family:'IBM Plex Mono',monospace; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; }

.chips { display:flex; flex-wrap:wrap; gap:9px; }
.chips.selected { margin-top:12px; }
.chip { display:inline-flex; align-items:center; gap:7px; background:var(--white); border:1px solid var(--line); color:var(--mut); padding:8px 13px; border-radius:999px; font-size:13.5px; }
.chip:hover { color:var(--ink); border-color:var(--blue); }
.chip-on { background:var(--blue-soft); border-color:var(--blue); color:var(--blue); font-weight:600; }
.chip-dot { width:9px; height:9px; border-radius:50%; }
.chip-x { display:inline-flex; opacity:0.7; }
.chip-x:hover { opacity:1; }
.kw-add { display:flex; gap:10px; }
.kw-add .input { flex:1; }
.gen-row { display:flex; align-items:center; gap:14px; margin-bottom:16px; flex-wrap:wrap; }
.mini-err { color:var(--mag); font-size:13px; }

.mini-funnel { display:flex; flex-direction:column; gap:8px; }
.mf-seg { display:flex; align-items:center; gap:14px; padding:14px 18px; border:1px solid var(--line); border-radius:12px; background:var(--paper); color:var(--ink); text-align:left; transition:border-color .2s, background .2s; }
.mf-seg:hover { border-color:var(--blue); }
.mf-on { color:#fff; }
.mf-n { font-family:'IBM Plex Mono',monospace; font-size:12px; opacity:0.7; }
.mf-t { font-family:'Fraunces',serif; font-weight:500; font-size:17px; flex:1; }

.tpl-list { display:flex; flex-direction:column; gap:14px; }
.tpl { background:var(--paper); border:1px solid var(--line); border-radius:14px; padding:14px; }
.tpl-top { display:flex; gap:10px; margin-bottom:10px; }
.tpl-name { font-weight:600; background:var(--white); }
.tpl .textarea { background:var(--white); }
.tpl-actions { display:flex; gap:10px; margin-top:16px; flex-wrap:wrap; }

.topics-head { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:18px; flex-wrap:wrap; }
.kw-strip { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:22px; }
.kw-pill { display:inline-flex; align-items:center; gap:6px; background:var(--paper); border:1px solid var(--line); color:var(--mut); padding:6px 11px; border-radius:999px; font-size:12.5px; font-family:'IBM Plex Mono',monospace; }
.kw-pill.sm { padding:4px 9px; font-size:11px; }
.news-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:18px; }
.news-card { background:var(--white); border:1px solid var(--line); border-radius:18px; padding:22px; display:flex; flex-direction:column; transition:transform .16s ease, box-shadow .2s, border-color .2s; }
.news-card:hover { transform:translateY(-3px); border-color:var(--blue); box-shadow:0 14px 34px rgba(23,23,23,0.08); }
.news-card.skeleton { height:220px; background:linear-gradient(100deg,var(--paper) 30%,var(--white) 50%,var(--paper) 70%); background-size:200% 100%; animation:sheen 1.3s linear infinite; }
@keyframes sheen { to { background-position:-200% 0; } }
.news-top { display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:12px; }
.src { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:var(--blue); }
.news-title { font-family:'Fraunces',serif; font-weight:500; font-size:20px; line-height:1.22; margin:0 0 10px; letter-spacing:-0.01em; }
.news-sum { color:var(--mut); font-size:14px; line-height:1.5; margin:0 0 12px; }
.news-angle { display:flex; gap:8px; align-items:flex-start; color:var(--ink); font-size:13.5px; line-height:1.45; background:var(--blue-soft); border:1px solid rgba(10,102,194,0.16); border-radius:12px; padding:10px 12px; margin:0 0 16px; }
.news-angle svg { color:var(--blue); flex:none; margin-top:1px; }
.news-foot { display:flex; align-items:center; gap:12px; margin-top:auto; }
.news-link { display:inline-flex; align-items:center; gap:6px; color:var(--mut); font-size:13px; }
.news-link:hover { color:var(--blue); }
.push { margin-left:auto; }
.empty { text-align:center; padding:56px 20px; color:var(--mut); display:flex; flex-direction:column; align-items:center; gap:14px; }
.empty.small { padding:34px 20px; }

.cal-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; }
.cal-head h2 { font-family:'Fraunces',serif; font-weight:500; font-size:22px; margin:0; text-transform:capitalize; }
.cal-nav { display:flex; gap:8px; }
.cal { display:grid; grid-template-columns:repeat(7,1fr); gap:7px; }
.cal-wd { font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--dim); text-align:center; padding-bottom:4px; text-transform:uppercase; letter-spacing:0.08em; }
.cal-cell { min-height:64px; border:1px solid var(--line); border-radius:11px; background:var(--paper); padding:8px; display:flex; flex-direction:column; align-items:flex-start; gap:6px; transition:border-color .15s, background .15s; }
.cal-cell:hover { border-color:var(--blue); background:var(--white); }
.cal-cell.empty-cell { border:none; background:none; }
.cal-cell.cal-today { border-color:var(--blue); box-shadow:inset 0 0 0 1px var(--blue); }
.cal-d { font-size:13px; font-weight:600; color:var(--mut); }
.cal-dots { display:flex; flex-wrap:wrap; gap:4px; align-items:center; }
.cal-dot { width:8px; height:8px; border-radius:50%; }
.cal-more { font-size:10px; color:var(--dim); }

.sched-list { display:flex; flex-direction:column; gap:12px; margin:18px 0; }
.sched { display:flex; gap:16px; align-items:center; background:var(--paper); border:1px solid var(--line); border-radius:14px; padding:14px 16px; }
.sched-date { display:flex; flex-direction:column; align-items:center; width:46px; flex:none; }
.sd-d { font-family:'Fraunces',serif; font-weight:500; font-size:22px; line-height:1; }
.sd-m { font-family:'IBM Plex Mono',monospace; font-size:10.5px; text-transform:uppercase; color:var(--dim); letter-spacing:0.06em; }
.sched-body { flex:1; min-width:0; }
.sched-meta { display:flex; align-items:center; gap:10px; margin-bottom:5px; flex-wrap:wrap; }
.cat-pill { color:#fff; font-size:11px; font-weight:600; padding:3px 10px; border-radius:999px; }
.sched-time { font-family:'IBM Plex Mono',monospace; font-size:12px; color:var(--dim); }
.sched-text { margin:0; font-size:14px; color:var(--ink); line-height:1.45; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.sched-actions { display:flex; gap:8px; flex:none; }
.add-btn { width:100%; justify-content:center; }

.overlay { position:fixed; inset:0; background:rgba(23,23,23,0.42); backdrop-filter:blur(5px); display:flex; align-items:center; justify-content:center; padding:18px; z-index:70; }
.composer { background:var(--white); border:1px solid var(--line); border-radius:22px; width:min(1000px,100%); max-height:92vh; overflow:auto; padding:26px; }
.comp-head { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:22px; }
.comp-title { font-family:'Fraunces',serif; font-weight:500; font-size:22px; margin:6px 0 0; line-height:1.2; letter-spacing:-0.01em; }
.comp-body { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
.comp-left { display:flex; flex-direction:column; gap:14px; }

.li-card { background:var(--paper); border:1px solid var(--line); border-radius:14px; padding:18px; margin-top:10px; }
.li-top { display:flex; gap:11px; align-items:flex-start; margin-bottom:14px; }
.ava-mini { width:44px; height:44px; border-radius:50%; background:var(--blue) center/cover; display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:16px; color:#fff; flex:none; }
.li-meta { flex:1; }
.li-name { font-weight:600; font-size:15px; display:flex; align-items:center; gap:6px; }
.li-first { color:var(--dim); font-weight:400; font-size:12px; }
.li-role { color:var(--mut); font-size:12.5px; }
.li-time { color:var(--dim); font-size:11.5px; }
.li-in { color:var(--blue); }
.li-text { white-space:pre-wrap; line-height:1.55; font-size:14.5px; color:var(--ink); }
.li-cat { margin-top:12px; }
.li-react { display:flex; gap:18px; align-items:center; margin-top:16px; padding-top:12px; border-top:1px solid var(--line); color:var(--mut); font-size:13px; }
.li-emos { width:22px; height:22px; border-radius:50%; background:var(--blue); color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:14px; }

.foot { border-top:1px solid var(--line); margin-top:88px; background:var(--paper); }
.foot-grid { max-width:1120px; margin:0 auto; padding:44px 26px 26px; display:grid; grid-template-columns:1.2fr 0.9fr 0.9fr; gap:30px; }
.foot-tag { font-family:'Fraunces',serif; font-style:italic; color:var(--mut); font-size:16px; margin:12px 0 0; }
.foot-col { display:flex; flex-direction:column; gap:9px; align-items:flex-start; }
.foot-h { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--dim); margin-bottom:4px; }
.foot-link { background:none; border:none; padding:0; color:var(--mut); font-size:14px; text-align:left; }
.foot-link:hover { color:var(--blue); }
.foot-base { max-width:1120px; margin:0 auto; padding:16px 26px 28px; border-top:1px solid var(--line); color:var(--dim); font-size:13px; display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap; }
.lang-toggle { display:inline-flex; border:1px solid var(--line); border-radius:999px; overflow:hidden; background:var(--white); }
.lang-toggle button { border:none; background:none; padding:6px 14px; font-size:12.5px; font-weight:600; color:var(--mut); font-family:'IBM Plex Mono',monospace; }
.lang-toggle button:hover { color:var(--blue); }
.lang-toggle .lang-on { background:var(--blue); color:#fff; }

@media (max-width:880px) {
  .hero { padding-top:56px; padding-bottom:56px; }
  .cards3, .kb-grid { grid-template-columns:1fr; }
  .band-in { grid-template-columns:1fr; padding:30px; }
  .ctrl { padding:26px; } .ctrl-grid { grid-template-columns:1fr; }
  .contact { grid-template-columns:1fr; }
  .news-grid { grid-template-columns:1fr; }
  .comp-body { grid-template-columns:1fr; }
  .prof-grid { grid-template-columns:1fr; }
  .row2 { grid-template-columns:1fr; }
  .foot-grid { grid-template-columns:1fr; }
  .sect { padding-top:60px; }
  .tabbar { position:static; }
  .tabbtn { flex-direction:column; gap:4px; padding:10px 6px; font-size:11px; }
  .cal-cell { min-height:52px; padding:6px; }
  .flow { flex-direction:column; }
  .flow-arrow { transform:rotate(90deg); padding:4px 0; }
  .f-seg { max-width:100%; }
  .bk { display:none; }
}
@media (prefers-reduced-motion:reduce) {
  .news-card.skeleton { animation:none; }
  .btn-blue:hover, .news-card:hover, .f-seg:hover { transform:none; }
  .menu, .menu-item, .burger-bar { transition:none; }
}
`;
