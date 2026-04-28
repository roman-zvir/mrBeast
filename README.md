# MrZvir

[![CI/CD Pipeline](https://github.com/roman-zvir/mrBeast/actions/workflows/main.yml/badge.svg)](https://github.com/roman-zvir/mrBeast/actions/workflows/main.yml)

MrZvir is a small Vite-based MVP used to practice modern frontend delivery: Git workflow, automated testing, build automation, CI/CD, product analytics, and observability.

## Project Vision

Build a lightweight task-focused delivery console that demonstrates the full lifecycle of a frontend MVP from local development to monitoring in production.

## Tech Stack

- HTML
- CSS
- JavaScript
- Vite
- Node.js test runner
- Playwright
- GitHub Actions
- PostHog
- Sentry

## Lab Coverage

- `Lab 1` - Git workspace structure, `.gitignore`, README, branching-oriented repo hygiene.
- `Lab 2` - Unit tests, mocked async test, coverage report, E2E tests, broken test mode.
- `Lab 3` - Build scripts, linting, environment files, preview, generated `dist/` artifacts.
- `Lab 4` - GitHub Actions pipeline for lint, tests, build, and deployment integration points.
- `Lab 5` - Event-driven analytics with PostHog, task events, feature flags.
- `Lab 6` - Error tracking and observability hooks with Sentry, release tagging, source maps.

## Installation

```bash
npm install
node ./node_modules/@playwright/test/cli.js install chromium
```

## Environment Variables

Create or adjust local env files as needed:

- `.env.example` - starter template for required values
- `.env` - local development values
- `.env.production` - production defaults

Supported variables:

- `VITE_APP_STATUS`
- `VITE_POSTHOG_KEY`
- `VITE_POSTHOG_HOST`
- `VITE_SENTRY_DSN`
- `VITE_SENTRY_TRACES_SAMPLE_RATE`
- `VITE_RELEASE`
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN`
- `SENTRY_RELEASE`

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm test
npm run test:coverage
npm run test:broken
npm run e2e
```

## Run Locally

```bash
npm run dev
```

Open the Vite URL shown in the terminal.

## Testing

```bash
npm test
npm run test:coverage
npm run e2e
```

## Broken Test Demo

```bash
npm run test:broken
```

This intentionally enables `BUG_MODE=1` so the `calculateTotal` unit test fails and demonstrates regression detection.

## Deployment Notes

- The GitHub Actions workflow lives in `.github/workflows/main.yml`.
- Pushes to `develop` trigger Vercel preview deployment.
- Pushes to `main` trigger Vercel production deployment.
- GitHub Actions requires `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` for deployment.
- Vite build output is generated in `dist/`.
- CI also runs Playwright and uploads `coverage`, `dist`, and `playwright-report` artifacts.

## Analytics and Monitoring

- PostHog captures CTA clicks, task creation, completion, deletion, urgent-filter usage, and simulated errors.
- Sentry captures simulated client errors when `VITE_SENTRY_DSN` is configured.
- Vite source maps are enabled to support clearer production debugging.
- When `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` are available during build, `vite.config.js` uploads source maps and creates a release automatically; if upload fails, the build continues and logs a warning.

## Collaboration Workflow

- See `CONTRIBUTING.md` for branching strategy, commit naming, pull request flow, and the local quality checklist.

## What Still Requires External Services

The codebase is prepared, but these parts cannot be fully activated from the repo alone:

- real PostHog ingestion requires a valid `VITE_POSTHOG_KEY`
- real Sentry issue capture requires a valid `VITE_SENTRY_DSN`
- Sentry source map upload requires `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT`
- real cloud deployment requires GitHub repository secrets for your hosting provider and a linked Vercel project
