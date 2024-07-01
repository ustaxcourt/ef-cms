// usage: npx ts-node --transpile-only scripts/run-once-scripts/add-gsis-to-work-items.ts

import { createApplicationContext } from '../../web-api/src/applicationContext';
import { scan } from '../../web-api/src/persistence/dynamodbClientService';
import { TDynamoRecord } from '../../web-api/src/persistence/dynamo/dynamoTypes';
import { updateRecords } from 'scripts/run-once-scripts/scriptHelper';
import { get } from 'lodash';
import { formatResults } from '@web-api/persistence/elasticsearch/searchClient';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { exit } from 'process';

// const findWorkItems = async ({ applicationContext }) => {
//   const result = await scan({
//     ExpressionAttributeValues: {
//       ':pk_prefix': 'case|',
//       ':sk_prefix': 'work-item|',
//     },
//     FilterExpression:
//       'begins_with(pk, :pk_prefix) AND begins_with(sk, :sk_prefix)',
//     applicationContext,
//   });
//   return result;
// };

const migrateItems = items => {
  for (const item of items) {
    if (!item.completedAt && (item.inProgress || item.caseIsInProgress)) {
      item.gsiUserBox = item.assigneeId
        ? `assigneeId|inProgress|${item.assigneeId}`
        : undefined;
      item.gsiSectionBox = item.section
        ? `section|inProgress|${item.section}`
        : undefined;
    } else if (!item.completedAt) {
      item.gsiUserBox = item.assigneeId
        ? `assigneeId|inbox|${item.assigneeId}`
        : undefined;
      item.gsiSectionBox = item.section
        ? `section|inbox|${item.section}`
        : undefined;
    }
    item.gsi2pk = undefined;
  }

  return items as unknown as TDynamoRecord[];
};

(async () => {
  const dryRun = process.argv.slice(2)[0] || true;

  const applicationContext = createApplicationContext({});
  const searchParameters = {
    body: {
      query: {
        bool: {
          must: [
            {
              exists: {
                field: 'section.S',
              },
            },
          ],
        },
      },
    },
    index: 'efcms-work-item',
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

    console.log('countQ', countQ);
  } catch (searchError) {
    applicationContext.logger.error(searchError);
    throw new Error('Search client encountered an error.');
  }

  const expected = get(countQ, 'body.count', 0);

  let i = 0;
  let search_after = [0];
  while (i < expected) {
    let searchResults = [];
    const chunk = await applicationContext.getSearchClient().search({
      _source: [],
      body: {
        query,
        search_after,
        // this is the only indexed date field, can we use it to sort?
        sort: [{ 'completedAt.S': 'asc' }],
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

    let { results } = formatResults({
      hits: {
        hits: searchResults,
        total: {
          value: searchResults.length,
        },
      },
    });

    try {
      results = results.map(workItem => {
        delete workItem._score;
        delete workItem.sort;
        new WorkItem(workItem, {
          applicationContext,
        }).validate();
        return workItem;
      });
    } catch (e) {
      console.log('Error migrating message records:', e);
      exit(); //???
    }

    const migratedItems = migrateItems(results);
    if (dryRun != true) {
      try {
        await updateRecords(applicationContext, migratedItems);
      } catch (e) {
        console.log('Error writing migrated workItem records to dynamo:', e);
        exit(); //???
      }
    }
  }
})();
