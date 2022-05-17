# 5. Use one lambda with an integrated router instead of one lambda per route

Date: 2022-04-28

## Status

Accepted

## Context

**This issue was documented in retrospect.**

Sometimes when new code gets deployed, the system expects an new data structure in the database. When this happens, we need to perform an update to any of the affected database records.

Before this decision, we had been performing a full table scan and combing through records chunks at a time, updating the ones that need to be migrated with `umzug` to the newer version. We observed a number of roadblocks when we started using a production sized data set:

- Would not be a viable approach as CircleCI jobs timed out at 5 hours, and the process would have taken many hours (20+).
- Would incur significant downtime because DAWSON would be confused by two different data structures being present while the update was running.

## Decision

We will perform parallel table scans from the live database table, process the records, and populate a new empty database table with updated information. The blue/green nature of the deployment will have the newly created stack using the newly created database table, while the old stack continues to function with the preexisting database table.

## Consequences

This forced us to revisit blue/green architecture as the Lambdas needed to talk to a different DynamoDB table once the deployment was complete. We achieved this making use of Terraform templates.

As a result, downtime windows became very narrow (lasting only seconds to minutes) during a database migration. The system simply switches over to the new database only when all of the data has been populated with the updated version.

However, this also meant we needed to perform a complete re-index of our Elasticsearch cluster. This can be very time consuming (~4 hours). And we could only start it once all of the data has been populated in the destination table because some of the re-indexing functions rely on related records (not just the record being re-indexed) being available (solved by #[9538](https://github.com/flexion/ef-cms/issues/8538)). It became difficult to know precisely when the entire re-indexing operation was complete in order to complete the deployment (solved by #[8511](https://github.com/flexion/ef-cms/issues/8511)).

We discovered a critical issue and needed to craft a solution to handle live updates that occur while the migration is running (solved by #[8199](https://github.com/flexion/ef-cms/issues/8199)).

We also discovered [some partitions were overloaded with data](https://github.com/flexion/ef-cms/issues/8933), and they needed to be restructured. These were section inboxes that shared a `pk`, and they were eventually cleaned up with [this PR](https://github.com/ustaxcourt/ef-cms/pull/1669).
