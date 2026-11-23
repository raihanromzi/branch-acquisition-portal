# DEPLOYMENT.md

How the Branch Acquisition & Monitoring Portal is built, checked, published, and released.

Status: **not deployable yet.** The repo has no application code until task T001 in
`specs/001-acquisition-portal/tasks.md` runs. The steps below describe the target setup. Update
this file when the real `package.json`, workflow files, or Vercel project settings change.

## What gets deployed

A static-first Next.js (App Router) prototype hosted on Vercel. There is no backend, no database,
and no secrets (spec decision 1 and `research.md` section 12). All sample data ships in the bundle.

## Environments

| Environment | Trigger | Where | Purpose |
|---|---|---|---|
| Preview | Every pull request | Vercel preview URL | Review a change before merge |
| Production | Push to `main` | Vercel production URL | The public prototype for testers |

## Build settings (Vercel)

- Framework preset: Next.js
- Install command: `npm ci`
- Build command: `npm run build`
- Output: Next.js default
- Node.js: 20 LTS or newer (matches `specs/001-acquisition-portal/quickstart.md`)
- Environment variables: none required. Do not add any unless a task in `tasks.md` names one.

## CI (GitHub Actions)

The workflow file `.github/workflows/ci.yml` runs on every pull request and every push to `main`.
It runs the same checks as `CLAUDE.md`, in this order. A failure at any step blocks the merge.

1. `npm ci`
2. `npx tsc --noEmit`
3. `npm run lint`
4. `npm run build`

There are no test steps, per the constitution (Principle III). Do not add one without an
explicit request for a named change.

Create the workflow when T001 produces `package.json`. Until then, this file is the spec for it.

## Publishing to Vercel

Vercel's GitHub integration does the publishing. There is no separate deploy job, so the same
push that runs CI also publishes.

1. In Vercel, import the GitHub repository once and accept the Next.js defaults above.
2. Pushes to `main` create production deployments. Pull requests create preview deployments.
3. Vercel shows a failed build as a failed deployment. Production keeps serving the last good build.

Vercel is the only place that serves the public site. Do not hand-upload builds.

## Releases (GitHub)

Each completed phase in `tasks.md` gets an annotated git tag and a GitHub Release.

| Phase | Tag | Release title |
|---|---|---|
| Phase 0 | `phase-0-initialization` | Phase 0: initialization |
| Phase 1 | `phase-1-setup` | Phase 1: setup |
| Phase 2 | `phase-2-foundational` | Phase 2: foundational |
| Phase 3 to 8 | `phase-3-us1-intake`, and so on | Named after the user story |
| Final | `phase-final-polish` | Final: polish and validation |

Steps for each release:

1. Confirm the phase's tasks are marked `[X]` in `tasks.md` and CI is green on `main`.
2. Tag the commit: `git tag -a <tag> -m "<release title>"`, then `git push origin <tag>`.
3. Create the release with the GitHub CLI: `gh release create <tag> --title "<release title>" --notes-file <notes>`.
   Notes list the completed tasks, the Vercel production URL, and any open questions from
   `CLAUDE.md`.

## Rollback

- Vercel: promote a previous production deployment from the Vercel dashboard. This restores the
  site without a code change.
- Git: revert the commit on `main` with `git revert <sha>`. This triggers a new deployment.

## Before the first public deploy

- Confirm the repository visibility is what you want. The repo is currently public.
- Check that no internal bank data is in the repo. All records must be fictional (spec assumption).
- Confirm the sample data contains no real NIP, CIF, or merchant details.
- Confirm the public URL is acceptable for testers, since spec decision 1 expects public access.
