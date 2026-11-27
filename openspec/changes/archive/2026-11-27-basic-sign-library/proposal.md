# Proposal

## Why

The Library tab is still a placeholder, so hearing users have no way to look up basic Austrian Sign Language (ÖGS) signs when they want to communicate with deaf people. Issue #17 asks for a list of basic signs backed by a dynamically loaded JSON file of URLs.

## What Changes

- Replace the Library tab placeholder with a list of about 30 basic ÖGS signs, grouped by category, each showing the German word beside a playable video with a poster image.
- Load the list at runtime from a JSON manifest that holds the media URLs and the attribution for each sign.
- Show attribution for every sign (creator, source link, license link), as CC BY-SA 4.0 requires.
- Add a repeatable script that fetches the selected signs from the HandsUp collection through the Kulturpool API and generates the manifest.
- Commit the video and poster files to the repository and serve them from the app, because the origin host cannot be hotlinked over HTTPS.
- Search, the full dictionary (#19) and AI training data (#11) are out of scope.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `sign-translation`: adds a requirement for a browsable library of basic ÖGS signs with video and attribution.

## Impact

- **Code:** `frontend/src/App.tsx`, `frontend/src/styles.css`, new hook and components in `frontend/src/`, updated `frontend/src/App.test.tsx`.
- **New files:** `frontend/scripts/` (fetch script and curated sign list), `frontend/public/signs/` (manifest, about 11 MB of media, license note).
- **Dependencies:** no new npm packages. The script uses the public Kulturpool API and `handsup-web.eu` at authoring time only; the running app calls neither.
- **Licensing:** the media is CC BY-SA 4.0 and stays outside the repository's own `LICENSE`.
- **Content gap:** the collection has no `Hallo`, `Danke`, `Entschuldigung`, `gut`, `Tschüss`, `Arzt` or `Guten Morgen`, so the first version omits them.
