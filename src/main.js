import './style.css';

/* ============================================================
   InkCraft Library — single-page encyclopedia application.
   The browser title is permanently "InkCraft Library".
   ============================================================ */
document.title = 'InkCraft Library';

const modules = import.meta.glob('../content/**/*.json', { eager: true });
const ARTICLES = Object.values(modules)
  .map((m) => m.default || m)
  .sort((a, b) => a.title.localeCompare(b.title));
const BY_PATH = new Map(ARTICLES.map((a) => [a.path, a]));

const CATEGORIES = [
  { name: 'History', path: '/history' },
  { name: 'Science', path: '/science' },
  { name: 'Technology', path: '/technology' },
  { name: 'Geography', path: '/geography' },
  { name: 'Biography', path: '/biography' }
];

const root = document.getElementById('root');

/* Base path support: '/' on Vercel, '/inkcraft-library/' on GitHub Pages. */
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
function stripBase(p) {
  return BASE && p.startsWith(BASE) ? p.slice(BASE.length) || '/' : p;
}

/* ---------- SVG icon helpers (hand-coded, zero emojis) ---------- */
const ICONS = {
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.3 22h-6.3l-4.9-6.4L6.5 22H3.4l7.3-8.3L2.7 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L7.1 3.9H5.3L17.8 20z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 22v-8h3l.5-4H13V7.5c0-1.1.3-1.5 1.6-1.5H17V2.2C16.4 2.1 15.2 2 13.9 2 11.1 2 9.2 3.7 9.2 6.9V10H6v4h3.2v8H13z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 3.6a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.5a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.6 3.6 12 3.6 12 3.6s-4.6 0-7.7.3c-.5.1-1.5.1-2.4 1-.7.7-.9 2.3-.9 2.3S.8 9.1.8 11v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.6 1 1.9.2 7.5.3 7.5.3s4.6 0 7.7-.4c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8V11c0-1.9-.2-3.8-.2-3.8zM9.8 15.1V8.4l6.2 3.4-6.2 3.3z"/></svg>',
  pinterest: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.3-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.5 1.9 1.9 0 3.3-2 3.3-4.8 0-2.5-1.8-4.3-4.4-4.3-3 0-4.7 2.2-4.7 4.5 0 .9.3 1.9.8 2.4.1.1.1.2.1.3l-.3 1.1c0 .2-.2.2-.4.1-1.2-.6-2-2.3-2-3.7 0-3 2.2-5.8 6.3-5.8 3.3 0 5.9 2.4 5.9 5.5 0 3.3-2.1 6-5 6-1 0-1.9-.5-2.2-1.1l-.6 2.3c-.2.8-.8 1.9-1.2 2.5.9.3 1.9.4 2.9.4 5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>',
  reddit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 13.4c-.2 1-1.2 1.7-2.4 1.8-1.8.2-4.3-.4-6.2-1.3-.5-.2-1-.5-1.4-.9-.4.4-.9.7-1.4.9-1.9.9-4.4 1.5-6.2 1.3-1.2-.1-2.2-.8-2.4-1.8-.1-.7.2-1.3.9-1.7.5-.3 1.3-.3 1.9 0 .4.2.8.6 1.2 1 .5-.2 1.1-.4 1.6-.5-.1-.3-.1-.7 0-1 .2-.8 1-1.3 1.9-1.4.4-.1.9 0 1.3.1.3-.3.8-.6 1.2-.7.5-.2 1.1-.2 1.6 0 .4.1.9.4 1.2.7.4-.1.9-.2 1.3-.1.9.1 1.7.6 1.9 1.4.1.3.1.7 0 1 .5.1 1.1.3 1.6.5.4-.4.8-.8 1.2-1 .6-.3 1.4-.3 1.9 0 .7.4 1 1 .9 1.7z"/></svg>',
  rumble: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 13.5v-7l6 3.5-6 3.5z"/></svg>'
};

const SOCIALS = [
  { key: 'x', label: 'X', handle: '@ICKlibrary', url: 'https://x.com/ICKlibrary' },
  { key: 'facebook', label: 'Facebook', handle: '@InkCraftLibrary', url: 'https://facebook.com/InkCraftLibrary' },
  { key: 'instagram', label: 'Instagram', handle: '@InkCraftLibrary', url: 'https://instagram.com/InkCraftLibrary' },
  { key: 'youtube', label: 'YouTube', handle: '@InkCraftLibrary', url: 'https://youtube.com/@InkCraftLibrary' },
  { key: 'pinterest', label: 'Pinterest', handle: '@InkCraftLibrary', url: 'https://pinterest.com/InkCraftLibrary' },
  { key: 'reddit', label: 'Reddit', handle: '@InkCraftLibrary', url: 'https://reddit.com/user/InkCraftLibrary' },
  { key: 'rumble', label: 'Rumble', handle: '@InkCraftLibrary', url: 'https://rumble.com/user/InkCraftLibrary' }
];

