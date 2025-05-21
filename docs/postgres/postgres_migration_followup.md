While we made some sweeping changes to the codebase in the migration from DynamoDB to Postgres, we prioritized simply getting data into Postgres and making sure the app worked; this meant sometimes leaving improvements to be done until after the data was fully migrated. Here is a list of such improvements/tasks that would be good to address at that point:

- Certain OpenSearch queries, like the one for the Cold Case Report, can probably be moved from OpenSearch into Postgres. For example, we spent a day or two trying to make the Cold Case Report fast enough in Postgres--there is no reason in principle it cannot be done with efficient indexing, precomputed views, or the like--but we dropped it for more important tasks.
  - Queries that rely on all but the most trivial text matching are best to keep in OpenSearch.

- Get transactions to work properly. The tricky bits to consider:
  - Unless you do a [two-phase transaction](https://www.postgresql.org/docs/current/two-phase.html), transactions are one-per-connection. This can make running tasks in a `Promise.all()` difficult: if each task needs a transaction, then each task also probably needs its own connection. This would entail handling our connections differently, since they are currently one connection per Lambda execution environment.
  - We need to index Case, Docket Entry, and Practitioner data with Postgres-to-OpenSearch latency in the low seconds range. We explored various paths before settling on an in-code solution: `database.ts::getDbWriter` checks if the table needs indexing and, if so, gets the results of the executed query, transforms them, and passes the data through an SQS queue to index. With transactions, this would have to be modified: we would only want to send the message on commit, not on execution, of the query.

- We did not enforce Foreign Key constraints. They should be enforced. E.g., `docketNumber` should probably always be a foreign key into `dw_case`.

- Consider robust connection pooling as needed. RDS Proxy, for instance.

- In general, there are probably places where the app can now better leverage relationships.
  - Since the app was originally in DynamoDB, many of the relationships that come for free in a relational database had to be manually maintained in code ("if you update some record X in Dynamo, make sure there is code to also update some corresponding record Y").
  - The above also entailed a lot of redundant saves/loads ("you changed a field, and who knows what that might affect, so now resave all the data again").

- Case creation/docket number generation can be improved as needed. The current setup is to acquire a mutex lock so that only one case can be created at a time (and in the process obtain/save a docket number). This is because we need the docket number in the process of making the case BEFORE saving--it is the primary key/ID--but we also cannot skip docket numbers. A better method: user a uuid for the ID and outsource the incrementing of docket numbers to the database so that the case is assigned a docket number on save. This avoid locking.
  - We have sometimes observed flakiness in deployed CI tests due to conflicts trying to obtain the lock.

