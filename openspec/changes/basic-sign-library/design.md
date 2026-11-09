# Design

## Context

`frontend/src/App.tsx` renders a static `library-shell` placeholder when the Library tab is active. The frontend is React 19 with Vite and has no `public/` directory or data-fetching code yet. `useCamera` and `LiveCamera` set the existing pattern for a hook with a `cancelled` flag and for error display with `role="alert"`.

ÖGS data is scarce and most sources do not permit reuse. The HandsUp collection on Kulturpool has 1,642 avatar videos, each marked CC BY-SA 4.0, with metadata from a public API that needs no key. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Keep the sign list editable without code changes.
- Meet the CC BY-SA attribution terms for every sign.
- Keep opening the Library tab cheap on mobile.

**Non-Goals:**
- Search or filtering.
- Offline caching through a service worker. Same-origin media keeps this possible later.
- Reusing this media for model training. It is avatar footage rather than real signers, and ShareAlike terms apply.

## Decisions

**Use HandsUp as the source.** It is the only ÖGS source found with an explicit reuse license on each item.
- LedaSila names "Creative Commons" without a variant, so it needs a permission request.
- Lectary is CC BY-NC with mixed upstream sources and offers no download or API.
- Spread the Sign allows private use only without a license.

**Self-host the media instead of hotlinking.** `handsup-web.eu` presents a self-signed certificate on HTTPS, and plain HTTP would be mixed content in an HTTPS deployment. Files are committed under `frontend/public/signs/`. About 11 MB for 33 signs is acceptable in git. Git LFS would add setup for every team member without a real benefit at this size.

**Generate the manifest with a script.** `frontend/scripts/fetch-signs.mjs` reads the curated `basic-signs.config.json` (`title`, `category`, optional `identifier`) and writes `public/signs/signs.json` plus media. A script keeps attribution accurate and makes it easy to add signs. It runs on Node 20 with built-in `fetch`, so it adds no dependencies. It pages through the search endpoint and matches titles exactly, and it fails on a missing or ambiguous title rather than guessing, because a wrong match would teach the wrong sign. `identifier` resolves duplicates such as `Bitte` and `Freund`.

Video downloads use `http://` because of the invalid certificate. The script checks for `Content-Type: video/mp4`, and a person reviews the videos before they are committed. Files are stored unmodified, so no adaptation terms come into play.

**Keep the manifest source-neutral.** Each entry holds `id`, `gloss`, `category`, `video`, `poster`, `creator`, `sourceUrl`, `license` and `licenseUrl`. Team recordings from #11 can fill the content gaps later without UI changes. Media paths are relative and prefixed with `import.meta.env.BASE_URL`, so a non-root deployment works.

**Load with a `useSigns` hook and a separate `SignCard` component.** The hook returns `{ signs, error, isLoading }` and follows `useCamera`'s `cancelled` pattern, and it treats a non-OK response or a non-array body as an error. `SignLibrary` handles state and grouping. `SignCard` owns one video element.

**Use `preload="none"` with a custom play toggle.** `preload="none"` keeps about 30 videos from loading when the tab opens. A single labelled button works better than native `controls`, which are cramped on a small square video. Videos are `muted`, `loop` and `playsInline`. UI labels stay in English to match the existing app, and glosses stay in German.

## Risks / Trade-offs

- [Avatar signing or the chosen variant may be wrong or unnatural] → Ask a deaf ÖGS user to review the list before merge, if possible.
- [Common words such as `Hallo` and `Danke` are missing] → Omit them rather than show empty entries, and fill them later through #11 or a LedaSila permission.
- [HTTP downloads have no transport integrity] → This happens only at authoring time, with a content-type check and manual review of the committed files.
- [Kulturpool API or file names change] → Committed media and manifest keep the app working. Only re-running the script is affected.
- [Repository grows with each added sign] → Acceptable for a basic list. Move media to object storage if #19 needs the full collection.
