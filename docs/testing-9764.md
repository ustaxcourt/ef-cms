# Manual Test Plan: Zero-Downtime Aurora Postgres Engine Upgrade (Issue #9764)

This plan validates the Blue/Green deployment for Aurora RDS Serverless *and* the
Read-Only Mode safety net that protects the application during the ~2-minute
switchover window when Postgres is unavailable for writes.

Related PRs:
- [9764: part one — Blue/Green RDS deployment](https://github.com/ustaxcourt/ef-cms/pull/9899)
- [9764: part two — Read-Only Mode](https://github.com/ustaxcourt/ef-cms/pull/9914)
- [9764: part three — Postgres Engine Upgrade](https://github.com/ustaxcourt/ef-cms/pull/9909)

## Reference: What "engaging read-only mode" does

1. Publishes `read_only_mode_engaged` WebSocket notification to all connected
   private clients. State `state.readOnlyMode` flips to `true`.
2. Iterates every application Lambda and sets `READ_ONLY_MODE=true` on its
   environment (forcing a cold start on next invoke).
3. The private API ([web-api/src/app.ts](web-api/src/app.ts)) and public API
   ([web-api/src/app-public.ts](web-api/src/app-public.ts)) begin returning
   `503 "System is upgrading. Please wait a few minutes and try again."` for
   every non-GET, non-OPTIONS request *except* a small allow-list of POSTs used
   for searches, reports, and `/auth/refresh`.
4. Async and cron Lambdas (changeOfAddress, send-emails, trial-session,
   rdsExpiredRecordsCleanup, sealInLowerEnvironment,
   checkForReadyForTrialCases, handleBounceNotifications) short-circuit at the
   top of the handler without opening a DB connection.
   - **Note:** the `pdf-generation` Lambda is intentionally **NOT** gated by
     `READ_ONLY_MODE`. It is invoked synchronously
     (`InvocationType: 'RequestResponse'`) by `generatePdfFromHtmlInteractor`,
     which `JSON.parse`s the payload and reads `tempId`. Rescheduling it would
     return `undefined` and crash every PDF-producing route that is
     allow-listed during read-only mode (`/views/pending-report`,
     `/reports/judge-activity-report`, `/trial-sessions/bulk-copy-notes`).
     Rendering only reads HTML and writes to S3 (never to Postgres), so it is
     safe to keep running across the Aurora switchover.
5. On the UI, the [ReadOnlyBanner](web-client/src/views/ReadOnlyBanner.tsx)
   mounts and every `Button`/`ButtonSmall` that does not pass
   `overrideReadOnly` renders disabled with a `not-allowed` cursor.
6. Newly loading authenticated clients skip the WebSocket handshake (which
   requires Postgres for connectionId persistence) and fall back to polling
   `/public-api/maintenance-mode` every `READ_ONLY_POLLING_INTERVAL` (10s) via
   [startReadOnlyModePollingAction](web-client/src/presenter/actions/WebSocketConnection/startReadOnlyModePollingAction.ts).

## Role matrix (used below)

Authenticated internal: `docketclerk`, `petitionsclerk`, `admissionsclerk`,
`clerkofcourt`, `trialclerk`, `adc`, `chambers`, `judge`, `caseServicesSupervisor`,
`reportersOffice`, `floater`, `general`.

Authenticated external: `privatePractitioner`, `irsPractitioner`, `petitioner`.

Unauthenticated: Public DAWSON site (no session).

Out-of-band (not UI-tested): `irsSuperuser`, `zendesk`, `admin`, `legacyJudge`,
`inactivePractitioner`.

---

## Phase 1 — Local Environment Testing

**Goal:** Validate WebSockets, UI hydration, form state preservation, polling
fallbacks, navigational integrity, and the middleware/modal/button plumbing.

**Setup:** `npm run start:all:docker` (or equivalent). Have a normal window
*and* a private/incognito window open. Keep DevTools → Network tab handy.

> **Note on the `:local` scripts:** `read-only:engage:local` broadcasts the
> *UI* WebSocket event to test frontend behavior, but it cannot mutate the
> running API Docker container's env. To test the true 503 backend block
> locally, set `READ_ONLY_MODE=true` in [docker-compose.yml](docker-compose.yml)
> for the API service and restart it. Tests that need the real 503 are
> labeled **[backend-true]**.

### Test 1.1 — Banner UX: slide-in / slide-out, no layout shift

1. Log in as `docketclerk`.
2. `npm run read-only:engage:local`.
3. **Verify:** red banner slides down smoothly, sticky on scroll, present on
   every route, no flicker or reflow. Message: "We are performing maintenance."
4. `npm run read-only:disengage:local`. Banner slides out; layout returns.

### Test 1.2 — Form preservation on active session

1. Log in as `docketclerk`. Start *Create a Case* or *Add a Docket Entry*.
2. Populate every field: text, dropdowns, radios, file upload. Do **not** Save.
3. Engage read-only mode.
4. **Verify:** banner appears; Save/Submit disabled with `not-allowed` cursor.
   The [ReadOnlyModeEngagedModal](web-client/src/views/Maintenance/ReadOnlyModeEngagedModal.tsx)
   (if triggered) shows "You have unsaved changes" because `form` is dirty.
5. Attempt to click disabled Save — nothing happens; data untouched.
6. Navigate between tabs/fields inside the form (non-mutating); values persist.
7. Disengage. Save succeeds; row persisted to local Postgres.

### Test 1.3 — Dynamic modal confirm buttons (prop-spreading regression)

1. Engage read-only mode.
2. Trigger a flow using `ConfirmModal` (Delete Draft, Dismiss Case, etc.).
3. **Verify:** modal's primary mutation button is disabled with `not-allowed`
   cursor; Cancel remains clickable. This regression-tests the
   [Button.tsx](web-client/src/ustc-ui/Button/Button.tsx) /
   [button.tsx](web-client/src/dawson-ui/ui/button.tsx) /
   [buttonSmall.tsx](web-client/src/dawson-ui/ui/buttonSmall.tsx) prop order
   where `disabled` must be applied after remainingProps so
   `disabledByReadOnlyMode` wins.

### Test 1.3a — Mutation triggers hidden behind raw `<button>` (regression suite)

An audit of `web-client/src` found that read-only gating only fires for the
`<Button>` (USTC) and `<Button>` (dawson-ui) primitives — raw `<button>`
elements bypass the gate even if their `onClick` invokes a write sequence.

With read-only mode engaged, exercise these specific paths and verify each
button is **disabled** (greyed, `cursor: not-allowed`, no network call):

1. **Trial Session Minutes → Preview PDF (top + bottom)**
   ([TrialSessionMinutesPage.tsx](web-client/src/views/TrialSessionMinutes/TrialSessionMinutesPage.tsx)):
   `downloadMinuteSheetFormPdfSequence` runs
   `autosaveTrialSessionMinuteSheetAction` before generating the PDF, which is
   a write. Preview PDF must **not** be clickable while engaged.

If any of the above remains clickable during engage, file a regression — a
raw `<button>` was reintroduced and must be replaced with the gated
`<Button>` primitive.

### Test 1.4 — 503 interceptor + Cerebral toast **[backend-true]**

1. With `READ_ONLY_MODE=true` on the API container, log in as `docketclerk`.
2. Attempt any mutation (e.g., Save user profile).
3. **Verify:** `ReadOnlyModeError` (503) is caught by
   [ErrorFactory](web-client/src/presenter/errors/ErrorFactory.ts) →
   [readOnlyModeErrorSequence](web-client/src/presenter/sequences/readOnlyModeErrorSequence.ts)
   fires a toast with the maintenance copy. Form state remains intact.
4. In DevTools, raw response must be `503` with body
   `"System is upgrading. Please wait a few minutes and try again."`.

### Test 1.5 — Late-arrival login: polling fallback (no WS)

1. With the backend flag still engaged, open an Incognito window.
2. Log in as `petitionsclerk`.
3. **Verify:** dashboard renders; red banner present on first paint; Network
   shows `GET /public-api/maintenance-mode` every ~10s; **no** `/ws` handshake.
4. Disengage. Within one poll interval, banner clears and WS handshake
   succeeds (observe the new `/ws` 101 in Network).

### Test 1.6 — Multi-tab coherence (same session)

1. Open 3 tabs as `docketclerk`.
2. Engage — all 3 tabs receive the WS event and show the banner simultaneously.
3. Disengage — all 3 tabs clear simultaneously; no refresh required.

### Test 1.7 — Per-role dashboard smoke

For each role, log in cleanly *during* engage, land on the default dashboard,
and verify: (a) page loads without console errors, (b) banner shows, (c) at
least one search/navigation works, (d) at least one mutation button is
disabled. Then repeat with a user that was **already** logged in before engage.

| Role | Landing check |
|---|---|
| docketclerk | Messages, Document QC |
| petitionsclerk | Case QC, STIN Batch |
| admissionsclerk | Practitioner Search, Add Practitioner |
| clerkofcourt | Messages, Orders |
| trialclerk | Trial Sessions list |
| adc | Pending report, Reports |
| chambers | Judge dashboard, assignments |
| judge | Opinions, Orders |
| caseServicesSupervisor | Unassigned work queues |
| reportersOffice | Opinions published view |
| privatePractitioner | My Cases |
| irsPractitioner | My Cases (IRS) |
| petitioner | My Case(s) |

### Test 1.8 — Navigational / non-mutating button allow-list audit

While engaged, verify the following remain fully interactive:

- **Searches:** Case Search, Practitioner Search, Opinion Search, Order Search,
  Judge Activity Report, Pending Report.
- **Exports/Downloads:** "Export", "Print", "Download Docket Record".
- **Navigation:** Cancel, Back, Close, Clear Search, "Go to Case", header
  search box, pagination, sort/filter, tab switches.
- **Explicit `overrideReadOnly` sites** to inspect:
  [CorrespondenceViewerCorrespondence.tsx](web-client/src/views/Correspondence/CorrespondenceViewerCorrespondence.tsx),
  [AddCorrespondenceDocument.tsx](web-client/src/views/Correspondence/AddCorrespondenceDocument.tsx),
  [EditCorrespondenceDocument.tsx](web-client/src/views/Correspondence/EditCorrespondenceDocument.tsx),
  [PaperFiling.tsx](web-client/src/views/PaperFiling/PaperFiling.tsx),
  [OrderResponse.tsx](web-client/src/views/OrderResponse/OrderResponse.tsx),
  [UserContactEdit.tsx](web-client/src/views/UserContactEdit.tsx),
  [AppMaintenanceModal.tsx](web-client/src/views/AppMaintenanceModal.tsx),
  [SearchBox.tsx](web-client/src/views/Header/SearchBox.tsx).

### Test 1.9 — Allow-listed POST search endpoints (private API) **[backend-true]**

For each path below, confirm 200 + results render during engage:
- `POST /cases/search`
- `POST /case-documents/opinion-search`
- `POST /case-documents/order-search`
- `POST /reports/judge-activity-report`
- `POST /trial-sessions/bulk-copy-notes`
- `POST /views/pending-report`
- `POST /auth/refresh`

### Test 1.10 — Public API allow-list + 503 for mutations **[backend-true]**

1. Open the public UI. On first load, banner renders (public has no WS; state
   is read statically).
2. Exercise allow-listed POSTs: `/public-api/search`, `/public-api/order-search`,
   `/public-api/opinion-search`. All should 200.
3. Click "Forgot Password" (`POST /auth/forgot-password`) → expect 503 handled
   gracefully (no uncaught error).
4. Trigger email verification → expect 503 handled gracefully.
5. Run `npm run cypress:readonly:public:open:local`.

### Test 1.11 — Public UI refresh on disengage

1. With public banner showing, disengage.
2. **Verify:** public UI does *not* auto-clear (no WS). After a manual refresh,
   banner is gone.

### Test 1.12 — Disengagement graceful recovery

1. Populate a dirty form in Tab A (Test 1.2 state). Incognito Tab B polling
   (Test 1.5 state).
2. Disengage.
3. **Verify:** Tab A banner disappears without refresh; buttons restored. Tab
   B polling stops within one tick; WS handshake succeeds.
4. Submit Tab A's form — persisted. No data loss.

### Test 1.13 — Error edge: disengage without engage

1. With RO not engaged, run `npm run read-only:disengage:local`.
2. **Verify:** script exits 0; state unchanged; no spurious banner/toast.

### Test 1.14 — Error edge: double engage (idempotent)

1. Engage twice in a row.
2. **Verify:** banner stays up; no duplicate polling intervals (one
   `state.readOnlyPollingInterval` timer id in Cerebral devtools).

### Test 1.15 — WebSocket drop during engaged state

1. Authenticated user connected. Engage.
2. In DevTools Network, block the WS.
3. **Verify:** UI falls back to polling; banner accurate.
4. Unblock. WS reconnects (or polling continues until disengage — both are
   acceptable; polling self-terminates on disengage).

### Test 1.16 — Keyboard & accessibility

1. Engage. Tab through the page with keyboard only.
2. **Verify:** disabled buttons are reachable via tab and announce "disabled"
   via screen reader (VoiceOver/NVDA); focus ring visible; no keyboard traps
   on banner or `ReadOnlyModeEngagedModal`.
3. Banner has a live region so assistive tech announces engage/disengage.

### Test 1.17 — Session expiration during engage **[backend-true]**

1. Log in; engage; leave idle long enough for ID token to expire (or shorten
   TTL for the test).
2. **Verify:** `/auth/refresh` (allow-listed) silently renews; user not booted
   to login. If refresh itself fails, user routes to login, which also shows
   the banner.

### Test 1.18 — File upload attempt during engage

1. Start a filing with a PDF upload. Engage before clicking Save.
2. **Verify:** Save disabled; uploaded file still visible; on disengage, Save
   succeeds and the pre-selected file persists (test multipart upload path,
   not just metadata).

### Test 1.19 — In-flight request at moment of engage

1. Start a long request (bulk PDF, large search). While the spinner is up,
   engage.
2. **Verify:** in-flight completes or fails gracefully; subsequent attempts get
   the 503 toast; no stuck spinners.

### Test 1.20 — Cerebral state inspection

Using Cerebral debugger:
1. Observe `state.readOnlyMode` flip `false → true` on engage event.
2. Observe `state.readOnlyPollingInterval` is set only on late-arrival
   (polling path) and `clearInterval`'d on disengage.
3. No other unrelated state mutates during engage/disengage.

### Test 1.21 — Cypress automated baseline

Run before every manual pass:
- `npm run cypress:readonly`
- `npm run cypress:readonly:public`
- [cypress/local-only/tests/integration/maintenance/read-only-mode.cy.ts](cypress/local-only/tests/integration/maintenance/read-only-mode.cy.ts)

All must pass.

---

## Phase 2 — Deployed AWS Environment Testing (DEV / EXPERIMENTAL)

**Goal:** Validate the real RDS orchestrator script, async queue drainage,
cron Lambda gracefulness, and Lambda cold-start reconciliation during an
actual Blue/Green switchover.

**Setup:** Branch fully deployed to a lower env. AWS creds exported. Export
`ENV`, `CURRENT_COLOR`, `REGION`, `RDS_ENGINE_VERSION`. Bookmarks ready for:
RDS Console, CloudWatch Logs, SQS Console. Four browser windows: logged-in
`docketclerk`, logged-in `privatePractitioner`, fresh Incognito, public DAWSON.

Run [scripts/postgres/upgrade-rds-engine-version.sh](scripts/postgres/upgrade-rds-engine-version.sh).

### Test 2.1 — Pre-flight: cross-region replica cleanup path

1. Ensure `${ENV}-dawson-replica` exists in `us-west-1` before invocation.
2. Run the upgrade script.
3. **Verify:** script logs "Replica found", disables deletion protection,
   detaches from `${ENV}-dawson-global`, deletes replica instances, deletes
   replica cluster, waits for `deleted` status, then proceeds.
4. After run completes, Terraform rebuilds the replica on the next `allColors`
   pipeline run.

### Test 2.2 — Pre-flight: pending parameter-group reboot abort

1. Apply a parameter change that puts the writer in `pending-reboot` (e.g.,
   toggle `rds.logical_replication`), do not reboot.
2. Run the upgrade script.
3. **Verify:** script exits 1 with the explicit pending-reboot error; no B/G
   deployment created; no read-only engagement; application stays fully live.

### Test 2.3 — Idempotency: already at target version

1. Run with `RDS_ENGINE_VERSION` equal to the current version.
2. **Verify:** script exits 0 with "Database is already at engine version…";
   no B/G deployment created; no engage/disengage.

### Test 2.4 — Idempotency: active B/G deployment exists

1. Manually create a B/G deployment for the cluster (leave `PROVISIONING` or
   `AVAILABLE`).
2. Run the script.
3. **Verify:** script detects the existing `BG_IDENTIFIER`, skips creation,
   resumes waiting. No duplicate deployment objects in the RDS console.

### Test 2.5 — Global cluster source selection

1. Confirm `${ENV}-dawson-global` exists.
2. Run the script.
3. **Verify:** logs show `"Primary cluster is part of a global database. Using
   the global database as the source..."`; `SOURCE_ARN` is the global cluster
   ARN (not the writer cluster ARN).

### Test 2.6 — Happy-path switchover (main event)

With real test users signed in across all four browser windows:

1. Kick off `upgrade-rds-engine-version.sh`. Wait for
   `ENGAGING READ-ONLY MODE`.
2. **Immediately verify (UI):** banners appear across all authenticated
   windows via WS. Public window requires a refresh to see the banner.
3. Switchover runs (~2 min). While waiting, confirm:
   - CloudWatch: 503 emitted by private and public API for mutations.
   - Network tab: allow-listed searches succeed.
   - Async/cron lambdas short-circuit (Tests 2.7–2.14).
4. Script echoes `DISENGAGING READ-ONLY MODE`. Lambda env var flips; next
   invocations are cold starts. Banners clear on authenticated clients via WS.
5. **Verify:**
   - `aws rds describe-db-clusters` returns `EngineVersion ==
     $TARGET_VERSION`.
   - B/G orchestration object deleted.
   - Application fully operational; no lingering 503s.
   - No data loss; users resume their workflows.

### Test 2.7 — Async queue: changeOfAddress (SQS)

1. Just before engage, submit a Change of Address for a practitioner with many
   cases.
2. During engage, monitor
   [changeOfAddressLambda](web-api/src/lambdas/changeOfAddress/changeOfAddressLambda.ts)
   CloudWatch logs.
3. **Verify:** early return "Cannot execute … during read-only mode"; no DB
   driver instantiated; queue `ApproximateNumberOfMessagesVisible` stays high;
   no messages move to DLQ during the window.
4. After disengage + cold start, queue drains; each case updates against the
   upgraded DB; DLQ remains empty.

### Test 2.8 — Synchronous PDF generation across the switchover

Unlike the other async lambdas, `pdf-generation` is **not** gated by
`READ_ONLY_MODE` (see Reference §4 note). It must continue rendering during
the switchover so the allow-listed read-only routes that emit PDFs keep
working.

During engage, in *separate* browser sessions:

1. Hit `POST /views/pending-report` (Pending Report → Print/Export).
2. Hit `POST /reports/judge-activity-report` (Judge Activity Report → Print).
3. Hit `POST /trial-sessions/bulk-copy-notes` (Bulk Copy Notes flow).

Also trigger any PDF-producing GET that uses `generatePdfFromHtmlInteractor`
(e.g., printable docket record, printable trial session copy).

**Verify:**
- Each request returns a 200 with a downloadable PDF.
- `pdf_generator_${stage}_${currentColor}` CloudWatch logs show successful
  `RequestResponse` invocations with `tempId` payloads (no rescheduling, no
  `undefined` returns, no 503s upstream).
- No bulk-PDF backoff/queueing should occur — that was a previous (incorrect)
  behavior that is no longer present.

### Test 2.9 — Async queue: send-emails

Repeat for [send-emails](web-api/src/lambdas/sendEmails/send-emails.ts). Queue
service notifications before engage. Verify no emails fire during the window;
each recipient receives exactly one email after disengage (no dupes, no drops).

### Test 2.10 — Async queue: trial-session

Repeat for [trial-session](web-api/src/lambdas/trial-session/trial-session.ts).
Kick off trial session notice/calendar generation. Verify backoff + resumption.

### Test 2.11 — Cron gracefulness: rds expired records

1. Mid-switchover, manually invoke
   [rdsExpiredRecordsCleanupLambda](web-api/src/lambdas/rdsExpiredRecordsCleanup/rdsExpiredRecordsCleanupLambda.ts).
2. **Verify:** ~10 ms execution, logs "Skipped … due to read-only mode.",
   exits successfully, no DB connection attempted, no alarm fires.

### Test 2.12 — Cron gracefulness: ready-for-trial

Repeat 2.11 for
[checkForReadyForTrialCasesLambda](web-api/src/lambdas/cases/checkForReadyForTrialCasesLambda.ts).

### Test 2.13 — Cron gracefulness: sealInLowerEnvironment

Repeat 2.11 for
[sealInLowerEnvironmentLambda](web-api/src/lambdas/cases/sealInLowerEnvironmentLambda.ts)
(lower envs only).

### Test 2.14 — SNS gracefulness: bounce handler

1. During engage, replay a stored SES bounce event to
   [handleBounceNotificationsLambda](web-api/src/lambdas/email/handleBounceNotificationsLambda.ts).
2. **Verify:** no-op with expected log; SNS subscription does not move to a
   failure state; after disengage, next replay processes normally.

### Test 2.15 — Maintenance-mode endpoint truthfulness

Throughout the run, `curl https://<public-host>/public-api/maintenance-mode`:
- Before engage: `{ maintenanceMode:false, readOnlyMode:false }`
- During engage: `{ maintenanceMode:false, readOnlyMode:true }`
- After disengage (post-cold-start): `{ maintenanceMode:false, readOnlyMode:false }`

Served by
[getMaintenanceModeLambda](web-api/src/lambdas/maintenance/getMaintenanceModeLambda.ts).

### Test 2.16 — Cold-start poison-pool clearing

After disengage, the script forces cold starts across all Lambdas.
1. Tail CloudWatch for a representative lambda (e.g., `getCaseLambda`).
2. **Verify:** first post-disengage invocation has `INIT_START`; subsequent
   warm invocations query the Green writer; no "connection refused" or
   "terminated" errors persist past the first cold start.

### Test 2.17 — WebSocket behavior across switchover

API Gateway WS persists connectionIds to Postgres. During the write-block:
1. Already-connected client keeps its socket (no writes needed for keepalive).
2. New client logging in does **not** establish WS; it falls through to
   polling — verify in DevTools.
3. Post-disengage, new clients succeed at WS handshake.

### Test 2.18 — Session refresh across the switchover

1. Three authenticated users with ID tokens expiring mid-switchover.
2. During engage, tokens hit `POST /auth/refresh` (allow-listed) against the
   read-capable endpoint.
3. **Verify:** none are bounced to login.

### Test 2.19 — Switchover failure recovery

Artificially trigger a failure on a non-prod env (e.g., set
`--switchover-timeout 30`).
1. Run the script; switchover fails.
2. **Verify:** script logs failure, still runs `disengage-read-only-mode.sh`
   (lambdas un-flag), exits 1.
3. Application recovers against the original Blue writer; no user data lost.
4. B/G orchestration object is **not** deleted (leave it for RDS console
   inspection).

### Test 2.20 — Aborted script mid-run (operator kill)

1. Start the script. During "Waiting for Blue/Green deployment … AVAILABLE",
   `Ctrl-C` the script.
2. **Verify:** no engage was fired; B/G deployment continues in AWS; app
   unaffected. Re-run the script: it detects the existing B/G (Test 2.4 path).

### Test 2.21 — Script run while lambdas are all cold

Edge case between deploys when no warm lambdas exist.
1. Run the script.
2. **Verify:** engage/disengage still mutate env vars successfully; first user
   after switchover gets a cold start but succeeds.

### Test 2.22 — Concurrent deploy + upgrade (do not run simultaneously)

Operational guardrail check:
1. Attempt to kick a pipeline deploy while a B/G deployment is
   `PROVISIONING`/`AVAILABLE`.
2. **Verify:** pipeline fails fast with an explicit error (or is manually
   held); no partial infra mutation.

### Test 2.23 — DNS / connection-string continuity

1. Before switchover, capture `DBCluster.Endpoint` of `${ENV}-dawson-cluster`.
2. After switchover, capture again.
3. **Verify:** hostname unchanged (B/G rename swap); lambdas need no code
   change to find the new writer.

### Test 2.24 — Observability across the run

- CloudWatch dashboard: 503 rate rises then falls; no `5xx` spike persists.
- Application alarms (error rate, DLQ depth) do not page.
- APIGW access logs show expected 503 concentration during the window only.
- No unhandled exceptions or stack traces in lambda logs besides the
  deliberate read-only early returns.

### Test 2.25 — Engine-version confirmation (post-run)

Run:
```
aws rds describe-db-clusters \
  --db-cluster-identifier ${ENV}-dawson-cluster \
  --query "DBClusters[0].EngineVersion"
```
Must equal `$TARGET_VERSION`. Also confirm parameter group, writer instance
class, storage config unchanged.

---

## Phase 3 — Combined Scenarios & Negative Testing

### Test 3.1 — Mutation page opened exactly when engaging

Open Edit User Contact. Mid-render, engage.
**Verify:** buttons become disabled live (Cerebral reactivity); no stale-button
window where a click sneaks through.

### Test 3.2 — Direct API call bypass attempt **[backend-true]**

With a valid session cookie, `curl` a raw mutation on *both* private and
public APIs:
```
curl -X POST -b session -H "Content-Type: application/json" \
  https://<host>/cases/<docketNumber>/notes -d '{"notes":"hi"}'
```
**Verify:** 503 from middleware; body is the canonical maintenance message.

### Test 3.3 — `overrideReadOnly` audit

`rg "overrideReadOnly" web-client/src` and sample at least 20 hits across
different views. For each, confirm the button truly should be allowed:
non-mutating navigation, search, or a mutation routed through an allow-listed
POST. Flag any hit that looks like a write (e.g., "Save", "Submit", "Serve"
without a compensating allow-list entry).

### Test 3.4 — maintenance mode vs read-only mode matrix

These are independent systems. Validate all four combinations on local:

| maintenance | readOnly | Expected UI |
|---|---|---|
| off | off | normal |
| off | on | red banner, mutations 503 |
| on | off | full maintenance mode (blocks UI) |
| on | on | maintenance mode takes precedence; no red banner needed |

### Test 3.5 — Clerk-of-court impersonation under RO

Clerk of Court can impersonate other users.
**Verify:** impersonation enters a GET-only view; no permission escalation
edge cases leak; impersonated user sees the same banner.

### Test 3.6 — Toast de-duplication

Rapidly trigger 10 mutation attempts (via DevTools or race conditions). The
503 toast should coalesce — one visible toast, not 10.

### Test 3.7 — Long session across repeated upgrades

Simulate two upgrades back-to-back (engage → disengage → engage → disengage) in
the same open session.
**Verify:** banner toggles twice, no zombie polling intervals accumulate, no
memory leak (Performance tab memory snapshot).

### Test 3.8 — Browser matrix

Re-run the critical path (Test 1.2, 1.5, and 2.6 if feasible) in:
- Chrome (latest)
- Firefox (latest)
- Safari (macOS latest)
- Edge (latest)

### Test 3.9 — Mobile / narrow viewport

Viewport ≤ 375 px: banner text readable, doesn't obscure header actions, no
overflow, disabled-button styles still visible.

### Test 3.10 — Operator tampering (negative)

Manually flip a single lambda's `READ_ONLY_MODE` to `false` mid-run.
**Verify:** that lambda attempts writes against the frozen Green DB and errors.
This documents the *correct* expectation: the disengage script is the only
supported path; operators must not tamper mid-run.

### Test 3.11 — Mixed-state clients

Have one client still on the old build (before the RO feature shipped) and
one on the new build during engage. Old client will not show the banner or
disable mutations but *will* see 503s. Modern client behaves fully.
**Verify:** old client surfaces a recognizable error for mutations; does not
crash; can recover after disengage.

### Test 3.12 — Load test during engage

Run a light k6/artillery burst (read-only workload and a handful of writes)
during engage.
**Verify:** writes 503 promptly; reads succeed; no cascading failures; p95
read latency unaffected.

### Test 3.13 — Time-of-day / DST / timezone

Kick engage at 23:59:55 UTC so disengage spans midnight. Verify no
date-based logging or cron schedule interacts incorrectly with the RO flag.

### Test 3.14 — Unauthenticated mutation attempts

Public user hits `POST /auth/forgot-password` and an email-verification
endpoint during engage. Both 503 gracefully with the canonical copy; nothing
leaks 500s.

### Test 3.15 — Re-entrant form after disengage

A `docketclerk` is mid-form at engage, walks away, session expires. On return
after disengage, browser restores the page.
**Verify:** either form is restored from Cerebral state or user is routed to
login; no partial writes; no orphan drafts.

---

## Sign-off checklist

- [ ] Phase 1: all 21 tests pass on local
- [ ] Phase 2: all 25 tests pass in DEV/EXPERIMENTAL
- [ ] Phase 3: all 15 scenarios pass
- [ ] Cypress `readonly` + `readonly:public` suites green in CI
- [ ] CloudWatch alarms silent through full run
- [ ] SQS DLQ depths unchanged before/after
- [ ] RDS engine version reflects `TARGET_VERSION`
- [ ] B/G orchestration object deleted after successful run
- [ ] No data loss in any form-preservation test
