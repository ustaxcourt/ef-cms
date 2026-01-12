# Goal: Get AWS Aurora Postgres updates into Open Search

## Constraints:
1) A low-latency (between update in Postgres to update in OpenSearch), real-time solution. The user should be able to create/update/etc. X and see the updates as soon as possible afterwards.
2) Need to be able to support advanced search functionality, including advanced search syntax.
3) Need to be able to support searches (and therefore indexing) over all docket entries for all cases, which is a lot.

## Data Activity Streams without Provisioned Aurora (Impossible)
Pros:
- This would be great! Same as below, but better!
Cons:
- Data Activity Streams is unavailable for Serverless Aurora

## Use OpenSearch for everything
Pros:
- No longer need Postgres or DynamoDB
- Single source of truth
- No need to track changes and index in a separate place
Cons:
- Overkill
- Costly
- Transaction support?

## Use Dynamo as a poor man's CDC
Pros:
- Continue to use DynamoDB activity stream as before
- All DAWSON database activity is tracked 
- Manual changes to database are tracked
Cons:
- Need to continue to maintain DynamoDB ... now we have three-ish sources of truth
- The whole goal is to move off of DynamoDB!
- Costly

## Postgres triggers to invoke lambda directly (either lambda -> SQS -> lambda or just to lambda itself)
Pros:
- It does the thing?
- Manual changes to database are tracked
Cons:
- Less control/debugging due to hidden complexity and lack of visibility
- Performance overhead
- Unintended side-effects
- Harder to scale
- Complicates schema migration
- Security/access issues
- Business logic in wrong layer
- And more!

## Data Activity Streams with Provisioned Aurora
Pros:
- All DAWSON database activity is tracked 
- Data Activity Stream can be used for free just like DynamoDB stream.
- Low latency syncing to OpenSearch
- We are assured that everything that happens in Postgres is reflected in OpenSearch
- Little additional infrastructure
- Manual changes to database are tracked
- Transactions work out of the box
Cons:
- Provisioned Aurora (vs. Serverless) was explored as part of the initial Aurora setup and is not a path we want to go down
  - High latencies on West-coast reads/writes to Postgres
  - Hard to scale
  - Need to maintain/re-create the instances
  - Cost is higher (worse for spiky traffic, and more upfront than Serverless)
  - Some potential issues connecting to the database (e.g., without VPN)

## Move off of OpenSearch entirely and use Postgres
Pros:
- No longer need OpenSearch--one less technology
- Reduces costs
- Single source of truth for data
- Postgres supports full text search and trigram search (among other word similarity searches)
- No need to track changes and index in a separate place
- Transactions work out of the box
Cons:
- Depending on the type of search, requires an extension
- Not as scalable (vertical vs. horizontal), and hard to support the number of documents we need to index
- Don't support the same advanced syntax operators ("", |, +) unless we rebuild OpenSearch functionality, which is a big undertaking and leads to big queries
- Search results would likely be different (behavior change)
- OpenSearch is made for searches like this. Postgres can do it, but not as well.

## Direct writes, no wrapper (calling upserts to OpenSearch as part of persistence calls)
Pros:
- Maximum performance
- Lots of control over indexing
- All DAWSON database activity is tracked
- No additional infrastructure required
- Cheap (service-wise)
Cons:
- Transactions can get complicated
- Developer needs to maintain each individual persistence call and monitor whether it should sync to OpenSearch or not
- No additional failure handling
- Manual changes to database are NOT tracked

## Database Migration Service (DMS)
Pros:
- This is the "preferred" way to handle Serverless Aurora streaming
- All DAWSON database activity is tracked
- Manual changes to database are tracked
- Transactions work out of the box
Cons:
- The latency between Postgres update and OpenSearch update can seconds to minutes to hours, which violates our constraints
- Additional costs and infrastructure, including something like Kinesis to ingest the DMS stream
- Local testing is difficult (no easy infrastructure setup)

## Using Postgres CDC plugin: Debezium with or without Kafka Messaging (WAL)
Pros:
- All DAWSON database activity is tracked (with Kafka messaging; otherwise additional services required)
- Low latency between Postgres update and OpenSearch update
- Easy local support in addition to deployed environments
- Multiple sinks supported out-of-the box (i.e., multiple supported "plug ins" to ingest the data)
- Debezium is a common, industry-standard tool
- Manual changes to database are tracked
Cons:
- Expanding local and deployed infrastructure with new technologies
- Extra costs associated with AWS-managed Kafka, and Kafka can be complicated (Zookeeper, messengers, etc.) and introduces a new messaging pattern
- Debezium was made with Kafka in mind. There are workarounds, but it is more complex.
- Postgres config needs to be updated for WAL (impacts performance slightly?)
- Debezium has to run somewhere, and we need to maintain that.
- Reliance on an unmanaged third-party tool
Neutral:
- Transaction support?

## 24/7 Fargate (listening on logical replication slot of WAL, with or without SQS)
Pros:
- All database activity is tracked
- Manual changes to database are tracked
- With SQS, you can guarantee order and build custom retry logic
- WAL logs keep track of the listener's read location even if the listener service goes down
Cons:
- Additional infrastructure to support: additional lambda (optional) and additional Fargate service to listen to changes (this pattern does not exist, and therefore it also leads to another dependency update file)
- We have to build out the CRUD operations manually
- We need the additional pg_logical package in node_modules
Neutral:
- Cost
- Transactions supported, but need to listen for rollback events

## Direct writes, with wrapper around getDbWriter, to SQS -> Lambda
Pros:
- With SQS queue, order is maintained
- Performant
- All DAWSON database activity is tracked
- No additional infrastructure required
- Cheap (service-wise)
Cons:
- Transactions can get complicated
- Manual changes to database are NOT tracked
- No additional failure handling
- Developers need to maintain the wrapper (and get the right level of abstraction)

Recommendation: Our first choice approach would be the 24/7 Fargate listener. It is robust, it handles all database changes (not just DAWSON changes), and it is reasonably cost-effective. However, as this approach would increase costs and infrastructure complexity, the direct-writes-with-wrapper approach seems like a reasonable compromise. Likewise, Flexion folks favored simplicity and recommended direct writes when possible. If it turns out that transactions are too difficult to support in the future with the direct-write approach, nothing stops us from moving away from it.

Note:
- Kinesis < SQS (cheaper, and we don't need the throughput of Kinesis)
