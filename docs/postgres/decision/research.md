## Database Migration & Performance

- **Overview**
  - **1. Improve Dynamo Migrations**
    - looked into speeding up dynamo, but kept hitting write limits on every approach. tried a lot of different approaches (see a.)
    - tested a simple rds instance and it could easily update 10 million records in 18 seconds
    - decided instead of using a bandaid, investigate switching databases
  - **2. SQL Experiment**
    - researched multiple orms (multiple day effort, wasted effort on some bad ORMs) (see b.)
    - investigated work to move over messages entity to rds, it was very easy
    - we refactor all messages into rds using dynamo streams and persistence method refactoring in a few days of work
  - **3. Migrations**
    - needed to figure out migration script approach
    - started with a publically accessible RDS instance (security concerns)
    - led us down an approach to figure out vpc (address security concerns)
    - led us down a jumpbox approach because we couldn't run migrations in circleci due to VPC (more security concerns brought up)
    - led us down setting up a VPN (to allow devs and circleci to be able to connect to the rds instance), but added so much complexity to the system and terraform
  - **4. IAM Permissions**
    - vpn complexity made us look into other approaches
    - we found there was a way to configure RDS with IAM permissions
    - requires an IAM user and a corresponding user created in the database to be able to generate a short lived (15 minute) access token
  - **5. Performance Testing**
    - RDS seemed to work faster than dynamo on east coast
    - issue, on west coast, we were seeing close to 900ms for a query to get messages
    - looked into multi-region replicas
    - led us down figure out how to configure RDS postgres with multi-region, felt like a lot of work
    - looked into Aurora, seemed to make the east - west setup much easier
    - spend time getting all that setup in terraform
    - got the cluster setup, replicas made the queries run fast on west coast; writes still need to hit primary but were fast enough
  - **6. Backups / Restores**
    - looked into how RDS snapshots work
    - started prototyping some changes in terraform to restore a cluster from a snapshot.
    - felt like it could be done, but put a hold on the work
    - prepared notes for discussion

- **a.) DynamoDB vs. RDS Migration Speed**

  - We looked into dynamodb to try and find ways to speed up migrations
    - one approach was add a GSI on specific fields and then do targeted queries to only update those fields
    - applying the GSI took like 20 minutes or more
    - felt like it defeated the purpose of "speeding up the migration"
    - also, if needing to run a migration over 10 million docket entries, there isn't much speed up possible there.
  - Compared migration times: RDS completed a migration in 5 minutes with 10 million records, while DynamoDB took about an hour.
  - Inserted 10 million records in 2 minutes using the smallest RDS instance. DynamoDB took much longer and required more custom code.
  - did an adhoc query with no index over 10 million records in 18 seconds (no index)
  - counting all records in that table took 2 seconds

- **Load Testing**

  - Performed load testing on PostgreSQL vs. DynamoDB.
  - Conducted load testing on AWS West vs. East regions.
  - Found RDS returned data faster than DynamoDB during tests.
  - Using Global Database with RDS resulted in very fast writes on the East Coast, with writes outside the primary region taking less than 1 second.
  - RDS allows for multiple reader replicas, including readers which are a day behind for reports. Also allows for promoting a read replica to take over in case of issues.
  - moving queries off of opensearch might allow us to scale down opensearch

- **Expand & Contract Migration**
  - Looked into and recommended expand & contract migration.

## Database Setup & Configuration

- **RDS Configuration**

  - Setup RDS single instance.
  - Looked into RDS PostgreSQL vs. RDS Aurora PostgreSQL:
    - Aurora is more expensive but reduces complexity of configuration.
  - Aurora Serverless auto-scales up and down, with charges only for what is used.

- **VPC & Connectivity**

  - Setup a VPC to connect all Lambdas and RDS instance.
  - Setup a jumpbox for performing migrations from CircleCI.
  - Attempted to set up a VPN to allow individual developers to tunnel into the VPC.

- **Public Accessibility & Security**

  - Investigated publicly accessible RDS instances with different security group settings and SSL encryption.
  - Looked into IAM authentication for RDS with public accessibility.
  - Setup scripts for creating RDS users and generating the 15-minute tokens for connecting to the database.

- **Seeding & Test Factories**
  - Set up a new pattern for seeding data.
  - Set up a test factory to allow existing tests to work out of the box.

## Database Selection & Justification

