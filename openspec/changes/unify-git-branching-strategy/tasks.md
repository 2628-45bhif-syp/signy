# Tasks

## 1. Unify Git Branching Strategy in Agent & Team Documentation

- [ ] 1.1 Add a `## Git Branching Strategy` section to `AGENTS.md` next to `## Git Commit Convention` covering `main` and `dev` executable stability requirements, `<type>/<issue-number>-<short-description>` issue branch naming and `dev` merge flow, pre-sprint-review `dev -> main` release merges with `vX.Y.Z` tags, hotfix flow from `main`, and branch retention policy; verify `AGENTS.md` contains both sections with matching `<type>` conventions.
- [ ] 1.2 Update `docs/branching-strat.md` to align with `AGENTS.md` (replace `Review/<number>` flow with direct `dev -> main` sprint release merges, update issue branch naming to `<type>/<issue-number>-<short-description>`, and remove the conflicting branch deletion instruction); verify `docs/branching-strat.md` has no contradictions with `AGENTS.md`.
