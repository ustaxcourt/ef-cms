# AWS CloudWatch RUM

This guide is for DAWSON developers and product specialists who need to **investigate a bug that a user reported through the help desk**. It explains how we use [AWS CloudWatch RUM](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html) (Real User Monitoring) to capture what went wrong in the user's browser, how to trace an error back to the code, and how to tell a real bug from harmless noise.

## Start here: "I can't find it in Kibana"

Most production investigations start in Kibana ([kibana.md](kibana.md)), which shows **server-side** logs — the requests our API lambdas actually handled. But a large class of failures never reaches the API and so leaves **no trace in Kibana at all**:

- a React component throws while rendering and the user sees a blank page or the "Something went wrong" screen,
- a JavaScript bundle or asset fails to load,
- an unhandled promise rejection silently kills a workflow,
- a request fails in the browser (network dropped, CORS, request blocked) before the server ever sees it.

When a help desk ticket describes something like "the page went blank," "it just spins," or "I clicked X and nothing happened," and **you've looked in Kibana and there's nothing there**, that's your cue to look in CloudWatch RUM instead. RUM runs a small client (`aws-rum-web`) in every user's browser that captures these client-side failures and ships them to AWS.

## What RUM captures

For a recorded session, RUM gives you:

- **Client JS errors** — uncaught exceptions, unhandled promise rejections, and React render errors caught by our [`ErrorBoundary`](https://github.com/ustaxcourt/ef-cms/blob/staging/web-client/src/views/ErrorBoundary.tsx). You get the error message, the stack trace, the page URL, and the browser/OS.
- **Client HTTP errors** — failed API/network requests (4xx, 5xx, and network failures), including the request URL and status code. Successful requests are **not** recorded.
- **Unminified stack traces** — traces show the **original filenames, line numbers, and function/class names** (e.g. `web-client/src/views/ErrorBoundary.tsx`), not minified single-letter names, so you can jump straight to the code.
- **The DAWSON user id** — when the user is logged in, their DAWSON `userId` is attached to the session's metadata, so you can line an error up with the specific person who reported it.
- **Performance** — page load timing and web vitals (secondary; not usually the focus of a help-desk investigation).

---

## How to find an error reported through the help desk

1. **Open the right app monitor.** Go to the [CloudWatch RUM console](https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#rum:) in **us-east-1** and select the monitor for the environment the user was on — `prod_dawson_rum_app_monitor` for production, or `${env}_dawson_rum_app_monitor` for a lower environment (e.g. `dev_`, `test_`).

2. **Set the time window.** Narrow the time range to when the user says it happened. Help desk tickets are often vague ("this morning," "yesterday afternoon"), so start a little wider than you think and tighten from there. The **Errors** tab has a histogram — a spike is a good place to zoom in.

3. **Identify the session.** You usually have one or more of these from the ticket; use whichever you have to filter down:
   - **DAWSON user id** — if you know who reported it, match their `userId` in the event metadata. This is the most precise filter and the fastest way to find *their* error rather than a similar one.
   - **Docket number / page URL** — the event records the page URL, so a ticket that mentions a specific case (e.g. `/case-detail/123-45`) lets you filter by that path.
   - **Error message** — if the ticket quotes an on-screen message, or you know the "Something went wrong" boundary fired, search the error text.
   - **Time + browser** — as a last resort, the timestamp plus the user's browser/OS often uniquely identifies the session.

4. **Open the event.** Expand the matching error to see the full stack trace, the page URL, the user id, and the browser metadata. For HTTP errors, you'll see the failing request URL and status code.

> **Sampling caveat.** RUM records only a **sample** of sessions (`RUM_SAMPLE_RATE`, a value from `0`–`1`). If the sample rate is below `1`, a specific user's error may simply not have been recorded. If you can't find a reported error, that doesn't prove it didn't happen — it may not have been sampled. Ask the user to reproduce it, or check whether the environment's sample rate is high enough to expect a hit.

---

## How to find where in the code the error occurred

### For a JS error

The stack trace is the map. Because production builds ship with source maps and esbuild's `keepNames`, the trace shows **original filenames, line numbers, and function names** instead of minified output. A trace like:

```
TypeError: Cannot read properties of undefined (reading 'docketNumber')
    at formatCase (web-client/src/presenter/computeds/formattedCaseDetail.ts:212)
    at CaseDetailHeader (web-client/src/views/CaseDetail/CaseDetailHeader.tsx:48)
    at ErrorBoundary (web-client/src/views/ErrorBoundary.tsx:30)
```

reads top-down as where it threw → who called it. Open the **topmost frame that points into our code** (`web-client/src/...`) at the given line — that's where the error actually occurred. Frames below it are the call chain that led there, useful for understanding *why* the bad value arrived. Frames pointing into `node_modules` or a library are usually just the path the error travelled through, not the bug.

> If a frame shows a minified name or no filename, the source map for that build wasn't available to RUM — see [Setup](#how-its-set-up). `keepNames` still preserves function/class names even without a source map, so you'll at least get `ErrorBoundary` rather than `a`.

### For an HTTP error

An HTTP error event gives you the **request URL and status code**, not a stack trace. Map it back to the code by the endpoint:

- The path (e.g. `POST /case-documents/123-45/...`) corresponds to an interactor on the API and a use case on the client. Search the repo for the route to find the handler.
- A **5xx** means the server erred — now you *can* pivot to Kibana and search that request's docket number / timestamp for the server-side stack trace.
- A **4xx** usually means the client sent something the server rejected (or an expected condition like a 404 for a missing case) — decide whether it's a bug or expected (see below).

---

## Is it noise or a legitimate bug?

Not every recorded error is a defect. Before you open a ticket or start debugging, triage it.

**Usually noise:**

- **Third-party / browser-extension errors** — stack traces pointing at `chrome-extension://`, injected scripts, or files that aren't part of our bundle. These come from the user's environment, not our code.
- **Benign browser warnings** — e.g. `ResizeObserver loop completed with undelivered notifications`. It's a well-known no-op warning, not a failure.
- **Cancelled/aborted requests** — an HTTP error logged because the user navigated away mid-request. Correlated with a page change, not a real failure.
- **Expected 404s** — a request for a case that doesn't exist because the user hand-edited the URL or followed a stale link. (This is exactly what the [smoke test](#appendix-triggering-a-known-test-error) below produces on purpose.)
- **Auth/session expiry (401)** — an expected consequence of a timed-out session, unless you see an unusual spike.
- **One-off in a single session** — a single occurrence in one session that never recurs and doesn't match a ticket is low priority.

**Likely legitimate — prioritize:**

- **Same error across many distinct sessions or users** — repetition is the strongest signal it's real.
- **A spike that lines up with a deploy** — a new error class appearing right after a release points at that change.
- **A stack trace that lands squarely in our code** (`web-client/src/...`) with a plausible failure (undefined access, etc.).
- **It matches a help desk report** — a user described the exact symptom and the metadata (user id, docket, time) corresponds.
- **It's reproducible** — you can follow the same steps and trigger it yourself.

Rule of thumb: **impact = how many real users are hitting it × whether it points at our code.** A one-session error from a browser extension is noise; the same stack trace across dozens of sessions after last night's deploy is a bug to escalate.

---

## Appendix: triggering a known test error

To confirm the RUM pipeline is working end-to-end (useful after a deploy or a change to the RUM setup), generate a known error on purpose:

1. Sign in to a **deployed** environment — RUM is disabled locally (see below).
2. Navigate to a case-detail URL with a bogus docket number:

   ```
   https://app.<env>.<domain>/case-detail/00000
   ```

   `00000` isn't a valid docket number, so the request for that case fails and is captured by the `http` telemetry (plus any resulting render error via the `errors` telemetry / `ErrorBoundary`).
3. Wait a minute or two, then open the app monitor's **Errors** tab. If the event shows up — with the page URL, your DAWSON user id, and a readable stack trace — the identity pool, app monitor id, sample rate, source maps, and client wiring are all working.

---

## How it's Set Up

Three layers: AWS infrastructure, build-time configuration, and the client code in the browser.

### 1. Infrastructure (Terraform)

Provisioned per environment by [`web-api/terraform/modules/rum/rum.tf`](https://github.com/ustaxcourt/ef-cms/blob/staging/web-api/terraform/modules/rum/rum.tf), wired up per color in [`allColors.tf`](https://github.com/ustaxcourt/ef-cms/blob/staging/web-api/terraform/applyables/allColors/allColors.tf). It creates:

- An **app monitor** named `${environment}_dawson_rum_app_monitor`, scoped to `*.${domain}`.
- A **Cognito identity pool** allowing *unauthenticated* identities — the browser needs credentials to call the RUM data plane, and RUM runs before/independent of user login (including on the public site), so it uses this dedicated pool rather than our user pool.
- An **IAM role** on that pool whose only permission is `rum:PutRumEvents`. The browser can send events and nothing else — it can't read data back.

The `sample_rate` comes from `var.rum_sample_rate` (`TF_VAR_rum_sample_rate` in the deploy scripts).

> The app monitor's own `telemetries` setting in Terraform only applies when using AWS's auto-generated snippet. We instantiate the client manually, so the telemetries we actually collect are the ones in `realUserMonitoring.ts`.

### 2. Build-time configuration

[`web-client/build-dist.sh`](https://github.com/ustaxcourt/ef-cms/blob/staging/web-client/build-dist.sh) looks up three values from AWS and passes them into `npm run build:client`, where [`esbuildHelper.mjs`](https://github.com/ustaxcourt/ef-cms/blob/staging/esbuildHelper.mjs) inlines them into the bundle (available at runtime as `process.env.RUM_*`):

| Env var | Source | Purpose |
| --- | --- | --- |
| `RUM_APP_MONITOR_ID` | `aws rum list-app-monitors` (by name) | Which app monitor receives events |
| `RUM_IDENTITY_POOL_ID` | `aws rum get-app-monitor` | Cognito pool the browser authenticates against |
| `RUM_SAMPLE_RATE` | Deploy env / secrets | Fraction of sessions recorded (`0`–`1`) |

**Readable stack traces** depend on two build settings:

- **`keepNames: true`** — preserves original function/class names through minification, so traces show `ErrorBoundary` instead of `a`.
- **Source maps** — RUM de-minifies stack traces back to original **filenames and line numbers** using the build's source maps.

### 3. Client-side code

[`web-client/src/providers/realUserMonitoring.ts`](https://github.com/ustaxcourt/ef-cms/blob/staging/web-client/src/providers/realUserMonitoring.ts) owns the integration:

- **`initializeRealUserMonitoring()`** — instantiates and enables the client. Called once at startup in both [`app.tsx`](https://github.com/ustaxcourt/ef-cms/blob/staging/web-client/src/app.tsx) (authenticated app) and [`appPublic.tsx`](https://github.com/ustaxcourt/ef-cms/blob/staging/web-client/src/appPublic.tsx) (public site). **No-op when `ENV === 'local'`**, so RUM never runs in local dev. Wrapped in `try/catch` so a RUM failure can't break the app.
- **`recordError(error)`** — manually forwards an error to RUM. Safe to call even when RUM isn't initialized (it's a no-op).

Telemetries configured on the client:

- `'performance'` — page load and web vitals.
- `'errors'` — automatically captures uncaught errors (`window.onerror`) and unhandled promise rejections.
- `['http', { recordAllRequests: false }]` — records **failed** HTTP requests only. axios uses `XMLHttpRequest` in the browser, which this telemetry instruments; `recordAllRequests: false` keeps us from recording every successful request.

The `errors` telemetry misses one case: a React render error is caught by React and would silently unmount the tree without ever reaching `window.onerror`. [`ErrorBoundary.tsx`](https://github.com/ustaxcourt/ef-cms/blob/staging/web-client/src/views/ErrorBoundary.tsx) covers that — it wraps the app, shows a fallback UI, and forwards the error via `recordError(error)` in `componentDidCatch`. (Error boundaries still don't catch errors in event handlers or async code — those are covered by the `errors` telemetry, or call `recordError` yourself.)

## Configuration reference

| Variable | Where it's set | Notes |
| --- | --- | --- |
| `RUM_APP_MONITOR_ID` | `build-dist.sh` (from AWS) | Which app monitor receives events |
| `RUM_IDENTITY_POOL_ID` | `build-dist.sh` (from AWS) | Cognito unauthenticated pool for browser creds |
| `RUM_SAMPLE_RATE` | Deploy env / `TF_VAR_rum_sample_rate` | `0`–`1`; fraction of sessions recorded |
| `ENV` | Runtime env | RUM is disabled entirely when `local` |

Region is hard-coded to `us-east-1` and the app version reported to RUM is `0.0.1` (see `realUserMonitoring.ts`).
