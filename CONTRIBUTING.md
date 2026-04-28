# Contributing to MrZvir

This project is used to practice the full delivery lifecycle of a frontend MVP.

## Branching Strategy

- `main` - stable branch for release-ready code
- `develop` - integration branch for completed features
- `feature/<short-name>` - isolated work for a single lab task or feature
- `hotfix/<short-name>` - urgent production fixes

Recommended flow:

1. Branch from `develop` using `feature/<name>`.
2. Make small, focused commits.
3. Run lint, unit tests, coverage, and E2E locally.
4. Open a Pull Request into `develop`.
5. Request review and address comments.
6. Merge only after CI passes.
7. Use `develop` for preview deployments and `main` for production releases.

## Commit Messages

Use Conventional Commits where possible:

- `feat:` new functionality
- `fix:` bug fix
- `test:` test updates
- `docs:` documentation changes
- `chore:` tooling or maintenance
- `refactor:` code restructuring without behavior change

Examples:

- `feat: add analytics task board`
- `fix: capture simulated client errors in sentry`
- `test: extend e2e coverage for task lifecycle`

## Pull Requests

Each PR should include:

- a short description of the problem and solution
- linked issue or lab task if available
- screenshots for UI changes
- notes about testing performed

## Local Quality Checklist

Run before opening a PR:

```bash
npm run lint
npm test
npm run test:coverage
npm run e2e
npm run build
```

## Environment Setup

Copy values from `.env.example` into your local `.env` if needed and add service credentials only on your machine or in GitHub secrets.

For production Sentry releases and source map upload, GitHub Actions also needs:

- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`

For Vercel deployments, GitHub Actions also needs:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Code Review Focus

Reviewers should check:

- correctness and readability
- test coverage for new behavior
- analytics and monitoring impact
- CI/CD safety and environment handling
- documentation updates when setup changes
