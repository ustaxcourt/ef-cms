# Investigate a client-side error reported through the help desk

## Description
When a user reports a browser-side problem — a blank page, an endless spinner, the "Something went wrong" screen, or "I clicked X and nothing happened" — the failure often never reaches the API and so leaves **no trace in Kibana**. This runbook describes how to find that error in AWS CloudWatch RUM, trace it back to the code, and decide whether it is a real bug or noise.

Reach for this runbook when you've already looked in Kibana ([logging.md](../logging.md), [kibana.md](../../kibana.md)) and found nothing for a reported issue.

## Prerequisites
- AWS Console access to **CloudWatch RUM** in the DAWSON account, region **us-east-1**. (Ask the Tax Court tech lead if you don't have it.)
- The name of the app monitor for the environment the user was on: `prod_dawson_rum_app_monitor` for production, or `${env}_dawson_rum_app_monitor` for a lower environment (e.g. `dev_`, `test_`).
- As much of the following from the help desk ticket as you can get:
  - **Who** reported it — their DAWSON user id or email.
  - **When** it happened — approximate date/time.
  - **Where** — the docket number or page they were on.
  - **What** — the symptom and any on-screen error message.
- You have already checked Kibana and found no matching server-side log (client-side errors don't reach the API).

## Steps

### 1. Open the right app monitor
1. Open the [CloudWatch RUM console](https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#rum:) in **us-east-1**.
2. Select the app monitor for the user's environment (e.g. `prod_dawson_rum_app_monitor`).
3. Go to the **Errors** tab (use **Performance** only if the complaint is about slowness, not a failure).

### 2. Set the time window
1. Set the time range to when the user says it happened. Start wider than you think and tighten — ticket times are often vague.
2. Use the histogram on the Errors tab to spot spikes; click-and-drag to zoom into a spike.

### 3. Find the error / session
Filter down using whatever the ticket gave you, most precise first:
1. **DAWSON user id** — match the user's `userId` in the event metadata. This is the fastest way to find *their* error rather than a similar one.
2. **Docket number / page URL** — the event records the page URL, so a ticket mentioning a case (e.g. `/case-detail/123-45`) lets you filter by that path.
3. **Error message** — if the ticket quotes an on-screen message, or the "Something went wrong" boundary fired, search the error text.
4. **Time + browser** — as a last resort, timestamp plus the user's browser/OS usually pins down the session.

> **Sampling caveat:** RUM records only a **sample** of sessions (`RUM_SAMPLE_RATE`, `0`–`1`). If you can't find a reported error, it may simply not have been sampled — that is *not* proof it didn't happen. Ask the user to reproduce it, or confirm the environment's sample rate.

### 4. Open the event
Expand the matching error. RUM records two kinds of client error — the event tells you which one you're looking at:

- **JS errors** (uncaught exceptions, unhandled promise rejections, and React render errors from the [`ErrorBoundary`](https://github.com/ustaxcourt/ef-cms/blob/staging/web-client/src/views/ErrorBoundary.tsx)) — you get an **unminified stack trace** showing the **original filenames, line numbers, and function names** (e.g. `web-client/src/views/ErrorBoundary.tsx:30`), not minified single-letter names.
- **HTTP errors** (failed API/network requests) — you get the **failing request URL and status code** (4xx, 5xx, or network failure). Successful requests are not recorded.

Both include the same session metadata: **page URL**, **DAWSON user id**, and **browser/OS**.

### 5. Find where in the code the error occurred

**For a JS error** — read the stack trace top-down:
1. Find the **topmost frame that points into our code** (`web-client/src/...`). That line is where the error actually threw. Example:
   ```
   TypeError: Cannot read properties of undefined (reading 'docketNumber')
       at formatCase (web-client/src/presenter/computeds/formattedCaseDetail.ts:212)
       at CaseDetailHeader (web-client/src/views/CaseDetail/CaseDetailHeader.tsx:48)
       at ErrorBoundary (web-client/src/views/ErrorBoundary.tsx:30)
   ```
   → open `formattedCaseDetail.ts:212`.
2. Frames below it are the call chain that led there — useful for understanding *why* the bad value arrived.
3. Frames pointing into `node_modules` / a library are usually just the path the error travelled, not the bug.

**For an HTTP error** — you get a request URL and status code, not a stack trace:
1. Map the path (e.g. `POST /case-documents/123-45/...`) to its interactor/use case by searching the repo for the route.
2. If it's a **5xx**, the server erred — pivot to Kibana and search that request's docket number / timestamp for the server-side stack trace.
3. If it's a **4xx**, the client sent something the server rejected, or it's an expected condition (e.g. a 404 for a missing case). Continue to Step 6.

### 6. Decide: noise or legitimate bug
Triage before opening a ticket or debugging.

**Usually noise:**
- Third-party / browser-extension errors — traces pointing at `chrome-extension://` or scripts not in our bundle.
- Benign browser warnings — e.g. `ResizeObserver loop completed with undelivered notifications`.
- Cancelled/aborted requests — an HTTP error logged because the user navigated away mid-request.
- Expected 404s — a request for a case that doesn't exist because the user hand-edited the URL or followed a stale link (see Step 7).
- Session-expiry 401s — expected after a timed-out session, unless there's an unusual spike.
- A single one-off in one session that never recurs and matches no ticket.

**Likely legitimate — prioritize:**
- The same error across many distinct sessions or users.
- A spike that lines up with a deploy.
- A stack trace landing squarely in our code (`web-client/src/...`) with a plausible failure.
- It matches the help desk report (user id / docket / time line up).
- It's reproducible by following the same steps.

> Rule of thumb: **impact = how many real users are hitting it × whether it points at our code.** One browser-extension error in one session is noise; the same trace across dozens of sessions after last night's deploy is a bug to escalate.

### 7. (Optional) Verify the pipeline with a known test error
To confirm RUM is capturing events end-to-end (e.g. after a deploy or a RUM change):
1. Sign in to a **deployed** environment — RUM is disabled locally.
2. Navigate to a case-detail URL with a bogus docket number:
   ```
   https://app.<env>.<domain>/case-detail/00000
   ```
   `00000` isn't a valid docket number, so the request fails and is captured.
3. Wait a minute or two, then confirm the event appears in the **Errors** tab with the page URL, your user id, and a readable stack trace.

## Additional Resources
- [AWS CloudWatch RUM (DAWSON reference)](../../aws-rum.md) — what RUM captures, how it's set up (Terraform, build wiring, client code), and the configuration reference.
- [Kibana](../../kibana.md) / [Logging](../logging.md) — the server-side logs to check first (and to pivot to for 5xx errors).
- Client integration source: [`realUserMonitoring.ts`](https://github.com/ustaxcourt/ef-cms/blob/staging/web-client/src/providers/realUserMonitoring.ts) and [`ErrorBoundary.tsx`](https://github.com/ustaxcourt/ef-cms/blob/staging/web-client/src/views/ErrorBoundary.tsx).
- Infrastructure: [`web-api/terraform/modules/rum/rum.tf`](https://github.com/ustaxcourt/ef-cms/blob/staging/web-api/terraform/modules/rum/rum.tf).
- [AWS CloudWatch RUM documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html).
