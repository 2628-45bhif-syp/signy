<!-- caveman-begin -->
Respond terse like smart caveman. All technical substance stay. Only fluff die.

Rules:
- Drop: articles (a/an/the), filler (just/really/basically), pleasantries, hedging
- Fragments OK. Short synonyms. Technical terms exact. Code unchanged.
- Pattern: [thing] [action] [reason]. [next step].
- Not: "Sure! I'd be happy to help you with that."
- Yes: "Bug in auth middleware. Fix:"

Switch level: /caveman lite|full|ultra|wenyan-lite|wenyan-full|wenyan-ultra
Stop: "stop caveman" or "normal mode"

Auto-Clarity: drop caveman for security warnings, irreversible actions, user confused. Resume after.

Boundaries: code/commits/PRs written normal.
<!-- caveman-end -->

## Git Commit Convention

All git commits MUST follow the Conventional Commits specification:
`<type>(<optional-scope>): <description>`

- **Types**:
  - `feat`: New feature or user-facing capability
  - `fix`: Bug fix
  - `docs`: Documentation updates only
  - `chore`: Maintenance, build tasks, dependencies, tooling
  - `refactor`: Code restructure without changing behavior or fixing bugs
  - `ci`: CI/CD workflows, automation scripts
  - `test`: Adding, modifying, or fixing tests
- **Rules**:
  - Lower-case type and scope.
  - Imperative mood for description (e.g., `add landmark pruner`, NOT `added` or `adds`).
  - No trailing period. Keep subject line concise (under 72 characters).
- **Examples**:
  - `feat(pipeline): add landmark extraction module`
  - `docs: update system specification`
  - `chore: clean up project structure`
  - `refactor(pitch): streamline presentation slides`

## Git Branching Strategy

- **Long-Lived Branches & Executable Stability**:
  - `main`: Production/release branch representing verified sprint milestones.
  - `dev`: Primary integration branch for ongoing sprint development.
  - **Strict Invariant**: Both `main` and `dev` MUST build and run without errors at all times. Never push or merge broken code to `main` or `dev`.
- **Issue Branch Naming & Flow**:
  - Branch from `dev` for every user story or task using `<type>/<issue-number>-<short-description>`, where `<type>` matches the Conventional Commits types above (`feat`, `fix`, `docs`, `chore`, `refactor`, `ci`, `test`).
  - Examples: `feat/25-head-tracking`, `fix/30-camera-crash`, `docs/18-backlog-hierarchy`.
  - When a user story or task is complete and verified executable, merge the branch back into `dev`.
- **Sprint Release Flow (`dev -> main`)**:
  - Prior to each sprint review, verify `dev` is stable and merge `dev` directly into `main`.
  - Tag the release commit on `main` using semantic versioning (`vX.Y.Z`, e.g., `v0.1.0`, `v0.2.0`).
- **Hotfix Flow**:
  - If a critical bug is discovered on `main`, branch from `main` using `fix/<issue-number>-<short-description>` (or `hotfix/<version>-<short-description>`), fix and verify, then merge into both `main` and `dev`.
- **Branch Retention Policy**:
  - Do **NOT** delete merged branches unless explicitly requested, preserving commit and branch history for project grading.
