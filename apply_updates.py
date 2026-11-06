#!/usr/bin/env python3
"""apply_updates.py - applies this update to the HTML pages of the site.

Run it from the repository root (the folder that contains index.html):

    python apply_updates.py --dry-run     # shows what would change, writes nothing
    python apply_updates.py               # applies the changes

Safe to run twice (steps that are already applied are skipped). Each page is changed all-or-nothing: if any step
cannot find its place in a page, that page is left untouched and the problem is printed. Windows (CRLF) line
endings are preserved. Commit your current state to git first, so `git diff` shows exactly what changed.
"""
import argparse
import datetime
import re
import sys
from pathlib import Path
from urllib.parse import quote

ROOT = Path.cwd()
SITE = "https://pavleradojevic07.github.io/pavle.radojevic"
PAGES = ["index", "basketball", "academic", "plates", "visitors", "privacy", "terms", "cookies"]
OG_PAGES = ["index", "basketball", "academic", "plates", "visitors"]
LEGAL_PAGES = ["privacy", "terms", "cookies"]
REQUIRED_FILES = [
    "assets/site.js", "assets/site.css", "images/og-image.png", "files/pavle-radojevic-player-sheet.pdf",
    "assets/vendor/leaflet/leaflet.js", "assets/vendor/leaflet/leaflet.css", "assets/vendor/three/three.module.min.js",
    "assets/vendor/three/addons/controls/OrbitControls.js", "assets/vendor/three/earth_atmos_2048.jpg", "countries.geojson",
]
d = datetime.date.today()
TODAY = f"{d:%B} {d.day}, {d.year}"


class Ctx:
    def __init__(self, page):
        self.page, self.log, self.problems = page, [], []

    def ok(self, msg): self.log.append("  + " + msg)
    def skip(self, msg): self.log.append("  . " + msg + " (already done)")
    def bad(self, msg): self.problems.append(msg); self.log.append("  ! " + msg)


def sub1(text, ctx, label, pattern, repl, marker=None, flags=re.S):
    """Replace the first match of `pattern`. `marker` (a string) means 'already applied' if present in the page."""
    if marker and marker in text:
        ctx.skip(label); return text
    new, n = re.subn(pattern, lambda m: repl(m) if callable(repl) else repl, text, count=1, flags=flags)
    if n == 0:
        ctx.bad(f"{label}: place to change not found"); return text
    ctx.ok(label); return new


def remove_scripts(text, needle, max_len=None):
    """Remove every plain inline <script>...</script> whose body contains `needle`. Returns (text, count)."""
    count = 0
    def repl(m):
        nonlocal count
        body = m.group(1)
        if needle in body and (max_len is None or len(body) < max_len):
            count += 1; return ""
        return m.group(0)
    return re.sub(r"[ \t]*<script>(.*?)</script>[ \t]*\n?", repl, text, flags=re.S), count


# ───────────────────────── step 1: shared code moves to assets/site.css + assets/site.js ─────────────────────────
STYLE_BLOCK = re.compile(r"[ \t]*<style>\s*/\* Light-theme accent colors darkened.*?</style>[ \t]*\n?", re.S)
BANNER_STYLE = re.compile(r"[ \t]*<style>\s*#analytics-consent-banner \{.*?</style>[ \t]*\n?", re.S)
THEME_SEG = re.compile(r"[ \t]*(?://[^\n]*[Tt]heme toggle[^\n]*\n[ \t]*)?const themeToggle = document\.getElementById\('themeToggle'\);"
                       r".*?SameSite=Lax' \+ \(location\.protocol === 'https:' \? ';Secure' : ''\);\s*\}\);[ \t]*\n?", re.S)
MENU_SEG = re.compile(r"[ \t]*(?://[^\n]*[Mm]obile menu[^\n]*\n[ \t]*)?const mobileMenuBtn = document\.getElementById\('mobileMenuBtn'\);\s*"
                      r"const navLinks = document\.getElementById\('navLinks'\);\s*mobileMenuBtn\.addEventListener\('click', \(\) => \{"
                      r".*?aria-expanded', navLinks\.classList\.contains\('mobile-open'\) \? 'true' : 'false'\);\s*\}\);[ \t]*\n?", re.S)
EMPTY_SCRIPT = re.compile(r"[ \t]*<script>\s*</script>[ \t]*\n?")


