# Design

## Context

`AGENTS.md` currently contains communication instructions (caveman mode). It notes "Boundaries: code/commits/PRs written normal", but does not specify what "normal" means. Recent git history reflects emerging adoption of Conventional Commits (`feat`, `docs`, `ci`, `refactor`), but lacks uniform enforcement across AI agents and team members. See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- Provide a clear, unambiguous commit message standard directly within `AGENTS.md`.
- Align with existing commit patterns in git history.
- Ensure all AI assistants parse and apply the rule prior to generating commits.

**Non-Goals:**
- Setting up client-side Git hooks (`commit-msg`) or CI commit linting workflows (deferred to future tooling updates).
- Changing historical git commit messages.

## Decisions

### Decision 1: Conventional Commits specification
- **Choice**: Adopt Conventional Commits format `<type>(<scope>): <subject>`.
- **Allowed Types**:
  - `feat`: New feature or capability
  - `fix`: Bug fix
  - `docs`: Documentation only changes
  - `chore`: Maintenance, config, dependencies, tooling
  - `refactor`: Code change that neither fixes a bug nor adds a feature
  - `ci`: CI/CD workflow and build changes
  - `test`: Adding or correcting tests
- **Format details**: Lower-case type, optional scope in parentheses, lowercase imperative summary, no trailing period, maximum 72 characters.
- **Alternatives considered**:
  - Freestyle commits: Inconsistent and unparseable by automated release tools.
  - Custom prefix format (e.g. `[FEATURE]`): Deviates from git ecosystem standards.

### Decision 2: Section layout in `AGENTS.md`
- **Choice**: Add a dedicated `## Commit Message Rules` section in `AGENTS.md` that is explicitly addressed to AI agents and human contributors.

## Risks / Trade-offs

- **[Risk]** Context overflow or agent non-compliance without hard git hooks.
  - **Mitigation**: Keep the rule concise, directive, and backed by concrete examples for immediate in-context adherence.
