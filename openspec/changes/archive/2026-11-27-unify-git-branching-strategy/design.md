# Design

## Context

`AGENTS.md` is loaded into every AI agent session as a mandatory rule file and currently specifies `## Git Commit Convention` (Conventional Commits). Meanwhile, `docs/branching-strat.md` was written separately for human team members with a Git-Flow diagram, a `Review/<number>` branch convention that was bypassed in actual release practice (`08fb57c`, `v0.1.0`), and conflicting statements about deleting vs. keeping merged branches. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Establish a single source of truth for git branching and release rules in `AGENTS.md` right next to `## Git Commit Convention`.
- Align `docs/branching-strat.md` with the exact same rules so human and agent workflows do not diverge.
- Preserve executable stability on both `main` and `dev`.

**Non-Goals:**
- Adding automated GitHub Actions branch protection or CI workflows (out of scope for this documentation/convention unification).
- Renaming or deleting historical branches already pushed to `origin`.

## Decisions

1. **Issue Branch Naming: `<type>/<issue-number>-<short-description>`**
   - **Rationale:** Reuses the lower-case `<type>` prefixes already defined under `## Git Commit Convention` (`feat`, `fix`, `docs`, `chore`, `refactor`, `ci`, `test`) followed by the GitHub issue number and a kebab-case slug (e.g., `feat/25-head-tracking`, `fix/30-camera-crash`). This links every branch to both its semantic intent and its tracked user story/task.
   - **Alternatives considered:** `feat/<issue>-<slug>` for all branches regardless of task type (rejected because bugfix or docs issues would be mislabeled as features) or `issue<number>` (used once early on as `issue13`, rejected for lack of descriptive context).

2. **Direct `dev -> main` Sprint Release Merges**
   - **Rationale:** Because `dev` is strictly required to be executable and fully running after every feature merge, creating an intermediate `Review/<number>` branch adds overhead without extra safety for a small team. Merging `dev` directly into `main` before each sprint review and tagging `vX.Y.Z` matches how `v0.1.0` was released.
   - **Alternatives considered:** Maintaining `Review/<number>` branches as originally drafted in `docs/branching-strat.md` (rejected as unnecessary ceremony that conflicted with actual workflow).

3. **Keep Merged Branches (No Automatic Deletion)**
   - **Rationale:** In the school project context (HTL SYP), instructors inspect branch history and individual contributions. `docs/branching-strat.md` previously contradicted itself on deletion; both `AGENTS.md` and `docs/branching-strat.md` will explicitly mandate keeping branches unless cleanup is explicitly requested.

## Risks / Trade-offs

- **[Risk] Rules duplicated between `AGENTS.md` and `docs/branching-strat.md` could drift later** → Mitigation: Keep `AGENTS.md` concise and authoritative for agents/contributors, and structure `docs/branching-strat.md` to mirror the exact same rules and examples while retaining the lecture-notes reference diagram.
