const createApplicationContext = require('../../../web-api/src/applicationContext');
const {
  batchDelete,
  queryFull,
} = require('../../src/persistence/dynamodbClientService');
const {
  createSectionOutboxRecords,
} = require('../../src/persistence/dynamo/workitems/createSectionOutboxRecords');
const {
  createUserOutboxRecord,
} = require('../../src/persistence/dynamo/workitems/createUserOutboxRecord');
const { chunk } = require('lodash');
const { readFileSync } = require('fs');
const { sleep } = require('../../src/tools/helpers');

const usage = error => {
  if (error) {
    console.error(`ERROR: ${error}`);
  }
  console.log(
    'USAGE: \n$ npx ts-node archive-outboxes.js [user-outbox|uuid, section-outbox|section]',
  );
};

const archiveUserOutboxItems = async (
  applicationContext,
  { items, userId },
) => {
  const promises = items.map(workItem =>
    createUserOutboxRecord({ applicationContext, userId, workItem }),
  );
  await Promise.all(promises);
};

const archiveSectionOutboxItems = async (
  applicationContext,
  { items, section },
) => {
  const promises = items.map(workItem =>
    createSectionOutboxRecords({ applicationContext, section, workItem }),
  );
  await Promise.all(promises);
};

const archiveOutboxItems = async (
  applicationContext,
  { bucketKey, bucketType, items, retries = 0 },
) => {
  try {
    switch (bucketType) {
      case 'user-outbox':
        await archiveUserOutboxItems(applicationContext, {
          items,
          userId: bucketKey,
        });
        break;
      case 'section-outbox':
        await archiveSectionOutboxItems(applicationContext, {
          items,
          section: bucketKey,
        });
        break;
    }
  } catch (err) {
    console.log(`ERROR - ${err.message}`);
    if (retries > 9) {
      console.log(items);
      throw 'Cannot complete operation';
    }
    await sleep(1000 * Math.pow(2, retries));
    await archiveOutboxItems(applicationContext, {
      bucketKey,
      bucketType,
      items,
      retries: retries + 1,
    });
  }
};

const processPrimaryKey = async (applicationContext, { pk }) => {
  const [bucketType, bucketKey] = pk.split('|');

  if (!['user-outbox', 'section-outbox'].includes(bucketType)) {
    return usage(`received invalid pk: ${pk}`);
  }
  console.time(pk);

  const records = await queryFull({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': pk,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  const chunks = chunk(records, 25);
  let i = 1;
  for (const items of chunks) {
    await batchDelete({
      applicationContext,
      items,
    });

    await archiveOutboxItems(applicationContext, {
      bucketKey,
      bucketType,
      items,
    });

    console.log(`batch ${i++}/${chunks.length} done`);
  }
  console.timeEnd(pk);
};
(async () => {
  const applicationContext = createApplicationContext({});
  // move user-outbox records to outbox
  const jsonFile = process.argv[2];

  const pks = JSON.parse(readFileSync(jsonFile, 'utf-8'));
  console.log(pks);

  for (const pk of pks) {
    await processPrimaryKey(applicationContext, { pk });
  }

  // get all records in outbox
})();
