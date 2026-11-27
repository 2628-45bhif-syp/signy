# Tasks

## 1. Feature Branch & GitHub Label Preparation

- [x] 1.1 Create and check out feature branch `docs/reorganize-backlog-hierarchy` from `dev` and verify `git branch --show-current` outputs `docs/reorganize-backlog-hierarchy`
- [x] 1.2 Ensure the `epic` label exists on the GitHub repository alongside `user-story` and `task` and verify with `gh label list`

## 2. Reorganize Open GitHub Issues into 3-Tier Hierarchy

- [x] 2.1 Create the 5 `[EPIC]` parent issues (`[EPIC] Facial Expression & Non-Manual Grammar`, `[EPIC] ÖGS Dataset & Sign Recognition Pipeline`, `[EPIC] German Sentence Synthesis & Two-Way Communication`, `[EPIC] Ergonomic Modes & Form Factors`, `[EPIC] ÖGS Learning & Reference Tools`) formatted per `.github/ISSUE_TEMPLATE/epic.yml` and verify their issue numbers and `epic` labels via `gh issue list --label epic`
- [x] 2.2 Update open User Stories `#2`, `#4`, `#10`, `#17`, and `#26` via `gh issue edit` to fix typos, restore `#2`'s Acceptance Criteria, disentangle `#4` vs `#26`, standardize `#17` to English with the `[USER STORY]` prefix, and verify each updated title and body with `gh issue view`
- [x] 2.3 Update open Tasks `#21`, `#22`, and `#23` to use the `[TASK]` title prefix and `.github/ISSUE_TEMPLATE/task.yml` body sections (`Task Type (Branch Prefix)`, `Description`, `Definition of Done`), create structured `[TASK]` sub-issues for `#26` and `#4`, and verify via `gh issue list --label task --state open`
- [x] 2.4 Wire native GitHub Sub-issue relationships (`Epic -> User Story` for all 13 open User Stories `#2`–`#12`, `#17`, `#26`; reparent `#23` from `#2` to `#10`; attach the new facial expression tasks to `#26` and `#4`) via `gh api graphql` and verify the full parent-child tree for open issues via GraphQL query

## 3. Update Project Backlog & Sprint Documentation

- [x] 3.1 Rewrite `docs/backlog.md` to mirror the new 3-tier hierarchy (`Epic -> User Story -> Task`) including issue references, aligned Effort/Priority values, and a completed section for the closed Camera & Landmark Pipeline issues, and verify all open and closed issues are accurately represented
- [x] 3.2 Update `docs/sprints.md` to fix the `DGS` -> `ÖGS` terminology inconsistency and clarify the Sprint 1 User Story and Task references, then verify `git diff docs/` shows clean formatting
