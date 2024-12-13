// usage: npx ts-node --transpile-only scripts/run-once-scripts/find-petitioners-missing-cases.ts
import { createApplicationContext } from '../../web-api/src/applicationContext';
import { search } from '../../web-api/src/persistence/elasticsearch/searchClient';
import fs from 'fs';
import { CASE_STATUS_TYPES } from '../../shared/src/business/entities/EntityConstants';
import {query} from '@web-api/persistence/dynamodbClientService'
import {purgeDynamoKeys} from "../../web-api/src/persistence/dynamo/helpers/purgeDynamoKeys";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext();
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: [
          'caption',
          'caseType',
          'docketNumber',
          'docketNumberSuffix',
          'docketNumberWithSuffix',
          'leadDocketNumber',
          'highPriority',
          'qcCompleteForTrial',
          'isSealed',
        ],
        query: {
          bool: {
            must: [
              { term: { 'preferredTrialCity.S': 'Lubbock, Texas' } },
              {
                term: {
                  'status.S': CASE_STATUS_TYPES.generalDocketReadyForTrial,
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
  const casePromises = results.map(async c => {
    const [privatePractitioners, irsPractitioners] = await Promise.all([
      query({
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
        ExpressionAttributeValues: {
          ':pk': `case|${c.docketNumber}`,
          ':skPrefix': 'privatePractitioner|',
        },
        KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :skPrefix)',
        applicationContext,
      }),
      query({
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
        ExpressionAttributeValues: {
          ':pk': `case|${c.docketNumber}`,
          ':skPrefix': 'irsPractitioner|',
        },
        KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :skPrefix)',
        applicationContext,
      }),
    ]);

    return purgeDynamoKeys({
      ...c,
      irsPractitioners,
      privatePractitioners,
    });
  });
  const fullEligibleCases = await Promise.all(casePromises);
  const outputFilePath = `./shared/src/test/tempEligibleCases.json`;
  fs.writeFileSync(outputFilePath, JSON.stringify(fullEligibleCases));
})();
