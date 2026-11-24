# Proposal

## Why

The repository's git branching rules are currently split and contradictory: `AGENTS.md` defines the commit convention but omits branching rules, while `docs/branching-strat.md` references an unused `Review/*` branch step and contains conflicting rules on whether merged branches should be deleted. Unifying the branching strategy in `AGENTS.md` (and syncing `docs/branching-strat.md`) ensures human contributors and AI agents follow a single, consistent workflow where `main` and `dev` remain executable at all times.

## What Changes

- Add a `## Git Branching Strategy` section to `AGENTS.md` directly next to `## Git Commit Convention`:
  - Define long-lived branches (`main` for production/releases and `dev` for ongoing integration) with the strict invariant that both MUST build and run at all times.
  - Enforce the issue branch naming convention `<type>/<issue-number>-<short-description>` (matching commit convention types such as `feat/25-head-tracking`, `fix/30-camera-crash`) branched off `dev` and merged back into `dev` upon completion of a user story/task.
  - Define the sprint review release flow: merge `dev` into `main` prior to sprint review and tag the release (`vX.Y.Z`).
  - Define the hotfix flow from `main` (merged back into both `main` and `dev`) and the branch retention policy (do not delete merged branches so grading history remains intact).
- Update `docs/branching-strat.md` so team documentation matches the unified rules in `AGENTS.md` without contradictions.

## Capabilities

### New Capabilities
<!-- None: documentation and contributor/agent workflow convention change (`skip_specs: true`). -->

### Modified Capabilities
<!-- None: no system runtime spec requirements change (`skip_specs: true`). -->

## Impact

- `AGENTS.md`: Adds authoritative git branching and release rules alongside the commit convention.
- `docs/branching-strat.md`: Aligns human-facing branching documentation with `AGENTS.md` and removes contradictory branch deletion / `Review/*` instructions.
