<div align="center">

<img src="./public/logo.svg" alt="ICKITY" width="320" />

# ICKITY

**An open source encyclopedia and publishing web application.**

This is an Open Source website.

[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-2ea44f?style=for-the-badge)](https://github.com/ICKITY/ICKITY)
[![MIT License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](https://github.com/ICKITY/ICKITY/blob/main/LICENSE)
[![Vercel Deployed](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge)](https://vercel.com)

</div>

ICKITY is a complete, production-ready encyclopedia built as a lightweight single-page application. It publishes eleven full-length, unabridged, multi-paragraph Wikipedia-style articles across history, science, technology, geography, and biography — every article densely interlinked with clickable wiki-links and hover preview cards, illustrated with verified public-domain photography, and rendered in a three-column academic layout with a sticky contents sidebar, a drop-cap lead paragraph, pull quotes, a Wikipedia-style fact infobox, a topic navbox, and numbered academic references.

Every page of the site carries the exact browser title **ICKITY**. Every image is a real, verified public-domain photograph from Wikimedia Commons, NASA archives, or the Library of Congress — there is no AI-generated media anywhere in this repository. Every icon is a hand-coded SVG, and there are no emojis anywhere in the codebase, the articles, or this documentation.

---

## Repository Visual Showcase

The plates below are real public-domain photographs that illustrate the encyclopedia's visual architecture: the archival photography that appears in article bodies, the infobox portraits, and the documentary imagery that anchors each topic.

| | | |
|---|---|---|
| ![Earth from Apollo 17](https://commons.wikimedia.org/wiki/Special:FilePath/Earth%20from%20Apollo%2017.jpg) | ![Black hole in M87](https://commons.wikimedia.org/wiki/Special:FilePath/Black%20hole%20-%20Messier%2087%20crop%20max%20res.jpg) | ![Mohenjo-daro](https://commons.wikimedia.org/wiki/Special:FilePath/Mohenjo-daro.jpg) |
| *Earth, Apollo 17 (NASA)* | *Black hole shadow, M87 (EHT)* | *Mohenjo-daro, Indus Valley* |
| ![Gutenberg Bible](https://commons.wikimedia.org/wiki/Special:FilePath/Gutenberg%20Bible%2C%20Lenox%20Copy%2C%20New%20York%20Public%20Library%2C%202009.%20Pic%2001.jpg) | ![Library of Alexandria](https://commons.wikimedia.org/wiki/Special:FilePath/Library%20of%20Alexandria%2C%20Egypt.jpg) | ![Pillars of Creation](https://commons.wikimedia.org/wiki/Special:FilePath/Pillars%20of%20Creation%20(2014%20Hubble%20image).jpg) |
| *Gutenberg Bible (NYPL)* | *Bibliotheca Alexandrina* | *Pillars of Creation (NASA/Hubble)* |
| ![Albert Einstein](https://commons.wikimedia.org/wiki/Special:FilePath/Albert%20Einstein%20Head.jpg) | ![Tim Berners-Lee](https://commons.wikimedia.org/wiki/Special:FilePath/Tim%20Berners-Lee.jpg) | ![Charles Babbage](https://commons.wikimedia.org/wiki/Special:FilePath/Charles%20Babbage.jpg) |
| *Albert Einstein, 1921* | *Tim Berners-Lee* | *Charles Babbage* |

All plates are public-domain images served from Wikimedia Commons. Full credit lines appear in each article's captions and infoboxes.

---

## Directory Structure

Articles live in nested folders inside `content/`, one folder inside another, mirroring the site's URL structure exactly:

```
ICKITY/
├── content/                          ← every article lives here
│   ├── history/
│   │   ├── ancient-civilizations/
│   │   │   └── library-of-alexandria.json
│   │   └── inventions/
│   │       └── printing-press.json
│   ├── science/
│   │   ├── physics/
│   │   │   ├── general-relativity.json
│   │   │   └── quantum-mechanics.json
│   │   └── astronomy/
│   │       ├── solar-system.json
│   │       └── black-holes.json
│   ├── technology/
│   │   └── computing/
│   │       ├── world-wide-web.json
│   │       └── history-of-computing.json
│   ├── geography/
│   │   └── ancient-sites/
│   │       └── indus-valley-civilization.json
│   └── biography/
│       └── scientists/
│           ├── albert-einstein.json
│           └── oppenheimer.json
├── public/
│   ├── logo.svg
│   └── favicon.svg
├── src/
│   ├── main.js                       ← SPA router, renderer, locks, Admin Studio
│   └── style.css                     ← handcrafted CSS design system
├── index.html                        ← strictly 16 lines
├── vite.config.js
├── vercel.json                       ← rewrites /(.*) to /index.html
├── LICENSE                           ← MIT License
├── CODE_OF_CONDUCT.md
└── README.md
```

The route of an article is its folder path: `content/history/ancient-civilizations/library-of-alexandria.json` is served at `/history/ancient-civilizations/library-of-alexandria`.

---

## The Eleven Articles

| # | Article | Route |
|---|---|---|
| 1 | Library of Alexandria | `/history/ancient-civilizations/library-of-alexandria` |
| 2 | Printing Press | `/history/inventions/printing-press` |
| 3 | General Relativity | `/science/physics/general-relativity` |
| 4 | Quantum Mechanics | `/science/physics/quantum-mechanics` |
| 5 | Solar System | `/science/astronomy/solar-system` |
| 6 | Black Holes | `/science/astronomy/black-holes` |
| 7 | World Wide Web | `/technology/computing/world-wide-web` |
| 8 | History of Computing | `/technology/computing/history-of-computing` |
| 9 | Indus Valley Civilization | `/geography/ancient-sites/indus-valley-civilization` |
| 10 | Albert Einstein | `/biography/scientists/albert-einstein` |
| 11 | Oppenheimer | `/biography/scientists/oppenheimer` |

Every article contains 1,200+ words of full explanatory prose: three rich introductory paragraphs followed by six detailed H2/H3 sections of three to four paragraphs each. Inside the body paragraphs, mentions of the other topics are wrapped in interactive wiki-links, for example:

```html
<a class='wiki-link' href='/science/physics/general-relativity'>general relativity</a>
```

Hovering over any wiki-link displays a floating preview card with the target article's verified thumbnail, category breadcrumb, and opening summary.

---

## How the Team Adds a New Article on GitHub (No Code Required)

Team members who only know basic HTML/CSS/JS can add a complete nested article directly on GitHub in about five minutes:

1. Open the repository on GitHub and click **Add file** (top right of the file list).
2. Click **Create new file**.
3. In the file-name field, type the full nested path, for example:

   ```
   content/science/physics/quantum-gravity.json
   ```

   GitHub automatically creates the `science` and `physics` folders when you type the slashes.
4. Paste the article JSON into the editor. Use the **Admin Studio** (below) to build the JSON visually and download it, then paste it here.
5. Write a commit message such as `Add Quantum Gravity article` and click **Commit changes**.
6. Vercel automatically rebuilds and deploys the site. The new article is live at `/science/physics/quantum-gravity` within a minute.

### Article JSON Schema

```json
{
  "slug": "quantum-gravity",
  "title": "Quantum Gravity",
  "category": "Science",
  "subcategory": "Physics",
  "path": "/science/physics/quantum-gravity",
  "summary": "One or two sentences shown on hover preview cards.",
  "thumbnail": "https://commons.wikimedia.org/wiki/Special:FilePath/...",
  "thumbnailCaption": "Credit line for the thumbnail.",
  "infobox": {
    "image": "https://commons.wikimedia.org/wiki/Special:FilePath/...",
    "caption": "Credit line for the infobox photo.",
    "rows": [{ "label": "Proposed", "value": "1916" }]
  },
  "intro": ["First paragraph (rendered with a drop cap).", "Second paragraph.", "Third paragraph."],
  "sections": [
    { "level": "h2", "heading": "Section heading", "paragraphs": ["Paragraph one.", "Paragraph two.", "Paragraph three."] }
  ],
  "pullQuote": { "text": "A memorable line.", "source": "Who said it" },
  "media": [
    { "type": "image", "src": "https://...", "caption": "Caption and credit." },
    { "type": "video", "src": "https://www.youtube-nocookie.com/embed/VIDEO_ID", "caption": "Documentary caption." }
  ],
  "seeAlso": ["/science/physics/general-relativity"],
  "references": ["Author, Title, Publisher, Year."]
}
```

Editorial rules: write every article in full (never a stub), use only verified public-domain media with credit lines, interlink densely with `.wiki-link` anchors, and never use emojis — use hand-coded SVGs.

---

## Admin Studio (`/admin`)

The password-protected visual editor at `/admin` is designed for team members who only know basic HTML/CSS/JS. Studio password: `inkcraft2026` (change it in `src/main.js`).

The studio provides:

1. **Folder-Inside-Folder Creator** — category, subcategory, and slug fields that compute the exact `content/...` path and route.
2. **Multi-paragraph section builder** — add intro paragraphs and H2/H3 sections with as many paragraphs as needed.
3. **One-click Internal Wiki-Link Inserter** — pick a target article and insert a hover-preview wiki-link at the cursor.
4. **Media uploader** — upload PNG, JPG, JPEG, or GIF images, or paste a verified public-domain URL, with captions.
5. **Universal video/social embedder** — YouTube, X, Facebook, Instagram, Pinterest, Reddit, Rumble, and self-hosted `.mp4`/`.webm` embeds.
6. **Raw HTML/CSS/JS code block mode** — with a live preview frame.
7. **One-click `.json` export** — download or copy the finished article file, ready to commit on GitHub at the path shown.

---

## Security Locks

The site ships with strict front-end protection that keeps scrolling fully smooth on all devices:

- **Anti-zoom:** locked viewport (`maximum-scale=1.0, user-scalable=no`), plus JS blockers for Ctrl/Cmd + `+`, `-`, `0`, Ctrl + mouse wheel, `gesturestart`/`gesturechange`, and multi-touch pinch moves.
- **Anti-copy:** global `user-select: none` (unlocked only inside `/admin` form fields), plus `copy`, `cut`, `paste`, `selectstart`, and `dragstart` blockers.
- **Anti-inspect:** `contextmenu` blocked, F12 blocked, Ctrl/Cmd+Shift+I/J/C blocked, Ctrl/Cmd+U (view source), Ctrl/Cmd+S (save), and Ctrl/Cmd+P (print) blocked, plus a DevTools detection guard.

---

## Local Development & Deployment

```bash
npm install
npm run dev      # local dev server on http://localhost:5173
npm run build    # production build into dist/ (minified JS/CSS)
```

Because Vite bundles all JS/CSS, view-source on any page only ever displays the 16-line `index.html`.

### Hosting at the domain root (Vercel)

`vercel.json` rewrites `/(.*)` to `/index.html`, so infinite nested folder routing works for every article path. Import the repository at [vercel.com/new](https://vercel.com/new), name the project `inkcraftlary`, and accept the detected Vite settings (build `npm run build`, output `dist`). The published address is `inkcraftlary.vercel.app` while the site itself remains ICKITY.

### Hosting under a subpath (GitHub Pages)

The site is base-path aware. `vite.config.js` reads the `VITE_BASE` environment variable, so the same source builds for a `/<repository-name>/` subpath (for this repository, `/ICKITY/`):

```bash
VITE_BASE=/ICKITY/ npm run build
```

`.github/workflows/pages.yml` does this automatically: on every push it builds with `VITE_BASE=/<repository-name>/`, adds `404.html` (the single-page-app fallback so deep article links resolve) and `.nojekyll`, then force-pushes the output to the `gh-pages` branch.

To serve it, open **Settings → Pages** for the repository and set **Source** to *Deploy from a branch*, branch `gh-pages`, folder `/(root)`. The site then appears at `https://ickity.github.io/ICKITY/`.

### Custom domain

**GitHub Pages:** add the domain under **Settings → Pages → Custom domain**, then create these DNS records at the registrar:

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `ickity.github.io` |

Enable **Enforce HTTPS** once the certificate is issued.

**Vercel:** add the domain under **Project → Settings → Domains**, then point the apex `A` record to `76.76.21.21` and the `www` `CNAME` to `cname.vercel-dns.com`.

---

## Official Social Channels

| Platform | Handle |
|---|---|
| X | [@ICKlibrary](https://x.com/ICKlibrary) |
| Facebook | [@InkCraftLibrary](https://facebook.com/InkCraftLibrary) |
| Instagram | [@InkCraftLibrary](https://instagram.com/InkCraftLibrary) |
| YouTube | [@InkCraftLibrary](https://youtube.com/@InkCraftLibrary) |
| Pinterest | [@InkCraftLibrary](https://pinterest.com/InkCraftLibrary) |
| Reddit | [@InkCraftLibrary](https://reddit.com/user/InkCraftLibrary) |
| Rumble | [@InkCraftLibrary](https://rumble.com/user/InkCraftLibrary) |

---

## Repository Identity

| Item | Value |
|---|---|
| GitHub account | [ICKITY](https://github.com/ICKITY) |
| Commit and contact email | `360687152+ICKITY@users.noreply.github.com` — the GitHub-provided noreply address. No personal email address is stored anywhere in this repository. |
| Repository avatar and social preview | Upload [`public/avatar.png`](public/avatar.png) (512 × 512) under **Settings → General → Social preview** |
| Logo | [`public/logo.svg`](public/logo.svg) — the ICKITY monogram: a serif I whose foot becomes a fountain-pen nib |
| Favicon | [`public/favicon.svg`](public/favicon.svg) |
| Contributors | Every commit on the default branch is authored `ICKITY <360687152+ICKITY@users.noreply.github.com>`, with no co-author trailers, so the contributor list shows only the project account. |

## Credits

- **Photography:** Wikimedia Commons, NASA archives, and the Library of Congress (public domain). Individual credit lines appear in every article caption.
- **Documentary video:** embedded from official and documentary YouTube channels, credited in each article.
- **Logo and icons:** hand-coded original SVG graphics created for ICKITY. `public/avatar.png` is the 512×512 square mark for the repository avatar and social preview.
- **Code, design, and editorial content:** ICKITY & InkCraft Social.

Designed & Hosted, Developed by InkCraft Social
Maintained & Hosted by ICKITY

**Contact:** [ICKITY](https://github.com/ICKITY) — [360687152+ICKITY@users.noreply.github.com](mailto:360687152+ICKITY@users.noreply.github.com)

This is an Open Source website. Released under the MIT License — see [LICENSE](LICENSE). Contributions are governed by the [Code of Conduct](CODE_OF_CONDUCT.md).
