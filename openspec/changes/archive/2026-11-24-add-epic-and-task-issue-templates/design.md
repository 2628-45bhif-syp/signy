# Design

## Context

`.github/ISSUE_TEMPLATE/` currently contains `config.yml` (`blank_issues_enabled: false`) and `user-story.yml` (`[USER STORY] ` prefix, `user-story` label, fields: `User Story`, `Acceptance Criteria`, `Effort Estimation`, `Priority`). The GitHub repository already defines `user-story` and `task` labels, while existing task sub-issues (#13–#16, #20–#23) were created without a template and have empty or unformatted bodies. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Define a 3-tier issue hierarchy (`Epic -> User Story -> Task`) where each tier has distinct, non-overlapping responsibilities.
- Connect the Task template directly to the repository's branch and commit naming conventions (`<type>/<issue-number>-<short-description>`).
- Keep all templates compatible with GitHub's YAML issue form schema and native Sub-issues linking.

**Non-Goals:**
- Retroactively migrating or rewriting closed historical issues (#1–#25).
- Adding automated GitHub Actions workflows for issue labeling or project board automation.

## Decisions

1. **Use GitHub Native Sub-issues Instead of Manual Parent ID Input Fields**
   - **Rationale:** GitHub's native Sub-issues feature tracks parent-child relationships (`Epic -> User Story` and `User Story -> Task`) with live progress bars and automatic link rendering. Including a manual `Parent Issue #` text input field in `task.yml` or `user-story.yml` duplicates state that can drift when issues are reparented.
   - **Alternatives considered:** Adding a required `parent_story` text input field to `task.yml` (rejected by user preference in favor of native GitHub sub-issues).

2. **Restrict Effort Estimation and Priority Strictly to User Stories**
   - **Rationale:** User Stories are the unit of sprint planning, estimation, and prioritization. Epics act as high-level thematic containers whose priority and scope derive from their constituent stories, while Tasks are small technical steps executed to fulfill a scheduled User Story. Omitting `effort` and `priority` dropdowns from `epic.yml` and `task.yml` prevents redundant or conflicting estimates across levels.
   - **Alternatives considered:** Including Effort (1–4) on Tasks and Priority (1–5) on Epics (rejected to keep estimation and prioritization strictly at the User Story level).

3. **Use `Task Type (Branch Prefix)` Dropdown Instead of Fixed Team/Component Areas in `task.yml`**
   - **Rationale:** The team works in an agile, cross-functional manner without fixed component silos. Providing a `Task Type (Branch Prefix)` dropdown (`feat`, `fix`, `refactor`, `test`, `docs`, `chore`) maps 1:1 to `## Git Commit Convention` and the `<type>/<issue-number>-<short-description>` branch naming rule.
   - **Alternatives considered:** A `Team / Component` dropdown (`Web App`, `AI Training`) based on early `docs/sprints.md` notes (rejected because the team does not use fixed working areas).

## Risks / Trade-offs

- **[Risk] `epic` label does not exist on the remote GitHub repository yet** → Mitigation: Include an implementation task to create the `epic` label via `gh label create` (or verify it exists) so `labels: ["epic"]` in `epic.yml` applies cleanly when issues are opened.
