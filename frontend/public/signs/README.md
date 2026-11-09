# Sign media

The videos and posters in this directory are from the HandsUp collection by equalizent ST GmbH / Ausstellung Hands Up, retrieved through [Kulturpool](https://kulturpool.at/en/content/equalizent). They are licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) and are not covered by the repository's `LICENSE`. The files are unmodified. `signs.json` records the source of each sign.

## Regenerating

Edit `scripts/basic-signs.config.json`, then run this from `frontend/`:

```bash
node scripts/fetch-signs.mjs
```

The script replaces `videos/`, `posters/` and `signs.json`. It stops without changing anything if a title is missing or ambiguous. Set `identifier` on an entry to choose between duplicates.
