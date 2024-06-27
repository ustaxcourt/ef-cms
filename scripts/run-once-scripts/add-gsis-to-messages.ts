// usage: npx ts-node --transpile-only scripts/run-once-scripts/add-gsis-to-messages.ts

import { Message } from '../../shared/src/business/entities/Message';
import {
  ServerApplicationContext,
  createApplicationContext,
} from '../../web-api/src/applicationContext';
import { calculateTimeToLive } from '../../web-api/src/persistence/dynamo/calculateTimeToLive';
import { TDynamoRecord } from '../../web-api/src/persistence/dynamo/dynamoTypes';
import {
  formatResults,
  search,
} from '../../web-api/src/persistence/elasticsearch/searchClient';
import { exit } from 'process';
import { get } from 'lodash';
import { updateRecords } from 'scripts/run-once-scripts/scriptHelper';

// const getMessages = async ({
//   applicationContext,
// }: {
//   applicationContext: ServerApplicationContext;
// }) => {
//   const query = {
//     body: {
//       query: {
//         bool: {
//           must: [{ term: { 'entityName.S': 'Message' } }],
//         },
//       },
//     },
//     index: 'efcms-message',
//   };

//   const { results } = await search({
//     applicationContext,
//     searchParameters: query,
//   });

//   return results;
// };

const applyMessageChanges = ({ items }) => {
  const itemsAfter: TDynamoRecord[] = [];
  for (const item of items) {
    if (!item.completedAt) {
      const ttl = calculateTimeToLive({
        numDays: 8,
        timestamp: item.createdAt!, // Zach: I think I am unfamiliar with this, why do we want to delete messages 8 days after they were created?
      });

      // add outbox records
      itemsAfter.push({
        ...item,
        gsi1pk: undefined,
        pk: `message|outbox|user|${item.fromUserId}`, // Zach: This is outside of the scope of the migration but I wanted to ask about creating duplicate records for the same information, rather than the same record with multiple ways it can be searched for.
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
// (async function () {
//   const applicationContext = createApplicationContext({});
//   const items = await getMessages({ applicationContext }); // Zach: How many messages are there in the system? You may not be able to fetch all messages at once, but need to batch get messages, migrate, then get messages again.
//   try {
//     items.forEach(message => {
//       message = new Message(message, {
//         applicationContext,
//       }).validate();
//     });
//   } catch (e) {
//     console.log('Error migrating message records:', e);
//     exit(); //???
//   }

//   const migratedItems = applyMessageChanges({ items });

//   try {
//     await updateRecords(applicationContext, migratedItems); // Zach: This needs to be extracted to a helper somewhere because there is a function in the file you are importing which will automatically start running when you import updateRecords();
//   } catch (e) {
//     console.log('Error writing migrated message records to dynamo:', e);
//     exit(); //???
//   }
// })();

(async function () {
  const dryRun = process.argv.slice(2)[0] || true;

  const applicationContext = createApplicationContext({});
  const searchParameters = {
    body: {
      query: {
        bool: {
          must: [{ term: { 'entityName.S': 'Message' } }],
        },
      },
      sort: [{ 'createdAt.S': 'asc' }],
    },
    index: 'efcms-message',
    size: 10000,
  };

  const index = searchParameters.index || '';
  const query = searchParameters.body?.query || {};
  const size = searchParameters.size;

  let countQ;
  try {
    countQ = await applicationContext.getSearchClient().count({
      body: {
        query,
      },
      index,
    });
  } catch (searchError) {
    applicationContext.logger.error(searchError);
    throw new Error('Search client encountered an error.');
  }

  const _source = searchParameters.body?._source || [];
  const sort = searchParameters.body?.sort; // sort is required for paginated queries

  const expected = get(countQ, 'body.count', 0);

  let i = 0;
  let search_after = [0];
  while (i < expected) {
    let searchResults = [];
    const chunk = await applicationContext.getSearchClient().search({
      _source,
      body: {
        query,
        search_after,
        sort,
      },
      index,
      size,
    });
    const hits = get(chunk, 'body.hits.hits', []);

    if (hits.length > 0) {
      searchResults = searchResults.concat(hits);
      search_after = hits[hits.length - 1].sort;
    }

    i += size; // this avoids an endless loop if expected is somehow greater than the sum of all hits

    const { results } = formatResults({
      hits: {
        hits: searchResults,
        total: {
          value: searchResults.length,
        },
      },
    });

    let items;
    try {
      items = results.map(message => {
        delete message._score;
        delete message.sort;
        new Message(message, {
          applicationContext,
        }).validate();
        return message;
      });
    } catch (e) {
      console.log('Error migrating message records:', e);
      exit(); //???
    }

    const migratedItems = applyMessageChanges({ items });

    if (dryRun != true) {
      try {
        await updateRecords(applicationContext, migratedItems);
      } catch (e) {
        console.log('Error writing migrated message records to dynamo:', e);
        exit(); //???
      }
    }
  }
})();
