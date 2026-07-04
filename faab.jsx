import React, { useState, useEffect, useRef } from 'react';

/*
  FAAB - Founder as a Brand
  Multi-channel personal branding engine (LinkedIn, Instagram, X, Facebook).
  Light, blue-dominant. i18n NL default / EN toggle. Persistent profiles (simple login).
  Views: intro splash, home, channel pages, onboarding, CMS (vertical tabs).
  AI via Anthropic API (proxied outside the artifact). Zero em/en-dashes anywhere.
*/

// ---------- Icons ----------
const I = {
  user: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>),
  users: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 8a3 3 0 1 0 6 0a3 3 0 0 0-6 0"/><path d="M4 21v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1"/><path d="M16 4.3a3 3 0 0 1 0 5.4"/><path d="M19 15a4.5 4.5 0 0 1 2 4v2"/></svg>),
  target: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>),
  radar: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18.364 5.636a9 9 0 1 0 1.417 11.315"/><path d="M15.536 8.464a5 5 0 1 0 .719 6.44"/><path d="M12 12l6-3"/></svg>),
  megaphone: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 8a3 3 0 0 1 0 6"/><path d="M10 8v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-5"/><path d="M12 8h0l4.5-3.5A1 1 0 0 1 18 5.3v11.4a1 1 0 0 1-1.5.8L12 14H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"/></svg>),
  message: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8 9h8M8 13h5"/><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"/></svg>),
  coin: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M14.8 9A2 2 0 0 0 13 8h-2a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4h-2a2 2 0 0 1-1.8-1"/><path d="M12 6v2m0 8v2"/></svg>),
  heart: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572"/></svg>),
  send: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>),
  calendar: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M16 3v4M8 3v4M4 11h16"/></svg>),
  tag: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/><path d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592-5.592a2.41 2.41 0 0 0 0-3.408l-7.71-7.71A2 2 0 0 0 11.172 3H6a3 3 0 0 0-3 3"/></svg>),
  spark: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/><path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>),
  plus: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>),
  x: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>),
  upload: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M7 9l5-5 5 5M12 4v12"/></svg>),
  copy: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>),
  arrow: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>),
  refresh: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 11a8 8 0 1 0-2.3 5.6"/><path d="M20 5v6h-6"/></svg>),
  check: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12l5 5L20 7"/></svg>),
  edit: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3"/><path d="M13.5 6.5l3 3"/></svg>),
  trash: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/></svg>),
  link: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 15l6-6"/><path d="M11 6l.5-.5a4 4 0 0 1 6 6l-.5.5"/><path d="M13 18l-.5.5a4 4 0 0 1-6-6l.5-.5"/></svg>),
  shield: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>),
  eye: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0"/><path d="M21 12c-2.4 4-5.4 6-9 6s-6.6-2-9-6c2.4-4 5.4-6 9-6s6.6 2 9 6"/></svg>),
  mail: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>),
  globe: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/></svg>),
  doc: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M9 13h6M9 17h6"/></svg>),
  trend: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>),
  image: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M4 19l5-5 3 3 4-4 4 4"/></svg>),
  palette: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 21a9 9 0 1 1 9-9c0 2-1.5 3-3 3h-2a2 2 0 0 0-2 2c0 .6.2 1 .5 1.5c.3.4.5.8.5 1.3c0 .7-.6 1.2-1.3 1.2z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16.5" cy="10.5" r="1"/></svg>),
  chevL: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 6l-6 6 6 6"/></svg>),
  chevR: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 6l6 6-6 6"/></svg>),
  chevD: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9l6 6 6-6"/></svg>),
  logout: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2"/><path d="M9 12h12l-3-3m0 6l3-3"/></svg>),
  linkedin: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z"/></svg>),
  instagram: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.5"/><circle cx="16.7" cy="7.3" r="0.8" fill="currentColor" stroke="none"/></svg>),
  xsocial: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M17.75 3h3.07l-6.71 7.67L22 21h-6.18l-4.84-6.33L5.44 21H2.36l7.18-8.21L2 3h6.34l4.37 5.78L17.75 3zm-1.08 16.16h1.7L7.42 4.74H5.6l11.07 14.42z"/></svg>),
  facebook: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M13.5 21v-7h2.6l.4-3h-3V9.1c0-.87.24-1.46 1.5-1.46h1.6V4.95c-.28-.04-1.23-.12-2.34-.12c-2.32 0-3.9 1.41-3.9 4v2.17H7.75v3h2.61v7h3.14z"/></svg>),
};

// ---------- Brand logo ----------
// AA peak mark (from the supplied logo sheet) and the full lockup with subline.
/* Exact logo paths, traced from the supplied artwork (potrace, IoU 99%+) */
const MARK_D = "M0 784 L431.8 0 L857.7 784 L726.8 784 L431.3 239.4 L134.8 784 Z M857.7 784 L1289.8 3.4 L1719.8 784 L1589.7 784 L1290.4 234.7 L989.1 784 Z";
const WORD_D = "M11684 7320 c-172 -25 -353 -125 -486 -269 -71 -76 -84 -97 -273 -422 -55 -95 -111 -191 -124 -213 -13 -23 -32 -56 -42 -73 -43 -76 -205 -350 -238 -405 -9 -15 -52 -88 -96 -164 -44 -75 -91 -156 -105 -179 -14 -23 -77 -131 -140 -240 -63 -109 -124 -213 -135 -231 -11 -18 -58 -98 -105 -179 -47 -81 -95 -163 -108 -183 -12 -21 -27 -47 -32 -59 -5 -12 -31 -57 -58 -100 -27 -43 -84 -140 -128 -216 -43 -76 -86 -151 -95 -165 -9 -15 -25 -43 -36 -62 -11 -19 -55 -93 -98 -165 -79 -131 -159 -268 -429 -735 -82 -140 -178 -304 -216 -365 -37 -60 -119 -200 -183 -310 -63 -110 -140 -240 -170 -290 -31 -49 -109 -182 -175 -295 -66 -113 -175 -299 -242 -415 -112 -191 -291 -498 -585 -1005 -59 -102 -129 -222 -156 -267 -48 -80 -59 -116 -39 -128 5 -3 220 -5 477 -5 545 0 479 -16 570 143 32 56 68 117 80 136 13 20 31 51 40 68 20 36 207 357 238 409 65 107 122 205 143 244 14 25 33 57 43 72 11 14 19 29 19 32 0 4 19 37 85 148 5 9 37 63 70 119 33 57 69 117 80 135 11 17 58 98 105 178 47 81 92 159 101 174 25 41 241 411 279 477 38 66 172 296 240 410 41 69 237 405 347 593 65 112 127 218 138 236 11 18 47 79 80 135 33 56 67 115 76 129 57 94 205 346 345 587 327 561 399 686 417 718 10 17 55 95 101 172 47 77 155 263 243 413 87 149 177 305 200 345 77 131 125 163 234 155 70 -5 102 -25 142 -89 38 -60 169 -283 306 -519 62 -107 141 -242 177 -300 35 -58 71 -120 81 -137 79 -142 316 -549 398 -683 56 -91 128 -212 160 -270 32 -58 98 -170 145 -250 48 -80 120 -201 160 -270 40 -69 123 -210 185 -315 62 -104 160 -271 217 -370 214 -371 511 -874 595 -1010 31 -49 96 -162 146 -250 49 -88 167 -290 262 -450 95 -159 200 -339 234 -400 35 -60 100 -173 146 -250 46 -77 144 -246 219 -375 74 -129 146 -248 160 -265 l24 -30 464 -3 c482 -3 502 -2 512 23 5 13 -105 215 -241 443 -12 20 -27 46 -32 57 -6 11 -42 72 -80 135 -39 63 -122 205 -186 315 -64 110 -120 207 -125 215 -5 8 -24 41 -42 73 -18 33 -42 73 -53 91 -11 18 -47 79 -80 135 -33 56 -69 118 -80 136 -11 19 -73 126 -138 237 -65 112 -123 210 -128 218 -41 65 -137 228 -235 400 -122 212 -428 729 -494 835 -21 33 -84 141 -140 240 -57 99 -164 284 -240 410 -170 286 -267 451 -585 995 -60 102 -154 262 -210 355 -56 94 -149 251 -205 350 -57 99 -157 270 -223 380 -66 110 -149 252 -185 315 -283 500 -369 603 -598 718 -144 72 -461 106 -690 72z M28941 7316 c-14 -17 -15 -765 0 -803 l9 -23 2452 0 c1486 0 2488 -4 2543 -10 606 -64 1035 -523 1035 -1105 -1 -618 -397 -1060 -1030 -1150 -91 -13 -440 -15 -2552 -15 -2421 0 -2447 0 -2458 -20 -16 -30 -13 -4012 3 -4034 14 -20 5083 -25 5410 -6 326 20 671 115 895 246 384 224 661 525 815 884 16 36 32 74 37 85 15 32 55 154 78 235 50 180 57 242 57 510 0 304 -11 385 -87 630 -23 78 -75 199 -110 262 -21 37 -38 70 -38 72 0 27 -186 285 -272 378 -122 133 -464 377 -578 413 -31 10 -25 46 13 72 77 53 293 291 364 401 40 63 146 272 158 312 4 14 11 30 15 35 4 6 19 51 33 100 240 824 -6 1632 -651 2133 -249 193 -506 304 -887 384 l-110 23 -2566 3 c-2216 2 -2568 1 -2578 -12z m5224 -3956 c412 -20 673 -133 928 -400 386 -405 429 -1062 97 -1502 -197 -260 -476 -418 -827 -468 -170 -24 -4567 -32 -4591 -8 -21 21 -17 2352 4 2372 18 19 4025 24 4389 6z M22615 7314 c-231 -54 -349 -115 -473 -241 -83 -85 -134 -165 -469 -743 -50 -85 -143 -245 -208 -355 -65 -110 -155 -263 -200 -340 -45 -77 -129 -219 -185 -315 -57 -96 -157 -267 -223 -380 -162 -279 -113 -194 -400 -680 -44 -74 -143 -243 -220 -375 -77 -132 -147 -252 -156 -267 -89 -149 -119 -199 -139 -238 -14 -25 -30 -52 -37 -60 -6 -8 -42 -69 -79 -135 -83 -148 -69 -125 -163 -279 -105 -173 -108 -179 -263 -446 -74 -128 -144 -248 -155 -266 -11 -18 -74 -126 -140 -240 -66 -114 -129 -222 -140 -240 -31 -50 -118 -197 -131 -219 -24 -43 -54 -94 -114 -195 -35 -58 -72 -121 -82 -140 -10 -19 -30 -53 -43 -75 -14 -22 -30 -49 -35 -60 -5 -11 -20 -37 -32 -57 -46 -75 -154 -259 -275 -468 -68 -118 -136 -232 -149 -252 -15 -20 -24 -47 -22 -60 l3 -23 470 -3 c259 -1 479 0 490 3 21 5 50 45 98 135 16 30 34 61 39 68 6 7 18 25 27 41 27 47 214 370 238 409 12 20 29 51 37 67 9 17 45 77 80 135 35 58 126 211 201 340 75 129 174 298 220 375 46 77 125 212 176 300 51 88 127 219 169 290 43 72 130 220 195 330 65 110 146 247 180 305 35 58 77 131 94 163 17 32 87 151 155 265 68 114 215 362 327 552 111 190 281 478 377 640 96 162 223 378 282 480 95 166 241 415 553 945 226 385 235 395 344 395 105 0 125 -21 291 -310 71 -124 173 -299 227 -390 55 -91 155 -262 223 -380 130 -226 219 -377 412 -700 64 -107 134 -226 155 -265 21 -38 77 -135 125 -215 48 -80 139 -235 203 -345 63 -110 140 -240 171 -290 30 -49 135 -229 233 -399 98 -170 188 -325 200 -345 13 -20 31 -50 40 -68 30 -53 171 -293 218 -368 24 -38 114 -193 202 -344 188 -326 178 -309 258 -441 35 -58 98 -166 141 -240 65 -112 131 -224 303 -512 9 -15 70 -120 136 -234 66 -114 129 -222 140 -240 11 -18 34 -56 51 -86 47 -80 18 -75 454 -80 493 -6 574 -2 578 29 3 21 -66 145 -315 568 -55 94 -138 233 -183 310 -45 77 -90 152 -99 167 -9 15 -61 104 -116 199 -55 94 -110 188 -122 208 -12 20 -38 63 -58 96 -19 33 -45 77 -58 97 -12 20 -78 134 -147 253 -69 119 -132 227 -140 240 -8 13 -69 117 -135 231 -66 114 -132 228 -147 253 -16 25 -45 75 -65 109 -21 35 -47 78 -57 95 -11 18 -24 41 -30 52 -20 36 -127 217 -219 370 -50 83 -98 164 -107 180 -9 17 -28 48 -41 71 -13 22 -51 86 -84 143 -33 56 -65 110 -70 119 -6 9 -37 62 -69 117 -32 55 -69 116 -81 135 -13 19 -34 55 -48 80 -23 43 -46 83 -86 153 -10 17 -39 66 -65 107 -25 41 -50 85 -56 98 -5 12 -49 87 -97 165 -47 78 -95 158 -105 177 -10 19 -29 52 -41 72 -12 20 -74 126 -137 234 -63 109 -126 216 -140 239 -39 65 -263 451 -283 488 -10 17 -46 79 -82 137 -35 58 -90 149 -122 204 -32 54 -66 113 -77 130 -10 17 -34 59 -52 92 -18 34 -46 83 -63 110 -16 27 -55 92 -85 146 -143 246 -309 388 -550 470 -59 20 -486 37 -551 22z M1330 7290 c-209 -32 -345 -80 -549 -196 -326 -184 -575 -584 -627 -1004 -17 -146 -21 -5858 -4 -5891 10 -18 25 -19 405 -19 216 0 396 4 399 9 3 5 6 671 6 1481 1 959 4 1479 11 1491 9 18 65 19 1837 19 1564 0 1830 2 1848 14 11 8 38 41 60 73 22 32 101 144 174 248 74 105 157 224 186 265 29 41 71 101 93 133 45 63 51 91 22 106 -12 7 -732 10 -2111 11 -1409 0 -2097 3 -2105 10 -24 20 -11 1835 13 1935 51 204 154 333 338 420 146 70 -18 66 2868 64 2098 -2 2595 0 2611 10 11 7 41 42 65 77 25 36 81 115 125 177 44 62 123 173 175 247 85 121 148 211 196 278 15 21 15 24 -1 42 -27 29 -5844 29 -6035 0z";
const SUB_D = "M2335 1224 c-98 -23 -149 -41 -200 -68 -398 -210 -355 -857 67 -1008 90 -33 301 -33 401 0 365 117 477 634 199 912 -115 115 -341 194 -467 164z m187 -125 c378 -130 423 -651 73 -836 -195 -102 -472 -5 -571 200 -165 345 156 753 498 636z M17464 1201 c-161 -46 -243 -169 -219 -328 18 -123 104 -188 325 -247 221 -59 296 -118 288 -228 -9 -119 -85 -173 -248 -173 -117 0 -181 21 -264 88 -64 52 -65 52 -102 16 -45 -43 -43 -51 19 -100 235 -187 628 -140 707 84 35 98 22 195 -37 273 -46 61 -99 87 -293 139 -210 58 -280 111 -280 213 0 176 256 240 469 117 13 -7 28 -21 33 -29 15 -26 42 -17 66 21 l23 36 -22 24 c-91 96 -305 140 -465 94z M580 1200 c-113 -4 -253 -5 -311 -3 -104 4 -107 4 -112 -19 -3 -13 -4 -252 -3 -533 l1 -510 58 -3 57 -3 0 220 c0 186 2 222 16 235 13 13 47 16 207 17 106 0 212 1 237 2 l45 2 0 48 0 49 -240 4 c-210 4 -242 6 -252 21 -22 28 -18 347 4 368 17 18 483 18 511 1 32 -20 60 40 42 89 -7 18 -16 24 -32 23 -13 -1 -115 -5 -228 -8z M4855 1198 c-2 -7 -6 -177 -7 -378 l-3 -365 -27 -52 c-132 -249 -488 -241 -589 13 -23 57 -24 71 -29 419 l-5 360 -50 0 -50 0 0 -370 c0 -356 1 -373 23 -442 55 -177 173 -252 412 -261 215 -7 347 69 406 233 23 66 45 815 24 840 -15 19 -99 21 -105 3z M6183 1202 c-14 -9 -20 -1059 -6 -1073 4 -4 31 -5 58 -1 l50 7 1 398 c1 244 5 402 11 408 14 14 60 -6 68 -30 3 -11 50 -77 103 -145 53 -69 133 -173 177 -232 44 -58 116 -153 160 -210 44 -57 95 -124 113 -149 l33 -46 57 3 57 3 0 535 0 535 -34 3 c-19 2 -44 1 -56 -2 l-22 -6 1 -405 c1 -504 21 -483 -196 -211 -104 129 -178 227 -367 479 -96 128 -105 137 -136 137 -18 0 -39 2 -47 5 -7 3 -18 1 -25 -3z M8292 1193 c-8 -14 -11 -1015 -3 -1055 3 -18 443 -8 521 11 255 62 401 254 400 525 -1 223 -101 385 -298 485 -67 34 -138 42 -361 41 -119 -1 -224 2 -233 5 -10 4 -20 0 -26 -12z m553 -128 c295 -141 321 -607 43 -768 -99 -58 -452 -86 -478 -38 -12 23 -14 823 -2 835 4 5 90 6 192 4 178 -5 187 -6 245 -33z M10520 1201 l-155 -6 -3 -534 -2 -533 352 4 353 5 0 47 0 46 -280 6 c-344 6 -312 -14 -314 197 -2 210 -28 192 270 194 269 2 266 1 253 67 l-6 35 -97 -5 c-126 -7 -387 8 -403 24 -18 18 -23 325 -6 339 8 7 115 13 293 15 l280 4 0 49 0 49 -190 1 c-104 1 -260 -1 -345 -4z M12260 1195 c-8 -9 -13 -464 -11 -882 l1 -183 54 0 c68 0 65 -10 64 213 -2 216 -8 206 122 209 145 4 133 13 270 -195 65 -100 127 -192 135 -204 13 -20 25 -23 75 -23 72 0 80 10 43 54 -15 19 -50 69 -77 113 -28 43 -71 111 -98 151 -63 95 -62 105 10 141 237 120 233 453 -8 577 -53 28 -59 28 -240 31 -102 2 -218 4 -258 6 -41 1 -77 -2 -82 -8z m391 -98 c211 -9 318 -192 202 -344 -57 -75 -98 -88 -288 -91 -219 -5 -202 -21 -208 203 -7 247 -8 245 128 239 39 -2 113 -5 166 -7z M15656 1198 c-7 -4 -21 -26 -30 -50 -10 -24 -26 -63 -37 -88 -53 -132 -136 -326 -164 -385 -8 -16 -53 -127 -100 -245 -47 -118 -95 -232 -106 -253 -24 -45 -18 -50 61 -45 59 3 57 1 94 98 39 102 73 167 91 174 9 3 123 6 254 6 262 0 271 -2 290 -63 12 -37 40 -113 66 -175 l18 -42 69 0 c74 0 82 8 54 53 -7 12 -35 72 -61 132 -26 61 -55 128 -65 150 -10 22 -28 65 -40 95 -12 30 -28 69 -36 85 -7 17 -47 113 -88 215 -77 192 -135 332 -142 339 -7 7 -115 6 -128 -1z m116 -278 c44 -108 99 -240 135 -318 25 -56 23 -91 -5 -93 -37 -4 -378 3 -384 8 -15 8 -8 65 10 91 11 15 22 36 25 47 3 11 20 56 37 100 17 44 45 118 62 165 50 139 65 139 120 0z M20650 1200 c-13 -8 -202 -452 -374 -880 -26 -63 -53 -127 -61 -142 -24 -42 -19 -48 38 -48 68 0 74 7 131 144 25 60 50 114 56 120 13 14 452 21 502 9 37 -10 48 -28 108 -178 l36 -90 54 -3 c74 -4 75 -1 24 128 -24 63 -59 151 -76 195 -17 44 -62 145 -99 225 -63 137 -199 470 -199 489 0 27 -107 51 -140 31z m99 -212 c5 -13 18 -50 31 -83 12 -33 39 -100 61 -148 21 -48 39 -96 39 -105 0 -9 9 -30 20 -47 54 -82 29 -95 -187 -99 -224 -4 -258 9 -209 80 13 18 105 237 143 339 8 22 19 50 24 63 6 16 17 22 39 22 22 0 33 -6 39 -22z M23491 1190 c-3 -8 -6 -249 -6 -535 l0 -520 260 0 c285 0 338 8 421 64 72 50 98 102 102 207 5 126 -25 182 -130 246 -40 25 -38 60 7 88 55 34 80 90 79 180 -1 155 -81 247 -232 270 -120 18 -493 18 -501 0z m477 -99 c92 -18 156 -121 132 -211 -22 -83 -81 -130 -179 -142 -121 -14 -286 -7 -306 13 -23 22 -28 306 -6 332 15 19 273 24 359 8z m38 -476 c232 -71 179 -367 -68 -377 -156 -7 -306 2 -322 18 -24 24 -23 329 1 356 22 24 311 27 389 3z M25414 1199 c-2 -5 -7 -941 -4 -1057 0 -9 16 -12 58 -10 l57 3 3 191 c3 230 -2 221 122 224 160 4 138 16 225 -127 43 -71 84 -139 92 -153 7 -14 30 -50 51 -80 l37 -55 73 -3 c49 -2 72 1 72 9 0 15 -204 321 -230 344 -39 36 -27 68 45 114 264 171 209 537 -88 592 -66 12 -506 19 -513 8z m484 -109 c136 -30 207 -215 126 -331 -58 -83 -87 -93 -284 -97 -101 -2 -181 1 -189 7 -35 23 -44 378 -11 411 23 23 264 30 358 10z M27720 1201 c-52 -7 -53 -9 -156 -251 -31 -74 -96 -225 -144 -335 -49 -110 -109 -254 -135 -320 -26 -66 -51 -124 -56 -130 -25 -26 -9 -36 53 -33 l62 3 22 45 c34 70 71 153 79 178 13 45 55 52 299 52 123 0 232 -3 241 -6 20 -8 60 -86 91 -178 32 -92 36 -96 105 -96 62 0 80 20 44 50 -8 7 -15 17 -15 22 0 5 -20 55 -44 111 -24 56 -62 149 -86 207 -23 58 -60 146 -80 195 -21 50 -52 124 -68 165 -116 288 -139 335 -162 328 -3 0 -25 -4 -50 -7z m44 -203 c7 -13 17 -36 21 -53 9 -40 120 -306 146 -350 24 -40 20 -80 -8 -87 -10 -2 -103 -1 -208 2 l-190 5 -4 25 c-1 14 6 43 17 65 11 22 32 69 47 105 15 36 33 79 41 97 8 17 14 35 14 40 0 4 7 21 15 36 8 16 20 47 26 70 19 70 54 90 83 45z M29344 1199 c-6 -9 -9 -209 -9 -539 l0 -525 49 -3 c27 -2 53 1 57 5 7 7 12 645 6 768 -2 50 39 64 67 23 54 -78 180 -246 264 -351 53 -68 133 -174 177 -236 162 -228 157 -223 233 -212 l43 6 0 528 c0 290 -3 532 -6 537 -9 14 -92 12 -101 -1 -3 -6 -6 -191 -5 -410 3 -504 16 -492 -213 -184 -70 94 -166 221 -214 283 -85 110 -185 243 -220 291 -21 29 -111 43 -128 20z M31428 1192 c-7 -8 -9 -181 -5 -535 l5 -522 215 -3 c329 -4 481 42 584 175 251 325 97 817 -277 883 -89 15 -510 18 -522 2z m556 -131 c300 -141 324 -620 39 -764 -111 -57 -421 -89 -461 -49 -19 19 -25 814 -6 843 5 9 53 10 183 7 172 -5 178 -6 245 -37z";

