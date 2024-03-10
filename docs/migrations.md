# Migrations

The goal of this part of the documentation is to explain how blue-green migration process and architecture is setup, and why we often need these types of migrations.

## Overview

As developers work on stories and bugs, we often run into issues where our data entities need to change in regards to requirements.  Entity changes means our production data *might* need to be modified before we deploy these new changes.  For example, if we added a new required field to the Case entity, this would mean all the data in our database is broken because that field would be missing.  Since our data is stored in DynamoDB, it's not possible to write a simple SQL migration script to fix data.

Our team invested a lot of time designing and implementing something we call the **blue-green migration process** which helps modify the data on dynamo tables before we switch the users over to a newer version of the application.  This is done with a combination of various CI/CD steps, shell scripts, and terraform to deploy various AWS resources to process these records as fast as possible.

## Writing a Migration Script

?> There is a video walkthrough at the end of this section which also explains how to write a migration script.

We are going to do a walkthrough tutorial in this section to explain how you can write a migration script.  For the sake of this walk through, let's pretend we need to write a migration script which adds a new required field to a Case adjourned.


First, we'd want to create a new migration script called `0005-add-case-adjourned-field.js` and put it in the `web-api/workflow-terraform/migration/main/lambdas/migrations` directory.  Note that the `0005` numeric prefix is just for us developers to understand the ordering of these scripts; our system doesn't automatically sort these scripts by that prefix.  We will name the script with a numeric prefix and also a descriptive name.

Second, we will need to implement a `migrateItems` function which will take in an array of dynamo records and modify them based on certain criteria.  In this scenario, we only care about modifying the records that are cases.  Often when dealing with case migrations we want to fetch the entire case and aggregate the items together into a single case object so we can validate the entity.  

The following is an example of how one might write a migration script for this scenario.  I added extra comments in the code to help explain what is going on.


```javascript
// this is needed for various utility functions and writing to dynamo
const createApplicationContext = require('../../../../src/applicationContext');

// a utility function for combining all the separate case dynamo records into a single case object
const {
  aggregateCaseItems,
} = require('../../../../../web-api/src/persistence/dynamo/helpers/aggregateCaseItems');

// since we will be adding a field to the case, we need to bring in the case entity to validate our data.
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');

// a utility function for fetching all records associated with a case
const { queryFullCase } = require('../utilities');

// create a new application context
const applicationContext = createApplicationContext({});

// a filter to know when we should modify a record
const isCaseRecord = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('case|');
};

// this function will be ran by the migration lambda
const migrateItems = async (items, documentClient) => {
  // keep track of all the modified and unchanged records
  const itemsAfter = [];

  
  for (const item of items) {
    // we only care about modifying cases
    if (isCaseRecord(item)) {
      // get all the case records
      const fullCase = await queryFullCase(documentClient, item.docketNumber);

      // combine them all together
      const caseRecord = aggregateCaseItems(fullCase);

      // construct a new case entity, default adjourned to false and validate
      const theCase = new Case({
          caseRecord, 
          adjourned: false
      }, {
        applicationContext,
      }).validateWithLogging(applicationContext); // validating the entity is the most important step

      item.adjourned = theCase.adjourned;
    }

    // push the record into the array to later be returned at the end of this function
    itemsAfter.push(item);
  }

  // return those items to be written to the destination dynamo table
  return itemsAfter;
};

// the migration script must export a migrateItems function
exports.migrateItems = migrateItems;
```

Keep in mind this migration script processes each dynamo record individually; therefore, any item put into that `itemsAfter` array must be a dynamodb record containing a `pk`, `sk`.  The main reason we fetch the entire case is so we can validate the case after modifying it's properties.

After you write your migration script, there is one more additional step you must do to get everything setup.  There is a file called `web-api/workflow-terraform/migration/main/lambdas/migrationsToRun.ts` which contains an array of objects that must be in the order of which you want the migration scripts invoked.  Be sure to add your new migration script to this file so that the blue-green migration knows what to run.

Here is an example of that file:

```typescript
import {
  migrateItems: migration0003,
} from './migrations/0003-case-has-sealed-documents';

// MODIFY THIS ARRAY TO ADD NEW MIGRATIONS OR REMOVE OLD ONES
const migrationsToRun = [
  { key: '0003-case-has-sealed-documents.js', script: migration0003 },
];

exports.migrationsToRun = migrationsToRun;
```

After doing these two main steps, writing a migration and adding it to the migrationsToRun.ts file, our CI/CD process will automatically start the setup for running a blue-green migration.

If learning via a video if more your style, we have a short recording explaining how you can write a migration script below.

<iframe width="560" height="315" src="https://www.youtube.com/embed/6fY74z71ouA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## Keeping Track of Migrations

When our CI/CD process runs the migration process, it keeps track of which migration scripts have ran inside our `efcms-$ENV-$VERSION` table using the `./web-api/workflow-terraform/migration/bin/track-successful-migrations.ts` node script.  This script looks at the migration directory and writes entries into dynamo to track the migrations that have ran.  An example of one of these records looks like this:

