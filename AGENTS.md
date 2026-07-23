# AGENTS.md

## 1. Project structure
- This is a generated public runtime tree. Keep `.nojekyll`, `index.html`, `404.html`, `content/site-content.json`, `css/site.css`, `js/site.js`, `images/favicon.png`, `images/hero-campus.jpg`, the three README files, and this `AGENTS.md` as the complete public artifact.
- `NextWeb4/website-source` is the private source of truth; this repository is not a development checkout.

## 2. Run commands
- Preview the committed runtime with `python -m http.server 8000 --bind 127.0.0.1` from the repository root; do not expose the public tree on a LAN interface during review.

## 3. Test commands
- Current runtime tree has no test command; test and artifact validation must be run in private `NextWeb4/website-source` before deployment.

## 4. Build commands
- Current runtime tree has no build command; `python scripts/build-public.py` belongs to private `NextWeb4/website-source`.

## 5. Code style
- Keep the exact centered Shields language row with visible labels `English`, `简体中文`, and `日本語` in all three README files.
- Keep README facts, paths, numbers, links, images, and code fences aligned across languages; do not add private-source paths or credentials.
- Preserve UTF-8, semantic HTML, safe text assignment, fixed responsive dimensions, and nonempty image alt text.

## 6. Module boundaries
- Public markup belongs in `index.html` and `404.html`; presentation belongs in `css/site.css`; browser behavior belongs in `js/site.js`; managed overlay data belongs in `content/site-content.json`. Managed presentation is limited to an 85-115% font scale in 5% steps, one complete six-module order, and `compact`/`standard`/`wide` sizes for every module.
- The `images/` files are the only runtime media. Admin, backend, tests, deployment scripts, credentials, and private history remain in `NextWeb4/website-source`.
- Documentation describes the generated artifact; authoring changes happen in the private source repository.
- The public tree must preserve the visibility-aware thought rotator, dated four-project fallback snapshot, safe text assignment, equal project-card layout, and wrapping evidence links; these are runtime behavior owned by `js/site.js` and `css/site.css`.

## 7. Prohibited changes
- Do not edit the runtime as a durable content workflow; the next private-source deployment replaces it.
- Do not add `admin/`, `backend/`, `tests/`, `.github/`, `scripts/`, credentials, deploy keys, backups, or private Git history.
- Do not weaken safe text rendering, content fallback, GitHub API fallback, wallpaper host validation, visibility-aware pause behavior, keyboard/accessibility behavior, or mobile overflow protections.
- Do not replace the SVG language row with browser-translatable plain text or add unlicensed decorative assets.

## 8. Completion criteria
- The public tree matches the private build allowlist exactly: eight browser runtime files plus the three README files and this `AGENTS.md` (12 files total).
- All three README files contain the same runtime facts and reciprocal language links.
- The homepage, 404 page, local JSON overlay, images, keyboard interactions, fallback content, and canonical URLs work through an HTTP preview.

## 9. Review criteria
- Compare the public tree with `NextWeb4/website-source` build output before accepting deployment.
- Check desktop/mobile overflow, focus visibility, reduced motion, language switching, archive pause/dialog behavior, image paths, and JSON fallback.
- Run the private source tests and `git diff --check`; never claim runtime-only review is equivalent to source regression coverage.

## 10. Common risks
- Manual runtime edits are temporary and may be overwritten by deployment.
- The public tree is inspectable by design; it must not contain source-only files or secrets.
- GitHub API, wallpaper, Shields, and Pages availability are external dependencies; bundled content and the solid-color fallback must remain usable.
- No license file was detected; reuse rights for code, writing, JSON, and images are not granted by public visibility.
