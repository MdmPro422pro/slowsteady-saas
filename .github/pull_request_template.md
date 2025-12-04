# Pull Request Template

## Title
`chore(scaffold): [brief description]`

## Summary
Brief description of what this PR accomplishes.

## Changes Made
- [ ] List key changes
- [ ] Feature additions
- [ ] Bug fixes
- [ ] Documentation updates

## Definition of Done
- [ ] Code builds successfully
- [ ] All tests pass (when implemented)
- [ ] No new security vulnerabilities introduced
- [ ] Documentation updated
- [ ] CI workflow passes
- [ ] At least one reviewer approved
- [ ] No secrets or credentials committed

## Testing Steps
1. Checkout the branch
2. Run `pnpm install`
3. Test frontend: `pnpm --filter frontend dev`
4. Test backend: `pnpm --filter backend dev`
5. Verify health endpoint: `curl http://localhost:4000/health`

## Security Considerations
- [ ] No sensitive data exposed
- [ ] Dependencies audited
- [ ] Trivy scan passed

## Reviewers
@MdmPro422pro

## Labels
Add relevant labels: `setup`, `feature`, `bugfix`, `security`, `dependencies`