```javascript
{
  "createdAt": "2021-11-19T20:39:01.811Z",
  "pk": "migration",
  "sk": "migration|0001-update-websockets-gsi1pk.js"
}
```

If this record exists, we know the migration script ran successfully in the past.  When a deployment is running on Circle, one of the tasks we run is called `Setup Blue Green Migration If Needed`, which will set a `migrate` flag in the deploy table.  This flag is set to `true` when a migration is pending.  This flag is also used in other parts of the deployment process.

```javascript
{
  "current": false,
  "pk": "migrate",
  "sk": "migrate"
}
```

Additionally, during our deployment process, there are a couple of other records we use to keep track of the current state of the environment.  Understanding these will help the next section of this documentation.  

#### current-color
We use this to keep track of which color the environment is currently on:

```javascript
{
  "current": "blue",
  "pk": "current-color",
  "sk": "current-color"
}
```

#### source-table-version
we use this to keep track of which table is the migration going to read records from:

```javascript
{
  "current": "alpha",
  "pk": "source-table-version",
  "sk": "source-table-version"
}
```

#### destination-table-version
we use this to keep track of which table is the migration going to push records into:

```javascript
{
  "current": "alpha",
  "pk": "destination-table-version",
  "sk": "destination-table-version"
}
```

## Migration Architecture

This Blue-Green Migration is one of the more complex parts of our system.  It will be useful to define a couple of key terms before we start explaining how the blue-green migration is setup.  Additionally, I'm going to split these up into 3 different categories.

- Global Terms
    - Current Color: this could be either **blue** or **green**
    - Target Color: this will be the opposite of the current version
    - Current Version: this is either **alpha** or **beta**
    - Destination Version: this is opposite of current version
    - Destination Table: the dynamodb table we plan to migrate the data into, i.e. **efcms-exp1-alpha** or **efcms-exp1-beta**
    - Source Table: the dynamodb table we plan to migrate the data from
    - Deploys Table: keeps track of which migration scripts have already ran
- Live Migrations
    - Migration Stream: records are placed onto this dynamodb stream when the source table is modified (insert, update, deletes)
    - Migration Lambda: processes the records from the migration stream and put them into the destination table
- Segment Migrations
    - Migrations Segment Queue - a queue which holds events (segment and total segments) created from the `npm run start:migration` command
    - Migrations Segment Lambda - processes the segment queue and reads records from source table and migrates them to the destination table
    - Dynamo to Kinesis Stream - a dynamodb stream that contains any changed records (used for indexing any changed records into our elasticsearch cluster)
    - Dynamo to Kinesis Stream Lambda - processes the events on the dynamo to kinesis stream and writes them elasticsearch cluster

To help further understand these terms, take a look at the following diagram which highlights how the records flow throughout this entire blue-green migration architecture.  In this diagram, the alpha table would be the source table, and beta would be the destination table, but those will alternate for each blue-green migration executed.

![Blue-Green Migration Architecture](https://user-images.githubusercontent.com/1868782/117465361-9f83e400-af1f-11eb-8844-b14fefa2c3d2.png)

As an overview of this diagram, when we do a deploy in circle, part of the CI/CD pipeline will check using the `./web-api/workflow-terraform/migration/bin/is-migration-needed.ts` script if we need to run a new migration script.  If a new migration is needed, CI/CD will run our  `npm run deploy:migration` script which will run terraform and create some of the resources displayed in this diagram above.  For example, this terraform deploy will create the SQS queues, the dead letter queues, the migration lambda, the live migration streams, and the segment migration lambda, etc.  

?> Please checkout our [Dawson's Terraform documentation](terraform?id=migration-terraform) for more information about terraform and our project.

Once all of the infrastructure is setup, CI/CD will run `npm run start:migration` to create 60,000+ events that contain the segment id and total segments, and push those events into the segments migration sqs queue.  These events will be processed by the migration segments lambda which will read data from the source table, process them, and write the changed records to the destination table.  Our CI/CD process will then wait for all the records to have been migrated using the `wait-for-migration-to-finish.sh` script.  Once all the segments have been processed, CI/CD will then deploy something called the `migration reindex cron`, turn on the Dynamo to Elasticsearch stream which will then start the process of indexing all of these items into a new elasticsearch cluster, and then CI/CD will wait until the reindex is complete using the reindex cron.

Once the reindex cron determines the elasticsearch clusters are matching in regards to items, it will tell CircleCI to continue on in the deploy process.  After all of these steps are done, smoketests will run and finally the colors will switch over if everything is successful.

## Migration Pitfalls

In rare cases a blue-green migration will fail due to entity validation or timing out.  Sometimes the data we fetch from the backend doesn't properly align with the entities we are trying to create and validate which will cause the migration flow to fail when being ran.  The way we have the migration setup is it will retry 10 times on a segment before failing the entire migration.  Any failed events will be put onto one of two dead letter queue called either `migration_segments_dl_queue_$ENV` or `migration_failure_queue_$ENV`.  Any records in these dead letter queues means something bad has happened and needs to be fixed.

!> Our CI/CD pipeline is mostly fully automated, but do not switch colors to the new environment if these dead letter queues contain any events.
