# Site update bundle: how to apply it

## What it does
1. **Home page intro**: your name as the page's `<h1>`, a one-line description, and two buttons (Watch highlights, Get in touch).
2. **Real social-preview image**: `images/og-image.png` (1200x630) on index, basketball, academic, plates and visitors, with `og:image:width/height/alt` and `twitter:image`.
3. **Highlight video on the Basketball page**: a click-to-play facade. Nothing is requested from YouTube until the visitor presses play, then it loads from `youtube-nocookie.com`. Plays are logged as an outbound click (when analytics is accepted). The old "Highlight Video" button is replaced by it.
4. **Player sheet + Recruiting inquiry buttons** under your profile text. `files/pavle-radojevic-player-sheet.pdf` is one A4 page; downloads are tracked by your existing PDF tracking.
5. **Self-hosting**: Leaflet, three.js, OrbitControls and the Earth texture now live in `assets/vendor/`. The Visitors map reads your own `countries.geojson` instead of raw.githubusercontent.com. No more unpkg / threejs.org / GitHub raw requests.
6. **One copy of the shared code**: the ~150 lines of JS and ~100 lines of CSS that were pasted into every page now live in `assets/site.js` and `assets/site.css`. The search index exists once (it also fixes the missing "Activities & leadership" entry on the basketball page).
7. **Legal pages updated to match**: privacy (outside-services list), cookies ("other requests" section), terms (globe texture wording). "Last updated" dates are set to the day you run the script.

## Apply it (about 5 minutes)
1. **Commit your current state** in git (so `git diff` / `git checkout .` can show or undo everything).
2. **Copy the bundle into the repo root**: unzip, then copy everything over your repo folder (the folders `assets/`, `images/`, `files/`, `tools/` merge with your existing ones; `apply_updates.py` lands next to `index.html`). It only adds new files, it does not overwrite your existing ones.
3. **Preview the changes**, from the repo root:
   ```
   python apply_updates.py --dry-run
   ```
   Every line should start with `+` (or `.` = already done). A line starting with `!` means that page's structure differs from what the script expects; that page is left untouched. Send me that line and I'll adjust.
4. **Apply**:
   ```
   python apply_updates.py
   ```
   It is safe to run twice. Windows line endings are preserved.
5. **Test locally with a server** (not by double-clicking the files; modules and `fetch` need http):
   ```
   python -m http.server 8000
   ```
   Open http://localhost:8000 and check:
   - **Home**: intro strip shows, both buttons work, theme toggle flips once per click.
   - **Basketball**: the video box shows a play button; clicking it loads the player; the Player sheet button downloads the PDF; Recruiting inquiry opens a pre-filled email.
   - **Atlas**: globe loads and rotates, search finds a country, gallery works. DevTools > Network should show no requests to unpkg.com or threejs.org.
   - **Visitors**: map shows the countries; Network shows no unpkg.com or raw.githubusercontent.com (map tiles from arcgisonline.com are expected).
   - Press **Ctrl+K** on any page: 17 search results. **Cookie Preferences** in the footer still opens the confirm box.
6. **Push to GitHub.** Pages updates in 1 to 2 minutes. Hard-refresh (Ctrl+F5) once.
7. **Refresh the social previews** (platforms cache old images): LinkedIn Post Inspector, Facebook Sharing Debugger. WhatsApp updates after a while.
8. Optional clean-up: `apply_updates.py` and `tools/` are served publicly by GitHub Pages. Harmless, but you can delete `apply_updates.py` after use. Keep `tools/` to regenerate the PDF and image.

## Maintenance
- **New season or club?** Edit the DATA block at the top of `tools/make_player_sheet.py`, then `pip install reportlab` and `python tools/make_player_sheet.py` (writes the PDF into `files/`).
- **Different OG image?** Replace `images/og-image.png` with any 1200x630 PNG/JPG (for example a photo card), same file name. Or edit and run `tools/make_og_image.py` (needs `pip install pillow`).
- **New page or section in search?** One list: `SITE_INDEX` at the top of `assets/site.js`.
- **Consent/analytics logic** is now only in `assets/site.js` (section 3). It is unchanged, except a link can carry `data-label="..."` for a clean name in your event report.

## Things to know
- The Visitors map now needs `countries.geojson` to be the same Natural Earth country file the Atlas page already uses (it is, if the Atlas globe works). If it is a lower-resolution file, the map will just look coarser.
- The Earth texture is the three.js example image (r160). It is credited in terms.html. If you ever want fully clear licensing, swap in NASA's Blue Marble (public domain) under the same name.
- The PDF shows birth **year** only (2007). Add a full date in the DATA block if you want recruiters to see it.
- Not changed in this bundle (next batch): stats table, academic projects section, plates filters/deep links, globe fly-to fix.