/* ---------- Shared chrome ---------- */
function header(active) {
  const nav = [
    { href: '/', label: 'Home', id: 'home' },
    { href: '/history/ancient-civilizations/library-of-alexandria', label: 'History', id: 'history' },
    { href: '/science/physics/general-relativity', label: 'Science', id: 'science' },
    { href: '/technology/computing/world-wide-web', label: 'Technology', id: 'technology' },
    { href: '/admin', label: 'Admin Studio', id: 'admin' }
  ];
  return (
    '<header class="site-header"><div class="header-inner">' +
    '<a class="brand" href="/"><img src="/logo.svg" alt="InkCraft Library logo">' +
    '<span><span class="brand-name">InkCraft Library</span>' +
    '<span class="brand-tag">AN OPEN SOURCE ENCYCLOPEDIA</span></span></a>' +
    '<nav class="main-nav">' +
    nav.map((n) => '<a href="' + n.href + '"' + (active === n.id ? ' class="active"' : '') + '>' + n.label + '</a>').join('') +
    '</nav></div></header>'
  );
}

function footer() {
  const cols = [
    { title: 'Encyclopedia', links: CATEGORIES.map((c) => ({ href: '/', label: c.name })) },
    {
      title: 'Featured Articles',
      links: ARTICLES.slice(0, 5).map((a) => ({ href: a.path, label: a.title }))
    },
    {
      title: 'Project',
      links: [
        { href: '/admin', label: 'Admin Studio' },
        { href: 'https://github.com/ICKITY/inkcraft-library', label: 'GitHub Repository' },
        { href: 'https://github.com/ICKITY/inkcraft-library/blob/main/LICENSE', label: 'MIT License' },
        { href: 'https://github.com/ICKITY/inkcraft-library/blob/main/CODE_OF_CONDUCT.md', label: 'Code of Conduct' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { href: 'https://commons.wikimedia.org', label: 'Wikimedia Commons' },
        { href: 'https://images.nasa.gov', label: 'NASA Image Library' },
        { href: 'https://www.loc.gov', label: 'Library of Congress' },
        { href: 'https://vercel.com', label: 'Hosted on Vercel' }
      ]
    }
  ];
  return (
    '<footer class="site-footer"><div class="footer-inner"><div class="footer-top">' +
    '<div class="footer-brand"><img src="/logo.svg" alt="InkCraft Library">' +
    '<p>InkCraft Library is a free, open source encyclopedia of history, science, technology, geography, and biography — written in full, illustrated with verified public-domain media, and interlinked like a great library.</p>' +
    '<p><strong>This is an Open Source website.</strong></p>' +
    '<div class="social-row">' +
    SOCIALS.map((s) => '<a href="' + s.url + '" target="_blank" rel="noopener" aria-label="' + s.label + ' ' + s.handle + '">' + ICONS[s.key] + '</a>').join('') +
    '</div>' +
    '<div class="social-handles">' +
    SOCIALS.map((s) => s.label + ' ' + s.handle).join('<br>') +
    '</div></div>' +
    cols.map((c) => '<div class="footer-col"><h3>' + c.title + '</h3><ul>' +
      c.links.map((l) => '<li><a href="' + l.href + '">' + l.label + '</a></li>').join('') +
      '</ul></div>').join('') +
    '</div>' +
    '<div class="footer-bottom"><span class="credits">Designed &amp; Hosted, Developed by InkCraft Social\nMaintained &amp; Hosted by InkCraft Library</span>' +
    '<span>Copyright (c) 2026 InkCraft Library &amp; InkCraft Social. Released under the MIT License.</span></div>' +
    '</div></footer>' +
    '<div class="devtools-warning" id="devtoolsWarning">Developer tools detected. InkCraft Library content is protected for editorial integrity. Please close DevTools to continue reading.</div>'
  );
}

/* ---------- Home page ---------- */
function homePage() {
  const cards = ARTICLES.map((a) =>
    '<article class="card"><img src="' + a.thumbnail + '" alt="' + a.title + '" loading="lazy">' +
    '<div class="card-body"><span class="card-crumb">' + a.category + ' / ' + a.subcategory + '</span>' +
    '<h3><a href="' + a.path + '">' + a.title + '</a></h3>' +
    '<p>' + a.summary + '</p>' +
    '<a class="read-link" href="' + a.path + '">Read the full article</a></div></article>'
  ).join('');
function countWord(n) {
  const words = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'];
  return words[n] || String(n);
}

  return (
    header('home') +
    '<section class="hero"><img class="hero-logo" src="/logo.svg" alt="InkCraft Library">' +
    '<h1>The Open Source Encyclopedia</h1>' +
    '<p>' + countWord(ARTICLES.length) + ' complete, unabridged, multi-paragraph articles spanning history, science, technology, geography, and biography — every one densely interlinked, fully illustrated with verified public-domain photography, and free for everyone to read, fork, and improve.</p>' +
    '<span class="open-source">THIS IS AN OPEN SOURCE WEBSITE</span></section>' +
    '<main class="wrap"><h2 class="section-title">Browse by Category</h2>' +
    '<div class="cat-strip">' +
    CATEGORIES.map((c) => '<a class="cat-chip" href="#articles">' + c.name + '</a>').join('') +
    '</div>' +
    '<h2 class="section-title" id="articles">All Articles</h2>' +
    '<div class="card-grid">' + cards + '</div>' +
    '<h2 class="section-title">About This Library</h2>' +
    '<p>InkCraft Library is an institutional-grade publishing project. Each article is stored as a structured JSON file inside nested category folders, rendered by a lightweight single-page application, and deployed to the world on Vercel. Team members can add new articles directly on GitHub — or visually, from the password-protected Admin Studio — without writing a single line of code.</p>' +
    '<p>Every photograph on this site is a real, verified public-domain image from Wikimedia Commons, NASA archives, or the Library of Congress. Every icon is a hand-coded SVG. There is no AI-generated media and there are no emojis anywhere in this codebase.</p>' +
    '</main>' +
    footer()
  );
}

/* ---------- Article page ---------- */
function cite(n) {
  return '<sup class="cite">[' + n + ']</sup>';
}

function articlePage(a) {
  const tocItems = a.sections
    .map((s, i) => '<li><a href="#section-' + i + '">' + s.heading + '</a></li>')
    .join('');
  const introHtml = a.intro
    .map((p, i) => '<p' + (i === 0 ? ' class="lead"' : '') + '>' + p + '</p>')
    .join('');
  const sectionsHtml = a.sections
    .map((s, i) => {
      const tag = s.level === 'h3' ? 'h3' : 'h2';
      const paras = s.paragraphs
        .map((p, j) => '<p>' + p + (j === 0 ? cite((i % a.references.length) + 1) : '') + '</p>')
        .join('');
      return '<' + tag + ' id="section-' + i + '">' + s.heading + '</' + tag + '>' + paras;
    })
    .join('');
  const pull = a.pullQuote
    ? '<blockquote class="pull-quote">' + a.pullQuote.text + '<cite>— ' + a.pullQuote.source + '</cite></blockquote>'
    : '';
  const mediaHtml = (a.media || [])
    .map((m) => {
      if (m.type === 'video') {
        return '<figure class="video-embed"><div class="video-frame">' +
          '<iframe src="' + m.src + '" title="' + m.caption + '" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
          '</div><figcaption>' + m.caption + '</figcaption></figure>';
      }
      return '<figure class="figure"><img src="' + m.src + '" alt="' + m.caption + '" loading="lazy">' +
        '<figcaption>' + m.caption + ' <a class="download-btn" href="' + m.src + '" download target="_blank" rel="noopener">Download Original Media</a></figcaption></figure>';
    })
    .join('');
  const infoboxRows = a.infobox.rows
    .map((r) => '<tr><th>' + r.label + '</th><td>' + r.value + '</td></tr>')
    .join('');
  const seeAlso = (a.seeAlso || [])
    .map((p) => {
      const t = BY_PATH.get(p);
      return t ? '<a href="' + p + '">' + t.title + '</a>' : '';
    })
    .join('');
  const navboxRows = CATEGORIES.map((c) => {
    const items = ARTICLES.filter((x) => x.category === c.name);
    if (!items.length) return '';
    return '<div class="navbox-row"><div class="navbox-group">' + c.name + '</div><div class="navbox-links">' +
      items.map((x) => '<a href="' + x.path + '">' + x.title + '</a>').join('') + '</div></div>';
  }).join('');
  const refs = a.references.map((r) => '<li>' + r + '</li>').join('');

  return (
    header('') +
    '<div class="article-layout">' +
    '<aside class="toc-col">' +
    '<nav class="breadcrumbs"><a href="/">Home</a> / <a href="/#articles">' + a.category + '</a> / ' + a.subcategory + ' / <strong>' + a.title + '</strong></nav>' +
    '<div class="toc-box"><h2>Contents</h2><ol>' + tocItems + '</ol></div>' +
    '</aside>' +
    '<main class="article-body"><h1>' + a.title + '</h1>' +
    '<div class="subtitle">InkCraft Library · ' + a.category + ' · ' + a.subcategory + '</div>' +
    introHtml + pull + sectionsHtml + mediaHtml +
    '</main>' +
    '<aside class="infobox"><h2 class="infobox-title">' + a.title + '</h2>' +
    '<img src="' + a.infobox.image + '" alt="' + a.infobox.caption + '">' +
    '<div class="infobox-caption">' + a.infobox.caption + '</div>' +
    '<table>' + infoboxRows + '</table></aside>' +
    '</div>' +
    '<section class="bottom-sections">' +
    '<h2 class="section-title">See Also</h2><div class="see-also">' + seeAlso + '</div>' +
    '<div class="navbox"><div class="navbox-title">InkCraft Library — Encyclopedia Topic Navbox</div>' + navboxRows + '</div>' +
    '<div class="references"><h2 class="section-title">References</h2><ol>' + refs + '</ol></div>' +
    '</section>' +
    footer()
  );
}

/* ---------- 404 ---------- */
function notFoundPage() {
  return (
    header('') +
    '<main class="not-found"><h1>404</h1><p>This shelf is empty. The page you requested does not exist in the library.</p>' +
    '<p><a href="/">Return to the InkCraft Library home page</a></p></main>' +
    footer()
  );
}

/* ============================================================
   ADMIN STUDIO (/admin) — password-protected visual editor
   ============================================================ */
const ADMIN_PASSWORD = 'inkcraft2026';

function adminPage() {
  if (sessionStorage.getItem('ic_admin') !== '1') {
    return (
      header('admin') +
      '<main class="admin-shell"><div class="admin-gate"><h1>Admin Studio</h1>' +
      '<p class="admin-note">This studio is restricted to the InkCraft Library editorial team. Enter the studio password to continue.</p>' +
      '<div class="field"><label for="adminPass">Studio password</label>' +
      '<input id="adminPass" type="password" autocomplete="off" placeholder="Enter password"></div>' +
      '<button class="btn" id="adminLogin">Unlock Studio</button>' +
      '<p class="admin-msg" id="adminMsg"></p></div></main>' +
      footer()
    );
  }
  const articleOptions = ARTICLES.map((a) => '<option value="' + a.path + '">' + a.title + ' (' + a.path + ')</option>').join('');
  return (
    header('admin') +
    '<main class="admin-shell">' +
    '<h1>Admin Studio — Visual Article Editor</h1>' +
    '<p class="admin-note">Build a complete article visually, then export a ready-to-commit .json file. Save it on GitHub at the path shown in the export panel: Add file, Create new file, then paste the JSON.</p>' +

    '<section class="admin-panel"><h2>1 · Folder-Inside-Folder Creator</h2>' +
    '<div class="admin-grid">' +
    '<div class="field"><label>Category folder</label><input id="fCategory" placeholder="e.g. history"></div>' +
    '<div class="field"><label>Subcategory folder</label><input id="fSubcategory" placeholder="e.g. ancient-civilizations"></div>' +
    '<div class="field"><label>Article file name (slug)</label><input id="fSlug" placeholder="e.g. library-of-alexandria"></div>' +
    '<div class="field"><label>Article title</label><input id="fTitle" placeholder="e.g. Library of Alexandria"></div>' +
    '</div><p class="admin-note" id="fPathNote">Target path: content/…</p></section>' +

    '<section class="admin-panel"><h2>2 · Summary, Thumbnail &amp; Infobox</h2>' +
    '<div class="field"><label>Opening summary (shown on hover preview cards)</label><textarea id="fSummary" placeholder="One or two sentences summarising the topic."></textarea></div>' +
    '<div class="field"><label>Thumbnail image URL (Wikimedia Commons / NASA / Library of Congress)</label><input id="fThumbnail" placeholder="https://commons.wikimedia.org/wiki/Special:FilePath/…"></div>' +
    '<div class="field"><label>Thumbnail caption</label><input id="fThumbCaption" placeholder="Credit line for the thumbnail"></div>' +
    '<div class="field"><label>Infobox image URL</label><input id="fInfoImage" placeholder="https://…"></div>' +
    '<div class="field"><label>Infobox caption</label><input id="fInfoCaption" placeholder="Credit line for the infobox photo"></div>' +
    '<div class="field"><label>Infobox rows (one per line, format: Label: Value)</label><textarea id="fInfoRows" placeholder="Born: 1879, Ulm, Germany"></textarea></div>' +
    '</section>' +

    '<section class="admin-panel"><h2>3 · Introductory Paragraphs</h2>' +
    '<p class="admin-note">Write one paragraph per box. Add as many as you need — every article needs at least three rich introductory paragraphs.</p>' +
    '<div id="introBuilder"></div><button class="btn secondary" id="addIntro">Add intro paragraph</button></section>' +

    '<section class="admin-panel"><h2>4 · Section Builder (H2 / H3)</h2>' +
    '<div id="sectionBuilder"></div><button class="btn secondary" id="addSection">Add section</button></section>' +

    '<section class="admin-panel"><h2>5 · Internal Wiki-Link Inserter</h2>' +
    '<div class="admin-grid">' +
    '<div class="field"><label>Link target article</label><select id="linkTarget">' + articleOptions + '</select></div>' +
    '<div class="field"><label>Insert into</label><select id="linkField"><option value="summary">Summary</option><option value="intro">First intro paragraph</option></select></div>' +
    '</div><button class="btn secondary" id="insertLink">Insert wiki-link at cursor</button>' +
    '<p class="admin-note">Place your cursor in the Summary or first intro paragraph, choose a target, and click Insert. The link is added as a clickable .wiki-link with a hover preview card.</p></section>' +

    '<section class="admin-panel"><h2>6 · Media Uploader (PNG, JPG, JPEG, GIF)</h2>' +
    '<div class="field"><label>Upload an image from your device</label><input id="mediaFile" type="file" accept="image/png,image/jpeg,image/gif"></div>' +
    '<img id="mediaPreview" class="media-preview" alt="Uploaded media preview" style="display:none">' +
    '<div class="field"><label>Or paste a verified public-domain image URL</label><input id="mediaUrl" placeholder="https://commons.wikimedia.org/wiki/Special:FilePath/…"></div>' +
    '<div class="field"><label>Caption</label><input id="mediaCaption" placeholder="Caption and credit line"></div>' +
    '<button class="btn secondary" id="addMedia">Add image to article media</button>' +
    '<p class="admin-note">Only real, verified public-domain media may be used. AI-generated images are prohibited.</p></section>' +

    '<section class="admin-panel"><h2>7 · Video &amp; Social Embedder</h2>' +
    '<div class="admin-grid">' +
    '<div class="field"><label>Platform</label><select id="videoPlatform">' +
    '<option value="youtube">YouTube</option><option value="x">X (Twitter)</option><option value="facebook">Facebook</option>' +
    '<option value="instagram">Instagram</option><option value="pinterest">Pinterest</option><option value="reddit">Reddit</option>' +
    '<option value="rumble">Rumble</option><option value="mp4">Self-hosted .mp4 / .webm</option></select></div>' +
    '<div class="field"><label>Post / video URL</label><input id="videoUrl" placeholder="https://www.youtube.com/watch?v=…"></div>' +
    '</div><div class="field"><label>Generated embed code</label><textarea id="videoCode" readonly placeholder="Embed code appears here"></textarea></div>' +
    '<button class="btn secondary" id="genVideo">Generate embed code</button> ' +
    '<button class="btn secondary" id="addVideo">Add video to article media</button></section>' +

    '<section class="admin-panel"><h2>8 · Raw Code Block Mode (HTML / CSS / JS)</h2>' +
    '<div class="field"><label>Code</label><textarea id="codeInput" placeholder="Paste raw HTML, CSS or JS here"></textarea></div>' +
    '<button class="btn secondary" id="codePreviewBtn">Live preview</button> ' +
    '<button class="btn secondary" id="codeCopyBtn">Copy code</button>' +
    '<h3>Live preview</h3><iframe class="preview-frame" id="codePreview" title="Code preview"></iframe></section>' +

    '<section class="admin-panel"><h2>9 · Pull Quote, See Also &amp; References</h2>' +
    '<div class="field"><label>Pull quote text</label><textarea id="fQuote" placeholder="A memorable line from the article"></textarea></div>' +
    '<div class="field"><label>Pull quote source</label><input id="fQuoteSource" placeholder="Who said it"></div>' +
    '<div class="field"><label>See Also (one article path per line)</label><textarea id="fSeeAlso" placeholder="/science/physics/general-relativity"></textarea></div>' +
    '<div class="field"><label>References (one per line)</label><textarea id="fReferences" placeholder="Author, Title, Publisher, Year"></textarea></div>' +
    '</section>' +

    '<section class="admin-panel"><h2>10 · Export .json for GitHub</h2>' +
    '<p class="admin-note" id="exportPath">Target: content/…</p>' +
    '<div class="field"><label>Article JSON</label><textarea id="exportJson" readonly style="min-height:220px"></textarea></div>' +
    '<button class="btn" id="buildJson">Build JSON</button> ' +
    '<button class="btn secondary" id="downloadJson">Download .json</button> ' +
    '<button class="btn secondary" id="copyJson">Copy JSON</button>' +
    '<p class="admin-msg" id="exportMsg"></p></section>' +

    '<section class="admin-panel"><h2>Existing Articles</h2><ul>' +
    ARTICLES.map((a) => '<li><a href="' + a.path + '">' + a.title + '</a> <span class="admin-note">' + a.path + '</span></li>').join('') +
    '</ul><button class="btn secondary" id="adminLogout">Lock Studio</button></section>' +
    '</main>' +
    footer()
  );
}

/* ---------- Admin logic ---------- */
let adminState = { intros: [''], sections: [{ level: 'h2', heading: '', paragraphs: [''] }], media: [] };

function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function renderBuilders() {
  const introBox = document.getElementById('introBuilder');
  if (introBox) {
    introBox.innerHTML = adminState.intros
      .map((t, i) => '<div class="field"><label>Intro paragraph ' + (i + 1) + '</label><textarea data-intro="' + i + '">' + t + '</textarea></div>')
      .join('');
  }
  const secBox = document.getElementById('sectionBuilder');
  if (secBox) {
    secBox.innerHTML = adminState.sections
      .map((s, i) =>
        '<div class="section-builder"><div class="admin-grid">' +
        '<div class="field"><label>Level</label><select data-sec-level="' + i + '">' +
        '<option value="h2"' + (s.level === 'h2' ? ' selected' : '') + '>H2 — major section</option>' +
        '<option value="h3"' + (s.level === 'h3' ? ' selected' : '') + '>H3 — subsection</option></select></div>' +
        '<div class="field"><label>Heading</label><input data-sec-heading="' + i + '" value="' + s.heading.replace(/"/g, '&quot;') + '"></div></div>' +
        '<div class="field"><label>Paragraphs (separate with a blank line)</label><textarea data-sec-paras="' + i + '">' + s.paragraphs.join('\n\n') + '</textarea></div>' +
        '<button class="btn secondary" data-remove-sec="' + i + '">Remove section</button></div>'
      )
      .join('');
  }
}

function syncBuildersFromDom() {
  document.querySelectorAll('[data-intro]').forEach((el) => { adminState.intros[+el.dataset.intro] = el.value; });
  document.querySelectorAll('[data-sec-heading]').forEach((el) => { adminState.sections[+el.dataset.secHeading].heading = el.value; });
  document.querySelectorAll('[data-sec-level]').forEach((el) => { adminState.sections[+el.dataset.secLevel].level = el.value; });
  document.querySelectorAll('[data-sec-paras]').forEach((el) => {
    adminState.sections[+el.dataset.secParas].paragraphs = el.value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  });
}

function targetPath() {
  const cat = slugify(document.getElementById('fCategory').value || 'history');
  const sub = slugify(document.getElementById('fSubcategory').value || 'general');
  const slug = slugify(document.getElementById('fSlug').value || 'new-article');
  return { cat, sub, slug, file: 'content/' + cat + '/' + sub + '/' + slug + '.json', route: '/' + cat + '/' + sub + '/' + slug };
}

function buildArticleJson() {
  syncBuildersFromDom();
  const t = targetPath();
  const rows = document.getElementById('fInfoRows').value.split('\n').map((l) => l.trim()).filter(Boolean)
    .map((l) => {
      const idx = l.indexOf(':');
      return idx > -1 ? { label: l.slice(0, idx).trim(), value: l.slice(idx + 1).trim() } : { label: 'Detail', value: l };
    });
  const obj = {
    slug: t.slug,
    title: document.getElementById('fTitle').value.trim() || 'Untitled Article',
    category: t.cat.replace(/(^|-)(\w)/g, (m, p1, p2) => p1 + p2.toUpperCase()),
    subcategory: t.sub.replace(/(^|-)(\w)/g, (m, p1, p2) => p1 + p2.toUpperCase()),
    path: t.route,
    summary: document.getElementById('fSummary').value.trim(),
    thumbnail: document.getElementById('fThumbnail').value.trim(),
    thumbnailCaption: document.getElementById('fThumbCaption').value.trim(),
    infobox: {
      image: document.getElementById('fInfoImage').value.trim(),
      caption: document.getElementById('fInfoCaption').value.trim(),
      rows
    },
    intro: adminState.intros.map((p) => p.trim()).filter(Boolean),
    sections: adminState.sections.filter((s) => s.heading.trim()).map((s) => ({
      level: s.level, heading: s.heading.trim(), paragraphs: s.paragraphs.map((p) => p.trim()).filter(Boolean)
    })),
    pullQuote: document.getElementById('fQuote').value.trim()
      ? { text: document.getElementById('fQuote').value.trim(), source: document.getElementById('fQuoteSource').value.trim() }
      : null,
    media: adminState.media,
    seeAlso: document.getElementById('fSeeAlso').value.split('\n').map((l) => l.trim()).filter(Boolean),
    references: document.getElementById('fReferences').value.split('\n').map((l) => l.trim()).filter(Boolean)
  };
  return obj;
}

function initAdmin() {
  const loginBtn = document.getElementById('adminLogin');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const val = document.getElementById('adminPass').value;
      if (val === ADMIN_PASSWORD) {
        sessionStorage.setItem('ic_admin', '1');
        render();
      } else {
        document.getElementById('adminMsg').textContent = 'Incorrect password. Access denied.';
      }
    });
    return;
  }
  renderBuilders();
  const updatePath = () => {
    const t = targetPath();
    document.getElementById('fPathNote').textContent = 'Target path: ' + t.file + '  ·  Route: ' + t.route;
    document.getElementById('exportPath').textContent = 'Target: ' + t.file;
  };
  ['fCategory', 'fSubcategory', 'fSlug'].forEach((id) => document.getElementById(id).addEventListener('input', updatePath));
  updatePath();

  document.getElementById('addIntro').addEventListener('click', () => { syncBuildersFromDom(); adminState.intros.push(''); renderBuilders(); });
  document.getElementById('addSection').addEventListener('click', () => { syncBuildersFromDom(); adminState.sections.push({ level: 'h2', heading: '', paragraphs: [''] }); renderBuilders(); });
  document.getElementById('sectionBuilder').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-sec]');
    if (btn) { syncBuildersFromDom(); adminState.sections.splice(+btn.dataset.removeSec, 1); renderBuilders(); }
  });

  document.getElementById('insertLink').addEventListener('click', () => {
    const target = BY_PATH.get(document.getElementById('linkTarget').value);
    if (!target) return;
    const field = document.getElementById('linkField').value;
    let ta;
    if (field === 'summary') ta = document.getElementById('fSummary');
    else ta = document.querySelector('[data-intro="0"]');
    if (!ta) return;
    const snippet = "<a class='wiki-link' href='" + target.path + "'>" + target.title + '</a>';
    const start = ta.selectionStart || ta.value.length;
    const end = ta.selectionEnd || ta.value.length;
    ta.value = ta.value.slice(0, start) + snippet + ta.value.slice(end);
    ta.focus();
    ta.selectionStart = ta.selectionEnd = start + snippet.length;
  });

  const fileInput = document.getElementById('mediaFile');
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById('mediaUrl').value = reader.result;
      const prev = document.getElementById('mediaPreview');
      prev.src = reader.result;
      prev.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });
  document.getElementById('addMedia').addEventListener('click', () => {
    const src = document.getElementById('mediaUrl').value.trim();
    const caption = document.getElementById('mediaCaption').value.trim() || 'Archival photograph';
    if (!src) return;
    adminState.media.push({ type: 'image', src, caption });
    document.getElementById('mediaUrl').value = '';
    document.getElementById('mediaCaption').value = '';
    document.getElementById('mediaPreview').style.display = 'none';
  });

  document.getElementById('genVideo').addEventListener('click', () => {
    const platform = document.getElementById('videoPlatform').value;
    const url = document.getElementById('videoUrl').value.trim();
    let code = '';
    if (platform === 'youtube') {
      const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/);
      if (m) code = '<iframe src="https://www.youtube-nocookie.com/embed/' + m[1] + '" title="Documentary video" allowfullscreen></iframe>';
    } else if (platform === 'mp4') {
      code = '<video controls src="' + url + '"></video>';
    } else {
      code = '<blockquote><a href="' + url + '">View on ' + platform + '</a></blockquote>';
    }
    document.getElementById('videoCode').value = code || 'Could not parse that URL. Paste a full post URL.';
  });
  document.getElementById('addVideo').addEventListener('click', () => {
    const code = document.getElementById('videoCode').value.trim();
    if (!code) return;
    const m = code.match(/src="([^"]+)"/);
    if (m) adminState.media.push({ type: 'video', src: m[1], caption: 'Embedded documentary video' });
  });

  document.getElementById('codePreviewBtn').addEventListener('click', () => {
    document.getElementById('codePreview').srcdoc = document.getElementById('codeInput').value;
  });
  document.getElementById('codeCopyBtn').addEventListener('click', () => {
    document.getElementById('codeInput').select();
    document.execCommand('copy');
  });

  document.getElementById('buildJson').addEventListener('click', () => {
    document.getElementById('exportJson').value = JSON.stringify(buildArticleJson(), null, 2);
  });
  document.getElementById('downloadJson').addEventListener('click', () => {
    const json = document.getElementById('exportJson').value || JSON.stringify(buildArticleJson(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = targetPath().slug + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
    document.getElementById('exportMsg').textContent = 'Downloaded. Now add it on GitHub at ' + targetPath().file + '.';
  });
  document.getElementById('copyJson').addEventListener('click', () => {
    const ta = document.getElementById('exportJson');
    ta.select();
    document.execCommand('copy');
    document.getElementById('exportMsg').textContent = 'JSON copied to clipboard.';
  });
  document.getElementById('adminLogout').addEventListener('click', () => {
    sessionStorage.removeItem('ic_admin');
    render();
  });
}

/* ---------- Router ---------- */
function currentPath() {
  let p = window.location.pathname;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

function render() {
  document.title = 'InkCraft Library';
  const p = currentPath();
  let html;
  if (p === '/') html = homePage();
  else if (p === '/admin') html = adminPage();
  else if (BY_PATH.has(p)) html = articlePage(BY_PATH.get(p));
  else html = notFoundPage();
  root.innerHTML = html;
  if (p === '/admin') initAdmin();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="/"]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (href.startsWith('//')) return;
  e.preventDefault();
  if (stripBase(href) === currentPath()) return;
  window.history.pushState({}, '', href);
  render();
});
window.addEventListener('popstate', render);

