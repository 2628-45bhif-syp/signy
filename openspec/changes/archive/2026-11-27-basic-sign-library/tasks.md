# Tasks

## 1. Sign Data

- [x] 1.1 Add `frontend/scripts/basic-signs.config.json` with the curated titles and categories (Fragen, Personen, Kommunikation, Alltag, Notfall), and verify it parses as JSON with about 30 entries
- [x] 1.2 Implement `frontend/scripts/fetch-signs.mjs` (paged Kulturpool search, exact title match, failure on missing or ambiguous titles, `video/mp4` content-type check, unmodified file storage, `signs.json` output), and verify it exits non-zero when run against a config containing an unknown title
- [x] 1.3 Run the script, add `identifier` values for duplicate titles such as `Bitte` and `Freund`, and verify every manifest entry has an existing video and poster file under `frontend/public/signs/`
- [x] 1.4 Add `frontend/public/signs/README.md` stating that the media is CC BY-SA 4.0 and not covered by the repository `LICENSE`, including the command to regenerate the data, and verify the documented command runs as written

## 2. Manifest Loading

- [x] 2.1 Implement `frontend/src/hooks/useSigns.ts` with `{ signs, error, isLoading }` and `cancelled` handling as in `useCamera`, and verify `useSigns.test.tsx` covers success, a non-OK response and a non-array body

## 3. Library UI

- [x] 3.1 Implement `frontend/src/components/SignCard.tsx` (video with `preload="none"`, `poster`, `muted`, `loop`, `playsInline`, play toggle labelled with the gloss, attribution links), and verify `SignCard.test.tsx` covers the word, video source, license link and play/pause toggle using a stubbed `HTMLMediaElement.prototype.play`
- [x] 3.2 Implement `frontend/src/components/SignLibrary.tsx` with the `Sign Library` heading, loading state, `role="alert"` error state and category grouping, and verify `SignLibrary.test.tsx` covers grouped rendering and the error state
- [x] 3.3 Replace the `library-shell` block in `frontend/src/App.tsx` with `<SignLibrary />`, stub `fetch` in `frontend/src/App.test.tsx`, and verify `npm test` passes in `frontend/`
- [x] 3.4 Add `.sign-*` styles to `frontend/src/styles.css` using existing tokens, remove any `.library-*` rules left unused, and verify the layout has no horizontal scrolling at about 400 px width

## 4. Integration Check

- [x] 4.1 Run `npm test` and `npm run build` in `frontend/`, and verify both succeed
- [x] 4.2 Run `npm run dev` and verify in the browser that opening the Library tab requests only `signs.json` and posters from the app's own origin, that a video plays and pauses on tap, and that switching to Translator and back works
