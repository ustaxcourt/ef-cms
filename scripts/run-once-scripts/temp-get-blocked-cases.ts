// usage: npx ts-node --transpile-only scripts/run-once-scripts/find-petitioners-missing-cases.ts
import { createApplicationContext } from '../../web-api/src/applicationContext';
import { search } from '../../web-api/src/persistence/elasticsearch/searchClient';
import fs from 'fs';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext();
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: [
          'automaticBlocked',
          'automaticBlockedDate',
          'automaticBlockedReason',
          'blocked',
          'blockedDate',
          'blockedReason',
          'caseCaption',
          'docketNumber',
          'docketNumberSuffix',
          'docketNumberWithSuffix',
          'leadDocketNumber',
          'status',
          'procedureType',
        ],
        query: {
          bool: {
            must: [
              { term: { 'preferredTrialCity.S': 'Lubbock, Texas' } },
              {
                bool: {
                  should: [
                    { match: { 'automaticBlocked.BOOL': true } },
                    { match: { 'blocked.BOOL': true } },
                  ],
                },
              },
            ],
          },
        },
        size: 5000,
      },
      index: 'efcms-case',
    },
  });

  const outputFilePath = `./shared/src/test/tempBlockedCases.json`;
  fs.writeFileSync(outputFilePath, JSON.stringify(results));
})();
