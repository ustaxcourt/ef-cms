// usage: npx ts-node --transpile-only scripts/run-once-scripts/add-gsis-to-messages.ts

/* eslint-disable */
import { calculateTimeToLive } from '../../web-api/src/persistence/dynamo/calculateTimeToLive';
import { TDynamoRecord } from '../../web-api/src/persistence/dynamo/dynamoTypes';
import { createApplicationContext } from '../../web-api/src/applicationContext';
import { marshall } from '@aws-sdk/util-dynamodb';
import { searchAll } from '../../web-api/src/persistence/elasticsearch/searchClient';
import { getClient } from '../../web-api/elasticsearch/client';

const environmentName = process.env.ENV!;

/** ideas:
- use elasticsearch to get all cases that have messages, then use those PKs 
  to get messages in dynamo, then push to dynamo
- just do a dynamo table scan
- trust ES message data and do a one-to-one pull -> upsert
*/

const getMessages = async ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}): Promise<RawCase[]> => {
  const searchOutput = await applicationContext.getSearchClient().search({
    index: 'efcms-message',
    body: {
      query: {
        // match_all: {},
        bool: {
          must: [
            { term: { 'entityName.S': 'Message' } },
            // { prefix: { 'sk.keyword': 'case|' } },
          ],
        },
      },
    },
  });

  // console.log('output', searchOutput.body.hits.hits);
  // const results = searchOutput.body.hits.hits;
  // console.log(results.body.hits.hits)
  console.log('results', searchOutput.body.hits.hits);
  return [] as unknown as RawCase[];
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
  // const messages = await getMessages();
  const messages = await getMessages({ applicationContext });
  // console.log(messages);

  // const updatedMessages = applyMessageChanges({ messages });
  // console.log(updatedMessages[0]);
  // write to Dynamo
})();