def step_shared(text, ctx):
    if "assets/site.js" in text:
        ctx.skip("shared CSS/JS extraction"); return text
    known = {l.strip() for l in (ROOT / "assets/site.css").read_text(encoding="utf-8").replace("\r\n", "\n").splitlines()}
    m = STYLE_BLOCK.search(text)
    if not m:
        ctx.bad("shared <style> block not found"); return text
    inner = re.sub(r"^\s*<style>|</style>\s*$", "", m.group(0).strip())
    residual = [l.rstrip() for l in inner.splitlines() if l.strip() and l.strip() not in known]
    if "".join(residual).count("{") != "".join(residual).count("}"):
        ctx.bad("page-specific rules inside the shared <style> block are not single-line; left as is"); return text
    link = '    <link rel="stylesheet" href="assets/site.css">\n'
    if residual:
        link += "    <style>\n" + "\n".join("    " + l.strip() for l in residual) + "\n    </style>\n"
    t = text[:m.start()] + link + text[m.end():]
    ctx.ok(f"shared <style> block -> assets/site.css" + (f" (kept {len(residual)} page-specific rule lines inline)" if residual else ""))

    t, n = BANNER_STYLE.subn("", t, count=1)
    ctx.ok("consent-banner <style> removed (now in site.css)") if n else ctx.bad("consent-banner <style> not found")
    t = re.sub(r"[ \t]*<!--[^>]*Tracking script[^>]*-->[ \t]*\n?", "", t, count=1)
    t, n = remove_scripts(t, "const WORKER_URL")
    ctx.ok("inline tracker/consent script removed (now in site.js)") if n == 1 else ctx.bad(f"tracker script: expected 1, found {n}")
    t, n = remove_scripts(t, "Scroll progress + back to top")
    ctx.ok("inline UI script removed (now in site.js)") if n == 1 else ctx.bad(f"UI script: expected 1, found {n}")
    t, n = remove_scripts(t, "getElementById('cookiePrefsBtn')", max_len=900)
    ctx.ok("inline cookie-preferences snippet removed") if n >= 1 else ctx.bad("cookie-preferences snippet not found")
    t, n = THEME_SEG.subn("", t, count=1)
    ctx.ok("inline theme toggle removed (now in site.js)") if n == 1 else ctx.bad("theme toggle code not found")
    t, n = MENU_SEG.subn("", t, count=1)
    ctx.ok("inline mobile-menu code removed (now in site.js)") if n == 1 else ctx.bad("mobile-menu code not found")
    t = EMPTY_SCRIPT.sub("", t)

    t, n = re.subn(r'([ \t]*)<script src="assets/modern\.js" defer></script>',
                   lambda m: m.group(0) + "\n" + m.group(1) + '<script src="assets/site.js" defer></script>', t, count=1)
    ctx.ok("site.js added") if n else ctx.bad('<script src="assets/modern.js"> not found (site.js not added)')

    for leftover in ("const WORKER_URL", "getElementById('themeToggle')", "getElementById('mobileMenuBtn')",
                     "Scroll progress + back to top", "getElementById('cookiePrefsBtn')"):
        if leftover in t:
            ctx.bad(f"old inline code still present after patch: {leftover}")
    return t


# ───────────────────────── step 2: social preview image ─────────────────────────
def step_og(text, ctx):
    img = f"{SITE}/images/og-image.png"
    alt = "Pavle Radojević: basketball player, mathematics student and license plate collector"
    if "og-image.png" in text:
        ctx.skip("social preview image"); return text
    def og(m):
        i = m.group(1)
        return (f'{i}<meta property="og:image" content="{img}">\n{i}<meta property="og:image:width" content="1200">\n'
                f'{i}<meta property="og:image:height" content="630">\n{i}<meta property="og:image:alt" content="{alt}">')
    t = sub1(text, ctx, "og:image -> images/og-image.png (1200x630)", r'^([ \t]*)<meta property="og:image" content="[^"]*">', og, flags=re.M)
    t = sub1(t, ctx, "twitter:image added", r'^([ \t]*)<meta name="twitter:card" content="summary_large_image">',
             lambda m: m.group(0) + f'\n{m.group(1)}<meta name="twitter:image" content="{img}">', flags=re.M)
    return t


# ───────────────────────── step 3: home page intro ─────────────────────────
INTRO = """    <section class="home-intro" aria-labelledby="home-title">
        <h1 id="home-title">Pavle Radojević</h1>
        <p>Basketball player, mathematics student and license plate collector.</p>
        <div class="home-intro-actions">
            <a href="basketball.html#highlights" class="intro-btn intro-btn-primary">Watch highlights</a>
            <a href="mailto:pavle.radojevic07@gmail.com" class="intro-btn">Get in touch</a>
        </div>
    </section>

"""


def step_index(text, ctx):
    return sub1(text, ctx, "home intro (name, description, two actions)", r'^([ \t]*)<main class="hero"',
                lambda m: INTRO + m.group(0), marker='class="home-intro"', flags=re.M)


