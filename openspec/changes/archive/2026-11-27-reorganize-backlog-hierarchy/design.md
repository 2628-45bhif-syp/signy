# Design

## Context

The repository defines three GitHub issue templates (`.github/ISSUE_TEMPLATE/epic.yml`, `.github/ISSUE_TEMPLATE/user-story.yml`, `.github/ISSUE_TEMPLATE/task.yml`) and labels (`epic`, `user-story`, `task`). Currently, 25 issues (`#1`–`#26`, with `#18` unused) exist on GitHub:
- **Closed issues (`#1`, `#13`–`#16`, `#19`, `#20`, `#24`, `#25`):** Represent completed Sprint 1 & camera/tracking work. Per user decision, closed issues on GitHub remain unmodified.
- **Open User Stories (`#2`–`#12`, `#17`, `#26`) and Open Tasks (`#21`–`#23`):** Have no parent `[EPIC]` issues, contain overlapping scopes (`#4` vs `#26`, `#2` vs `#10` vs `#11`), missing Acceptance Criteria (`#2`), inconsistent language/titles (`#17`, `#26`), and empty-body task sub-issues (`#21`–`#23`).
- **Local Docs (`docs/backlog.md`, `docs/sprints.md`):** `docs/backlog.md` only lists `#1`–`#12` flatly with unchecked items, and `docs/sprints.md` mistakenly refers to `DGS` instead of `ÖGS`.

See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Reorganize all open GitHub issues (`#2`–`#12`, `#17`, `#21`–`#23`, `#26`) into a strict 3-tier hierarchy (`Epic -> User Story -> Task`) using GitHub's native Sub-issues GraphQL mutations (`addSubIssue` / `removeSubIssue`).
- Fix every text, language, template, effort/priority, and scope inconsistency across open User Stories and Tasks.
- Synchronize `docs/backlog.md` and `docs/sprints.md` with the new 3-tier hierarchy on a dedicated feature branch off `dev`.

**Non-Goals:**
- Modifying or reparenting closed GitHub issues (`#1`, `#13`–`#16`, `#19`, `#20`, `#24`, `#25`) on GitHub.
- Changing application runtime code under `frontend/`.

## Decisions

1. **Five Thematic Epics for Open Work (Leaving Closed Issues Untouched on GitHub)**
   - **Rationale:** Grouping the 13 open User Stories into 5 domain Epics provides top-level roadmap tracking without touching closed issues. In `docs/backlog.md`, completed camera/tracking issues (`#1`, `#13`–`#16`, `#20`, `#24`, `#25`) and `#19` are documented in a completed reference section so the documentation remains comprehensive.
   - **Epic Mapping:**
     1. `[EPIC] Facial Expression & Non-Manual Grammar` → children: `#26`, `#4`
     2. `[EPIC] ÖGS Dataset & Sign Recognition Pipeline` → children: `#11`, `#10`, `#2`, `#3`
     3. `[EPIC] German Sentence Synthesis & Two-Way Communication` → children: `#5`, `#6`, `#7`
     4. `[EPIC] Ergonomic Modes & Form Factors` → children: `#8`, `#9`
     5. `[EPIC] ÖGS Learning & Reference Tools` → children: `#17`, `#12`

2. **Disentangle Facial Expression Stories (`#26` vs `#4`) and Add Structured Tasks**
   - **Rationale:** `#26` (`[USER STORY]  emtions and face analyzing`) and `#4` (`[USER STORY] Facial expression as grammar`) currently overlap on facial blendshape classification. Splitting them cleanly by layer eliminates duplication:
     - `#26` becomes `[USER STORY] Facial expression and emotion panel` (Effort `3 - Medium`, Priority `4 - High`): focuses on classifying at least 3 facial/emotional states (`question / raised eyebrows`, `negation / head shake`, `neutral / statement`) from MediaPipe face blendshapes/landmarks and displaying a live status panel below the camera feed.
       - Child `[TASK]` 1 (`feat`): Implement facial expression / emotion classifier from MediaPipe blendshapes and head movement.
       - Child `[TASK]` 2 (`feat`): Add live facial expression and emotion readout panel below the camera view.
     - `#4` remains `[USER STORY] Facial expression as grammar` (Effort `3 - Medium`, Priority `4 - High`, reduced from `5 - Fucking Huge` now that `#26` handles base classification & UI): focuses on converting live facial states into `GrammarContext` modifiers (`question`, `negation`, `statement`) in parallel with hand tracking (`< 33 ms` frame budget) to alter translated sentence meaning.
       - Child `[TASK]` 1 (`feat`): Emit real-time `GrammarContext` modifiers from facial state classification within the `< 33 ms` frame budget.
       - Child `[TASK]` 2 (`feat`): Integrate `GrammarContext` markers with the sign sentence buffer for question and negation translation.

3. **Resolve Sign Recognition & Vocabulary Overlap (`#2`, `#10`, `#11`, `#21`–`#23`)**
   - **Rationale:** Currently, `#2` has an empty `### Acceptance Criteria` section because its 3 criteria were turned into empty-body sub-issues `#21`, `#22`, and `#23`. Meanwhile, `#23` (*"At least 30 core ÖGS signs are recognized reliably"*) duplicates `#10` (*"Emergency vocabulary: 30–50 core ÖGS signs..."*).
   - **Resolution:**
     - Restore the Acceptance Criteria checklist inside `#2`'s body, scope `#2` to real-time sign token buffering and live gloss display (`Effort: 3 - Medium`, `Priority: 5 - Critical`), and format `#21` (`[TASK] Display recognized sign glosses as live text`) and `#22` (`[TASK] Buffer recognized sign tokens in signing order`) using the `task.yml` structure (`Task Type`, `Description`, `Definition of Done`).
     - Reparent `#23` from `#2` to `#10` via GitHub GraphQL (`removeSubIssue` from `#2`, `addSubIssue` to `#10`) and format `#23` as `[TASK] Train and evaluate recognition model on 30-50 core ÖGS signs` using `task.yml` structure.

4. **Standardize `#17` (`[USER STORY] Basic ÖGS sign library`) to English & Template Format**
   - **Rationale:** `#17` currently lacks the `[USER STORY]` title prefix and mixes an English story with a German acceptance criterion (`Dynamisch geladenes json mit URLS von den basic signs`). Updating `#17` to `[USER STORY] Basic ÖGS sign library` with English acceptance criteria matching `.github/ISSUE_TEMPLATE/user-story.yml` makes all open stories uniform.

5. **Branching & Documentation Sync (`docs/backlog.md` and `docs/sprints.md`)**
   - **Rationale:** All repository changes must happen on a feature branch off `dev` (`docs/reorganize-backlog-hierarchy`). `docs/backlog.md` will be updated to mirror the 3-tier hierarchy (with issue links, effort/priority badges, and task breakdowns), and `docs/sprints.md` will be updated to fix `DGS` -> `ÖGS` and clearly list the Sprint 1 issues.

## Risks / Trade-offs

- **[Risk] GitHub GraphQL sub-issue mutation requires internal GraphQL node IDs (`I_kwDO...`)** → Mitigation: Query the exact node `id` of each parent and child issue via `gh api graphql` before running `addSubIssue` / `removeSubIssue` mutations with header `GraphQL-Features: sub_issues`.
