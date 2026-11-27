# Branching Strategy

Make sure to use the branching strategy correctly as stated here (@adirnberger-htl) and enforced in `AGENTS.md`:

## Git-Flow Reference Diagram
Look at [5.1.2. Branching-Strategies](https://2526-3bhif-syp.github.io/2526-3bhif-syp-lecture-notes/#:~:text=5%2E1%2E2%2E%20Branching%2DStrategies) for general Git-Flow background.

![alt text](https://2526-3bhif-syp.github.io/2526-3bhif-syp-lecture-notes/images/gitflow_diagram_gfg.png)

## Unified Workflow Rules

### 1. Long-Lived Branches (`main` and `dev`)
- `dev` is the primary integration branch we work from and merge completed work into.
- `main` is the production/release branch presented at sprint reviews.
- **Executable Invariant:** Both `main` and `dev` **must build and run at all times**. Only merge tested, working code into `dev` or `main`.

### 2. Issue Branches (`<type>/<issue-number>-<short-description>`)
- Whenever we begin work on a user story or task, create a new branch off `dev`.
- Use the naming convention `<type>/<issue-number>-<short-description>`, where `<type>` matches our Conventional Commit types (`feat`, `fix`, `docs`, `chore`, `refactor`, `ci`, `test`).
  - Examples: `feat/15-mediapipe-tracking`, `feat/25-head-tracking`, `fix/30-camera-crash`, `docs/18-backlog-hierarchy`.
- Once the task or user story is finished and verified executable, merge the branch back into `dev`.

### 3. Sprint Releases (`dev -> main`)
- Prior to each sprint review, once all agreed sprint features on `dev` are complete and verified, merge `dev` directly into `main`.
- Tag the release on `main` with a semantic version tag (`vX.Y.Z`, e.g., `v0.1.0`, `v0.2.0`).

### 4. Hotfixes
- In case a critical bug is found on `main`, create a hotfix branch off `main` (`fix/<issue-number>-<short-description>` or `hotfix/<version>-<short-description>`).
- As soon as the bug is fixed and verified, merge the branch into both `main` and `dev`.

### 5. Branch Retention Policy
- Make sure **not to delete** merged branches unless explicitly needed, so full contribution and branch history remains visible for project grading.
