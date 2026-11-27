# Proposal

## Why

The repository currently only provides a single GitHub issue template (`.github/ISSUE_TEMPLATE/user-story.yml`) with blank issues disabled (`blank_issues_enabled: false`). As a result, broad multi-story themes (like facial expression & emotion analysis in issues #4 and #26) are squeezed into single User Story issues, while technical sub-issues (`task` label, e.g., #13–#16, #21–#23) are created with empty bodies and no structured Definition of Done or branch-type mapping. Adding dedicated `Epic` and `Task` issue templates establishes a clean 3-tier issue hierarchy (`Epic -> User Story -> Task`) connected via GitHub's native Sub-issues feature.

## What Changes

- Add `.github/ISSUE_TEMPLATE/epic.yml` for high-level Epics (`[EPIC] ` title prefix, `epic` label):
  - Captures `Epic Goal` and `Acceptance Criteria / Outcome` without duplicating Effort Estimation or Priority (which belong strictly to User Stories).
  - Instructs contributors to link child User Stories via GitHub's native Sub-issues feature.
- Add `.github/ISSUE_TEMPLATE/task.yml` for technical implementation Tasks (`[TASK] ` title prefix, `task` label):
  - Captures `Task Type (Branch Prefix)` (`feat`, `fix`, `refactor`, `test`, `docs`, `chore`) matching the project's commit and branch naming convention (`<type>/<issue-number>-<short-description>`).
  - Captures `Description` and `Definition of Done` checklists without Effort Estimation, Priority, or fixed team-area constraints.
- Ensure the `epic` label exists in the GitHub repository alongside `user-story` and `task`.

## Capabilities

### New Capabilities
<!-- None: GitHub issue template and project workflow configuration change (`skip_specs: true`). -->

### Modified Capabilities
<!-- None: no system runtime spec requirements change (`skip_specs: true`). -->

## Impact

- `.github/ISSUE_TEMPLATE/epic.yml`: New GitHub issue form template for Epics.
- `.github/ISSUE_TEMPLATE/task.yml`: New GitHub issue form template for Tasks.
- GitHub repository labels: Adds `epic` label to complement existing `user-story` and `task` labels.