# ───────────────────────── step 4: basketball page (player sheet, recruiting button, video) ─────────────────────────
MAIL = ("mailto:pavle.radojevic07@gmail.com?subject=" + quote("Recruiting inquiry - Pavle Radojević") + "&amp;body=" +
        quote("Hello Pavle,\n\nI am writing on behalf of [club / school / agency] about [opportunity].\n\nBest regards,\n[Your name]").replace("%0A", "%0D%0A"))
CTA = f"""
                    <div class="action-links profile-cta">
                        <a href="files/pavle-radojevic-player-sheet.pdf" class="btn-outline" download>📄 Player sheet (PDF)</a>
                        <a href="{MAIL}" class="btn-outline">✉️ Recruiting inquiry</a>
                    </div>"""
VIDEO = """
            <div class="video-embed">
                <a href="https://youtu.be/clxgFeRJaLQ" class="video-facade" data-video-id="clxgFeRJaLQ" data-title="Pavle Radojević - Highlights 2025/26" data-label="Highlight video 2025/26 (played on site)" target="_blank" rel="noopener">
                    <span class="video-play" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 24 24" focusable="false"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>
                    <span class="video-title">Highlights 2025/26</span>
                    <span class="video-note">Plays on this page when you press it. Nothing loads from YouTube until then.</span>
                </a>
            </div>"""


def step_basketball(text, ctx):
    t = sub1(text, ctx, "player sheet + recruiting buttons under the profile", r"(Currently competing[^<]*?for KK Portorož\.\s*</p>)",
             lambda m: m.group(1) + CTA, marker='class="action-links profile-cta"')
    t = sub1(t, ctx, "highlight video facade + #highlights anchor",
             r'<h2 (style="[^"]*">Highlights (?:&|&amp;) Statistics</h2>)',
             lambda m: '<h2 id="highlights" ' + m.group(1) + VIDEO, marker='class="video-embed"')
    t = re.sub(r'[ \t]*<a href="https://youtu\.be/clxgFeRJaLQ[^"]*" class="btn-outline">[^<]*</a>[ \t]*\n', "", t, count=1)
    return t


# ───────────────────────── step 5: self-host Leaflet, three.js, Earth texture, country shapes ─────────────────────────
def step_plates(text, ctx):
    t = sub1(text, ctx, "three.js import map -> assets/vendor/three", r'<script type="importmap">.*?</script>',
             '<script type="importmap">\n        { "imports": { "three": "./assets/vendor/three/three.module.min.js", "three/addons/": "./assets/vendor/three/addons/" } }\n    </script>',
             marker="assets/vendor/three/")
    t = sub1(t, ctx, "Earth texture -> assets/vendor/three", r"https://threejs\.org/examples/textures/planets/earth_atmos_2048\.jpg",
             "assets/vendor/three/earth_atmos_2048.jpg", marker="assets/vendor/three/earth_atmos_2048.jpg")
    return t


def step_visitors(text, ctx):
    t = sub1(text, ctx, "Leaflet CSS -> assets/vendor/leaflet", r'<link rel="stylesheet" href="https://unpkg\.com/leaflet@1\.9\.4/dist/leaflet\.css"\s*/?>',
             '<link rel="stylesheet" href="assets/vendor/leaflet/leaflet.css">', marker="assets/vendor/leaflet/leaflet.css")
    t = sub1(t, ctx, "Leaflet JS -> assets/vendor/leaflet", r'<script src="https://unpkg\.com/leaflet@1\.9\.4/dist/leaflet\.js"></script>',
             '<script src="assets/vendor/leaflet/leaflet.js"></script>', marker="assets/vendor/leaflet/leaflet.js")
    t = sub1(t, ctx, "country shapes: your own countries.geojson instead of raw.githubusercontent.com",
             r"fetch\('https://raw\.githubusercontent\.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries\.geojson'\)",
             "fetch('countries.geojson')", marker="fetch('countries.geojson')")
    return t


# ───────────────────────── step 6: privacy / cookie / terms wording matches the new reality ─────────────────────────
YT_LI = ("<li><strong>YouTube (youtube-nocookie.com)</strong> - only if you press play on the highlight video on the Basketball page. "
         "Nothing is requested from YouTube before that click. Once the video plays, YouTube/Google receive your IP address and may "
         "store data in your browser, under their own privacy policy</li>")


