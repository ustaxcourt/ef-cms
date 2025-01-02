# Goal: Stream AWS Aurora Postgres updates to Open Search

## Constraints:
1) A low-latency, real-time solution. The user should be able to create/update/etc. X and see the updates as soon as possible afterwards.

## Option 1: Replicate (as far as possible) our existing setup, which is the following:

DynamoDB --> DynamoDB Stream --> Lambda --> Open Search

We would need to replace DynamoDB Stream with some other Change Data Capture (CDC) and streaming tool. Two options I have seen:

1) Persistence function --> Aurora --> Data Migration Service --> Kinesis --> Lambda --> Open Search
2) Persistence function --> Aurora --> Data Activity Stream --> Kinesis --> Lambda --> Open Search

Both DMS and Data Activity Streams can be used to capture changes. DMS is more agnostic about source and destination databases, but it incurs an additional cost. Data Activity Streams are free, but they are narrower in scope (used for AWS RDS). Kinesis is a new cost regardless of our choice between 1 and 2.

Pros:
1) This continues our current pattern and keeps DB updates synced with--while, implementation-wise, decoupled from--Open Search
2) More scalable and event-driven: Kinesis offers buffering to smooth out traffic spikes.

Cons:
1) Added cost of Kinesis and possibly DMS
2) More moving parts: now we have to configure streams, kinesis, and format the data for Open Search
3) Kinesis sometimes has duplicate or out-of-order messages.

Basic argument for this approach: "This keeps us consistent with our current pattern, is more robust, and is more easily scalable. Plus, we might be able to use this event-driven pipeline for other things in the future."

Issues I have run into:
1) Data Activity Stream is only available for provisioned (not serverless) Aurora. This means
2) I see conflicting information, but Data Migration Service latency seems like it might not be acceptable for some of our use cases. (Potential delays of minutes.)

## Option 2a: "Directly" index in our persistence functions to stream to Open Search on successful Postgres updates

Rather than streaming database changes at all, we modify our code so that any changes that need to be indexed 1) wait for a successful write to postgres and then 2) kick off an async task (storing a message in a queue, for instance) to index the update. Something like:

Persistence function --> (Contingent upon successful update to Aurora) [--> Queue -->] Lambda --> Open Search

Pros:
1) Lower cost, probably
2) Faster, maybe?
-- With a queue, probably not. SQS, for instance, is poll based, not push-based, which introduces latency.
-- Without a queue--viz., directly invoking a lambda--probably faster.
3) Relatively simple infrastructure

Cons:
1) This breaks our existing pattern and puts the onus on us to update Open Search. Implementation between DB and Open Search is now more coupled.
2) Without a queue, we would need to handle retry logic. Although maybe this retry logic is as simple as "on failure, send to queue," and then we have a separate lambda polling for failed indexing.
3) Less scalable. If we had 1000s of writes per second, we could reach lambda concurrency limits.
4) Less of a paper trail.

Basic argument for this approach: "Look, we don't need to index all that much in open search anyway. Why set up all this infrastructure for streaming when we can just index what we need directly? Plus this incentivizes us to move as little into Open Search as necessary."

## Option 2b: "Directly" invoke a lambda function or Kinesis stream in a postgres trigger

This is like 2a, except rather than triggering in code, with trigger in postgres itself via pg_notify. An overview: we enable logical replication, 

## Option 3: Use a plugin or third-party tool like Debezium as a CDC

Cons:
1) It seems like most of these tools work better with a provisioned Aurora instance

## Option 4? Wrap getDbWriter in something that then invokes the change