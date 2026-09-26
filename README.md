# Proviyaa Master - Frontend & Full-Stack Platform

[![CI Pipeline](https://github.com/proviaa-master/proviaa-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/proviaa-master/proviaa-frontend/actions/workflows/ci.yml)
[![CD Deployment](https://github.com/proviaa-master/proviaa-frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/proviaa-master/proviaa-frontend/actions/workflows/deploy.yml)
[![CodeQL Security](https://github.com/proviaa-master/proviaa-frontend/actions/workflows/codeql.yml/badge.svg)](https://github.com/proviaa-master/proviaa-frontend/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-grade React application with Vite, TypeScript, Tailwind CSS, and a Node.js/Supabase backend, hosted under the **[proviaa-master](https://github.com/orgs/proviaa-master/)** organization.

---

## 📋 Project Specifications

| Property | Value |
| :--- | :--- |
| **Organization** | [`proviaa-master`](https://github.com/orgs/proviaa-master/) |
| **Repository Name** | `proviaa-frontend` (or `proviaa-master-admin`) |
| **Build Tool** | [Vite 5](https://vitejs.dev/) |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) |
| **Package Manager** | `npm` (Lockfile-based `npm ci`) |
| **Node Version** | `20 LTS` (Matrix-tested on 18.x, 20.x, 22.x) |
| **Testing Framework** | [Vitest 2](https://vitest.dev/) + [@testing-library/react](https://testing-library.com/) |
| **Code Quality** | ESLint 8 + Prettier 3 + TypeScript Strict Mode |
| **Security Scanning** | CodeQL SAST + TruffleHog Secret Scanning + Dependabot + `npm audit` |
| **Deployment Targets** | Vercel (PR Previews, Staging, Production with approval) / Docker container |

---

## 🌿 Git Branching Strategy & Branch Protection Rules

### 1. Branch Strategy
- **`main`**: Production-ready code only. Directly corresponds to the Production environment (`https://proviaa.com`).
- **`develop`**: Integration branch for pre-release features. Deploys to Staging (`https://staging.proviaa.com`).
- **`feature/*` / `fix/*`**: Ephemeral development branches. Merge into `develop` via Pull Request.

### 2. Branch Protection Rules (`main` and `develop`)
Configure through GitHub Organization Settings or the GitHub CLI:

```bash
# Using GitHub CLI (gh)
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  /repos/proviaa-master/proviaa-frontend/branches/main/protection \
  -f required_status_checks[strict]=true \
  -f required_status_checks[contexts][]="Code Quality (Lint, Format, Typecheck)" \
  -f required_status_checks[contexts][]="Unit Tests (Node 20.x)" \
  -f required_status_checks[contexts][]="Production Build & Bundle Size" \
  -f enforce_admins=true \
  -f required_pull_request_reviews[dismiss_stale_reviews]=true \
  -f required_pull_request_reviews[require_code_owner_reviews]=false \
  -f required_pull_request_reviews[required_approving_review_count]=1 \
  -f restrictions=null
```

#### GitHub Web UI Configuration:
1. Navigate to **Settings** > **Branches** > **Add branch protection rule**.
2. **Branch name pattern**: `main` (and repeat for `develop`).
3. Check **Require a pull request before merging**:
   - Require approvals: `1`
   - Dismiss stale pull request approvals when new commits are pushed
4. Check **Require status checks to pass before merging**:
   - Require branches to be up to date before merging
   - Status checks required:
     - `Code Quality (Lint, Format, Typecheck)`
     - `Unit Tests (Node 20.x)`
     - `Production Build & Bundle Size`
5. Check **Do not allow bypassing the above settings**.

---

## 🛠️ Local Development & Quality Scripts

All scripts can be executed either from the root or inside the `/frontend` directory:

```bash
# 1. Install dependencies using lockfile
npm run install:all          # Root
npm ci                       # Inside /frontend

# 2. Code Quality checks
npm run lint                 # ESLint check
npm run lint:fix             # ESLint automatic fix
npm run format:check         # Prettier verification
npm run format:write         # Prettier auto-formatting
npm run typecheck            # TypeScript compiler check (tsc --noEmit)

# 3. Unit testing & coverage
npm run test                 # Run Vitest test suite
npm run test:watch           # Watch mode for active development
npm run test:coverage        # Vitest with v8 coverage threshold

# 4. Production build & local preview
npm run build                # TypeScript compilation + Vite production bundle
npm run preview              # Local preview of the production build (http://localhost:4173)
```

---

## 🔄 CI/CD Pipeline Stages

### 1. `ci.yml` (Continuous Integration)
- **Triggers**: Push to `main`/`develop`, Pull Requests to `main`/`develop`, and manual `workflow_dispatch`.
- **Concurrency Control**: Outdated in-flight runs are automatically cancelled when a new commit is pushed.
- **Stage 1: Quality**: Runs ESLint, Prettier, and `tsc --noEmit` in parallel with clean npm cache.
- **Stage 2: Security**: Scans dependencies with `npm audit` and scans repository for leaked credentials with TruffleHog.
- **Stage 3: Test Matrix**: Executes Vitest across Node 18, 20, and 22 LTS, enforces coverage thresholds, and saves coverage reports as artifacts.
- **Stage 4: Build**: Compiles production bundle with Vite, generates bundle-size step summary, and uploads `dist/` as a workflow artifact.
- **Stage 5: Lighthouse CI**: Audits performance, accessibility, best practices, and SEO against the production bundle.
- **Stage 6: Summary**: Compiles markdown table report in the GitHub Action Step Summary.

### 2. `deploy.yml` (Continuous Delivery)
- **PR Preview**: Triggered on pull requests. Builds preview bundle, creates Vercel preview deployment, and comments the active preview URL on the PR.
- **Staging**: Triggered on merge to `develop`. Deploys directly to staging environment.
- **Production**: Triggered on merge to `main`. Protected by GitHub Environment **`production`** requiring mandatory reviewer approval before release.

### 3. `codeql.yml` (Security SAST)
- Performs semantic Static Application Security Testing (SAST) using GitHub CodeQL for JavaScript/TypeScript weekly and on pull requests.

---

## 🔑 Required GitHub Secrets

Configure in **Repository Settings** > **Secrets and variables** > **Actions**:

| Secret Name | Purpose | How to obtain |
| :--- | :--- | :--- |
| `VERCEL_TOKEN` | Authentication for Vercel deployment CLI | [Vercel Account Tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel team/org identifier | Found in `.vercel/project.json` or project settings |
| `VERCEL_PROJECT_ID` | Target Vercel project identifier | Found in Vercel project general settings |
| `SUPABASE_URL` | Supabase API URL for build injection | Supabase Project Settings > API |
| `SUPABASE_ANON_KEY` | Public client anon key | Supabase Project Settings > API |

---

## 🐳 Docker Deployment (Optional)

Build and run the production-optimized multi-stage Docker container locally or on any cloud runtime:

```bash
# Build the production image
docker build -t proviaa-frontend ./frontend

# Run the container on port 80
docker run -p 8080:80 proviaa-frontend
```
Open `http://localhost:8080` in your browser.
