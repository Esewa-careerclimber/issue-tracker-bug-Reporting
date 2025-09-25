## Branching Strategy & Rules

This repository uses a lightweight Git branching model optimized for a MERN stack with CI (GitHub Actions) running tests and Docker Compose validation. Follow these rules to keep history clean, reduce merge pain, and ensure reliable deployments.

### Branch Types
| Branch Type | Pattern | Purpose | Merge Target | Delete After Merge |
|-------------|---------|---------|--------------|--------------------|
| Main (protected) | `main` | Always deployable / stable | n/a | No |
| Development (optional) | `dev` | Integration of multiple feature streams (only if needed) | `main` | No |
| Feature | `feat/<scope>-<short-desc>` | New user-facing functionality | `main` or `develop` | Yes |
| Bug Fix | `fix/<issue|bug>-<short-desc>` | Fixes a defect / failing test | `main` or `develop` | Yes |
| Chore / Maintenance | `chore/<area>-<short-desc>` | Infra, config, refactors (no behavior change) | `main` or `develop` | Yes |
| Hotfix (urgent prod fix) | `hotfix/<short-desc>` | Critical production issue | `main` (then back-merge to `develop` if exists) | Yes |
| Release (optional) | `release/<version>` | Stabilize for tagged release | `main` (tag) | Yes |
| Experiment / Spike | `exp/<topic>` | Throwaway exploration (may be squashed) | Usually none or draft PR | Yes |

> If you are NOT actively using a `dev` branch, treat `main` as the integration branch and merge features directly into it via PRs.

### Naming Conventions
1. Use lowercase, hyphen-separated words after the type prefix.
2. Keep under 5 words total where possible.
3. Reference an issue number optionally at the start: `feat/123-auth-middleware`.
4. Avoid long generic names (`feat/new-feature` is too vague). Prefer `feat/issue-filtering`.

### Commit Message Conventions (Conventional Commits)
Format: `type(scope?): description`

Allowed types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `ci`, `build`, `perf`, `style`.

Examples:
```
feat(auth): add JWT access + refresh tokens
fix(api): handle null project id in issue creation
ci: add docker compose health wait to pipeline
chore: bump mongoose to 7.x and remove deprecated options
```

Use body lines for rationale and BREAKING CHANGES:
```
feat(api)!: switch issue id format to ULID

BREAKING CHANGE: existing clients must handle new id field format.
```

### Pull Request (PR) Rules
| Requirement | Rule |
|-------------|------|
| Tests | All existing tests must pass; add tests for new logic |
| Lint | Must pass `npm run lint` in both `client` & `server` if changed |
| Scope | One logical concern per PR (small & reviewable) |
| Description | Explain the problem, the change, and test evidence (screens / logs) |
| Linked Issue | Use `Closes #<id>` when applicable |
| Draft PR | Allowed early for feedback (CI still runs) |

### Rebasing vs Merging
Prefer *rebasing* your feature branch on latest target branch before opening / updating a PR to keep linear history:
```
git checkout feat/issue-filter
git fetch origin
git rebase origin/main
# Resolve conflicts, then continue
git rebase --continue
git push --force-with-lease
```
Use `--force-with-lease` (NOT `--force`) to avoid overwriting collaborators' work.

If the branch is shared by multiple people and conflict risk is high, a regular merge (no fast-forward) is acceptable:
```
git checkout feat/shared-work
git fetch origin
git merge origin/main
git push
```

### Branch Lifecycle Flow (Typical Feature)
1. Sync local default branch: `git checkout main && git pull origin main`
2. Create feature branch: `git checkout -b feat/<scope>-<desc>`
3. Implement + commit in small chunks.
4. Rebase (or merge) latest `main` before opening PR if > 1 day old.
5. Open PR → ensure CI green.
6. Address review feedback.
7. Squash merge (recommended) OR merge (for multi-commit logical history).
8. Delete remote branch.

---
## Practical Branch Commands

### Create a Branch (From Updated Main)
```
git fetch origin
git checkout main
git pull origin main
git checkout -b feat/issue-filtering
```

### Publish Branch
```
git push -u origin feat/issue-filtering
```

### Rename a Local Branch
```
git branch -m old-name new-name
git push origin :old-name
git push -u origin new-name
```