def step_privacy(text, ctx):
    t = sub1(text, ctx, "privacy: outside-services list (unpkg -> YouTube-on-click)",
             r"<li><strong>unpkg\.com</strong>.*?</li>", YT_LI, marker="youtube-nocookie.com")
    for label, pat in (("threejs.org", r"[ \t]*<li><strong>threejs\.org</strong>.*?</li>[ \t]*\n?"),
                       ("raw.githubusercontent.com", r"[ \t]*<li><strong>GitHub \(raw\.githubusercontent\.com\)</strong>.*?</li>[ \t]*\n?")):
        t, n = re.subn(pat, "", t, count=1, flags=re.S)
        ctx.ok(f"privacy: {label} entry removed (now self-hosted)") if n else ctx.log.append(f"  . privacy: {label} entry already gone")
    return t


COOKIES_SECTION = """<h2>Other requests that aren't cookies, but still involve a data transfer</h2>
                <p>These happen separately from the cookie banner above. They can see your IP address as a normal side effect of your browser fetching a file from their servers:</p>
                <ul>
                    <li><strong>Esri / OpenStreetMap</strong> (arcgisonline.com) - supplies map tile images on the Visitors page</li>
                    <li><strong>Cloudflare Worker</strong> (visitor-tracker.pavle-radojevic3.workers.dev) - the Visitors page requests its aggregate statistics from here every time it opens, whatever your cookie choice</li>
                    <li><strong>YouTube</strong> (youtube-nocookie.com) - only after you press play on the highlight video on the Basketball page. Nothing is requested from YouTube before that click. Once the video plays, YouTube may store its own cookies or data in your browser</li>
                </ul>
                <p>Apart from the video you choose to play, none of these set cookies on this site's behalf, and none of them are used for analytics. The code libraries (Leaflet, Three.js), the Earth texture, the country-boundary data and the typefaces are all hosted on this site itself, so no requests are made to unpkg, Google, GitHub or threejs.org for them.</p>"""


def step_cookies(text, ctx):
    return sub1(text, ctx, "cookies: 'other requests' section rewritten", r"<h2>Other requests that aren't cookies.*?no request is made to Google for them\.</p>",
                COOKIES_SECTION, marker="youtube-nocookie.com")


def step_terms(text, ctx):
    return sub1(text, ctx, "terms: globe texture wording (self-hosted copy)",
                r"The 3D globe texture on the Atlas page is provided by the Three\.js project's example assets\.",
                "The 3D globe texture on the Atlas page is a copy, hosted on this site, of an example asset from the Three.js project.",
                marker="a copy, hosted on this site")


# ───────────────────────── driver ─────────────────────────
STEPS = {
    "index": [step_shared, step_og, step_index], "basketball": [step_shared, step_og, step_basketball],
    "academic": [step_shared, step_og], "plates": [step_shared, step_og, step_plates], "visitors": [step_shared, step_og, step_visitors],
    "privacy": [step_shared, step_privacy], "terms": [step_shared, step_terms], "cookies": [step_shared, step_cookies],
}


def process(page, dry):
    path = ROOT / f"{page}.html"
    ctx = Ctx(page)
    if not path.exists():
        ctx.bad("file not found"); return ctx
    raw = path.read_bytes().decode("utf-8")
    crlf = "\r\n" in raw
    original = raw.replace("\r\n", "\n")
    text = original
    for step in STEPS[page]:
        text = step(text, ctx)
    if text != original and not ctx.problems:       # keep the "last updated" notes honest
        pat = r"(Content last updated |Last updated: )[A-Z][a-z]+ \d{1,2}, \d{4}"
        text, n = re.subn(pat, lambda m: m.group(1) + TODAY, text)
        if n:
            ctx.ok(f"'last updated' date set to {TODAY}")
    if ctx.problems:
        ctx.log.append("  -> NOT written (fix the items marked ! and run again)")
    elif text == original:
        ctx.log.append("  -> nothing to do")
    elif not dry:
        path.write_bytes((text.replace("\n", "\r\n") if crlf else text).encode("utf-8"))
        ctx.log.append("  -> written")
    else:
        ctx.log.append("  -> would be written (dry run)")
    return ctx


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dry-run", action="store_true", help="show what would change without writing anything")
    args = ap.parse_args()
    if not (ROOT / "index.html").exists():
        sys.exit("Run this from the repository root (the folder that contains index.html).")
    missing = [f for f in REQUIRED_FILES if not (ROOT / f).exists()]
    if missing:
        sys.exit("These files are missing. Copy the whole bundle into the repo first, then run again:\n  " + "\n  ".join(missing))
    failed = 0
    for page in PAGES:
        print(f"{page}.html")
        ctx = process(page, args.dry_run)
        print("\n".join(ctx.log))
        failed += bool(ctx.problems)
    print("\n" + ("Dry run finished." if args.dry_run else "Done.") +
          (f" {failed} page(s) need attention (see lines marked !)." if failed else " All pages OK."))
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