/* ---------- Hover preview cards for wiki-links ---------- */
const hoverCard = document.createElement('div');
hoverCard.className = 'hover-card';
document.body.appendChild(hoverCard);

document.addEventListener('mouseover', (e) => {
  const link = e.target.closest('.wiki-link');
  if (!link) return;
  const target = BY_PATH.get(link.getAttribute('href'));
  if (!target) return;
  hoverCard.innerHTML =
    '<img src="' + target.thumbnail + '" alt="">' +
    '<div class="hc-body"><span class="hc-crumb">' + target.category + ' / ' + target.subcategory + '</span>' +
    '<h4>' + target.title + '</h4><p>' + target.summary + '</p></div>';
  hoverCard.classList.add('visible');
  const r = link.getBoundingClientRect();
  const x = Math.min(r.left, window.innerWidth - 340);
  const y = r.bottom + 10;
  hoverCard.style.left = Math.max(8, x) + 'px';
  hoverCard.style.top = (y + 320 > window.innerHeight ? Math.max(8, r.top - 330) : y) + 'px';
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest('.wiki-link')) hoverCard.classList.remove('visible');
});
document.addEventListener('scroll', () => hoverCard.classList.remove('visible'), { passive: true });

/* ============================================================
   ANTI-COPY / ANTI-ZOOM / ANTI-INSPECT LOCKS
   (smooth scrolling remains fully enabled)
   ============================================================ */
