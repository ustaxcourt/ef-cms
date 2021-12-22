# 5. Use one lambda with an integrated router instead of one lambda per route

Date: 2021-07-13

## Status

Accepted

## Context

> The issue motivating this decision, and any context that influences or constrains the decision. **This issue was documented in retrospect.**

Before this decision, we had been using one Lambda per HTTP route and relying on API Gateway to perform routing. Serverless Framework lead us into this pattern, however, it caused:

- A significant amount of infrastructure configuration (leading to longer deploy times)
- A slower in-app experience (when navigating around the application, less-often used routes, especially routes that were only accessible to a subset of users, would need to cold-start)
- A complex local development experience (each route was booted as a separate script as they are in Lambda, leading to large memory footprints)

## Decision

> The change that we're proposing or have agreed to implement.

We’ll send all HTTP requests to a single Lambda, which will perform internal routing.

## Consequences

> What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.

As documented in the [pull request at the time](https://github.com/ustaxcourt/ef-cms/pull/280), the benefits to having a single Lambda hosting all of our code include:

- Faster deploys
- Limited amount of cold starts
- Less infrastructure overhead (single file having all our routes vs 15 serverless files)
- A single express service to run locally when doing development
