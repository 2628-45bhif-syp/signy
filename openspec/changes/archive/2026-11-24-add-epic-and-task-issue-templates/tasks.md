# Tasks

## 1. GitHub Label & Issue Templates

- [x] 1.1 Create the `epic` label in the GitHub repository (`gh label create epic --description "High-level epic grouping multiple user stories" --color "5319e7" --force`) and verify `gh label list` includes `epic`, `user-story`, and `task`.
- [x] 1.2 Create `.github/ISSUE_TEMPLATE/epic.yml` with `[EPIC] ` title prefix, `epic` label, `Epic Goal` textarea, and `Acceptance Criteria / Outcome` textarea (no Effort or Priority fields, referencing GitHub native Sub-issues); verify the YAML parses cleanly.
- [x] 1.3 Create `.github/ISSUE_TEMPLATE/task.yml` with `[TASK] ` title prefix, `task` label, `Task Type (Branch Prefix)` dropdown (`feat`, `fix`, `refactor`, `test`, `docs`, `chore`), `Description` textarea, and `Definition of Done` textarea (no Effort, Priority, or fixed team area fields); verify the YAML parses cleanly and all three templates (`epic.yml`, `user-story.yml`, `task.yml`) are present in `.github/ISSUE_TEMPLATE/`.
