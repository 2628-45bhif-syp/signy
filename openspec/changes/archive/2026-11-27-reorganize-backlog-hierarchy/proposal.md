# Proposal

## Why

Following the introduction of the 3-tier GitHub issue templates (`Epic -> User Story -> Task`), open GitHub issues (`#2`–`#12`, `#17`, `#21`–`#23`, `#26`) and local documentation (`docs/backlog.md`, `docs/sprints.md`) still exhibit structural inconsistencies: Epics disguised as User Stories, overlapping facial expression stories (`#4` vs `#26`), an empty Acceptance Criteria section on `#2`, acceptance criteria copy-pasted as empty-body task issues (`#21`–`#23`), mixed German/English text and missing prefixes (`#17`), and local docs that are out of sync with the 3-tier hierarchy. Reorganizing the open issues under new Epic parent issues and updating `docs/backlog.md` and `docs/sprints.md` establishes a clean, consistent backlog without altering closed historical issues.

## What Changes

- Work on a dedicated feature branch off `dev` following the repository branching convention (`docs/<issue-or-short-description>` or `chore/<issue-or-short-description>`).
- Reorganize open GitHub issues into the 3-tier `Epic -> User Story -> Task` hierarchy (leaving closed issues `#1`, `#13`–`#16`, `#19`, `#20`, `#24`, `#25` untouched):
  - Create 5 `[EPIC]` parent issues (`epic` label, formatted per `.github/ISSUE_TEMPLATE/epic.yml`) covering the open backlog domains:
    1. `[EPIC] Facial Expression & Non-Manual Grammar`
    2. `[EPIC] ÖGS Dataset & Sign Recognition Pipeline`
    3. `[EPIC] German Sentence Synthesis & Two-Way Communication`
    4. `[EPIC] Ergonomic Modes & Form Factors`
    5. `[EPIC] ÖGS Learning & Reference Tools`
  - Resolve inconsistencies across open User Stories and link them as native GitHub sub-issues under their respective Epics:
    - Redefine `#26` (`[USER STORY] Facial expression and emotion panel`) to focus cleanly on classifying 3 core facial states from MediaPipe blendshapes and rendering a live emotion/expression readout panel below the camera, fixing title/body typos and dropdown formatting (`3 - Medium` effort, `4 - High` priority).
    - Refine `#4` (`[USER STORY] Facial expression as grammar`) to focus on mapping detected non-manual facial markers (`question`, `negation`, `statement`) into the translation grammar context within the `< 33 ms` frame budget (`3 - Medium` effort, `4 - High` priority).
    - Restore the missing Acceptance Criteria on `#2` (`[USER STORY] Real-time sign translation`) and scope it to real-time sign token buffering and live gloss display (`3 - Medium` effort, `5 - Critical` priority).
    - Align `#10` (`[USER STORY] Core and emergency vocabulary recognition`) and `#11` (`[USER STORY] ÖGS dataset`) so `#11` covers recording and augmenting the 2,500 -> 10,000 clip dataset while `#10` covers training and evaluating reliable recognition of 30–50 core/emergency ÖGS signs.
    - Standardize `#17` (`[USER STORY] Basic ÖGS sign library`) to English with the `[USER STORY]` prefix and template-compliant sections.
  - Format open `[TASK]` sub-issues per `.github/ISSUE_TEMPLATE/task.yml` (`[TASK]` prefix, `Task Type (Branch Prefix)`, `Description`, `Definition of Done`):
    - Update `#21` and `#22` as structured `[TASK]` sub-issues under `#2`.
    - Update `#23` as a structured `[TASK]` sub-issue and reparent it from `#2` to `#10` (where 30–50 core ÖGS sign recognition belongs).
    - Create structured `[TASK]` sub-issues under `#26` and `#4` for facial expression classification, UI panel display, and grammatical modifier integration.
- Update `docs/backlog.md` to reflect the complete 3-tier hierarchy (Epics, User Stories with checkboxes/status, and Tasks), including a completed section for the closed Multimodal Camera & Landmark Pipeline issues.
- Update `docs/sprints.md` to fix the `DGS` -> `ÖGS` terminology typo and clarify Sprint 1 issue references.

## Capabilities

### New Capabilities
<!-- None: GitHub backlog organization and project documentation update (`skip_specs: true`). -->

### Modified Capabilities
<!-- None: no system runtime spec requirements change (`skip_specs: true`). -->

## Impact

- **GitHub Issues:** Creates 5 `[EPIC]` issues, creates `[TASK]` sub-issues for `#26` and `#4`, updates open User Stories (`#2`, `#4`, `#10`, `#17`, `#26`) and open Tasks (`#21`, `#22`, `#23`), and wires native parent/sub-issue links. Closed issues remain untouched.
- **Documentation:** Updates `docs/backlog.md` and `docs/sprints.md` on a dedicated feature branch.
