# Proposal

## Why

Recent commit history is inconsistent: some commits adhere to Conventional Commits (e.g. `refactor(pitch): ...`, `ci: ...`, `docs: ...`, `feat: ...`), while others use arbitrary phrasing (e.g. `Added NOTES.md`, `Update Sysspecs`). Without an explicit standard in `AGENTS.md`, AI assistants and contributors generate disparate commit formats. Codifying this rule in `AGENTS.md` guarantees uniform commit messaging without manual prompting.

## What Changes

- Add a standardized **Git Commit Convention** instruction block to `AGENTS.md`.
- Standardize on Conventional Commits format: `<type>(<optional-scope>): <imperative description>`.
- Restrict types to standard set: `feat`, `fix`, `docs`, `chore`, `refactor`, `ci`, `test`.
- Require lower-case type and imperative mood (e.g. `add`, `update`, `fix`, not `added` or `fixes`), max 72 characters, no trailing period.
- Provide concrete examples directly inside `AGENTS.md`.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
None.

## Impact

- Modifies `AGENTS.md` in repository root.
- Directly impacts AI assistant behavior when composing git commit messages.
- No impact on system runtime code or dependencies.