const Logo = {
  mark: (p) => (
    <svg viewBox="0 0 1719.8 784" fill="currentColor" {...p}>
      <path d={MARK_D} />
    </svg>
  ),
  wordmark: (p) => (
    <svg viewBox="0 0 3636 748" fill="currentColor" {...p}>
      <g transform="translate(0,748) scale(0.1,-0.1)"><path d={WORD_D} /></g>
    </svg>
  ),
  subline: (p) => (
    <svg viewBox="0 0 3248 140" fill="currentColor" {...p}>
      <g transform="translate(0,140) scale(0.1,-0.1)"><path d={SUB_D} /></g>
    </svg>
  ),
  lockup: ({ animate, className = '', ...p }) => (
    <div className={'lockup' + (animate ? ' lockup-anim' : '') + (className ? ' ' + className : '')} {...p}>
      <svg className="lockup-word" viewBox="0 0 3636 748" fill="currentColor"><g transform="translate(0,748) scale(0.1,-0.1)"><path d={WORD_D} /></g></svg>
      <svg className="lockup-sub" viewBox="0 0 3248 140" fill="currentColor"><g transform="translate(0,140) scale(0.1,-0.1)"><path d={SUB_D} /></g></svg>
    </div>
  ),
}

// ---------- i18n ----------
const STR = {
  nl: {
    start_brand: 'Bouw je strategie', cta_how: 'Hoe het werkt',
    hero_slogan: 'Wees de woordvoerder van je merk.',
    nav_home: 'Home', nav_how: 'Hoe het werkt', nav_channels: 'Kanalen', nav_cms: 'CMS', nav_start: 'Bouw je strategie',
    eb_funnel: 'De funnel', funnel_h2a: 'Van bereik tot ambassadeurschap,', funnel_h2b: 'in vijf fasen.',
    funnel_lede: 'Elke post krijgt een plek in de klantreis: zo werkt je content gericht van eerste kennismaking naar ambassadeur.',
    eb_flow: 'Hoe het werkt', flow_h2: 'Personal branding voor founders',
    flow_lede: 'Keur posts simpelweg goed of af. Onze AI signaleert trending onderwerpen in jouw niche en zet kant-en-klare posts voor je klaar, op basis van jouw stijl, stem, persoonlijkheid en doelen.',
    eb_channels: 'Kanalen', channels_h2a: 'Jouw voice,', channels_h2b: 'afgestemd per kanaal.',
    eb_control: 'De human review', control_h2: 'Drie momenten waarop jij beslist.',
    rv1_t: 'Onderwerpkeuze', rv1_d: 'AI signaleert trending onderwerpen in jouw niche. Jij bepaalt welke doorgaan.',
    rv2_t: 'De draft', rv2_d: 'Elke post staat klaar als preview, in jouw stem. Bewerk vrij of laat staan.',
    rv3_t: 'Akkoord', rv3_d: 'Goedkeuren, aanpassen of afwijzen. Zonder jouw akkoord gaat niets live.',
    eb_contact: 'Contact', contact_h2a: 'Praat met ons over', contact_h2b: 'jouw founder-merk.',
    foot_tag: 'Founders zijn hun merk.', foot_app: 'App', foot_learn: 'Kanalen', foot_contact: 'Contact', foot_the_funnel: 'De funnel',
    lang_word: 'Taal',
    // onboarding
    ob_title: 'Start je merk', ob_ind_account: 'Account', ob_ind_channels: 'Kanalen', ob_ind_brand: 'Merk',
    ob_choice_h: 'Hoe wil je starten?',
    ob_login: 'Inloggen', ob_register: 'Registreren', ob_guest: 'Doorgaan zonder account',
    ob_guest_note: 'Zonder account blijft je merk alleen op dit apparaat bewaard.',
    ob_username: 'Gebruikersnaam', ob_password: 'Wachtwoord', ob_name: 'Naam',
    ob_auth_exists: 'Deze gebruikersnaam bestaat al. Log in.', ob_auth_wrong: 'Onjuiste gebruikersnaam of wachtwoord.',
    ob_ch_h: 'Koppel je kanalen', ob_ch_p: 'Vul per kanaal je profiel-URL of handle in. FAAB gebruikt je openbare posts en reacties als input voor je tone of voice.',
    ob_ch_ph: 'Profiel-URL of @handle',
    ob_web_h: 'Scan je website', ob_web_p: 'FAAB haalt je merk op: beschrijving, doelgroep en kleuren.',
    ob_web_ph: 'https://jouwbedrijf.nl', ob_scan: 'Scan website', ob_scanning: 'Scannen...',
    ob_scan_err: 'Scan mislukte. Controleer de URL of vul het hieronder zelf in.',
    ob_desc: 'Beschrijving van je dienst', ob_aud: 'Doelgroep', ob_colors: 'Merkkleuren', ob_logo: 'Logo',
    ob_save: 'Opslaan', ob_saving: 'Opslaan...', ob_back: 'Terug',
    ob_tone_note: 'Bij opslaan bepaalt FAAB je tone of voice uit je kanalen en merkscan. Daarna opent het CMS.',
    // cms
    cms_brand: 'Merkpersoonlijkheid', cms_strategy: 'Strategie', cms_topics: 'Onderwerpen', cms_content: 'Content', cms_schedule: 'Planning',
    cms_exit: 'Terug naar site', cms_logout: 'Uitloggen',
    b_h: 'Merkpersoonlijkheid', b_company: 'Bedrijf', b_role: 'Rol', b_name: 'Naam', b_website: 'Website',
    b_desc: 'Beschrijving', b_aud: 'Doelgroep', b_pers: 'Persoonlijkheid', b_pers_ph: 'Direct, nieuwsgierig, een tikje eigenwijs ...',
    b_colors: 'Merkkleuren', b_docs: 'Documenten', b_docs_p: 'Upload merk- of stijl-documenten (.txt, .md) als extra input.',
    b_upload_doc: 'Document uploaden', b_tone_h: 'Basistekst tone of voice', b_tone_p: 'Deze tekst stuurt alle gegenereerde content. Volledig bewerkbaar.',
    b_regen_tone: 'Hergenereer uit kanalen', b_tone_examples: 'Voorbeelden per gekoppeld kanaal', b_no_channels: 'Nog geen kanalen gekoppeld.',
    b_gen_example: 'Genereer voorbeeld', b_socials: 'Gekoppelde kanalen',
    s_h: 'Strategie per funnelfase', s_p: 'Doel en aanpak per fase. Bewerk vrij.',
    s_goal: 'Doel', s_approach: 'Aanpak', s_gen: 'Genereer strategie', s_generating: 'Genereren...',
    s_keywords: 'Keywords', s_add_kw_ph: 'Voeg een keyword toe, dan Enter', s_add: 'Toevoegen',
    t_h: 'Onderwerpen', t_p: 'Zoekvolumes en trending discussies op je keywords.',
    t_refresh: 'Onderzoek onderwerpen', t_scanning: 'Onderzoeken...', t_kw: 'Keyword / thread', t_vol: 'Zoekvolume', t_src: 'Bron', t_act: 'Actie',
    t_use: 'Gebruik', t_add_link: 'Voeg een link toe als input', t_add_link_ph: 'https://... artikel of thread', t_added: 'Toegevoegd',
    t_empty: 'Voeg eerst keywords toe bij Strategie.', t_err: 'Onderzoek mislukte. Probeer opnieuw.',
    c_h: 'Content maken', c_p: 'Genereer copy vanuit je tone of voice, per kanaal en funnelfase.',
    c_channel: 'Kanaal', c_phase: 'Funnelfase', c_angle: 'Invalshoek', c_angle_ph: 'Bijv. een les, een mening, een klantverhaal ...',
    c_subject: 'Onderwerp', c_subject_none: 'Geen (vrije post)',
    c_generate: 'Genereer copy', c_generating: 'Genereren...', c_err: 'Genereren mislukte. Probeer opnieuw.',
    c_text: 'Copy', c_text_ph: 'Je copy verschijnt hier. Vrij te bewerken.',
    c_visual: 'Beeld', c_visual_preset: 'FAAB-template', c_visual_upload: 'Eigen beeld uploaden', c_visual_none: 'Geen beeld',
    c_headline: 'Kop op beeld', c_save_draft: 'Bewaar als concept', c_saved: 'Bewaard',
    sch_h: 'Planning', sch_drafts: 'Concepten om in te plannen', sch_scheduled: 'Ingeplande posts',
    sch_none_drafts: 'Nog geen concepten. Maak content in de Content-tab.', sch_none_sched: 'Nog niets ingepland.',
    sch_schedule: 'Inplannen', sch_date: 'Datum', sch_time: 'Tijd', sch_confirm: 'Bevestig planning', sch_unschedule: 'Terug naar concepten',
    err_generic: 'Er ging iets mis. Probeer opnieuw.',
    untitled: 'Naamloos concept',
    ch_strategy: 'Strategie', ch_placements: 'Plaatsingen', ch_tone: 'Tone of voice op dit kanaal',
    ch_back: 'Alle kanalen', ch_cta: 'Start je merk op', example_word: 'Voorbeeld',
  },
  en: {
    start_brand: 'Build your strategy', cta_how: 'How it works',
    hero_slogan: 'Be the spokesperson for your brand.',
    nav_home: 'Home', nav_how: 'How it works', nav_channels: 'Channels', nav_cms: 'CMS', nav_start: 'Build your strategy',
    eb_funnel: 'The funnel', funnel_h2a: 'From reach to ambassadorship,', funnel_h2b: 'in five stages.',
    funnel_lede: 'Every post gets a place in the customer journey: your content works purposefully from first touch to ambassador.',
    eb_flow: 'How it works', flow_h2: 'Personal branding for founders',
    flow_lede: 'Simply approve or reject posts. Our AI signals trending niche topics and prepares ready made posts for you, based on your style, voice, personality and goals.',
    eb_channels: 'Channels', channels_h2a: 'Your voice,', channels_h2b: 'tuned per channel.',
    eb_control: 'The human review', control_h2: 'Three moments where you decide.',
    rv1_t: 'Topic selection', rv1_d: 'AI signals trending topics in your niche. You decide which ones go ahead.',
    rv2_t: 'The draft', rv2_d: 'Every post is ready as a preview, in your voice. Edit freely or leave it.',
    rv3_t: 'Approval', rv3_d: 'Approve, adjust or reject. Nothing goes live without your sign-off.',
    eb_contact: 'Contact', contact_h2a: 'Talk to us about', contact_h2b: 'your founder brand.',
    foot_tag: 'Founders are their brand.', foot_app: 'App', foot_learn: 'Channels', foot_contact: 'Contact', foot_the_funnel: 'The funnel',
    lang_word: 'Language',
    ob_title: 'Start your brand', ob_ind_account: 'Account', ob_ind_channels: 'Channels', ob_ind_brand: 'Brand',
    ob_choice_h: 'How do you want to start?',
    ob_login: 'Log in', ob_register: 'Register', ob_guest: 'Continue without account',
    ob_guest_note: 'Without an account your brand is only saved on this device.',
    ob_username: 'Username', ob_password: 'Password', ob_name: 'Name',
    ob_auth_exists: 'This username already exists. Log in.', ob_auth_wrong: 'Wrong username or password.',
    ob_ch_h: 'Connect your channels', ob_ch_p: 'Enter your profile URL or handle per channel. FAAB uses your public posts and comments as input for your tone of voice.',
    ob_ch_ph: 'Profile URL or @handle',
    ob_web_h: 'Scan your website', ob_web_p: 'FAAB pulls your brand: description, audience and colors.',
    ob_web_ph: 'https://yourcompany.com', ob_scan: 'Scan website', ob_scanning: 'Scanning...',
    ob_scan_err: 'Scan failed. Check the URL or fill it in below yourself.',
    ob_desc: 'Description of your service', ob_aud: 'Target audience', ob_colors: 'Brand colors', ob_logo: 'Logo',
    ob_save: 'Save', ob_saving: 'Saving...', ob_back: 'Back',
    ob_tone_note: 'On save FAAB derives your tone of voice from your channels and brand scan. The CMS then opens.',
    cms_brand: 'Brand personality', cms_strategy: 'Strategy', cms_topics: 'Topics', cms_content: 'Content', cms_schedule: 'Schedule',
    cms_exit: 'Back to site', cms_logout: 'Log out',
    b_h: 'Brand personality', b_company: 'Company', b_role: 'Role', b_name: 'Name', b_website: 'Website',
    b_desc: 'Description', b_aud: 'Audience', b_pers: 'Personality', b_pers_ph: 'Direct, curious, a bit contrarian ...',
    b_colors: 'Brand colors', b_docs: 'Documents', b_docs_p: 'Upload brand or style documents (.txt, .md) as extra input.',
    b_upload_doc: 'Upload document', b_tone_h: 'Tone of voice base text', b_tone_p: 'This text drives all generated content. Fully editable.',
    b_regen_tone: 'Regenerate from channels', b_tone_examples: 'Examples per connected channel', b_no_channels: 'No channels connected yet.',
    b_gen_example: 'Generate example', b_socials: 'Connected channels',
    s_h: 'Strategy per funnel stage', s_p: 'Goal and approach per stage. Edit freely.',
    s_goal: 'Goal', s_approach: 'Approach', s_gen: 'Generate strategy', s_generating: 'Generating...',
    s_keywords: 'Keywords', s_add_kw_ph: 'Add a keyword, then Enter', s_add: 'Add',
    t_h: 'Topics', t_p: 'Search volumes and trending discussions on your keywords.',
    t_refresh: 'Research topics', t_scanning: 'Researching...', t_kw: 'Keyword / thread', t_vol: 'Search volume', t_src: 'Source', t_act: 'Action',
    t_use: 'Use', t_add_link: 'Add a link as input', t_add_link_ph: 'https://... article or thread', t_added: 'Added',
    t_empty: 'Add keywords in Strategy first.', t_err: 'Research failed. Try again.',
    c_h: 'Create content', c_p: 'Generate copy from your tone of voice, per channel and funnel stage.',
    c_channel: 'Channel', c_phase: 'Funnel stage', c_angle: 'Angle', c_angle_ph: 'E.g. a lesson, an opinion, a customer story ...',
    c_subject: 'Subject', c_subject_none: 'None (free post)',
    c_generate: 'Generate copy', c_generating: 'Generating...', c_err: 'Generation failed. Try again.',
    c_text: 'Copy', c_text_ph: 'Your copy appears here. Edit freely.',
    c_visual: 'Visual', c_visual_preset: 'FAAB template', c_visual_upload: 'Upload own visual', c_visual_none: 'No visual',
    c_headline: 'Headline on visual', c_save_draft: 'Save as draft', c_saved: 'Saved',
    sch_h: 'Schedule', sch_drafts: 'Drafts to schedule', sch_scheduled: 'Scheduled posts',
    sch_none_drafts: 'No drafts yet. Create content in the Content tab.', sch_none_sched: 'Nothing scheduled yet.',
    sch_schedule: 'Schedule', sch_date: 'Date', sch_time: 'Time', sch_confirm: 'Confirm schedule', sch_unschedule: 'Back to drafts',
    err_generic: 'Something went wrong. Try again.',
    untitled: 'Untitled draft',
    ch_strategy: 'Strategy', ch_placements: 'Placements', ch_tone: 'Tone of voice on this channel',
    ch_back: 'All channels', ch_cta: 'Start your brand on', example_word: 'Example',
  },
};
const MONTHS = {
  nl: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
const WD = { nl: ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'], en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] };

// ---------- Funnel (with icons) ----------
const FUNNEL = [
  { id: 'reach', n: '01', ic: I.megaphone, t: { nl: 'Bereik', en: 'Reach' }, d: { nl: 'Kom in beeld bij de juiste mensen.', en: 'Get in front of the right people.' }, intent: 'maximize reach and get discovered by new people', j: { nl: 'Nieuwe mensen ontdekken je. In deze fase draait alles om zichtbaarheid: herkenbare, deelbare posts die je naam in de tijdlijn van je doelgroep zetten.', en: 'New people discover you. This stage is all about visibility: recognizable, shareable posts that put your name in your audience\u0027s timeline.' }, c: '#6BA3E0', w: 100 },
  { id: 'engagement', n: '02', ic: I.message, t: { nl: 'Interactie', en: 'Engagement' }, d: { nl: 'Zet views om in gesprek.', en: 'Turn views into conversation.' }, intent: 'spark comments, replies and conversation', j: { nl: 'Kijkers worden deelnemers. Je posts nodigen uit tot reacties en gesprek, en elk gesprek vergroot je bereik en geloofwaardigheid.', en: 'Viewers become participants. Your posts invite comments and conversation, and every conversation grows your reach and credibility.' }, c: '#3E86D6', w: 84 },
  { id: 'followers', n: '03', ic: I.users, t: { nl: 'Volgers', en: 'Followers' }, d: { nl: 'Bouw een publiek dat terugkomt.', en: 'Build an audience that returns.' }, intent: 'give a clear reason to follow and come back', j: { nl: 'Wie vaker waarde ziet, wil niets meer missen. Consistentie en herkenbaarheid zetten losse kijkers om in vaste volgers.', en: 'Whoever sees value repeatedly does not want to miss out. Consistency and recognizability turn loose viewers into loyal followers.' }, c: '#0A66C2', w: 68 },
  { id: 'revenue', n: '04', ic: I.coin, t: { nl: 'Omzet', en: 'Revenue' }, d: { nl: 'Zet vertrouwen om in pipeline.', en: 'Turn trust into pipeline.' }, intent: 'build trust that softly leads to inbound and sales', j: { nl: 'Vertrouwen wordt omzet. Volgers die je expertise kennen, veranderen in aanvragen en klanten zodra je aanbod voorbijkomt.', en: 'Trust becomes revenue. Followers who know your expertise turn into inquiries and clients the moment your offer passes by.' }, c: '#0B4E96', w: 52 },
  { id: 'ambassadorship', n: '05', ic: I.heart, t: { nl: 'Ambassadeurschap', en: 'Ambassadorship' }, d: { nl: 'Volgers verspreiden je merk.', en: 'Followers carry your brand.' }, intent: 'make existing fans want to share and advocate', j: { nl: 'Klanten en fans dragen je merk verder. Ze delen, taggen en bevelen aan, en brengen zo de volgende lichting bereik binnen.', en: 'Clients and fans carry your brand onward. They share, tag and recommend, bringing in the next wave of reach.' }, c: '#06356C', w: 38 },
];
const phaseById = (id) => FUNNEL.find((f) => f.id === id) || FUNNEL[0];

// ---------- Userflow ----------
const USERFLOW = [
  { k: 'founder', ic: I.user, t: { nl: 'Founderprofiel', en: 'Founder profile' }, d: { nl: 'Je stem, stijl en merk als basis voor alles.', en: 'Your voice, style and brand as the base for everything.' } },
  { k: 'strategy', ic: I.target, t: { nl: 'Strategie', en: 'Strategy' }, d: { nl: 'Doel en aanpak per funnelfase, door jou bijgestuurd.', en: 'Goal and approach per funnel stage, steered by you.' } },
  { k: 'topics', ic: I.radar, t: { nl: 'Actuele onderwerpen', en: 'Current topics' }, d: { nl: 'Trending discussies en zoekvolumes op jouw thema\u0027s.', en: 'Trending discussions and search volumes on your themes.' } },
  { k: 'posting', ic: I.calendar, t: { nl: 'Posting', en: 'Posting' }, d: { nl: 'Posts in jouw stem. Jij keurt goed en plant in.', en: 'Posts in your voice. You approve and schedule.' } },
];

// ---------- Channels ----------
const CHANNELS = [
  {
    id: 'linkedin', name: 'LinkedIn', ic: I.linkedin, c: '#0A66C2',
    strat: {
      nl: 'LinkedIn is het thuiskanaal van de founder als merk. Hier bouw je autoriteit met meningen op nieuws, geleerde lessen en zichtbare expertise. De eerste twee regels beslissen alles: schrijf hook-first, houd een idee per post en nodig expliciet uit tot reactie. Ritme wint: twee tot drie posts per week, plus dagelijks reageren op anderen in je niche.',
      en: 'LinkedIn is the home channel of the founder as a brand. Build authority with takes on news, lessons learned and visible expertise. The first two lines decide everything: write hook-first, keep one idea per post and explicitly invite comments. Rhythm wins: two to three posts a week, plus daily commenting on others in your niche.',
    },
    placements: {
      nl: ['Timeline tekstpost', 'Documentcarrousel (PDF)', 'Video', 'Peiling', 'Pulse-artikel / nieuwsbrief'],
      en: ['Timeline text post', 'Document carousel (PDF)', 'Video', 'Poll', 'Pulse article / newsletter'],
    },
    tone: {
      nl: 'Professioneel maar persoonlijk, in de ik-vorm. Kort van zin, concreet, met een duidelijke mening. Geen jargon, geen corporate wij-vorm.',
      en: 'Professional but personal, first person. Short sentences, concrete, with a clear opinion. No jargon, no corporate we-voice.',
    },
    ex: {
      reach: { nl: 'De meeste founders posten over hun product. Klanten kopen het verhaal erachter. Dit is het onze.', en: 'Most founders post about their product. Customers buy the story behind it. This is ours.' },
      engagement: { nl: 'Onpopulaire mening: je website zegt minder over je merk dan je laatste tien LinkedIn-reacties. Eens of oneens?', en: 'Unpopular opinion: your website says less about your brand than your last ten LinkedIn comments. Agree or disagree?' },
      followers: { nl: 'Elke week deel ik een les uit het bouwen van ons bedrijf. Deze week: waarom we nee zeiden tegen onze grootste klant.', en: 'Every week I share one lesson from building our company. This week: why we said no to our biggest client.' },
      revenue: { nl: 'Drie klanten vroegen ons deze maand hetzelfde. Dus hebben we er een dienst van gemaakt. Zo werkt het.', en: 'Three clients asked us the same thing this month. So we turned it into a service. Here is how it works.' },
      ambassadorship: { nl: 'Dit team bouwde in negentig dagen wat anderen in een jaar doen. Tag iemand die dit verdient te zien.', en: 'This team built in ninety days what others do in a year. Tag someone who deserves to see this.' },
    },
    sample: { nl: 'Onpopulaire mening: je founderprofiel verslaat je bedrijfspagina. Elke week weer.', en: 'Unpopular opinion: your founder profile beats your company page. Every single week.' },
  },
  {
    id: 'instagram', name: 'Instagram', ic: I.instagram, c: '#C13584',
    strat: {
      nl: 'Instagram maakt je merk menselijk. Hier laat je de founder achter het bedrijf zien: behind-the-scenes, het team, mijlpalen en visuele storytelling. Reels dragen het bereik, carrousels dragen de diepgang, Stories dragen de band. De feed is je etalage: consistente stijl in kleur en toon herkent men in een halve seconde.',
      en: 'Instagram humanizes your brand. Show the founder behind the company: behind-the-scenes, the team, milestones and visual storytelling. Reels carry reach, carousels carry depth, Stories carry the bond. The feed is your storefront: a consistent style in color and tone is recognized in half a second.',
    },
    placements: {
      nl: ['Reel', 'Carrouselpost', 'Story', 'Feedpost (foto of video)'],
      en: ['Reel', 'Carousel post', 'Story', 'Feed post (photo or video)'],
    },
    tone: {
      nl: 'Warm, visueel en dichtbij. Kortere zinnen dan op LinkedIn, meer emotie, af en toe een emoji. Caption opent sterk, want de rest klapt in.',
      en: 'Warm, visual and close. Shorter sentences than LinkedIn, more emotion, an occasional emoji. The caption opens strong, the rest folds away.',
    },
    ex: {
      reach: { nl: 'Dag 1 vs dag 400 van ons bedrijf. Zelfde missie, ander kantoor.', en: 'Day 1 vs day 400 of our company. Same mission, different office.' },
      engagement: { nl: 'Welke kies jij: sneller groeien of rustiger bouwen? Stem in de comments.', en: 'Which one do you pick: grow faster or build calmer? Vote in the comments.' },
      followers: { nl: 'Elke vrijdag: een blik achter de schermen bij het bouwen van ons merk. Volg mee.', en: 'Every Friday: a look behind the scenes of building our brand. Follow along.' },
      revenue: { nl: 'Van aanvraag tot resultaat in vier stappen. Swipe voor hoe we dat aanpakken.', en: 'From request to result in four steps. Swipe to see how we do it.' },
      ambassadorship: { nl: 'Onze klanten zeggen het mooier dan wij. Deel dit met iemand die dit nodig heeft.', en: 'Our clients say it better than we do. Share this with someone who needs it.' },
    },
    sample: { nl: 'Dag 1 vs dag 400. Zelfde missie, ander verhaal. Swipe.', en: 'Day 1 vs day 400. Same mission, different story. Swipe.' },
  },
  {
    id: 'x', name: 'X', ic: I.xsocial, c: '#171717',
    strat: {
      nl: 'X is het snelste kanaal: hier reageer je op nieuws terwijl het nog nieuws is en bouw je een reputatie met scherpe, korte gedachten. Een sterke one-liner doet meer dan een lang betoog; threads gebruik je voor de uitwerking. Wees vroeg, wees stellig en ga het gesprek aan in de replies, daar wordt het volgen verdiend.',
      en: 'X is the fastest channel: react to news while it is still news and build a reputation with sharp, short thoughts. A strong one-liner beats a long argument; use threads for the build-out. Be early, be opinionated and join the conversation in the replies, that is where follows are earned.',
    },
    placements: {
      nl: ['Timeline post', 'Thread', 'Video', 'Quote-post'],
      en: ['Timeline post', 'Thread', 'Video', 'Quote post'],
    },
    tone: {
      nl: 'Direct, puntig en met durf. Geen opwarmers, geen hashtag-stapels. Elke post kan op zichzelf staan.',
      en: 'Direct, punchy and daring. No warm-ups, no hashtag piles. Every post can stand on its own.',
    },
    ex: {
      reach: { nl: 'Je hebt geen contentkalender nodig. Je hebt een mening nodig.', en: 'You do not need a content calendar. You need an opinion.' },
      engagement: { nl: 'Founders: wat was je duurste fout onder de 1000 euro? Ik begin.', en: 'Founders: what was your most expensive mistake under 1000 dollars? I will start.' },
      followers: { nl: 'Ik bouw in het openbaar aan ons bedrijf. Alles wat werkt en niet werkt deel ik hier.', en: 'Building our company in public. Everything that works and does not work gets shared here.' },
      revenue: { nl: 'We hebben dit kwartaal 3 diensten geschrapt en groeien sneller dan ooit. Thread over focus:', en: 'We cut 3 services this quarter and grow faster than ever. A thread on focus:' },
      ambassadorship: { nl: 'De beste marketing is een klant die het doorvertelt. RT als je dit ook zo bouwt.', en: 'The best marketing is a client who passes it on. RT if you build like this too.' },
    },
    sample: { nl: 'Je hebt geen contentkalender nodig. Je hebt een mening nodig.', en: 'You do not need a content calendar. You need an opinion.' },
  },
  {
    id: 'facebook', name: 'Facebook', ic: I.facebook, c: '#1877F2',
    strat: {
      nl: 'Facebook is het gemeenschapskanaal: lokaal bereik, groepen en een publiek dat verhalen leest in plaats van scant. Hier werken langere, persoonlijke verhalen, mijlpalen en vragen aan je community. Groepen rond je vakgebied zijn de verborgen groeimotor: wees daar behulpzaam zonder te verkopen.',
      en: 'Facebook is the community channel: local reach, groups and an audience that reads stories instead of scanning. Longer personal stories, milestones and questions to your community work here. Groups around your field are the hidden growth engine: be helpful there without selling.',
    },
    placements: {
      nl: ['Timeline post (tekst of foto)', 'Video', 'Story', 'Reel', 'Evenement of livesessie'],
      en: ['Timeline post (text or photo)', 'Video', 'Story', 'Reel', 'Event or live session'],
    },
    tone: {
      nl: 'Verhalend en toegankelijk. Iets langer mag, zolang het persoonlijk blijft. Schrijf zoals je het aan een bekende zou vertellen.',
      en: 'Narrative and approachable. A bit longer is fine, as long as it stays personal. Write like you would tell it to someone you know.',
    },
    ex: {
      reach: { nl: 'Vijf jaar geleden begon dit bedrijf aan een keukentafel. Vandaag een nieuwe mijlpaal. Het hele verhaal:', en: 'Five years ago this company started at a kitchen table. Today a new milestone. The full story:' },
      engagement: { nl: 'Ondernemers hier: wat is het beste advies dat je ooit kreeg? De reacties worden goud.', en: 'Business owners here: what is the best advice you ever got? The comments will be gold.' },
      followers: { nl: 'Elke maand delen we hier wat we leerden van onze klanten. Volg de pagina om niets te missen.', en: 'Every month we share what we learned from our clients here. Follow the page so you miss nothing.' },
      revenue: { nl: 'We hebben plek voor twee nieuwe projecten deze maand. Stuur een bericht en we denken vrijblijvend mee.', en: 'We have room for two new projects this month. Send a message and we will think along, no strings attached.' },
      ambassadorship: { nl: 'Zonder jullie was deze mijlpaal er niet. Ken je iemand die we kunnen helpen? Deel dit bericht.', en: 'This milestone would not exist without you. Know someone we can help? Share this post.' },
    },
    sample: { nl: 'Vijf jaar geleden: een keukentafel. Vandaag: een team van tien. Het hele verhaal in de comments.', en: 'Five years ago: a kitchen table. Today: a team of ten. Full story in the comments.' },
  },
];
const channelById = (id) => CHANNELS.find((c) => c.id === id) || CHANNELS[0];

// ---------- Environment shim ----------
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
  const body = { model: 'claude-sonnet-4-6', max_tokens: 1200, messages };
  if (tools) body.tools = tools;
  const res = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error('API status ' + res.status);
  const data = await res.json();
  return data.content || [];
}
const textOf = (c) => c.filter((b) => b.type === 'text').map((b) => b.text).join('\n');
const stripDashes = (t) => t.replace(/\s*[\u2014\u2013]\s*/g, ', ').replace(/,\s*,/g, ',').trim();
function extractJson(text, kind) {
  const s = text.replace(/```json/gi, '').replace(/```/g, '');
  const o = kind === 'array' ? ['[', ']'] : ['{', '}'];
  const a = s.indexOf(o[0]); const b = s.lastIndexOf(o[1]);
  if (a === -1 || b === -1) throw new Error('No JSON');
  return JSON.parse(s.slice(a, b + 1));
}
const uid = () => Math.random().toString(36).slice(2, 9);
const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const WEB_TOOL = [{ type: 'web_search_20250305', name: 'web_search' }];
const langName = (l) => (l === 'nl' ? 'Dutch' : 'English');

// Preset branded visual as SVG data URL.
function presetVisual(headline, color, name) {
  const safe = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').slice(0, 60);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="${color || '#0A66C2'}"/><path d="M60 210 L120 90 L180 210 M150 210 L210 90 L270 210" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><text x="60" y="430" fill="#FFFFFF" font-family="Georgia, serif" font-size="52" font-weight="600">${safe(headline)}</text><text x="60" y="720" fill="rgba(255,255,255,0.75)" font-family="monospace" font-size="24">${safe(name)}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

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

// ---------- Default state ----------
const emptyBrand = () => ({
  company: '', role: '', name: '', website: '', logo: '', description: '', audience: '',
  personality: '', colors: [], docs: [], tone: '', socials: { linkedin: '', instagram: '', x: '', facebook: '' },
  channelExamples: {},
});
const emptyStrategy = () => ({
  keywords: [],
  perPhase: FUNNEL.reduce((acc, f) => { acc[f.id] = { goal: '', approach: '' }; return acc; }, {}),
});

// ---------- App ----------
export default function App() {
  const [lang, setLang] = useState('nl');
  const [loaded, setLoaded] = useState(false);
  const [intro, setIntro] = useState(true);
  const [view, setView] = useState('home'); // home | channel:<id> | onboarding | cms
  const [menu, setMenu] = useState(false);
  const [bursts, setBursts] = useState([]);
  function onBgTap(e) {
    if (e.target.closest('button, a, input, textarea, select, label, [role="button"], .panel, .fnote, .ch-post-big, .cms, .topbar, .menu')) return;
    const id = uid();
    setBursts((b) => [...b.slice(-2), { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1700);
  }

  const [user, setUser] = useState(null); // { email, name }
  const [brand, setBrand] = useState(emptyBrand());
  const [strategy, setStrategy] = useState(emptyStrategy());
  const [topics, setTopics] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [scheduled, setScheduled] = useState([]);

  const t = (k) => (STR[lang] && STR[lang][k]) || STR.en[k] || k;
  const setupDone = !!(user && brand.tone);

  // ----- load: last user + language -----
  useEffect(() => {
    (async () => {
      let langSet = false;
      try {
        const last = await store.get('faab:last');
        if (last && last.value) {
          const email = last.value;
          const r = await store.get('faab:user:' + email);
          if (r && r.value) { applyData(JSON.parse(r.value)); langSet = true; }
        }
      } catch (e) { /* ignore */ }
      if (!langSet) {
        try { setLang((navigator.language || 'nl').toLowerCase().startsWith('en') ? 'en' : 'nl'); } catch (e) { /* nl */ }
      }
      setLoaded(true);
      setTimeout(() => setIntro(false), 2600);
    })();
  }, []);

  function applyData(d) {
    if (d.user) setUser(d.user);
    if (d.brand) setBrand({ ...emptyBrand(), ...d.brand, socials: { ...emptyBrand().socials, ...(d.brand.socials || {}) } });
    if (d.strategy) setStrategy({ ...emptyStrategy(), ...d.strategy, perPhase: { ...emptyStrategy().perPhase, ...(d.strategy.perPhase || {}) } });
    if (Array.isArray(d.topics)) setTopics(d.topics);
    if (Array.isArray(d.drafts)) setDrafts(d.drafts);
    if (Array.isArray(d.scheduled)) setScheduled(d.scheduled);
    if (d.lang) setLang(d.lang);
  }

  // ----- persist per user -----
  useEffect(() => {
    if (!loaded || !user || !user.email) return;
    (async () => {
      try {
        await store.set('faab:user:' + user.email, JSON.stringify({ user, brand, strategy, topics, drafts, scheduled, lang }));
        await store.set('faab:last', user.email);
      } catch (e) { /* ignore */ }
    })();
  }, [user, brand, strategy, topics, drafts, scheduled, lang, loaded]);

  useEffect(() => { document.body.style.overflow = menu ? 'hidden' : ''; }, [menu]);

  const go = (v) => { setView(v); setMenu(false); window.scrollTo(0, 0); };

  async function auth(mode, username, password, name) {
    const u = String(username || '').trim().toLowerCase();
    if (mode === 'guest') { setUser({ email: 'guest', name: '' }); return { ok: true }; }
    if (!u || !password) return { ok: false, err: 'wrong' };
    let rec = null;
    try { const r = await store.get('faab:auth:' + u); rec = r && r.value ? JSON.parse(r.value) : null; } catch (e) { rec = null; }
    if (mode === 'register') {
      if (rec) return { ok: false, err: 'exists' };
      await store.set('faab:auth:' + u, JSON.stringify({ password, name: String(name || '').trim() }));
      setUser({ email: u, name: String(name || '').trim() });
      setBrand((b) => ({ ...b, name: String(name || '').trim() }));
      return { ok: true };
    }
    if (!rec || rec.password !== password) return { ok: false, err: 'wrong' };
    try {
      const r = await store.get('faab:user:' + u);
      if (r && r.value) { applyData(JSON.parse(r.value)); return { ok: true }; }
    } catch (e) { /* no saved profile yet */ }
    setUser({ email: u, name: rec.name || '' });
    return { ok: true };
  }
  function logout() { setUser(null); setBrand(emptyBrand()); setStrategy(emptyStrategy()); setTopics([]); setDrafts([]); setScheduled([]); store.set('faab:last', ''); go('home'); }

  const setB = (k, v) => setBrand((p) => ({ ...p, [k]: v }));
  const setSocial = (ch, v) => setBrand((p) => ({ ...p, socials: { ...p.socials, [ch]: v } }));

  // ----- AI: website brand scan (Waryte mechanism) -----
  const [scanState, setScanState] = useState('idle');
  async function scanWebsite() {
    const url = (brand.website || '').trim();
    if (!url) return;
    setScanState('loading');
    try {
      const prompt = `Visit and research this company website: ${url}. Extract the brand.

Return ONLY a JSON object:
- company: company name.
- description: 2 sentences in ${langName(lang)} describing the service.
- audience: 1 sentence in ${langName(lang)} describing the target audience.
- colors: array of 2 to 4 hex color codes that match the site brand (best guess).

No markdown. Do not use em-dashes or en-dashes.`;
      const out = extractJson(textOf(await callClaude([{ role: 'user', content: prompt }], WEB_TOOL)), 'object');
      setBrand((p) => ({
        ...p,
        company: p.company || stripDashes(String(out.company || '')),
        description: stripDashes(String(out.description || p.description)),
        audience: stripDashes(String(out.audience || p.audience)),
        colors: Array.isArray(out.colors) && out.colors.length ? out.colors.map(String).slice(0, 4) : p.colors,
      }));
      setScanState('done');
    } catch (e) { setScanState('error'); }
  }

  // ----- AI: tone of voice from connected channels + brand -----
  const [toneState, setToneState] = useState('idle');
  async function generateTone() {
    setToneState('loading');
    try {
      const socials = Object.entries(brand.socials).filter(([, v]) => v.trim()).map(([k, v]) => `${channelById(k).name}: ${v}`).join('\n');
      const docs = brand.docs.map((d) => d.text).join('\n').slice(0, 3000);
      const prompt = `You are a senior brand voice strategist. Determine the tone of voice for this founder, based on how they actually write publicly.

${socials ? 'Connected public profiles (search the web for their public posts and comments, study sentence length, vocabulary, formality, humor and recurring themes):\n' + socials + '\n' : ''}Company: ${brand.company || 'n/a'}
Description: ${brand.description || 'n/a'}
Audience: ${brand.audience || 'n/a'}
Personality: ${brand.personality || 'n/a'}
${docs ? 'Brand documents excerpt:\n' + docs + '\n' : ''}
Write a tone of voice base text in ${langName(lang)}: 4 to 6 short lines covering voice adjectives, sentence rhythm, point of view, what to lean into and what to avoid. Concrete and usable, matching how this person already writes. Return only the text, no JSON, no markdown headers. Do not use em-dashes or en-dashes.`;
      const text = stripDashes(textOf(await callClaude([{ role: 'user', content: prompt }], socials ? WEB_TOOL : undefined)));
      setBrand((p) => ({ ...p, tone: text }));
      setToneState('done');
    } catch (e) { setToneState('error'); }
  }

  // ----- AI: example post per connected channel -----
  async function generateExampleFor(chId) {
    const text = await genPost({ channel: chId, phase: 'reach', angle: '', subject: '' });
    setBrand((p) => ({ ...p, channelExamples: { ...p.channelExamples, [chId]: text } }));
  }

  // ----- AI: strategy per funnel phase -----
  const [stratState, setStratState] = useState('idle');
  async function generateStrategy() {
    setStratState('loading');
    try {
      const prompt = `You are a personal branding strategist. For this founder brand, define a goal and an approach for each funnel stage of social media personal branding.

Brand: ${brand.company || 'n/a'}. ${brand.description || ''}
Audience: ${brand.audience || 'n/a'}
Tone: ${brand.tone ? brand.tone.slice(0, 400) : 'n/a'}
Stages: reach, engagement, followers, revenue, ambassadorship.

Return ONLY a JSON object with a key per stage id, each value an object with:
- goal: 1 short sentence in ${langName(lang)}.
- approach: 1 to 2 short sentences in ${langName(lang)} with the concrete content approach for that stage.
Also include key "keywords": array of 6 short content themes in ${langName(lang)}.
No markdown. Do not use em-dashes or en-dashes.`;
      const out = extractJson(textOf(await callClaude([{ role: 'user', content: prompt }])), 'object');
      setStrategy((p) => {
        const per = { ...p.perPhase };
        FUNNEL.forEach((f) => {
          const v = out[f.id];
          if (v) per[f.id] = { goal: stripDashes(String(v.goal || per[f.id].goal)), approach: stripDashes(String(v.approach || per[f.id].approach)) };
        });
        const kws = Array.isArray(out.keywords) ? out.keywords.map((k) => stripDashes(String(k))) : [];
        return { ...p, perPhase: per, keywords: Array.from(new Set([...p.keywords, ...kws])).slice(0, 10) };
      });
      setStratState('done');
    } catch (e) { setStratState('error'); }
  }

  // ----- AI: topics research (search volumes + reddit) -----
  const [topicState, setTopicState] = useState('idle');
  async function researchTopics() {
    if (!strategy.keywords.length) { setTopicState('empty'); return; }
    setTopicState('loading');
    try {
      const prompt = `Research content topics for these themes: ${strategy.keywords.join(', ')}.

Use web search. Return ONLY a JSON array of 8 items, mixing two kinds:
- keyword items: { "type": "keyword", "title": short search keyword, "volume": estimated monthly searches as a string like "2.4K" or "18K", "source": "Search" }
- reddit items: { "type": "reddit", "title": title of a trending relevant reddit thread, "volume": approximate upvotes as a string like "1.2K", "source": subreddit name like "r/entrepreneur", "url": link if known else "" }

Titles in ${langName(lang)} for keyword items; reddit titles stay as found. No markdown. Do not use em-dashes or en-dashes.`;
      const arr = extractJson(textOf(await callClaude([{ role: 'user', content: prompt }], WEB_TOOL)), 'array');
      setTopics(arr.map((it) => ({
        id: uid(), type: String(it.type || 'keyword'), title: stripDashes(String(it.title || '')),
        volume: stripDashes(String(it.volume || '')), source: stripDashes(String(it.source || 'Search')), url: String(it.url || ''),
      })).filter((x) => x.title));
      setTopicState('done');
    } catch (e) { setTopicState('error'); }
  }
  function addLinkTopic(url) {
    const u = url.trim(); if (!u) return;
    setTopics((arr) => [{ id: uid(), type: 'link', title: u, volume: '', source: 'Link', url: u }, ...arr]);
  }

  // ----- AI: content generation -----
  async function genPost({ channel, phase, angle, subject }) {
    const ch = channelById(channel);
    const ph = phaseById(phase);
    const per = strategy.perPhase[phase] || { goal: '', approach: '' };
    const prompt = `You are an expert social media ghostwriter for founders. Write one ${ch.name} post.

Author: ${brand.name || 'the founder'}${brand.role ? ', ' + brand.role : ''}${brand.company ? ' at ' + brand.company : ''}.
Brand: ${brand.description || 'n/a'} Audience: ${brand.audience || 'n/a'}
Tone of voice (match exactly):
${brand.tone || 'personal, clear, first person'}
Channel conventions for ${ch.name}: ${ch.tone.en}
Funnel stage: ${ph.t.en}. Stage intent: ${ph.intent}.${per.goal ? ' Stage goal: ' + per.goal : ''}${per.approach ? ' Approach: ' + per.approach : ''}
${subject ? 'Subject to react to: ' + subject : ''}${angle ? '\nAngle: ' + angle : ''}

Write in ${langName(lang)}. Rules:
- Line 1 is a scroll-stopping hook. One idea per post. Very short paragraphs.
- Concrete and human, first person. No corporate jargon, no cliches.
- Fit the length and format norms of ${ch.name}.
- End with one clear question or call to action.
- Do NOT use em-dashes or en-dashes. Use a regular hyphen or a comma.
- Return only the post text.`;
    return stripDashes(textOf(await callClaude([{ role: 'user', content: prompt }])));
  }

  // ----- drafts & schedule -----
  function saveDraft(d) { setDrafts((arr) => [{ id: uid(), created: Date.now(), ...d }, ...arr]); }
  function deleteDraft(id) { setDrafts((arr) => arr.filter((x) => x.id !== id)); }
  function schedulePost(draft, date, time) {
    setScheduled((arr) => [...arr, { ...draft, date, time }]);
    setDrafts((arr) => arr.filter((x) => x.id !== draft.id));
  }
  function unschedule(p) {
    setScheduled((arr) => arr.filter((x) => x.id !== p.id));
    setDrafts((arr) => [{ ...p }, ...arr]);
  }

  const MENU = [
    { k: 'home', label: t('nav_home'), act: () => go('home') },
    { k: 'how', label: t('nav_how'), act: () => { go('home'); setTimeout(() => { const el = document.getElementById('flow'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 60); } },
    { k: 'channels', label: t('nav_channels'), act: () => { go('home'); setTimeout(() => { const el = document.getElementById('channels'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 60); } },
    ...(setupDone ? [{ k: 'cms', label: t('nav_cms'), act: () => go('cms') }] : []),
    { k: 'start', label: t('nav_start'), act: () => go('onboarding') },
  ];

  return (
    <div className="faab" onClick={onBgTap}>
      <style>{CSS}</style>

      <div className="ripple-layer" aria-hidden="true">
        <div className="ripple-center"><span /><span /><span /><span /></div>
        {bursts.map((b) => <span key={b.id} className="ripple-burst" style={{ left: b.x + 'px', top: b.y + 'px' }} />)}
      </div>

      <div className="app-content">
      {intro && (
        <div className="intro" onClick={() => setIntro(false)}>
          {Logo.lockup({ animate: true })}
        </div>
      )}

      <header className="topbar">
        <button className="brand" onClick={() => go('home')} aria-label="FAAB home">
          {Logo.wordmark({ className: 'brand-logo' })}
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
        <div className="menu-foot" style={{ '--i': MENU.length }}>
          <button className="btn btn-blue" onClick={() => go('onboarding')}>{t('start_brand')} <I.arrow width="18" height="18" /></button>
        </div>
      </div>

      {view === 'home' && <Home t={t} lang={lang} go={go} />}
      {view.startsWith('channel:') && <ChannelPage t={t} lang={lang} id={view.split(':')[1]} go={go} />}
      {view === 'onboarding' && (
        <Onboarding t={t} lang={lang} user={user} brand={brand} setB={setB} setSocial={setSocial}
          auth={auth} scanWebsite={scanWebsite} scanState={scanState}
          generateTone={generateTone} toneState={toneState} go={go} />
      )}
      {view === 'cms' && (
        <CMS t={t} lang={lang} user={user} brand={brand} setB={setB} setBrand={setBrand} setSocial={setSocial}
          strategy={strategy} setStrategy={setStrategy}
          generateTone={generateTone} toneState={toneState} generateExampleFor={generateExampleFor}
          generateStrategy={generateStrategy} stratState={stratState}
          topics={topics} topicState={topicState} researchTopics={researchTopics} addLinkTopic={addLinkTopic}
          genPost={genPost} drafts={drafts} saveDraft={saveDraft} deleteDraft={deleteDraft}
          scheduled={scheduled} schedulePost={schedulePost} unschedule={unschedule}
          logout={logout} go={go} />
      )}

      {setupDone && view !== 'cms' && (
        <button className="cms-fab" onClick={() => go('cms')} aria-label="Open CMS">
          <I.palette width="24" height="24" />
        </button>
      )}

      {view !== 'cms' && (
        <footer className="foot">
          <div className="foot-grid">
            <div>
              {Logo.wordmark({ className: 'brand-logo sm' })}
              <p className="foot-tag">{t('foot_tag')}</p>
            </div>
            <div className="foot-col">
              <span className="foot-h">{t('foot_app')}</span>
              <button className="foot-link" onClick={() => go('onboarding')}>{t('start_brand')}</button>
              {setupDone && <button className="foot-link" onClick={() => go('cms')}>CMS</button>}
              <a className="foot-link" href="#funnel">{t('foot_the_funnel')}</a>
            </div>
            <div className="foot-col">
              <span className="foot-h">{t('foot_learn')}</span>
              {CHANNELS.map((c) => <button className="foot-link" key={c.id} onClick={() => go('channel:' + c.id)}>{c.name}</button>)}
            </div>
          </div>
          <div className="foot-base">
            <div className="lang-toggle" role="group" aria-label={t('lang_word')}>
              <button className={lang === 'nl' ? 'lang-on' : ''} onClick={() => setLang('nl')}>NL</button>
              <button className={lang === 'en' ? 'lang-on' : ''} onClick={() => setLang('en')}>EN</button>
            </div>
          </div>
        </footer>
      )}
      </div>
    </div>
  );
}

// ---------- Home ----------
function FunnelViz({ t, lang }) {
  const [phase, setPhase] = useState('reach');
  const W = 1000, H = 330, cy = 145, labelY = 318, segW = W / FUNNEL.length;
  const hs = [...FUNNEL.map((f) => f.w * 2.6), FUNNEL[FUNNEL.length - 1].w * 2.6 * 0.7];
  const f = FUNNEL.find((x) => x.id === phase) || FUNNEL[0];
  return (
    <div className="hfunnel">
      <svg className="bowtie" viewBox={`0 0 ${W} ${H}`} role="group" aria-label={t('eb_funnel')}>
        {FUNNEL.map((fu, i) => {
          const x0 = i * segW + 3, x1 = (i + 1) * segW - 3;
          const hl = hs[i], hr = hs[i + 1];
          const pts = `${x0},${cy - hl / 2} ${x1},${cy - hr / 2} ${x1},${cy + hr / 2} ${x0},${cy + hl / 2}`;
          const cx = i * segW + segW / 2;
          const on = phase === fu.id;
          return (
            <g key={fu.id} className={'bseg' + (on ? ' bseg-on' : '')} onClick={() => setPhase(fu.id)}
              role="button" tabIndex={0} aria-pressed={on}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPhase(fu.id); } }}>
              <polygon points={pts} fill={fu.c} />
              {fu.ic({ x: cx - 15, y: cy - 15, width: 30, height: 30, color: '#fff', className: 'bic' })}
              <text x={cx} y={labelY} textAnchor="middle" className="blbl">{fu.t[lang]}</text>
            </g>
          );
        })}
      </svg>
      <div className="fnote">
        <span className="fnote-ic" style={{ background: f.c }}>{f.ic({ width: 16, height: 16 })}</span>
        <div className="fnote-body">
          <p className="fnote-d"><b>{f.t[lang]}.</b> {f.j[lang]}</p>
        </div>
      </div>
    </div>
  );
}

function Home({ t, lang, go }) {
  const [prevCh, setPrevCh] = useState('linkedin');
  const pc = channelById(prevCh);
  return (
    <main>
      <section className="hero wrap">
        {Logo.mark({ className: 'hero-mark' })}
        {Logo.subline({ className: 'hero-subline' })}
        <p className="tagline">{t('hero_slogan')}</p>
        <div className="hero-cta">
          <button className="btn btn-blue" onClick={() => go('onboarding')}>{t('start_brand')} <I.arrow width="18" height="18" /></button>
          <a className="btn btn-ghost" href="#flow">{t('cta_how')}</a>
        </div>
      </section>

      <section id="funnel" className="sect wrap">
        <div className="eyebrow">{t('eb_funnel')}</div>
        <h2 className="h2">{t('funnel_h2a')}<br className="bk" /> {t('funnel_h2b')}</h2>
        <p className="sect-lede">{t('funnel_lede')}</p>
        <FunnelViz t={t} lang={lang} />
      </section>

      <section id="flow" className="sect wrap">
        <div className="eyebrow">{t('eb_flow')}</div>
        <h2 className="h2">{t('flow_h2')}</h2>
        <p className="sect-lede">{t('flow_lede')}</p>
        <div className="flow">
          {USERFLOW.map((s, i) => (
            <React.Fragment key={s.k}>
              <div className="flow-step">
                <span className="flow-ic">{s.ic({ width: 22, height: 22 })}</span>
                <span className="flow-n">0{i + 1}</span>
                <h3>{s.t[lang]}</h3>
                <p className="flow-d">{s.d[lang]}</p>
              </div>
              {i < USERFLOW.length - 1 && <span className="flow-arrow"><I.arrow width="22" height="22" /></span>}
            </React.Fragment>
          ))}
        </div>
      </section>

      <section id="channels" className="sect wrap">
        <div className="eyebrow">{t('eb_channels')}</div>
        <h2 className="h2">{t('channels_h2a')}<br className="bk" /> {t('channels_h2b')}</h2>
        <div className="ch-tabs" role="tablist">
          {CHANNELS.map((c) => (
            <button key={c.id} role="tab" aria-selected={prevCh === c.id}
              className={'fch' + (prevCh === c.id ? ' fch-on' : '')} style={{ '--cc': c.c }}
              onClick={() => setPrevCh(c.id)} aria-label={c.name}>
              {c.ic({ width: 18, height: 18 })}
            </button>
          ))}
        </div>
        <div className="ch-stage">
          <div className="ch-post ch-post-big" style={{ '--cc': pc.c }}>
            <div className="ch-post-top">
              <span className="ch-ava" style={{ background: pc.c }}>{Logo.mark({ width: 20, height: 20 })}</span>
              <div><div className="ch-post-name">Founder</div><div className="ch-post-sub">@founder &middot; {pc.name}</div></div>
              <span className="ch-post-badge" style={{ color: pc.c }}>{pc.ic({ width: 18, height: 18 })}</span>
            </div>
            <p className="ch-post-text">{pc.sample[lang]}</p>
            <div className="ch-post-actions">
              <span><I.heart width="16" height="16" /> 128</span>
              <span><I.message width="16" height="16" /> 32</span>
              <span><I.send width="16" height="16" /> 11</span>
            </div>
          </div>
          <button className="ch-open" style={{ color: pc.c }} onClick={() => go('channel:' + pc.id)}>
            {pc.name} <I.arrow width="15" height="15" />
          </button>
        </div>
      </section>

      <section id="control" className="sect wrap">
        <div className="ctrl">
          <div className="ctrl-head">
            <span className="ctrl-ic"><I.shield width="26" height="26" /></span>
            <div><div className="eyebrow">{t('eb_control')}</div><h2 className="h2">{t('control_h2')}</h2></div>
          </div>
          <div className="rv-grid">
            <div className="rv-card">
              <svg className="rv-visual" viewBox="0 0 150 92" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="14" y="10" width="122" height="18" rx="6" opacity="0.35" />
                <line x1="26" y1="19" x2="86" y2="19" opacity="0.35" />
                <rect x="14" y="37" width="122" height="18" rx="6" className="rv-blue" />
                <line x1="26" y1="46" x2="86" y2="46" className="rv-blue" />
                <circle cx="122" cy="46" r="7" className="rv-blue" />
                <path d="M119 46l2.2 2.2 3.8 -4.4" className="rv-blue" />
                <rect x="14" y="64" width="122" height="18" rx="6" opacity="0.35" />
                <line x1="26" y1="73" x2="86" y2="73" opacity="0.35" />
              </svg>
              <h3>{t('rv1_t')}</h3><p>{t('rv1_d')}</p>
            </div>
            <div className="rv-card">
              <svg className="rv-visual" viewBox="0 0 150 92" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="26" y="10" width="98" height="72" rx="9" opacity="0.55" />
                <circle cx="42" cy="26" r="6" opacity="0.55" />
                <line x1="54" y1="23" x2="92" y2="23" opacity="0.55" />
                <line x1="54" y1="30" x2="80" y2="30" opacity="0.35" />
                <line x1="38" y1="46" x2="112" y2="46" opacity="0.35" />
                <line x1="38" y1="55" x2="104" y2="55" opacity="0.35" />
                <line x1="38" y1="64" x2="96" y2="64" className="rv-blue" />
                <path d="M116 74l14 -14 6 6 -14 14 -7.5 1.5z" className="rv-blue" fill="var(--white)" />
              </svg>
              <h3>{t('rv2_t')}</h3><p>{t('rv2_d')}</p>
            </div>
            <div className="rv-card">
              <svg className="rv-visual" viewBox="0 0 150 92" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="26" y="8" width="98" height="52" rx="9" opacity="0.55" />
                <circle cx="42" cy="22" r="6" opacity="0.55" />
                <line x1="54" y1="19" x2="92" y2="19" opacity="0.55" />
                <line x1="38" y1="38" x2="112" y2="38" opacity="0.35" />
                <line x1="38" y1="47" x2="98" y2="47" opacity="0.35" />
                <rect x="34" y="68" width="38" height="16" rx="8" className="rv-fill" stroke="none" />
                <path d="M46 76l3.5 3.5 8 -8" stroke="#fff" />
                <rect x="80" y="68" width="38" height="16" rx="8" opacity="0.55" />
                <path d="M94 72l8 8 M102 72l-8 8" opacity="0.55" />
              </svg>
              <h3>{t('rv3_t')}</h3><p>{t('rv3_d')}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="sect wrap">
        <div className="contact">
          <div>
            <div className="eyebrow">{t('eb_contact')}</div>
            <h2 className="h2">{t('contact_h2a')}<br />{t('contact_h2b')}</h2>
          </div>
          <div className="contact-card">
            <a className="contact-row" href="mailto:hello@faab.app"><I.mail width="18" height="18" /> hello@faab.app</a>
            <button className="btn btn-blue" onClick={() => go('onboarding')}>{t('start_brand')} <I.arrow width="17" height="17" /></button>
          </div>
        </div>
      </section>
    </main>
  );
}

// ---------- Channel page ----------
function ChannelPage({ t, lang, id, go }) {
  const ch = channelById(id);
  return (
    <main className="wrap chpage">
      <button className="btn btn-ghost sm back-btn" onClick={() => go('home')}><I.chevL width="16" height="16" /> {t('ch_back')}</button>
      <div className="chpage-head">
        <span className="chpage-ic" style={{ background: ch.c }}>{ch.ic({ width: 30, height: 30 })}</span>
        <h1 className="chpage-title">{ch.name}</h1>
      </div>

      <section className="panel">
        <h2 className="panel-title">{t('ch_strategy')}</h2>
        <p className="body-text">{ch.strat[lang]}</p>
      </section>

      <section className="panel">
        <h2 className="panel-title">{t('ch_placements')}</h2>
        <div className="place-grid">
          {ch.placements[lang].map((p, i) => (
            <div className="place" key={i}><span className="place-n" style={{ background: ch.c }}>{i + 1}</span><span>{p}</span></div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">{t('ch_tone')}</h2>
        <p className="body-text">{ch.tone[lang]}</p>
      </section>

      <div className="chpage-cta">
        <button className="btn btn-blue lg" onClick={() => go('onboarding')}>{t('ch_cta')} {ch.name} <I.arrow width="18" height="18" /></button>
      </div>
    </main>
  );
}

// ---------- Onboarding ----------
function Onboarding({ t, lang, user, brand, setB, setSocial, auth, scanWebsite, scanState, generateTone, toneState, go }) {
  const [mode, setMode] = useState(null); // null | 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authErr, setAuthErr] = useState('');
  const [saving, setSaving] = useState(false);
  const logoRef = useRef(null);

  const accountDone = !!user;
  const channelsDone = CHANNELS.some((c) => (brand.socials[c.id] || '').trim());
  const brandDone = !!(brand.description || '').trim() || !!(brand.website || '').trim();
  const inds = [
    { k: 'account', label: t('ob_ind_account'), done: accountDone },
    { k: 'channels', label: t('ob_ind_channels'), done: channelsDone },
    { k: 'brand', label: t('ob_ind_brand'), done: brandDone },
  ];

  function onLogo(e) {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => setB('logo', String(r.result)); r.readAsDataURL(f);
  }
  async function doAuth(m) {
    setAuthErr('');
    const res = await auth(m, username, password, name);
    if (!res.ok) { setAuthErr(t(res.err === 'exists' ? 'ob_auth_exists' : 'ob_auth_wrong')); return; }
  }
  async function saveAll() {
    setSaving(true);
    try { if (!brand.tone) await generateTone(); } catch (e) { /* tone optional */ }
    setSaving(false);
    go('cms');
  }

  return (
    <main className="wrap wizard">
      <h1 className="wiz-title">{t('ob_title')}</h1>
      <div className="steps">
        {inds.map((s) => (
          <div key={s.k} className={'step' + (s.done ? ' step-done-c' : '')}>
            <span className="step-dot">{s.done ? <I.check width="14" height="14" /> : ''}</span>
            <span className="step-name">{s.label}</span>
          </div>
        ))}
      </div>

      {!user && (
        <section className="panel">
          <div className="panel-head"><h2>{t('ob_choice_h')}</h2></div>
          {!mode && (
            <div className="auth-choice">
              <button className="btn btn-blue" onClick={() => setMode('login')}><I.user width="17" height="17" /> {t('ob_login')}</button>
              <button className="btn btn-blue" onClick={() => setMode('register')}><I.plus width="17" height="17" /> {t('ob_register')}</button>
              <button className="btn btn-ghost" onClick={() => doAuth('guest')}>{t('ob_guest')} <I.arrow width="17" height="17" /></button>
            </div>
          )}
          {mode && (
            <div>
              {mode === 'register' && (
                <Field label={t('ob_name')}><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Sten Bossong" /></Field>
              )}
              <div className="row2">
                <Field label={t('ob_username')}><input className="input" value={username} onChange={(e) => setUsername(e.target.value)} autoCapitalize="none" /></Field>
                <Field label={t('ob_password')}><input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
              </div>
              {authErr && <div className="mini-err">{authErr}</div>}
              <div className="wiz-nav">
                <button className="btn btn-ghost" onClick={() => { setMode(null); setAuthErr(''); }}>{t('ob_back')}</button>
                <button className="btn btn-blue" disabled={!username.trim() || !password} onClick={() => doAuth(mode)}>{t(mode === 'login' ? 'ob_login' : 'ob_register')} <I.arrow width="18" height="18" /></button>
              </div>
            </div>
          )}
          <div className="li-source-note">{t('ob_guest_note')}</div>
        </section>
      )}

      {user && (
        <section className="panel">
          <div className="ob-sec">
            <div className="panel-head"><h2>{t('ob_ch_h')}</h2><p>{t('ob_ch_p')}</p></div>
            <div className="soc-list">
              {CHANNELS.map((c) => (
                <div className="soc-row" key={c.id}>
                  <span className="soc-ic" style={{ background: c.c }}>{c.ic({ width: 18, height: 18 })}</span>
                  <span className="soc-name">{c.name}</span>
                  <input className="input" value={brand.socials[c.id]} onChange={(e) => setSocial(c.id, e.target.value)} placeholder={t('ob_ch_ph')} />
                </div>
              ))}
            </div>
          </div>

          <div className="ob-sec">
            <div className="panel-head"><h2>{t('ob_web_h')}</h2><p>{t('ob_web_p')}</p></div>
            <div className="kw-add">
              <input className="input" value={brand.website} onChange={(e) => setB('website', e.target.value)} placeholder={t('ob_web_ph')} />
              <button className="btn btn-blue" onClick={scanWebsite} disabled={scanState === 'loading'}><I.globe width="16" height="16" /> {scanState === 'loading' ? t('ob_scanning') : t('ob_scan')}</button>
            </div>
            {scanState === 'error' && <div className="mini-err">{t('ob_scan_err')}</div>}
            <div className="scan-grid">
              <div className="ava-block">
                <div className="ava" style={brand.logo ? { backgroundImage: `url(${brand.logo})` } : {}} onClick={() => logoRef.current && logoRef.current.click()}>
                  {!brand.logo && <span className="ava-hint">{t('ob_logo')}</span>}
                </div>
                <button className="btn btn-ghost" onClick={() => logoRef.current && logoRef.current.click()}><I.upload width="15" height="15" /> {t('ob_logo')}</button>
                <input ref={logoRef} type="file" accept="image/*" hidden onChange={onLogo} />
              </div>
              <div>
                <Field label={t('b_company')}><input className="input" value={brand.company} onChange={(e) => setB('company', e.target.value)} /></Field>
                <Field label={t('ob_desc')}><textarea className="input textarea" rows={2} value={brand.description} onChange={(e) => setB('description', e.target.value)} /></Field>
                <Field label={t('ob_aud')}><textarea className="input textarea" rows={2} value={brand.audience} onChange={(e) => setB('audience', e.target.value)} /></Field>
                <Field label={t('ob_colors')}>
                  <div className="colors">
                    {brand.colors.map((c, i) => (
                      <span className="color-chip" key={i}>
                        <input type="color" value={/^#([0-9a-f]{6})$/i.test(c) ? c : '#0A66C2'} onChange={(e) => setB('colors', brand.colors.map((x, j) => j === i ? e.target.value : x))} />
                        <button className="color-x" onClick={() => setB('colors', brand.colors.filter((_, j) => j !== i))}><I.x width="11" height="11" /></button>
                      </span>
                    ))}
                    <button className="btn btn-ghost" onClick={() => setB('colors', [...brand.colors, '#0A66C2'])}><I.plus width="14" height="14" /></button>
                  </div>
                </Field>
              </div>
            </div>
          </div>

          <div className="li-source-note">{t('ob_tone_note')}</div>
          <div className="wiz-nav"><span />
            <button className="btn btn-blue" disabled={saving || toneState === 'loading'} onClick={saveAll}>{saving || toneState === 'loading' ? t('ob_saving') : t('ob_save')} <I.arrow width="18" height="18" /></button>
          </div>
        </section>
      )}
    </main>
  );
}

// ---------- CMS ----------
function CMS(props) {
  const { t } = props;
  const [tab, setTab] = useState('brand');
  const [contentSubject, setContentSubject] = useState('');
  const extra = { contentSubject, setContentSubject, goToContent: () => setTab('content') };
  const TABS = [
    { k: 'brand', label: t('cms_brand'), ic: I.user },
    { k: 'strategy', label: t('cms_strategy'), ic: I.target },
    { k: 'topics', label: t('cms_topics'), ic: I.trend },
    { k: 'content', label: t('cms_content'), ic: I.spark },
    { k: 'schedule', label: t('cms_schedule'), ic: I.calendar },
  ];
  return (
    <div className="cms wrap-wide">
      <aside className="cms-rail">
        <div className="cms-rail-top">
          {Logo.mark({ className: 'cms-mark' })}
        </div>
        <nav className="cms-tabs">
          {TABS.map((tb) => (
            <button key={tb.k} className={'cms-tab' + (tab === tb.k ? ' cms-tab-on' : '')} onClick={() => setTab(tb.k)}>
              {tb.ic({ width: 18, height: 18 })}<span>{tb.label}</span>
            </button>
          ))}
        </nav>
        <div className="cms-rail-bottom">
          <button className="cms-tab" onClick={() => props.go('home')}><I.chevL width="18" height="18" /><span>{t('cms_exit')}</span></button>
          <button className="cms-tab" onClick={props.logout}><I.logout width="18" height="18" /><span>{t('cms_logout')}</span></button>
        </div>
      </aside>
      <div className="cms-main">
        {tab === 'brand' && <CmsBrand {...props} />}
        {tab === 'strategy' && <CmsStrategy {...props} />}
        {tab === 'topics' && <CmsTopics {...props} {...extra} />}
        {tab === 'content' && <CmsContent {...props} {...extra} />}
        {tab === 'schedule' && <CmsSchedule {...props} />}
      </div>
    </div>
  );
}

// ----- Brand personality tab -----
function CmsBrand({ t, brand, setB, setBrand, setSocial, generateTone, toneState, generateExampleFor }) {
  const logoRef = useRef(null);
  const docRef = useRef(null);
  const [exLoading, setExLoading] = useState('');
  function onLogo(e) {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => setB('logo', String(r.result)); r.readAsDataURL(f);
  }
  function onDoc(e) {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => setBrand((p) => ({ ...p, docs: [...p.docs, { id: uid(), name: f.name, text: stripDashes(String(r.result)).slice(0, 8000) }] }));
    r.readAsText(f);
  }
  async function genEx(chId) {
    setExLoading(chId);
    try { await generateExampleFor(chId); } catch (e) { /* shown empty */ }
    setExLoading('');
  }
  const connected = CHANNELS.filter((c) => (brand.socials[c.id] || '').trim());
  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-head"><h2>{t('b_h')}</h2></div>
        <div className="scan-grid">
          <div className="ava-block">
            <div className="ava" style={brand.logo ? { backgroundImage: `url(${brand.logo})` } : {}} onClick={() => logoRef.current && logoRef.current.click()}>
              {!brand.logo && <span className="ava-hint">{t('ob_logo')}</span>}
            </div>
            <button className="btn btn-ghost sm" onClick={() => logoRef.current && logoRef.current.click()}><I.upload width="15" height="15" /> {t('ob_logo')}</button>
            <input ref={logoRef} type="file" accept="image/*" hidden onChange={onLogo} />
          </div>
          <div>
            <div className="row2">
              <Field label={t('b_name')}><input className="input" value={brand.name} onChange={(e) => setB('name', e.target.value)} /></Field>
              <Field label={t('b_role')}><input className="input" value={brand.role} onChange={(e) => setB('role', e.target.value)} /></Field>
            </div>
            <div className="row2">
              <Field label={t('b_company')}><input className="input" value={brand.company} onChange={(e) => setB('company', e.target.value)} /></Field>
              <Field label={t('b_website')}><input className="input" value={brand.website} onChange={(e) => setB('website', e.target.value)} /></Field>
            </div>
            <Field label={t('b_desc')}><textarea className="input textarea" rows={2} value={brand.description} onChange={(e) => setB('description', e.target.value)} /></Field>
            <Field label={t('b_aud')}><textarea className="input textarea" rows={2} value={brand.audience} onChange={(e) => setB('audience', e.target.value)} /></Field>
            <Field label={t('b_pers')}><textarea className="input textarea" rows={2} value={brand.personality} onChange={(e) => setB('personality', e.target.value)} placeholder={t('b_pers_ph')} /></Field>
            <Field label={t('b_colors')}>
              <div className="colors">
                {brand.colors.map((c, i) => (
                  <span className="color-chip" key={i}>
                    <input type="color" value={/^#([0-9a-f]{6})$/i.test(c) ? c : '#0A66C2'} onChange={(e) => setB('colors', brand.colors.map((x, j) => j === i ? e.target.value : x))} />
                    <button className="color-x" onClick={() => setB('colors', brand.colors.filter((_, j) => j !== i))}><I.x width="11" height="11" /></button>
                  </span>
                ))}
                <button className="btn btn-ghost sm" onClick={() => setB('colors', [...brand.colors, '#0A66C2'])}><I.plus width="14" height="14" /></button>
              </div>
            </Field>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>{t('b_socials')}</h2></div>
        <div className="soc-list">
          {CHANNELS.map((c) => (
            <div className="soc-row" key={c.id}>
              <span className="soc-ic" style={{ background: c.c }}>{c.ic({ width: 18, height: 18 })}</span>
              <span className="soc-name">{c.name}</span>
              <input className="input" value={brand.socials[c.id]} onChange={(e) => setSocial(c.id, e.target.value)} placeholder={t('ob_ch_ph')} />
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>{t('b_docs')}</h2><p>{t('b_docs_p')}</p></div>
        <div className="doc-list">
          {brand.docs.map((d) => (
            <div className="doc-row" key={d.id}>
              <I.doc width="17" height="17" /><span className="doc-name">{d.name}</span>
              <button className="icon-btn" onClick={() => setBrand((p) => ({ ...p, docs: p.docs.filter((x) => x.id !== d.id) }))}><I.trash width="15" height="15" /></button>
            </div>
          ))}
        </div>
        <button className="btn btn-ghost sm" onClick={() => docRef.current && docRef.current.click()}><I.upload width="15" height="15" /> {t('b_upload_doc')}</button>
        <input ref={docRef} type="file" accept=".txt,.md" hidden onChange={onDoc} />
      </section>

      <section className="panel">
        <div className="panel-head"><h2>{t('b_tone_h')}</h2><p>{t('b_tone_p')}</p></div>
        <textarea className="input textarea" rows={6} value={brand.tone} onChange={(e) => setB('tone', e.target.value)} />
        <div className="gen-row" style={{ marginTop: 12 }}>
          <button className="btn btn-blue sm" onClick={generateTone} disabled={toneState === 'loading'}><I.refresh width="15" height="15" /> {toneState === 'loading' ? t('ob_generating') : t('b_regen_tone')}</button>
          {toneState === 'error' && <span className="mini-err">{t('err_generic')}</span>}
        </div>
        <div className="field-label mt">{t('b_tone_examples')}</div>
        {connected.length === 0 && <p className="li-source-note">{t('b_no_channels')}</p>}
        <div className="ex-cards">
          {connected.map((c) => (
            <div className="ex-card" key={c.id}>
              <div className="ex-card-head" style={{ color: c.c }}>{c.ic({ width: 18, height: 18 })} {c.name}</div>
              {brand.channelExamples[c.id]
                ? <p className="ex-copy">{brand.channelExamples[c.id]}</p>
                : <button className="btn btn-ghost sm" onClick={() => genEx(c.id)} disabled={exLoading === c.id}><I.spark width="14" height="14" /> {exLoading === c.id ? t('ob_generating') : t('b_gen_example')}</button>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ----- Strategy tab -----
function CmsStrategy({ t, lang, strategy, setStrategy, generateStrategy, stratState }) {
  const [kwInput, setKwInput] = useState('');
  const setPhase = (id, k, v) => setStrategy((p) => ({ ...p, perPhase: { ...p.perPhase, [id]: { ...p.perPhase[id], [k]: v } } }));
  const addKw = (v) => {
    const s = (v || '').trim();
    if (!s || strategy.keywords.some((k) => k.toLowerCase() === s.toLowerCase())) return;
    setStrategy((p) => ({ ...p, keywords: [...p.keywords, s] }));
  };
  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-head"><h2>{t('s_h')}</h2><p>{t('s_p')}</p></div>
        <div className="gen-row">
          <button className="btn btn-blue" onClick={generateStrategy} disabled={stratState === 'loading'}><I.spark width="17" height="17" /> {stratState === 'loading' ? t('s_generating') : t('s_gen')}</button>
          {stratState === 'error' && <span className="mini-err">{t('err_generic')}</span>}
        </div>
        <div className="phase-list">
          {FUNNEL.map((f) => (
            <div className="phase" key={f.id}>
              <div className="phase-head">
                <span className="ex-ic" style={{ background: f.c }}>{f.ic({ width: 16, height: 16 })}</span>
                <span className="phase-t">{f.t[lang]}</span>
              </div>
              <Field label={t('s_goal')}><input className="input" value={strategy.perPhase[f.id].goal} onChange={(e) => setPhase(f.id, 'goal', e.target.value)} /></Field>
              <Field label={t('s_approach')}><textarea className="input textarea" rows={2} value={strategy.perPhase[f.id].approach} onChange={(e) => setPhase(f.id, 'approach', e.target.value)} /></Field>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>{t('s_keywords')}</h2></div>
        <div className="kw-add">
          <input className="input" value={kwInput} onChange={(e) => setKwInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { addKw(kwInput); setKwInput(''); } }} placeholder={t('s_add_kw_ph')} />
          <button className="btn btn-blue sm" onClick={() => { addKw(kwInput); setKwInput(''); }}><I.plus width="16" height="16" /> {t('s_add')}</button>
        </div>
        {strategy.keywords.length > 0 && (
          <div className="chips selected">
            {strategy.keywords.map((k) => <Chip key={k} active removable onRemove={() => setStrategy((p) => ({ ...p, keywords: p.keywords.filter((x) => x !== k) }))}>{k}</Chip>)}
          </div>
        )}
      </section>
    </div>
  );
}

// ----- Topics tab -----
function CmsTopics({ t, topics, topicState, researchTopics, addLinkTopic, goToContent, setContentSubject }) {
  const [linkInput, setLinkInput] = useState('');
  const [added, setAdded] = useState(false);
  return (
    <div className="stack">
      <section className="panel">
        <div className="topics-head">
          <div className="panel-head nomb"><h2>{t('t_h')}</h2><p>{t('t_p')}</p></div>
          <button className="btn btn-blue sm" onClick={researchTopics} disabled={topicState === 'loading'}><I.trend width="16" height="16" /> {topicState === 'loading' ? t('t_scanning') : t('t_refresh')}</button>
        </div>
        {topicState === 'empty' && <div className="empty small"><I.target width="24" height="24" /><p>{t('t_empty')}</p></div>}
        {topicState === 'error' && <div className="empty small"><I.radar width="24" height="24" /><p>{t('t_err')}</p></div>}
        {topicState === 'loading' && <div className="empty small"><I.radar width="24" height="24" /><p>{t('t_scanning')}</p></div>}
        {topics.length > 0 && (
          <div className="topic-table">
            <div className="tt-row tt-head">
              <span>{t('t_kw')}</span><span>{t('t_vol')}</span><span>{t('t_src')}</span><span>{t('t_act')}</span>
            </div>
            {topics.map((tp) => (
              <div className="tt-row" key={tp.id}>
                <span className="tt-title">{tp.url ? <a href={tp.url} target="_blank" rel="noreferrer" className="tt-link">{tp.title} <I.link width="12" height="12" /></a> : tp.title}</span>
                <span className="tt-vol">{tp.volume || '-'}</span>
                <span className="tt-src">{tp.source}</span>
                <span><button className="btn btn-blue sm" onClick={() => { setContentSubject(tp.title); goToContent(); }}>{t('t_use')}</button></span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-head nomb"><h2>{t('t_add_link')}</h2></div>
        <div className="kw-add" style={{ marginTop: 14 }}>
          <input className="input" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} placeholder={t('t_add_link_ph')} />
          <button className="btn btn-blue sm" onClick={() => { addLinkTopic(linkInput); setLinkInput(''); setAdded(true); setTimeout(() => setAdded(false), 1500); }}><I.plus width="16" height="16" /> {added ? t('t_added') : t('s_add')}</button>
        </div>
      </section>
    </div>
  );
}

// ----- Content tab -----
function CmsContent({ t, lang, brand, topics, genPost, saveDraft, contentSubject, setContentSubject }) {
  const [channel, setChannel] = useState('linkedin');
  const [phase, setPhase] = useState('reach');
  const [angle, setAngle] = useState('');
  const [subject, setSubject] = useState(contentSubject || '');
  const [text, setText] = useState('');
  const [gen, setGen] = useState('idle');
  const [visualMode, setVisualMode] = useState('none'); // none | preset | upload
  const [headline, setHeadline] = useState('');
  const [uploadImg, setUploadImg] = useState('');
  const [savedFlag, setSavedFlag] = useState(false);
  const imgRef = useRef(null);
  useEffect(() => { if (contentSubject) { setSubject(contentSubject); setContentSubject(''); } }, [contentSubject]);

  const ch = channelById(channel);
  const brandColor = (brand.colors && brand.colors[0]) || ch.c;
  const visual = visualMode === 'preset' ? presetVisual(headline || subject || brand.company, brandColor, brand.company || 'FAAB')
    : visualMode === 'upload' ? uploadImg : '';

  async function generate() {
    setGen('loading');
    try {
      const out = await genPost({ channel, phase, angle, subject });
      setText(out); setGen('done');
    } catch (e) { setGen('error'); }
  }
  function onImg(e) {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => { setUploadImg(String(r.result)); setVisualMode('upload'); }; r.readAsDataURL(f);
  }
  function save() {
    if (!text) return;
    saveDraft({ channel, category: phase, text, visual, headline });
    setSavedFlag(true); setTimeout(() => setSavedFlag(false), 1600);
  }

  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-head"><h2>{t('c_h')}</h2><p>{t('c_p')}</p></div>
        <div className="content-grid">
          <div className="content-left">
            <Field label={t('c_channel')}>
              <div className="chips">{CHANNELS.map((c) => <Chip key={c.id} active={channel === c.id} dot={c.c} onClick={() => setChannel(c.id)}>{c.name}</Chip>)}</div>
            </Field>
            <Field label={t('c_phase')}>
              <div className="chips">{FUNNEL.map((f) => <Chip key={f.id} active={phase === f.id} dot={f.c} onClick={() => setPhase(f.id)}>{f.t[lang]}</Chip>)}</div>
            </Field>
            <Field label={t('c_subject')}>
              <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={t('c_subject_none')} />
            </Field>
            <Field label={t('c_angle')}><input className="input" value={angle} onChange={(e) => setAngle(e.target.value)} placeholder={t('c_angle_ph')} /></Field>
            <button className="btn btn-blue" onClick={generate} disabled={gen === 'loading'}><I.spark width="17" height="17" /> {gen === 'loading' ? t('c_generating') : t('c_generate')}</button>
            {gen === 'error' && <div className="mini-err">{t('c_err')}</div>}
            <Field label={t('c_text')}><textarea className="input textarea tall" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('c_text_ph')} /></Field>
            <Field label={t('c_visual')}>
              <div className="chips">
                <Chip active={visualMode === 'none'} onClick={() => setVisualMode('none')}>{t('c_visual_none')}</Chip>
                <Chip active={visualMode === 'preset'} onClick={() => setVisualMode('preset')}>{t('c_visual_preset')}</Chip>
                <Chip active={visualMode === 'upload'} onClick={() => imgRef.current && imgRef.current.click()}>{t('c_visual_upload')}</Chip>
              </div>
              <input ref={imgRef} type="file" accept="image/*" hidden onChange={onImg} />
            </Field>
            {visualMode === 'preset' && <Field label={t('c_headline')}><input className="input" value={headline} onChange={(e) => setHeadline(e.target.value)} /></Field>}
            <button className="btn btn-blue" onClick={save} disabled={!text}>{savedFlag ? <><I.check width="16" height="16" /> {t('c_saved')}</> : <><I.doc width="16" height="16" /> {t('c_save_draft')}</>}</button>
          </div>
          <div className="content-right">
            <div className="field-label">{t('example_word')}</div>
            <PostPreview brand={brand} channel={ch} text={text} visual={visual} t={t} />
          </div>
        </div>
      </section>
    </div>
  );
}

function PostPreview({ brand, channel, text, visual, t }) {
  return (
    <div className="li-card">
      <div className="li-top">
        <span className="ava-mini" style={brand.logo ? { backgroundImage: `url(${brand.logo})`, backgroundColor: 'transparent' } : { background: channel.c }}>
          {!brand.logo && (brand.name ? brand.name[0].toUpperCase() : Logo.mark({ width: 18, height: 18 }))}
        </span>
        <div className="li-meta">
          <div className="li-name">{brand.name || 'Founder'}</div>
          <div className="li-role">{[brand.role, brand.company].filter(Boolean).join(' | ') || channel.name}</div>
        </div>
        <span className="li-in" style={{ color: channel.c }}>{channel.ic({ width: 18, height: 18 })}</span>
      </div>
      <div className="li-text">{text || t('c_text_ph')}</div>
      {visual && <img className="li-visual" src={visual} alt="" />}
    </div>
  );
}

// ----- Schedule tab -----
function CmsSchedule({ t, lang, brand, drafts, deleteDraft, scheduled, schedulePost, unschedule }) {
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [openDrafts, setOpenDrafts] = useState(true);
  const [openSched, setOpenSched] = useState(true);
  const [planning, setPlanning] = useState(null); // draft id being scheduled
  const [pDate, setPDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 1); return ymd(d); });
  const [pTime, setPTime] = useState('09:00');
  const [openPost, setOpenPost] = useState('');

  const y = month.getFullYear(), m = month.getMonth();
  const firstDow = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  const byDate = {};
  scheduled.forEach((p) => { (byDate[p.date] = byDate[p.date] || []).push(p); });
  const todayStr = ymd(new Date());
  const upcoming = [...scheduled].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <div className="stack">
      <section className="panel">
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
              <div className={'cal-cell' + (ds === todayStr ? ' cal-today' : '')} key={ds}>
                <span className="cal-d">{d}</span>
                <span className="cal-dots">
                  {list.slice(0, 3).map((p) => <span key={p.id} className="cal-dot" style={{ background: channelById(p.channel).c }} />)}
                  {list.length > 3 && <span className="cal-more">+{list.length - 3}</span>}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <button className="fold-head" onClick={() => setOpenDrafts((v) => !v)}>
          <h2>{t('sch_drafts')}</h2>
          <span className={'fold-chev' + (openDrafts ? ' fold-open' : '')}><I.chevD width="18" height="18" /></span>
        </button>
        {openDrafts && (
          <div className="sched-list">
            {!drafts.length && <div className="empty small"><I.doc width="22" height="22" /><p>{t('sch_none_drafts')}</p></div>}
            {drafts.map((d) => {
              const ch = channelById(d.channel);
              const ph = phaseById(d.category);
              return (
                <div className="sched" key={d.id}>
                  <span className="soc-ic" style={{ background: ch.c }}>{ch.ic({ width: 17, height: 17 })}</span>
                  <div className="sched-body">
                    <div className="sched-meta"><span className="cat-pill" style={{ background: ph.c }}>{ph.t[lang]}</span></div>
                    <p className="sched-text">{d.text ? d.text.split('\n')[0] : t('untitled')}</p>
                    {planning === d.id && (
                      <div className="plan-row">
                        <input className="input" type="date" value={pDate} onChange={(e) => setPDate(e.target.value)} />
                        <input className="input" type="time" value={pTime} onChange={(e) => setPTime(e.target.value)} />
                        <button className="btn btn-blue sm" onClick={() => { schedulePost(d, pDate, pTime); setPlanning(null); }}><I.check width="15" height="15" /> {t('sch_confirm')}</button>
                      </div>
                    )}
                  </div>
                  <div className="sched-actions">
                    {planning !== d.id && <button className="btn btn-blue sm" onClick={() => setPlanning(d.id)}><I.calendar width="15" height="15" /> {t('sch_schedule')}</button>}
                    <button className="icon-btn" onClick={() => deleteDraft(d.id)} aria-label="delete"><I.trash width="16" height="16" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="panel">
        <button className="fold-head" onClick={() => setOpenSched((v) => !v)}>
          <h2>{t('sch_scheduled')}</h2>
          <span className={'fold-chev' + (openSched ? ' fold-open' : '')}><I.chevD width="18" height="18" /></span>
        </button>
        {openSched && (
          <div className="sched-list">
            {!upcoming.length && <div className="empty small"><I.calendar width="22" height="22" /><p>{t('sch_none_sched')}</p></div>}
            {upcoming.map((p) => {
              const ch = channelById(p.channel);
              const ph = phaseById(p.category);
              const open = openPost === p.id;
              return (
                <div className="sched sched-col" key={p.id}>
                  <button className="sched-row" onClick={() => setOpenPost(open ? '' : p.id)}>
                    <div className="sched-date"><span className="sd-d">{p.date.slice(8)}</span><span className="sd-m">{MONTHS[lang][Number(p.date.slice(5, 7)) - 1].slice(0, 3)}</span></div>
                    <span className="soc-ic" style={{ background: ch.c }}>{ch.ic({ width: 17, height: 17 })}</span>
                    <div className="sched-body">
                      <div className="sched-meta"><span className="cat-pill" style={{ background: ph.c }}>{ph.t[lang]}</span><span className="sched-time">{p.time}</span></div>
                      <p className="sched-text">{p.text ? p.text.split('\n')[0] : t('untitled')}</p>
                    </div>
                    <span className={'fold-chev' + (open ? ' fold-open' : '')}><I.chevD width="17" height="17" /></span>
                  </button>
                  {open && (
                    <div className="sched-detail">
                      <PostPreview brand={brand} channel={ch} text={p.text} visual={p.visual} t={t} />
                      <div className="plan-row">
                        <span className="kw-pill"><I.calendar width="12" height="12" /> {p.date} {p.time}</span>
                        <button className="btn btn-ghost sm" onClick={() => unschedule(p)}><I.chevL width="14" height="14" /> {t('sch_unschedule')}</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
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

.sect-lede { margin:-8px 0 26px; color:var(--mut); font-size:16px; line-height:1.65; max-width:56ch; }
.eyebrow { display:inline-flex; align-items:center; gap:7px; font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:var(--blue); }
.field-label { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.13em; text-transform:uppercase; color:var(--dim); display:flex; gap:8px; align-items:baseline; }
.field-label.mt { display:block; margin:20px 0 10px; }
.field-hint { text-transform:none; letter-spacing:0; font-family:Inter; font-size:11.5px; color:var(--dim); }

/* intro splash */
.intro { position:fixed; inset:0; z-index:100; background:var(--white); display:flex; align-items:center; justify-content:center; animation:introFade .5s ease 2s forwards; cursor:pointer; }
@keyframes introFade { to { opacity:0; visibility:hidden; } }

/* lockup */
.lockup { display:flex; flex-direction:column; align-items:center; gap:16px; color:var(--ink); }
.lockup-word { width:min(340px,64vw); height:auto; display:block; }
.lockup-sub { width:89%; height:auto; display:block; color:var(--mut); }
.lockup-anim .lockup-word { clip-path:inset(-2% 102% -2% -2%); animation:wipe 1.15s cubic-bezier(.7,0,.25,1) .1s forwards; }
.lockup-anim .lockup-sub { opacity:0; animation:fadeUp .7s ease 1.15s forwards; }
@keyframes wipe { to { clip-path:inset(-2% -2% -2% -2%); } }
@keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

/* topbar */
.topbar { display:flex; align-items:center; justify-content:space-between; padding:14px 26px; border-bottom:1px solid var(--line); position:sticky; top:0; z-index:60; background:rgba(255,255,255,0.9); backdrop-filter:blur(14px); }
.brand { display:flex; align-items:center; gap:12px; background:none; border:none; padding:0; color:var(--ink); }
.brand-logo { height:19px; width:auto; aspect-ratio:3636/748; display:block; }
.brand-logo.sm { height:17px; }

/* burger */
.burger { position:relative; width:40px; height:40px; border:1px solid var(--line); border-radius:12px; background:var(--white); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:5px; }
.burger:hover { border-color:var(--blue); }
.burger-bar { width:18px; height:2px; background:var(--ink); border-radius:2px; transition:transform .34s cubic-bezier(.6,.05,.1,1), opacity .2s ease; }
.burger-on .b1 { transform:translateY(7px) rotate(45deg); }
.burger-on .b2 { opacity:0; transform:scaleX(0.4); }
.burger-on .b3 { transform:translateY(-7px) rotate(-45deg); }

/* menu */
.menu { position:fixed; inset:0; z-index:50; background:var(--blue); color:#fff; padding:96px 26px 40px;
  opacity:0; visibility:hidden; transform:scale(1.02); transition:opacity .4s ease, transform .5s cubic-bezier(.6,.05,.1,1), visibility 0s .45s; display:flex; flex-direction:column; justify-content:center; }
.menu-on { opacity:1; visibility:visible; transform:scale(1); transition:opacity .4s ease, transform .5s cubic-bezier(.6,.05,.1,1), visibility 0s; }
.menu-nav { max-width:1120px; margin:0 auto; width:100%; }
.menu-item { display:flex; align-items:center; gap:20px; width:100%; background:none; border:none; padding:13px 0; color:#fff; border-bottom:1px solid rgba(255,255,255,0.18);
  opacity:0; transform:translateY(24px); transition:opacity .5s ease, transform .5s cubic-bezier(.6,.05,.1,1); }
.menu-on .menu-item { opacity:1; transform:translateY(0); transition-delay:calc(var(--i) * 60ms + 120ms); }
.menu-i { font-family:'IBM Plex Mono',monospace; font-size:13px; color:rgba(255,255,255,0.6); width:34px; }
.menu-label { font-family:'Fraunces',serif; font-weight:400; font-size:clamp(28px,6.4vw,52px); letter-spacing:-0.01em; flex:1; text-align:left; }
.menu-item svg { color:rgba(255,255,255,0.55); transition:transform .3s ease; }
.menu-item:hover svg { transform:translateX(6px); color:#fff; }
.menu-foot { max-width:1120px; margin:34px auto 0; width:100%; opacity:0; transform:translateY(24px); transition:opacity .5s ease, transform .5s ease; }
.menu-on .menu-foot { opacity:1; transform:translateY(0); transition-delay:calc(var(--i) * 60ms + 120ms); }
.menu-foot .btn-blue { background:#fff; color:var(--blue); box-shadow:none; }

/* buttons */
.btn { display:inline-flex; align-items:center; justify-content:center; gap:9px; border:none; border-radius:999px; height:48px; padding:0 24px; font-size:15px; font-weight:600; transition:transform .15s ease, box-shadow .2s ease, background .2s; }
.btn.sm, .btn.lg { height:48px; padding:0 24px; font-size:15px; }
.btn-blue { background:var(--blue); color:#fff; box-shadow:0 6px 18px rgba(10,102,194,0.22); }
.btn-blue:hover { background:var(--blue-d); transform:translateY(-1px); }
.btn-blue:disabled { opacity:0.45; transform:none; box-shadow:none; cursor:not-allowed; }
.btn-ghost { background:var(--paper); color:var(--ink); border:1px solid var(--line); }
.btn-ghost:hover { border-color:var(--blue); color:var(--blue); }
.btn-ghost:disabled { opacity:0.4; cursor:not-allowed; }
.icon-btn { background:var(--white); border:1px solid var(--line); color:var(--mut); width:36px; height:36px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center; flex:none; }
.icon-btn:hover { color:var(--blue); border-color:var(--blue); }

.wrap { max-width:1120px; margin:0 auto; padding:0 26px; }
.wrap-wide { max-width:1320px; margin:0 auto; }

/* hero */
.hero { position:relative; overflow:hidden; padding-top:90px; padding-bottom:90px; text-align:center; display:flex; flex-direction:column; align-items:center; }
.hero-mark { position:relative; z-index:1; width:min(138px,31vw); height:auto; color:var(--ink); animation:fadeUp .8s ease both; }
.hero-subline { position:relative; z-index:1; width:min(210px,47vw); height:auto; color:var(--mut); margin-top:16px; animation:fadeUp .8s ease .15s both; }
.ripple-layer { position:fixed; inset:0; pointer-events:none; overflow:hidden; z-index:0; }
.app-content { position:relative; z-index:1; }
.ripple-center { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
.ripple-center span { position:absolute; width:min(420px,80vw); height:min(420px,80vw); border-radius:50%;
  background:radial-gradient(circle, rgba(0,0,0,0) 56%, rgba(23,23,23,0.045) 65%, rgba(255,255,255,0.9) 71%, rgba(23,23,23,0.028) 77%, rgba(0,0,0,0) 84%);
  filter:blur(6px); opacity:0; animation:ripple3d 10s ease-out infinite; }
.ripple-center span:nth-child(2) { animation-delay:2.5s; }
.ripple-center span:nth-child(3) { animation-delay:5s; }
.ripple-center span:nth-child(4) { animation-delay:7.5s; }
@keyframes ripple3d { 0% { transform:scale(0.22); opacity:0; } 14% { opacity:1; } 100% { transform:scale(3); opacity:0; } }
.ripple-burst { position:absolute; width:240px; height:240px; margin-left:-120px; margin-top:-120px; border-radius:50%;
  background:radial-gradient(circle, rgba(0,0,0,0) 52%, rgba(23,23,23,0.07) 63%, rgba(255,255,255,0.95) 70%, rgba(23,23,23,0.045) 77%, rgba(0,0,0,0) 85%);
  filter:blur(4px); opacity:0; animation:rippleBurst 1.6s ease-out forwards; }
@keyframes rippleBurst { 0% { transform:scale(0.12); opacity:0; } 16% { opacity:1; } 100% { transform:scale(2.4); opacity:0; } }
.tagline { font-family:'Fraunces',serif; font-style:italic; font-size:clamp(19px,3.4vw,30px); color:var(--ink); margin:30px auto 34px; max-width:26ch; line-height:1.3; text-wrap:balance; position:relative; z-index:1; }
.hero-cta { display:flex; gap:13px; justify-content:center; flex-wrap:wrap; position:relative; z-index:1; }

/* sections */
.sect { padding-top:88px; }
.h2 { font-family:'Fraunces',serif; font-weight:400; font-size:clamp(28px,4vw,42px); letter-spacing:-0.02em; line-height:1.12; margin:14px 0 28px; text-wrap:balance; }

/* funnel */
.hfunnel { display:flex; flex-direction:column; gap:18px; margin-top:8px; }
.bowtie { width:100%; height:auto; display:block; }
.bseg { cursor:pointer; outline:none; }
.bseg polygon { stroke:rgba(255,255,255,0.55); stroke-width:1; opacity:0.92; transition:opacity .15s ease, filter .15s ease; }
.bseg:hover polygon { opacity:1; }
.bseg:focus-visible polygon { stroke:#fff; stroke-width:2; }
.bseg-on polygon { opacity:1; filter:brightness(1.1); stroke:#fff; stroke-width:1.4; }
.bic { pointer-events:none; }
.blbl { font-family:'IBM Plex Mono',monospace; font-size:30px; font-weight:600; fill:var(--mut); letter-spacing:0.04em; }
.bseg-on .blbl { fill:var(--blue); }
.fnote { display:flex; gap:14px; align-items:flex-start; background:var(--paper); border:1px solid var(--line); border-radius:16px; padding:18px; }
.fnote-ic { width:32px; height:32px; border-radius:9px; color:#fff; display:inline-flex; align-items:center; justify-content:center; flex:none; }
.fnote-body { display:flex; flex-direction:column; gap:12px; min-width:0; flex:1; }
.fnote-d { margin:0; color:var(--mut); font-size:14.5px; line-height:1.6; }
.fnote-d b { color:var(--ink); font-weight:600; }
.fch { width:38px; height:38px; border-radius:11px; border:1px solid var(--line); background:var(--white); color:var(--dim); display:inline-flex; align-items:center; justify-content:center; transition:color .15s, border-color .15s, transform .12s; }
.fch:hover { transform:translateY(-1px); color:var(--cc); }
.fch-on { color:#fff; background:var(--cc); border-color:var(--cc); }

/* userflow */
.flow { display:flex; align-items:stretch; gap:10px; margin-top:8px; }
.flow-step { flex:1; min-width:0; background:var(--paper); border:1px solid var(--line); border-radius:18px; padding:22px 18px; display:flex; flex-direction:column; gap:10px; align-items:flex-start; }
.flow-ic { width:44px; height:44px; border-radius:12px; background:var(--blue); color:#fff; display:inline-flex; align-items:center; justify-content:center; }
.flow-n { font-family:'IBM Plex Mono',monospace; font-size:12px; letter-spacing:0.12em; color:var(--blue); }
.flow-step h3 { font-family:'Fraunces',serif; font-weight:500; font-size:17px; margin:0; line-height:1.25; }
.flow-d { margin:0; color:var(--mut); font-size:13.5px; line-height:1.5; }
.flow-arrow { display:flex; align-items:center; justify-content:center; color:var(--dim); flex:none; }

/* channels */
.ch-tabs { display:flex; gap:10px; margin-bottom:20px; }
.ch-stage { display:flex; flex-direction:column; align-items:center; gap:16px; }
.ch-post-big { background:var(--white); border:1px solid var(--line); border-top:3px solid var(--cc); border-radius:18px; padding:20px; box-shadow:0 16px 40px rgba(23,23,23,0.07); width:min(460px,100%); animation:fadeUp .35s ease both; }
.ch-post-badge { margin-left:auto; }
.ch-post-top { display:flex; gap:10px; align-items:center; margin-bottom:10px; }
.ch-ava { width:34px; height:34px; border-radius:50%; color:#fff; display:inline-flex; align-items:center; justify-content:center; flex:none; }
.ch-post-name { font-weight:600; font-size:13.5px; }
.ch-post-sub { color:var(--dim); font-size:11.5px; }
.ch-post-text { margin:0; font-size:14.5px; line-height:1.6; color:var(--ink); }
.ch-post-actions { display:flex; gap:22px; margin-top:14px; padding-top:12px; border-top:1px solid var(--line); color:var(--dim); font-size:12.5px; }
.ch-post-actions span { display:inline-flex; align-items:center; gap:6px; }
.ch-open { display:inline-flex; align-items:center; gap:8px; font-weight:600; font-size:14.5px; background:none; border:none; }




/* control */
.ctrl { background:var(--blue-tint); border:1px solid var(--line); border-radius:24px; padding:40px; }
.ctrl-head { display:flex; gap:18px; align-items:center; margin-bottom:20px; }
.ctrl-ic { display:inline-flex; width:56px; height:56px; align-items:center; justify-content:center; border-radius:16px; background:var(--blue); color:#fff; flex:none; }
.ctrl-head .h2 { margin:8px 0 0; }
.rv-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.rv-card { background:var(--white); border:1px solid var(--line); border-radius:16px; padding:20px; display:flex; flex-direction:column; gap:6px; }
.rv-visual { width:100%; max-width:190px; height:auto; color:var(--ink); margin:0 auto 14px; display:block; }
.rv-visual .rv-blue { stroke:var(--blue); }
.rv-visual .rv-fill { fill:var(--blue); }
.rv-card h3 { font-family:'Fraunces',serif; font-weight:500; font-size:16.5px; margin:0; }
.rv-card p { color:var(--mut); font-size:13.5px; line-height:1.55; margin:0; }

/* contact */
.contact { display:grid; grid-template-columns:1.1fr 0.9fr; gap:36px; align-items:center; }
.contact-card { background:var(--paper); border:1px solid var(--line); border-radius:20px; padding:28px; display:flex; flex-direction:column; gap:14px; align-items:flex-start; }
.contact-row { display:inline-flex; align-items:center; gap:11px; font-size:15.5px; font-weight:500; }
.contact-row svg { color:var(--blue); }

/* channel page */
.chpage { padding-top:34px; padding-bottom:60px; display:flex; flex-direction:column; gap:18px; }
.back-btn { align-self:flex-start; }
.chpage-head { display:flex; align-items:center; gap:18px; margin:6px 0 8px; }
.chpage-ic { width:60px; height:60px; border-radius:17px; color:#fff; display:inline-flex; align-items:center; justify-content:center; flex:none; }
.chpage-title { font-family:'Fraunces',serif; font-weight:400; font-size:clamp(34px,6vw,52px); margin:0; letter-spacing:-0.02em; }
.panel-title { font-family:'Fraunces',serif; font-weight:500; font-size:21px; margin:0 0 14px; }
.body-text { color:var(--mut); font-size:15.5px; line-height:1.7; margin:0; max-width:72ch; }
.place-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
.place { display:flex; gap:12px; align-items:center; background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:14px; font-size:14.5px; }
.place-n { width:26px; height:26px; border-radius:50%; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:12.5px; font-weight:600; flex:none; }
.ex-copy { margin:0; font-size:14.5px; line-height:1.55; white-space:pre-wrap; }
.chpage-cta { display:flex; justify-content:center; margin-top:10px; }

/* wizard / onboarding */
.wizard { max-width:780px; padding-top:38px; padding-bottom:60px; }
.wiz-title { font-family:'Fraunces',serif; font-weight:400; font-size:clamp(30px,5vw,42px); margin:0 0 20px; letter-spacing:-0.02em; }
.steps { display:flex; gap:10px; margin-bottom:22px; }
.step { display:flex; align-items:center; gap:9px; flex:1; padding:11px 13px; border-radius:12px; background:var(--paper); border:1px solid var(--line); color:var(--dim); transition:background .3s, border-color .3s, color .3s; }
.step-done-c { background:var(--blue); border-color:var(--blue); color:#fff; }
.step-dot { width:24px; height:24px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:13px; font-weight:600; background:var(--white); border:1px solid var(--line); flex:none; transition:background .3s, color .3s; }
.step-done-c .step-dot { background:rgba(255,255,255,0.2); border:none; color:#fff; }
.step-name { font-size:13px; font-weight:500; }
.auth-choice { display:flex; flex-direction:column; gap:12px; align-items:stretch; max-width:360px; margin-bottom:14px; }
.auth-choice .btn { width:100%; }
.ob-sec { margin-bottom:26px; padding-bottom:22px; border-bottom:1px solid var(--line); }
.wiz-nav { display:flex; justify-content:space-between; align-items:center; margin-top:20px; }

.panel { background:var(--white); border:1px solid var(--line); border-radius:20px; padding:26px; box-shadow:0 8px 24px rgba(23,23,23,0.04); }
.panel-head { margin-bottom:20px; }
.panel-head.nomb { margin-bottom:0; }
.panel-head h2 { font-family:'Fraunces',serif; font-weight:500; font-size:22px; margin:0 0 6px; letter-spacing:-0.01em; }
.panel-head p { color:var(--mut); font-size:14.5px; margin:0; }
.stack { display:flex; flex-direction:column; gap:18px; }

.field { display:flex; flex-direction:column; gap:8px; margin-bottom:15px; }
.row2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.input { background:var(--paper); border:1px solid var(--line); border-radius:11px; padding:12px 14px; color:var(--ink); font-size:15px; font-family:inherit; width:100%; }
.input::placeholder { color:var(--dim); }
.input:focus { border-color:var(--blue); outline:none; background:var(--white); }
.textarea { resize:vertical; line-height:1.5; }
.textarea.tall { min-height:200px; }

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
.kw-add { display:flex; gap:10px; }
.kw-add .input { flex:1; }
.gen-row { display:flex; align-items:center; gap:14px; margin-bottom:16px; flex-wrap:wrap; }
.mini-err { color:var(--mag); font-size:13px; }
.li-source-note { font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--dim); letter-spacing:0.02em; margin-top:8px; }

/* socials */
.soc-list { display:flex; flex-direction:column; gap:10px; }
.soc-row { display:flex; align-items:center; gap:12px; }
.soc-ic { width:36px; height:36px; border-radius:10px; color:#fff; display:inline-flex; align-items:center; justify-content:center; flex:none; }
.soc-name { width:84px; font-weight:600; font-size:14px; flex:none; }
.soc-row .input { flex:1; }

/* scan */
.scan-grid { display:grid; grid-template-columns:130px 1fr; gap:24px; margin-top:18px; }
.colors { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.color-chip { position:relative; display:inline-flex; }
.color-chip input[type=color] { width:44px; height:44px; border:1px solid var(--line); border-radius:11px; padding:2px; background:var(--white); cursor:pointer; }
.color-x { position:absolute; top:-6px; right:-6px; width:18px; height:18px; border-radius:50%; border:none; background:var(--ink); color:#fff; display:inline-flex; align-items:center; justify-content:center; }

/* tone / examples */
.tone-box { background:var(--blue-tint); border:1px solid var(--line); border-radius:14px; padding:16px; margin-bottom:16px; }
.tone-text { margin:8px 0 0; font-size:14.5px; line-height:1.6; white-space:pre-wrap; }
.ex-cards { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; margin-top:12px; }
.ex-card { background:var(--paper); border:1px solid var(--line); border-radius:14px; padding:16px; }
.ex-card-head { display:inline-flex; align-items:center; gap:8px; font-weight:600; font-size:14px; margin-bottom:8px; }

/* docs */
.doc-list { display:flex; flex-direction:column; gap:8px; margin-bottom:12px; }
.doc-row { display:flex; align-items:center; gap:10px; background:var(--paper); border:1px solid var(--line); border-radius:11px; padding:10px 12px; }
.doc-row svg { color:var(--blue); flex:none; }
.doc-name { flex:1; font-size:14px; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

/* CMS shell */
.cms { display:grid; grid-template-columns:230px 1fr; min-height:calc(100vh - 69px); }
.cms-rail { border-right:1px solid var(--line); background:var(--paper); padding:22px 14px; display:flex; flex-direction:column; gap:18px; position:sticky; top:69px; height:calc(100vh - 69px); }
.cms-rail-top { display:flex; justify-content:center; padding:4px 0 2px; }
.cms-mark { height:30px; width:auto; color:var(--ink); }
.cms-tabs { display:flex; flex-direction:column; gap:5px; flex:1; }
.cms-tab { display:flex; align-items:center; gap:11px; width:100%; border:none; background:none; color:var(--mut); font-size:14px; font-weight:600; padding:11px 13px; border-radius:11px; text-align:left; }
.cms-tab:hover { color:var(--ink); background:var(--white); }
.cms-tab-on { background:var(--blue); color:#fff; box-shadow:0 4px 12px rgba(10,102,194,0.22); }
.cms-tab-on:hover { color:#fff; background:var(--blue); }
.cms-rail-bottom { display:flex; flex-direction:column; gap:5px; border-top:1px solid var(--line); padding-top:12px; }
.cms-main { padding:26px; min-width:0; }

/* floating CMS button */
.cms-fab { position:fixed; right:22px; bottom:22px; z-index:40; width:58px; height:58px; border-radius:50%; border:none; background:var(--blue); color:#fff; display:inline-flex; align-items:center; justify-content:center; box-shadow:0 12px 30px rgba(10,102,194,0.4); transition:transform .15s ease, background .2s; }
.cms-fab:hover { transform:translateY(-2px) scale(1.04); background:var(--blue-d); }

/* strategy phases */
.phase-list { display:flex; flex-direction:column; gap:14px; }
.phase { background:var(--paper); border:1px solid var(--line); border-radius:14px; padding:16px; }
.phase .input { background:var(--white); }
.phase-head { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
.phase-t { font-family:'Fraunces',serif; font-weight:500; font-size:17px; }

/* topics table */
.topics-head { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:16px; flex-wrap:wrap; }
.topic-table { display:flex; flex-direction:column; border:1px solid var(--line); border-radius:14px; overflow:hidden; }
.tt-row { display:grid; grid-template-columns:1fr 110px 130px 96px; gap:12px; align-items:center; padding:12px 16px; border-bottom:1px solid var(--line); font-size:14px; }
.tt-row:last-child { border-bottom:none; }
.tt-head { background:var(--paper); font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--dim); }
.tt-title { min-width:0; overflow-wrap:anywhere; }
.tt-link { display:inline-flex; align-items:center; gap:5px; color:var(--blue); }
.tt-vol { font-family:'IBM Plex Mono',monospace; font-size:13px; }
.tt-src { color:var(--mut); font-size:13px; }

/* content tab */
.content-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
.content-left { display:flex; flex-direction:column; gap:4px; }
.li-card { background:var(--paper); border:1px solid var(--line); border-radius:14px; padding:18px; margin-top:10px; }
.li-top { display:flex; gap:11px; align-items:flex-start; margin-bottom:14px; }
.ava-mini { width:44px; height:44px; border-radius:50%; background:var(--blue) center/cover; display:inline-flex; align-items:center; justify-content:center; font-weight:700; font-size:16px; color:#fff; flex:none; }
.li-meta { flex:1; min-width:0; }
.li-name { font-weight:600; font-size:15px; }
.li-role { color:var(--mut); font-size:12.5px; }
.li-in { flex:none; }
.li-text { white-space:pre-wrap; line-height:1.55; font-size:14.5px; color:var(--ink); }
.li-visual { width:100%; border-radius:11px; margin-top:12px; display:block; }

/* schedule */
.cal-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; }
.cal-head h2 { font-family:'Fraunces',serif; font-weight:500; font-size:22px; margin:0; text-transform:capitalize; }
.cal-nav { display:flex; gap:8px; }
.cal { display:grid; grid-template-columns:repeat(7,1fr); gap:7px; }
.cal-wd { font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--dim); text-align:center; padding-bottom:4px; text-transform:uppercase; letter-spacing:0.08em; }
.cal-cell { min-height:60px; border:1px solid var(--line); border-radius:11px; background:var(--paper); padding:8px; display:flex; flex-direction:column; align-items:flex-start; gap:6px; }
.cal-cell.empty-cell { border:none; background:none; }
.cal-cell.cal-today { border-color:var(--blue); box-shadow:inset 0 0 0 1px var(--blue); }
.cal-d { font-size:13px; font-weight:600; color:var(--mut); }
.cal-dots { display:flex; flex-wrap:wrap; gap:4px; align-items:center; }
.cal-dot { width:8px; height:8px; border-radius:50%; }
.cal-more { font-size:10px; color:var(--dim); }

.fold-head { display:flex; justify-content:space-between; align-items:center; width:100%; background:none; border:none; padding:0; }
.fold-head h2 { font-family:'Fraunces',serif; font-weight:500; font-size:20px; margin:0; }
.fold-chev { color:var(--dim); display:inline-flex; transition:transform .25s ease; }
.fold-chev.fold-open { transform:rotate(180deg); }

.sched-list { display:flex; flex-direction:column; gap:12px; margin-top:16px; }
.sched { display:flex; gap:14px; align-items:flex-start; background:var(--paper); border:1px solid var(--line); border-radius:14px; padding:14px 16px; }
.sched-col { flex-direction:column; align-items:stretch; }
.sched-row { display:flex; gap:14px; align-items:center; width:100%; background:none; border:none; padding:0; text-align:left; }
.sched-date { display:flex; flex-direction:column; align-items:center; width:44px; flex:none; }
.sd-d { font-family:'Fraunces',serif; font-weight:500; font-size:21px; line-height:1; }
.sd-m { font-family:'IBM Plex Mono',monospace; font-size:10.5px; text-transform:uppercase; color:var(--dim); letter-spacing:0.06em; }
.sched-body { flex:1; min-width:0; }
.sched-meta { display:flex; align-items:center; gap:10px; margin-bottom:5px; flex-wrap:wrap; }
.cat-pill { color:#fff; font-size:11px; font-weight:600; padding:3px 10px; border-radius:999px; }
.sched-time { font-family:'IBM Plex Mono',monospace; font-size:12px; color:var(--dim); }
.sched-text { margin:0; font-size:14px; color:var(--ink); line-height:1.45; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.sched-actions { display:flex; gap:8px; flex:none; align-items:center; }
.plan-row { display:flex; gap:10px; align-items:center; margin-top:10px; flex-wrap:wrap; }
.plan-row .input { width:auto; }
.sched-detail { margin-top:6px; }
.kw-pill { display:inline-flex; align-items:center; gap:6px; background:var(--white); border:1px solid var(--line); color:var(--mut); padding:6px 11px; border-radius:999px; font-size:12.5px; font-family:'IBM Plex Mono',monospace; }
.empty { text-align:center; padding:50px 20px; color:var(--mut); display:flex; flex-direction:column; align-items:center; gap:14px; }
.empty.small { padding:30px 16px; }

/* footer */
.foot { border-top:1px solid var(--line); margin-top:88px; background:var(--paper); }
.foot-grid { max-width:1120px; margin:0 auto; padding:44px 26px 26px; display:grid; grid-template-columns:1.2fr 0.9fr 0.9fr; gap:30px; color:var(--ink); }
.foot-tag { font-family:'Fraunces',serif; font-style:italic; color:var(--mut); font-size:16px; margin:12px 0 0; }
.foot-col { display:flex; flex-direction:column; gap:9px; align-items:flex-start; }
.foot-h { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--dim); margin-bottom:4px; }
.foot-link { background:none; border:none; padding:0; color:var(--mut); font-size:14px; text-align:left; }
.foot-link:hover { color:var(--blue); }
.foot-base { max-width:1120px; margin:0 auto; padding:16px 26px 28px; border-top:1px solid var(--line); color:var(--dim); font-size:13px; display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap; }
.lang-toggle { display:inline-flex; border:1px solid var(--line); border-radius:999px; overflow:hidden; background:var(--white); }
.lang-toggle button { border:none; background:none; padding:6px 14px; font-size:12.5px; font-weight:600; color:var(--mut); font-family:'IBM Plex Mono',monospace; }
.lang-toggle .lang-on { background:var(--blue); color:#fff; }

@media (max-width:920px) {
  .hero { padding-top:48px; padding-bottom:52px; }
  .flow { flex-direction:column; }
  .flow-arrow { transform:rotate(90deg); padding:4px 0; }
  .ctrl { padding:24px; } .rv-grid { grid-template-columns:1fr; }
  .contact { grid-template-columns:1fr; }
  .content-grid { grid-template-columns:1fr; }
  .scan-grid { grid-template-columns:1fr; }
  .row2 { grid-template-columns:1fr; }
  .ex-cards { grid-template-columns:1fr; }
  .place-grid { grid-template-columns:1fr; }
  .foot-grid { grid-template-columns:1fr; }
  .sect { padding-top:58px; }
  .steps { flex-direction:column; }
  .cms { grid-template-columns:1fr; }
  .cms-rail { position:static; height:auto; flex-direction:row; align-items:center; overflow-x:auto; padding:10px 12px; gap:8px; }
  .cms-rail-top { display:none; }
  .cms-tabs { flex-direction:row; flex:none; }
  .cms-tab span { display:none; }
  .cms-tab { padding:11px; }
  .cms-rail-bottom { flex-direction:row; border-top:none; padding-top:0; margin-left:auto; }
  .cms-main { padding:16px; }
  .tt-row { grid-template-columns:1fr 70px 90px; }
  .tt-row > span:nth-child(4) { grid-column:1 / -1; }
  .tt-head > span:nth-child(4) { display:none; }
  .soc-name { width:auto; min-width:0; display:none; }
  .cal-cell { min-height:50px; padding:6px; }
  .bk { display:none; }
}
@media (prefers-reduced-motion:reduce) {
  .btn-blue:hover, .ch-icon:hover, .cms-fab:hover { transform:none; }
  .menu, .menu-item, .burger-bar, .fold-chev { transition:none; }
  .lockup-anim .lockup-word { animation:none; clip-path:none; }
  .lockup-anim .lockup-sub { animation:none; opacity:1; }
  .ripple-center span, .ripple-burst { animation:none; opacity:0; }
  .intro { animation-duration:0.01s; animation-delay:0.6s; }
}
`;
