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
