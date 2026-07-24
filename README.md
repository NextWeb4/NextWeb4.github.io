<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/English-0969da?style=flat-square" alt="English"></a>
  <a href="README.zh-CN.md"><img src="https://img.shields.io/badge/%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-c8102e?style=flat-square" alt="简体中文"></a>
  <a href="README.ja.md"><img src="https://img.shields.io/badge/%E6%97%A5%E6%9C%AC%E8%AA%9E-8250df?style=flat-square" alt="日本語"></a>
</p>

<div align="center">

# NextWeb4 Public Website Runtime

**The generated, browser-only publication delivered at [nextweb4.github.io](https://nextweb4.github.io/).**

[![Live site](https://img.shields.io/badge/live-nextweb4.github.io-0969da?style=flat-square&logo=githubpages&logoColor=white)](https://nextweb4.github.io/)
[![Last commit](https://img.shields.io/github/last-commit/NextWeb4/NextWeb4.github.io?style=flat-square&logo=github&label=last%20commit)](https://github.com/NextWeb4/NextWeb4.github.io/commits/main)
[![Repository size](https://img.shields.io/github/repo-size/NextWeb4/NextWeb4.github.io?style=flat-square&logo=github)](https://github.com/NextWeb4/NextWeb4.github.io)
![Generated runtime](https://img.shields.io/badge/type-generated%20runtime-0969da?style=flat-square)
![HTML](https://img.shields.io/badge/HTML-static-E34F26?style=flat-square&logo=html5&logoColor=white)

<img src="images/hero-campus.jpg" alt="Campus photograph used by the public homepage" width="900">

</div>

## Purpose

This repository is the public runtime artifact for the NextWeb4 personal website. It contains only browser-delivered HTML, CSS, JavaScript, images, managed public content, and the documentation needed to understand that artifact.

The private source repository `NextWeb4/website-source` owns the editor, backend, tests, deployment workflow, and authoring history. Do not treat this repository as the development source or as a place to store credentials.

## Reader experience

- Light and dark themes with Chinese/English interface switching.
- A dated 100-entry thought archive: 31 Moments entries and 69 iCloud Notes entries per language.
- Visibility-aware rotation that pauses during interaction, in hidden documents, or when less than one quarter of the panel remains visible; previous/next controls, reading progress, provenance, reading time, keyboard access, and a native full-text dialog remain available.
- Public GitHub project enrichment with a dated, sortable four-repository snapshot when the API is unavailable; “latest delivery” uses code-push time rather than metadata-only updates.
- Responsive article-style layout, balanced project cards, wrapping evidence links, a repository-owned hero photograph, and a non-blocking wallpaper enhancement.
- Browser copy or DevTools deterrence is presentational only; delivered browser code and content are inspectable.

## Public artifact inventory

The deployment workflow replaces the public tree from a private-source allowlist. The runtime includes these files and directories:

| Path | Role |
| --- | --- |
| `.nojekyll` | Prevents GitHub Pages Jekyll processing |
| `index.html` | Homepage structure, fallback copy, project list, and thought archive UI |
| `404.html` | Public error page |
| `content/site-content.json` | Validated bilingual content, module visibility, and bounded presentation overlay |
| `css/site.css` | Themes, responsive layout, typography, and interaction states |
| `js/site.js` | Content overlay, themes, projects, archive rotation, dialog, and safe text rendering |
| `images/favicon.png` | Site icon |
| `images/hero-campus.jpg` | Homepage hero photograph |
| `README.md`, `README.zh-CN.md`, `README.ja.md` | Independent English, Simplified Chinese, and Japanese runtime guides |
| `AGENTS.md` | Rules for reviewing this generated runtime repository |

Source-only paths such as `admin/`, `backend/`, `tests/`, `.github/`, `scripts/`, private history, and backups are intentionally absent.

## Content and fallback

The page first renders complete bundled content and may overlay `content/site-content.json` from the same origin. If the JSON is missing, invalid, slow, or unavailable, the bundled page remains usable. The overlay may set independent 85-115% font scales for all seven managed modules, CJK-safe compact/standard/wide primary-heading widths for all six sections, a complete six-section order, and three bounded section sizes; responsive limits remain authoritative on narrow screens. Missing heading settings use standard widths, while legacy global font scale values apply to all seven modules. The managed archive keeps exactly 31 dated Moments records plus 69 dated iCloud Notes records in matching source/date order for both languages.

Public JavaScript treats managed text as untrusted and assigns visible dates, provenance, titles, and bodies safely. The runtime does not expose iCloud storage labels as visible titles and does not run translation services in the browser.

## Network and privacy

- The public project list may request public GitHub repository data; bundled project data remains the fallback.
- The optional wallpaper path requests metadata from `bing.biturl.top`, accepts only validated HTTPS `bing.com` image hosts, uses a bounded timeout, and falls back to a solid color.
- Language, theme, and wallpaper cache state stays in browser storage; no admin token or GitHub credential belongs in this repository.
- README badges request images from `img.shields.io` when GitHub renders the page.
- This repository is public by design. HTML, JavaScript, JSON, images, and README content must be considered inspectable.

## Local preview

The runtime has no package manager, backend, build command, test suite, lint command, or format command. To preview the committed artifact with correct relative `fetch()` behavior:

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/`. Authoring and deployment tests belong in the private `NextWeb4/website-source` repository.

## Deployment model

Changes are made in `NextWeb4/website-source`. Its pinned GitHub Actions workflow builds an allowlisted artifact and synchronizes this public repository through a repository-scoped deploy key. A manual edit here will be replaced by the next successful deployment and is therefore not a durable content change.

The public repository must never receive the private source tree, backend, admin client, tests, credentials, deployment key, or private Git history.

## Verification checklist

- Confirm the artifact contains only the allowlisted runtime and documentation paths.
- Open `/`, `/404.html`, both public language states, and representative archive entries through HTTP.
- Check keyboard navigation, focus visibility, reduced motion, mobile overflow, pause behavior, dialog close access, and fallback content.
- Confirm project links, image paths, JSON loading, and canonical site URLs resolve.
- Compare the public tree with the private build artifact before accepting a deployment.

## Contact

- [Rays688888@Gmail.com](mailto:Rays688888@Gmail.com)

## Status, contribution, and license

At the 2026-07-22 audit, this repository was public, active, unarchived, and Pages-enabled. Contributions should be made in `NextWeb4/website-source`; report reproducible runtime issues with the public repository issue tracker when enabled. No license file was detected, so public availability does not by itself grant reuse rights for the code, writing, JSON, or images.
