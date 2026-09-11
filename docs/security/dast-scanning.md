# DAST Scanning (ZAP)

## What runs and where

| Job | Trigger | Roles scanned | Target |
|---|---|---|---|
| `dast-api` (2× matrix) | Every non-draft PR targeting `staging` | `petitionsclerk`, `petitioner` | `http://localhost:4000/api/swagger.json` |
| `dast-api` (public baseline) | Same (runs inside `petitioner` matrix leg) | unauthenticated | `http://localhost:4001` |
| `dast-web` | Weekly Monday 06:00 UTC + `workflow_dispatch` | `petitionsclerk` (private), unauthenticated (public) | `http://localhost:1234`, `http://localhost:5678` |

Both jobs are **warn-only** (`continue-on-error: true`). Findings appear in the GitHub Security tab under categories `zap-api-petitionsclerk`, `zap-api-petitioner`, and `zap-public-api`. They never fail the PR gate.

## Multi-role authenticated scans

`scripts/get-local-zap-token.mjs` now accepts a username argument and writes `options-<role>.prop`. The ZAP Replacer add-on injects `Authorization: Bearer <real-cognito-local-token>` on every request for that role.

**Why two roles?** ZAP api-scan fuzzes endpoints against the OpenAPI spec (`/api/swagger.json`). In-app RBAC (`isAuthorized` in interactors, `shared/src/authorization/authorizationClientService.ts`) enforces role-based permission checks in-process — identical locally and in production. Scanning as `petitionsclerk` (privileged) and `petitioner` (low-priv) exercises different authenticated surface areas.

## Known local false positives — triage these OUT

**Token-forgery / `alg:none` / expired-token findings from local ZAP runs are local-only artifacts and do NOT indicate a production vulnerability.**

Why: the local stack (`app-local.ts`, port 4000) calls `jwt.decode` (no signature verification) and has no Cognito authorizer — it accepts any structurally decodable JWT. The real edge trust boundary — signature verification, issuer validation, and expiry enforcement — exists **only** in the deployed AWS API Gateway custom authorizer (`createAuthorizer.ts`, wired via Terraform in `web-api/terraform/modules/api/api.tf`).

When ZAP reports alerts like:
- JWT `alg:none` accepted
- Token with forged/invalid signature accepted
- Expired token accepted

**Mark them as "Not applicable" or "False positive" in the Security tab** and note: "Local DAWSON stack does not run the Cognito edge authorizer; this is expected behavior in local-only environments."

The deployed edge behavior is validated separately — see below.

## Deployed edge trust-boundary check (CircleCI)

`scripts/circleci/verify-authorizers.sh` runs in the `api-hosted-environment-tests` CircleCI job after each deploy. It asserts:

1. Missing token → 401
2. Garbage/malformed token → 401
3. Structurally-valid but expired JWT → 401 (deployed Cognito authorizer validates `exp`)
4. Valid petitioner token hitting a restricted endpoint → 401 or 403

This is the **only place** token-forgery and expiry behavior is meaningfully testable because that is the only environment running the real Cognito API Gateway authorizer.

## ZAP Automation Framework (AF) — deferred

Migrating to a declarative `zap.yaml` AF plan (`zaproxy/action-af`) is deferred. The AF job list has no `accessControl`/`authorization` job — ZAP's access-control add-on requires the desktop GUI and an exported Context and cannot run headless in CI. The AF migration would be maintainability-only (no new coverage). See the plan file for details.

Cross-role authorization-bypass testing is provided instead by the custom token-replay harness (Pillar 2 of the auth security plan).
