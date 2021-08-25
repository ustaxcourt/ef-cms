# 2. Use DynamoDB as the primary database

Date: 2021-06-14

## Status

Accepted

## Context

> The issue motivating this decision, and any context that influences or constrains the decision. **This issue was documented in retrospect.**

On [November 7, 2018](https://ustaxcourt.slack.com/archives/CD4PNKEPK/p1541632606310800) the team discussed data stores, trying to choose the simplest thing which is easiest to reason about, knowing that the structure of the data is unknown.

> "If we don't have enough information to know for sure that we're making the best choice now, then, if possible, don't choose until you have better information."

The team was reading [Why Amazon DynamoDB Isn’t for Everyone](https://acloudguru.com/blog/engineering/why-amazon-dynamodb-isnt-for-everyone-and-how-to-decide-when-it-s-for-you) and considering if a relational database (with AWS Aurora) or a document database (with DynamoDB) was the simpler option.

> "Evolving a [DynamoDB] incrementally can be challenging"

> "I think we should start with SQL and transition to [DynamoDB] as we find things that make sense being stored in a document store"

> "Does the 'simplest thing' / 'easiest to reason about' require an [relational database] at this stage? I guess that would be the first question to answer."

On [December 21, 2018](https://ustaxcourt.slack.com/archives/CD4PNKEPK/p1545428905048500), the team was thinking about migration patterns, given DynamoDB’s lack of flexibility and requirement that data access patterns are known upfront.

> "…to deal with DynamoDB, it's my opinion that if there's a robust migration process where you can "easily" change how your data is represented from one story to the next, you're in good shape"

On August 18, 2021, Eric Sorenson (Flexion Tech Lead on project) and Cody Seibert (Flexion Enginner) met to add any additional context to the above. Here's a summary of additional context from that conversation

> Biggest thing is that we had no idea what the production data set looked like until close to going to production. So, if we were to use something other than DynamoDB the change in the scale of database would have a giant impact if it were a relational database. DDB scales infinitely without any change in performance. It felt like a huge risk to use something that would be CPU bound if you knew it couldn't scale properly. At risk of being in the same place as Elasticsearch
>
> We knew the Court didn't have an infinite budge to work with. We felt the operational costs were cheaper with DynamoDB than running RDS instances. DDB is very affordable as long as you don't change the database too often. The more data you had, the higher the monthly costs with RDS. Considered MongoDB but it was just a whole lot more expensive
>
> We were moving moving one story at a time; so we wanted to be as flexible as possible moving forward. Easy to destroy everything and build the documents back up based on each User Story. One thing that helps sing NoSQL / allows for more rapid iteration. Completely cleared the table and start anew. No need to add columns.
>
> Created the persistence gateway layer to isolate where we had to save and retrieve data.
>
> If we were to use a data store that was CPU bound before we knew the size of the production dataset, there was the possibility that the system wouldn't be functional with that data set. Dynamo does the scaling for you.
>
> Spent a week or two trying to get Aurora setup in Terraform at a time when we didn't know Terraform that well. It just wasn't easy, and so it made more sense to stick with DDB, which was working well enough for us, for now.
>
> Team was more comfortable and more experience with an SQL DB, but didn't have the time or expertise to tune the application for performance at scale.

## Decision

> The change that we're proposing or have agreed to implement.

- We’ll use DynamoDB as a primary data store, and use a persistence gateway abstraction layer within our code.

## Consequences

> What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.

| Risk | Mitigation |
|------|------------|
| The data structure will need to evolve as we learn more about the needs of the system. | We’ll develop a way to migrate data as the DynamoDB structure needs to change using Lambda.
| We may need to switch to another data store if we need relational features. | The persistence gateway abstraction layer will allow us to switch to another data store at a later date if needed.
| Cases have relations which need to be represented on a case. | The case relationships will be denormalized so that a case contains all of its documents and docket number references.
| Cost | DynamoDB is virtually free no matter the size of the DB if you don't have to work with the data too much |
| Lack of Experience with Technology | Would rely on the breadth of information available through online documentation to act as a guide |
| Tuning to Scale | DynamoDB is automatically tuned to perform the same at any scale. |