- **SQL vs. NoSQL**

  - Compared PostgreSQL to DynamoDB.
  - Decided to use a SQL database because the project’s data is relational by nature.
  - DynamoDB was seen as overkill in terms of dataset size.
  - DynamoDB forced denormalization of data, leading to complex application logic.
  - ElasticSearch was used too much to query DynamoDB data.
  - Transactions in DynamoDB felt very limited. (moved to separate devex card)
  - Jim mentioned it took him* days to generate reports with DynamoDB, which would have taken hours with SQL.
  - The team has discussed using SQL for this project for years.

- **Developer Experience**

  - Fewer engineers know how to use DynamoDB properly compared to PostgreSQL (everyone knows SQL).
  - It's very easy to add indexes in migration scripts in SQL.
  - Writing migrations is easy and fast.

- **Costs**

  - dynamodb has very large spikes based on when we are doing migrations (writing to dynamo can get expensive). it goes up $100 in a single day doing a deployment
  - rds is fixed cost, and the smallest instance of 0.5 ACU will cost around $43.80 per instance per month (multi region would be x2).
  - it would be nice to create the same number of instances we think we'll need for all our lower environments.
  - there is performance monitoring which can help us fine tune configurations on the instances (small cost associated with it)
  - we plan to use single instances for lower environments
  - "prod like" environments would use the primary - replica setup, and be 2x as much probably
  - 5 experiemntal env 5 \* 43.80 = $220 / month flexion
  - if we migrate everything to rds, dynamo costs will go away

- **Work Involved**
  - converting our messages persistence methods from dynamo to postgres took maybe a day
    - add a type web-api/src/database-types.ts
    - refactor persistence methods
    - add logic to streams
    - write migration scripts
    - add seed data
    - chatgpt helped convert dynamo and opensearch to kysley
  - most time was spent for research and setting up terraform / vpc / vpn / tunnel / figuring out rds configuration / switching to aurora / database tech / orms / query builders

## Developer Experience

- writing sql statements is much easier than elasticsearch queries or dynamodb GSI queries
- postgres has support for jsonb which allows us to store schemaless (which means we dont need to normalize everything to transition to postgres up front)

## Backups

- RDS will automatically create nightly snapshots of data and handle the data retention policy for us
- will handle upgrades for us automatically
- does these through maintence windows

## b.) ORM & Query Builder Investigation

- **ORMs**

  - **Dynamo**
    - **TypedORM**
        - Related to DynamoDB.
        - Limited DynamoDB transaction support.
    - **ElectroDB** - another Dynamodb specific ORM we looked into

  - **SQL**

  - **Prisma**
    - Overly complicated.
    - Requires a Rust binary, adding complexity to serverless deployments.
    - Uses a DSL (.prisma) instead of first-class TypeScript support.
    - Generates TypeScript types based on the DSL.
  - **Bookshelf**
    - Felt dated with limited TypeScript support.

- **TypeScript ORMs**

  - **Drizzle ORM**
    - Felt a bit too new.
  - **TypeORM**
    - Disliked the decorators, which caused deployment issues.
    - Generated complex queries.
    - Issues with built-in joining led to writing raw SQL to retrieve data.

- **Query Builders**
  - **Knex.js**
    - Felt outdated and unmaintained.
    - Limited TypeScript support.
  - **Kysely**
    - Simple and felt like the best approach.
    - First-class TypeScript support.
    - Easy to use.
    - Didn’t abstract too much.
    - Some risk as it is a “newish” library.
    - Less risk since only business entities are returned from the persistence layer, so only persistence knows about Kysely.

## Tools & Clients

- **GUI Client**
  - Found TablePlus to be a good GUI client for accessing PostgreSQL.

## DynamoDB-Specific Investigation

- **DynamoDB Indexing**
  - Explored different ways to set up GSIs (Global Secondary Indexes) to improve query performance.
  - Returned to square one to re-populate fields in DynamoDB.

## Questions to Ask

1. Backup and Restore Process
2. Deeper Cost Exploration
3. Setup for Lower + Higher Envs
4. Present to Team for Buy-in
5. Determine Roll out plan
6. Determine plan for moving remaining opensearch + dynamo entities (or experiment with messages first?)

## Left to do

1. iam token refresh functionality
2. investigate if we can generate tokens using roles instead of users (jim's request)