### Update Your Branch With Latest Main (Rebase)
```
git fetch origin
git checkout feat/issue-filtering
git rebase origin/main
# If conflicts:
#   edit files
git add <resolved-files>
git rebase --continue
git push --force-with-lease
```

### Abort a Rebase
```
git rebase --abort
```

### Merge Main into Branch (Alternative to Rebase)
```
git fetch origin
git checkout feat/issue-filtering
git merge origin/main
git push
```

### Squash Commits Before Pushing (Local Cleanup)
```
git reset --soft HEAD~3
git commit -m "feat(issue-filter): add filtering by status & priority"
```

### Find Branches Merged Into Main
```
git checkout main
git pull origin main
git branch --merged
```

### Delete Fully Merged Local & Remote Branch
```
git branch -d feat/issue-filtering      # local (safe, refuses if unmerged)
git push origin --delete feat/issue-filtering
```

### Stash WIP Before Switching Branches
```
git stash push -m "wip: partial filter logic"
git checkout main
git stash list
git stash apply stash@{0}
```

---
## Troubleshooting Cheat Sheet

| Problem | Symptom | Fix |
|---------|---------|-----|
| Accidental commit to `main` | Commit on main not pushed yet | `git reset --soft origin/main` then create a branch & commit again |
| Accidental push to `main` | Wrong change live | `git revert <sha>` (never rewrite public main) |
| Branch behind main with conflicts | Rebase stops & marks conflicts | Resolve files → `git add` → `git rebase --continue` |
| Force push rejected | Upstream changed | `git fetch origin` then rebase and `--force-with-lease` |
| “Diverged branches” warning | `git status` shows ahead/behind | `git fetch origin` then rebase or merge |
| Wrong branch name | Misnamed early | `git branch -m old new` then push & delete old remote |
| Want to discard uncommitted changes | Keep last commit only | `git restore .` (files) or `git reset --hard` (ALL) |
| Stuck in rebase/merge | Many conflicts, want out | `git rebase --abort` or `git merge --abort` |
| CI not triggering | Only docs changed | Add non-ignored file change OR remove `paths-ignore` rule |
| Large binary added accidentally | File shows in git diff | `git rm --cached <file>` & commit; if pushed, use Git LFS or purge history (advanced) |

### Recover a Deleted Branch (If Not Garbage Collected)
```
git reflog | grep <partial-commit-msg>
git checkout -b recovered-branch <commit-sha>
```

### Clean Up Local Stale Branches (Merged)
```
git fetch -p
git branch --merged origin/main | grep -v "main" | xargs -n 1 git branch -d
```
> Windows (PowerShell) alternative:
```
git branch --merged origin/main | Select-String -NotMatch "main" | ForEach-Object { $_.ToString().Trim() } | ForEach-Object { git branch -d $_ }
```

### Verify Branch Only Contains Intended Changes
```
git fetch origin
git diff --name-status origin/main...HEAD
```

### Show Commit Graph (Compact)
```
git log --oneline --decorate --graph --all --max-count=30
```

---
## CI Integration Notes
1. **Open a PR early**: CI validates server tests, client tests, and Docker Compose build.
2. **Green before merge**: Never override failing CI unless a known external flake (document it).
3. **Small PRs** = faster reviews & less merge conflict risk.
4. **/health contract**: Do not remove or change the semantics of the `/health` endpoint without updating CI & Docker healthchecks.

---
## Quick Reference Summary
| Task | Command |
|------|---------|
| New feature branch | `git checkout -b feat/<scope>-<desc>` |
| Update branch | `git fetch origin && git rebase origin/main` |
| Push first time | `git push -u origin feat/<scope>-<desc>` |
| Force (safe) after rebase | `git push --force-with-lease` |
| Fix last commit message | `git commit --amend` |
| Undo unpushed commit | `git reset --soft HEAD~1` |
| View graph | `git log --oneline --decorate --graph --all` |
| Delete remote branch | `git push origin --delete <branch>` |

---
Questions or improvements? Open a PR editing `BranchingRules.md` with the proposed change.<br>
*Note* : This file is auto generated by AI not by me:Gaurav Karki. so if you want to improve ** Open a PR editing `BranchingRules.md` with the proposed change.**<br


