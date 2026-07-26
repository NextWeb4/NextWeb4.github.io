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

- A dark-first fresh visit with persisted light/dark and Chinese/English switching; an explicitly stored light preference remains authoritative.
- A grapheme-safe bilingual hero-title pool with 27 unique lines per language, a complete active accessible name, all-candidate reserved geometry, a visible completed-text caret hold, hidden-document pause, and language-aware heading measures. Page entry types the fixed first line (`向世界交付你的价值` / `Deliver your value to the world.`) once even under reduced motion; clicking or keyboard-activating the title visibly deletes it before typing a random non-immediate-repeat line. No separate header replay icon is shown, and the no-JavaScript first title remains complete.
- A dated 100-entry thought archive: 31 Moments entries and 69 iCloud Notes entries per language.
- Visibility-aware rotation that pauses during interaction, in hidden documents, or when less than one quarter of the panel remains visible; previous/next controls, reading progress, provenance, reading time, keyboard access, and a native full-text dialog remain available.
- A complete live-first GitHub catalogue that revalidates every eligible public repository, description, Topic, Star count, update time, and code-push time on each entry. Fresh cache or the latest scheduled same-origin sync may render during revalidation; a complete dated emergency snapshot is the final fallback. All cards remain visible and sortable by popularity, delivery time, or name, while Chinese mode generates metadata-based summaries and localizes common Topics without hiding their GitHub values.
- Responsive article-style layout, a four-card initial project grid with an accessible complete-catalogue disclosure, a repository-owned hero photograph with a one-line Chinese desktop caption and normal-flow mobile wrapping, and four metadata-scored capability lines. When three repositories exist, every line contains at least three unique projects and renders exactly three per page; its introduction, aggregate Topic rail, languages, and two-Topic evidence metadata regenerate from that visible group. Projects may evidence multiple matching lines, every repository reaches at least one, and pages rotate every eight seconds with previous/next/pause and interaction/visibility-aware stops.
- Browser copy or DevTools deterrence is presentational only; delivered browser code and content are inspectable.

## Public artifact inventory

The deployment workflow replaces the public tree from a private-source allowlist. The runtime includes these files and directories:

| Path | Role |
| --- | --- |
| `.nojekyll` | Prevents GitHub Pages Jekyll processing |
| `index.html` | Homepage structure, fallback copy, project list, and thought archive UI |
| `404.html` | Public error page |
| `content/site-content.json` | Validated bilingual content, module visibility, and bounded presentation overlay |
| `content/github-projects.json` | Dated complete public-repository metadata for rate-limit-resistant same-origin fallback |
| `css/site.css` | Themes, responsive layout, typography, and interaction states |
| `js/site.js` | Content overlay, themes, projects, archive rotation, dialog, and safe text rendering |
| `images/favicon.png` | Site icon |
| `images/hero-campus.jpg` | Homepage hero photograph |
| `README.md`, `README.zh-CN.md`, `README.ja.md` | Independent English, Simplified Chinese, and Japanese runtime guides |
| `AGENTS.md` | Rules for reviewing this generated runtime repository |
| `LICENSE` | Rights and provenance notice; it grants no open-source permission |

Source-only paths such as `admin/`, `backend/`, `tests/`, `.github/`, `scripts/`, private history, and backups are intentionally absent.

## Content and fallback

The page first renders complete bundled content and may overlay `content/site-content.json` from the same origin. If the JSON is missing, invalid, slow, or unavailable, the bundled page remains usable. The overlay carries the 27-line bilingual title pools and may set independent 85-115% font scales for all seven managed modules, language-aware compact/standard/wide primary-heading widths for all six sections, a complete six-section order, and three bounded section sizes; responsive limits remain authoritative on narrow screens. Missing heading settings use standard widths, while legacy global font scale values apply to all seven modules. The managed thought archive keeps exactly 31 dated Moments records plus 69 dated iCloud Notes records in matching source/date order for both languages. The separate read-only project JSON is produced from GitHub's public REST metadata by the private deployment workflow every hour.

Public JavaScript treats managed text as untrusted and assigns visible dates, provenance, titles, and bodies safely. The runtime does not expose iCloud storage labels as visible titles and does not run translation services in the browser.

## Network and privacy

- The public project list requests GitHub repository data on every page entry and retains GitHub descriptions plus all normalized Topics up to the 20-topic bound. Fresh cache, the same-origin synchronized feed, and the complete embedded emergency snapshot form the fallback chain; loading, refreshing, live, cached, synchronized, and emergency status is explicit. Only the first four sorted cards are rendered initially; the native disclosure expands every eligible card without truncating the backing collection or capability evidence. Chinese project and capability summaries plus common Topic labels are generated locally from public metadata, with original values preserved and no translation request.
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
- Check keyboard navigation, focus visibility, fixed-first entry typing and delete/random/retype title switching under reduced motion, non-immediate repetition, hidden-document pause, all-candidate geometry, absence of a separate header replay icon, the one-line Chinese desktop caption, mobile overflow, dialog close access, and fallback content.
- Confirm four-card initial rendering, expand-all/collapse semantics, complete live GitHub status/refresh, all three sort modes, Chinese descriptions and source-preserving Topics, cache/synchronized/emergency fallback, three visible projects per capability line, project-derived introductions/Topic rails, multi-line coverage, rotation/pause/manual controls, project links, image paths, both JSON files, and canonical site URLs.
- Compare the public tree with the private build artifact before accepting a deployment.

## Contact

- [Rays688888@Gmail.com](mailto:Rays688888@Gmail.com)

## Status, contribution, and license

See [LICENSE](LICENSE). It is a rights and provenance notice, not an open-source license: it grants no permission to use, copy, modify, deploy, or redistribute original project material. Third-party material remains subject to its own rights and terms.

At the 2026-07-22 audit, this repository was public, active, unarchived, and Pages-enabled. Contributions should be made in `NextWeb4/website-source`; report reproducible runtime issues with the public repository issue tracker when enabled.
