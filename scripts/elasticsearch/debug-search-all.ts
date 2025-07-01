#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@web-api/applicationContext';
import { pinkLog } from '@shared/tools/pinkLog';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';

const excludedCaseStatuses = [
  CASE_STATUS_TYPES.closed,
  CASE_STATUS_TYPES.closedDismissed,
  CASE_STATUS_TYPES.onAppeal,
];

const scriptConfig: ScriptConfig = {
  description: 'debug-search-all',
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    env: 'ENV',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const getAllCasesNotInExcludedStatus = async (): Promise<RawCase[]> => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  'entityName.S': 'Case',
                },
              },
            ],
            must_not: [
              {
                terms: {
                  'status.S': excludedCaseStatuses,
                },
              },
            ],
          },
        },
        //sort: [{ 'sortableDocketNumber.N': { order: 'asc' } }],
      },
      index: 'efcms-case',
    },
  });
  return results;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const allOpenCases = await getAllCasesNotInExcludedStatus();
  pinkLog(`Found ${allOpenCases.length} cases`);
})();
