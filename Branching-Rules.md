# Issue Tracker Branching Rules

## Branch Types & Naming Convention

| Branch Type | Pattern | Purpose | Example |
|------------|---------|---------|---------|
| Main (protected) | `main` | Production-ready code | `main` |
| Development | `dev` | Integration branch | `dev` |
| Feature | `feat/*` | New features | `feat/user-auth` |
| Bug Fix | `fix/*` | Bug fixes | `fix/login-validation` |
| Hotfix | `hotfix/*` | Urgent production fixes | `hotfix/security-patch` |
| Release | `release/v*` | Release preparation | `release/v1.2.0` |
| Documentation | `docs/*` | Documentation updates | `docs/api-guide` |

## Branch Protection Rules

### Main Branch (`main`)
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
  - Required checks: `server-test`, `client-test`, `docker-compose-test`
- ✅ Require branches to be up to date
- ✅ Require linear history (no merge commits)
- ❌ No direct pushes to main
- ❌ No force pushes

### Development Branch (`dev`)
- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ✅ Allow squash merging
- ❌ No direct pushes except by maintainers

## Common Commands

### 1. Creating New Branches
```bash
# Feature Branch
git checkout main
git pull origin main
git checkout -b feat/feature-name

# Bug Fix Branch
git checkout main
git pull origin main
git checkout -b fix/bug-name

# Hotfix Branch
git checkout main
git pull origin main
git checkout -b hotfix/issue-name

# Documentation Branch
git checkout main
git pull origin main
git checkout -b docs/topic-name
```

### 2. Keeping Branches Updated
```bash
# Update your branch with latest main
git checkout main
git pull origin main
git checkout your-branch
git rebase main

# If there are conflicts
git rebase --continue  # after resolving conflicts
# or
git rebase --abort     # to cancel the rebase
```

### 3. Preparing for Pull Request
```bash
# Update your branch
git fetch origin
git rebase origin/main

# Push changes
git push origin your-branch

# Force push if you rebased (use with caution)
git push --force-with-lease origin your-branch
```

### 4. Clean Up After Merge
```bash
# Delete local branch
git checkout main
git branch -d your-branch

# Delete remote branch
git push origin --delete your-branch

# Prune deleted remote branches
git fetch --prune
```

## Commit Message Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### Examples
```
feat(auth): add JWT token validation

- Implement JWT middleware
- Add token refresh endpoint
- Update login flow to use JWT

Closes #123
```

## Pull Request Guidelines

### Title Format
`[Type] Brief description`

Example: `[Feature] Add user authentication`

### Description Template
```markdown
## Changes
- Detailed change 1
- Detailed change 2

## Testing
- [ ] Test case 1
- [ ] Test case 2

## Screenshots (if applicable)

## Related Issues
Closes #issue-number
```

## Branch Lifecycle

1. Create branch from `main`
2. Make changes in small, logical commits
3. Keep branch updated with main (rebase)
4. Create Pull Request
5. Address review feedback
6. Squash and merge
7. Delete branch

## Troubleshooting

### Reset Branch to Main
```bash
git checkout main
git pull origin main
git checkout your-branch
git reset --hard origin/main
```

### Undo Last Commit (not pushed)
```bash
git reset --soft HEAD~1
```

### Stash Changes Temporarily
```bash
git stash save "work in progress"
git stash list
git stash pop stash@{0}
```

### Fix Wrong Branch
```bash
git stash
git checkout correct-branch
git stash pop
```

## Questions or Improvements?

Open a PR updating this document with suggested changes. All improvements welcome!
*Note:This is AI generated contents* 
