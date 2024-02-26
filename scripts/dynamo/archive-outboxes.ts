import {
  batchDelete,
  queryFull,
} from '@web-api/persistence/dynamodbClientService';
import { chunk } from 'lodash';
import { createApplicationContext } from '@web-api/applicationContext';
import { createSectionOutboxRecords } from '@web-api/persistence/dynamo/workitems/createSectionOutboxRecords';
import { createUserOutboxRecord } from '@web-api/persistence/dynamo/workitems/createUserOutboxRecord';
import { readFileSync } from 'fs';
import { sleep } from '@shared/tools/helpers';
import type { RawWorkItem } from '@shared/business/entities/WorkItem';

const archiveUserOutboxItems = async (
  applicationContext: IApplicationContext,
  { items, userId }: { items: RawWorkItem[]; userId: string },
): Promise<void> => {
  const promises = items.map(workItem =>
    createUserOutboxRecord({ applicationContext, userId, workItem }),
  );
  await Promise.all(promises);
};

const archiveSectionOutboxItems = async (
  applicationContext: IApplicationContext,
  { items, section }: { items: RawWorkItem[]; section: string },
): Promise<void> => {
  const promises = items.map(workItem =>
    createSectionOutboxRecords({ applicationContext, section, workItem }),
  );
  await Promise.all(promises);
};

const archiveOutboxItems = async (
  applicationContext: IApplicationContext,
  {
    bucketKey,
    bucketType,
    items,
    retries = 0,
  }: {
    bucketKey: string;
    bucketType: string;
    items: RawWorkItem[];
    retries?: number;
  },
): Promise<void> => {
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
    console.log('Error archiving outbox items:', err);
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

const processPrimaryKey = async (
  applicationContext: IApplicationContext,
  { pk }: { pk: string },
): Promise<void> => {
  const [bucketType, bucketKey] = pk.split('|');

  if (!['user-outbox', 'section-outbox'].includes(bucketType)) {
    console.log(`received invalid pk: ${pk}`);
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
      items: items as unknown as RawWorkItem[],
    });

    console.log(`batch ${i++}/${chunks.length} done`);
  }
  console.timeEnd(pk);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const jsonFile = process.argv[2];
  const applicationContext = createApplicationContext({});

  const pks = JSON.parse(readFileSync(jsonFile, 'utf-8'));
  for (const pk of pks) {
    await processPrimaryKey(applicationContext, { pk });
  }
})();