function isAdminField(el) {
  return el && el.closest('.admin-shell') && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
}

['contextmenu', 'copy', 'cut', 'paste', 'selectstart', 'dragstart'].forEach((evt) => {
  document.addEventListener(evt, (e) => {
    if (isAdminField(e.target)) return;
    e.preventDefault();
  }, { passive: false });
});

document.addEventListener('keydown', (e) => {
  const key = (e.key || '').toLowerCase();
  const mod = e.ctrlKey || e.metaKey;
  if (e.key === 'F12') { e.preventDefault(); return; }
  if (mod && e.shiftKey && ['i', 'j', 'c'].includes(key)) { e.preventDefault(); return; }
  if (mod && ['u', 's', 'p'].includes(key)) { e.preventDefault(); return; }
  if (mod && ['+', '-', '=', '0'].includes(key)) { e.preventDefault(); return; }
}, { passive: false });

document.addEventListener('wheel', (e) => {
  if (e.ctrlKey || e.metaKey) e.preventDefault();
}, { passive: false });

['gesturestart', 'gesturechange', 'gestureend'].forEach((evt) => {
  document.addEventListener(evt, (e) => e.preventDefault(), { passive: false });
});

document.addEventListener('touchmove', (e) => {
  if (e.touches && e.touches.length > 1) e.preventDefault();
}, { passive: false });

/* DevTools detection guard */
let devtoolsOpen = false;
setInterval(() => {
  const w = window.outerWidth - window.innerWidth;
  const h = window.outerHeight - window.innerHeight;
  const open = w > 180 || h > 180;
  if (open && !devtoolsOpen) {
    devtoolsOpen = true;
    const warn = document.getElementById('devtoolsWarning');
    if (warn) warn.classList.add('visible');
  } else if (!open && devtoolsOpen) {
    devtoolsOpen = false;
    const warn = document.getElementById('devtoolsWarning');
    if (warn) warn.classList.remove('visible');
  }
}, 1200);

/* Initial render */
render();
