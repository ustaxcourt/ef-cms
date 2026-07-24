# Investigate a client-side error reported through AWS RUM

## Description
When a user reports a browser-side problem — a blank page, an endless spinner, the "Something went wrong" screen, or "I clicked X and nothing happened" — the failure often never reaches the API and so leaves **no trace in Kibana**. This runbook describes how to find that error in AWS CloudWatch RUM, trace it back to the code, and decide whether it is a real bug or noise.

Reach for this runbook when you've already looked in Kibana ([logging.md](../logging.md), [kibana.md](../../kibana.md)) and found nothing for a reported issue.

## Prerequisites
- AWS Console access to **CloudWatch RUM** in the DAWSON account, region **us-east-1**. (Ask the Tax Court tech lead if you don't have it.)
- The name of the app monitor for the environment the user was on: `prod_dawson_rum_app_monitor` for production, or `${env}_dawson_rum_app_monitor` for a lower environment (e.g. `expN_dawson_rum_app_monitor`, `test_dawson_rum_app_monitor`).
- As much of the following from the help desk ticket as you can get:
  - **Who** reported it — their DAWSON user id or email.
  - **When** it happened — approximate date/time.
  - **Where** — the docket number or page they were on.
  - **What** — the symptom and any on-screen error message.
- You have already checked Kibana and found no matching server-side log (client-side errors don't reach the API).

## Steps

### 1. Open the right app monitor
1. Open the [CloudWatch RUM console](https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#home)
2. Click on "RUM" in the sidebar under Application Signals (APM).
3. Select one of the app monitors under "App Monitors" (e.g. `{env}_dawson_rum_app_monitor`).

### 2. Set the time window
1. Set the time range to when the user says it happened. Start wider than you think and tighten — ticket times are often vague.

### 2.1 Filter by userId
1. If userId is known, filtering by userId can make it easier to narrow down the session and corresponding metrics for the error being investigated. Example: userId = <USER_ID>

### 3. Find the specific error - JS errors
1. Select JS errors tab.
2. You can locate the error in the histogram or by the "Top 100 JS errors by exception message" table.
3. A sidebar will appear; select the session ID corresponding to the desired error.
4. At the bottom you will see a "Sessions performance detail" table, click on one of the events to bring up a side panel.
5. This side panel will show various pieces of information. Click on the "Raw event" tab.
6. Scroll down on this raw event tab until you find the unminified stack "key".
7. Use the Error and the file name to troubleshoot the issue.

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


### 4. Find the specific error - HTTP errors
1. Select HTTP request tab.
2. Select a data point from either the graph or select a request.
3. Click on the session id.
4. Click on the event.
5. Go to raw event tab for additional information that you can use to debug.

**For an HTTP error** — you get a request URL and status code, not a stack trace:
1. Map the path (e.g. `POST /case-documents/123-45/...`) to its interactor/use case by searching the repo for the route.
2. If it's a **5xx**, the server erred — pivot to Kibana and search that request's docket number / timestamp for the server-side stack trace.
3. If it's a **4xx**, the client sent something the server rejected, or it's an expected condition (e.g. a 404 for a missing case).


**(Optional) Trigger known HTTP error for testing**
To confirm RUM is capturing events end-to-end (e.g. after a deploy or a RUM change):
1. Sign in to a **deployed** environment — RUM is disabled locally.
2. Navigate to a case-detail URL with a bogus docket number:
   ```
   https://app.<env>.<domain>/case-detail/00000
   ```
   `00000` isn't a valid docket number, so the request fails and is captured.
3. Wait a minute or two, then confirm the event appears in the **Errors** tab with the page URL, your user id, and a readable stack trace.

### 5. Decide: noise or legitimate bug
Triage before opening a ticket or debugging.

**Known noise:**
- POST - https://api-{color}.{env}.ef-cms.ustaxcourt.gov/auth/refresh
