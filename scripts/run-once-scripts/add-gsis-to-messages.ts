// usage: npx ts-node --transpile-only scripts/run-once-scripts/add-gsis-to-messages.ts

import { Message } from '@shared/business/entities/Message';
import {
  ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { calculateTimeToLive } from '@web-api/persistence/dynamo/calculateTimeToLive';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { search } from '@web-api/persistence/elasticsearch/searchClient';
import { exit } from 'process';
import { updateRecords } from 'scripts/run-once-scripts/add-gsis-to-work-items';

const environmentName = process.env.ENV!;

/** ideas:
- trust ES message data and do a one-to-one pull -> upsert
*/
// !!!! NEED TO ADD DYNAMO FIELDS TO UNTOUCHED RECORDS
const getMessages = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}) => {
  const query = {
    body: {
      query: {
        bool: {
          must: [{ term: { 'entityName.S': 'Message' } }],
        },
      },
    },
    index: 'efcms-message',
  };

  const { results } = await search({
    applicationContext,
    searchParameters: query,
  });

  return results;
};

const applyMessageChanges = ({ messages: items }) => {
  const itemsAfter: TDynamoRecord[] = [];
  for (const item of items) {
    if (!item.completedAt) {
      const ttl = calculateTimeToLive({
        numDays: 8,
        timestamp: item.createdAt!,
      });

      // add outbox records
      itemsAfter.push({
        ...item,
        gsi1pk: undefined,
        pk: `message|outbox|user|${item.fromUserId}`,
        sk: item.createdAt,
        ttl: ttl.expirationTimestamp,
      });
      itemsAfter.push({
        ...item,
        gsi1pk: undefined,
        pk: `message|outbox|section|${item.fromSection}`,
        sk: item.createdAt,
        ttl: ttl.expirationTimestamp,
      });

      // add global secondary indexes
      item.gsiUserBox = item.toUserId
        ? `assigneeId|${item.toUserId}`
        : undefined;
      item.gsiSectionBox = item.toSection
        ? `section|${item.toSection}`
        : undefined;
      itemsAfter.push(item);
    } else {
      const ttl = calculateTimeToLive({
        numDays: 8,
        timestamp: item.completedAt!,
      });

      // add completed box records
      itemsAfter.push({
        ...item,
        gsi1pk: undefined,
        pk: `message|completed|user|${item.completedByUserId}`,
        sk: item.completedAt!,
        ttl: ttl.expirationTimestamp,
      });
      itemsAfter.push({
        ...item,
        gsi1pk: undefined,
        pk: `message|completed|section|${item.completedBySection}`,
        sk: item.completedAt!,
        ttl: ttl.expirationTimestamp,
      });

      // completed message does not get global secondary indexes
      itemsAfter.push({
        ...item,
        gsiSectionBox: undefined,
        gsiUserBox: undefined,
      });
    }
  }
  return itemsAfter;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async function () {
  const applicationContext = createApplicationContext({});
  const messages = await getMessages({ applicationContext });
  try {
    messages.forEach(message => {
      message = new Message(message, {
        applicationContext,
      }).validate();
    });
  } catch (e) {
    console.log('Error migrating message records:', e);
    exit(); //???
  }

  const migratedItems = applyMessageChanges({ messages });

  console.log('Sample migrated item:', migratedItems[0]);

  try {
    await updateRecords(applicationContext, migratedItems);
  } catch (e) {
    console.log('Error writing migrated message records to dynamo:', e);
    exit(); //???
  }
})();
