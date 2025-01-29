#!/usr/bin/env -S npx ts-node --transpile-only

import { QueryContainer } from '@opensearch-project/opensearch/api/_types/_common.query_dsl.js';
import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import { createApplicationContext } from '@web-api/applicationContext';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { search } from '@web-api/persistence/elasticsearch/searchClient';

const scriptConfig: ScriptConfig = {
  description: 'open-search-playground - Play with OpenSearch queries.',
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    env: 'ENV',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);
// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const source = [
    'caseCaption',
    'caseStatusHistory',
    'docketNumber',
    'docketNumberWithSuffix',
    'associatedJudge',
    'leadDocketNumber',
    'petitioners',
    'status',
  ];

  const judges = [
    'Ashford',
    'Buch',
    'Carluzzo',
    'Choi',
    'Cohen',
    'Colvin',
    'Copeland',
    'Foley',
    'Fried',
    'Gale',
    'Goeke',
    'Greaves',
    'Gustafson',
    'Halpern',
    'Holmes',
    'Jones',
    'Kerrigan',
    'Landy',
    'Lauber',
    'Leyden',
    'Marshall',
    'Marvel',
    'Morrison',
    'Nega',
    'Panuthos',
    'Paris',
    'Pugh',
    'Siegel',
    'Thornton',
    'Toro',
    'Urda',
    'Vasquez',
    'Weiler',
    'Wells',
  ];

  const statuses = ['Submitted', 'CAV'];

  const params = {
    excludeMemberCases: true,
    judges,
    statuses,
  };
  const applicationContext = createApplicationContext({});

  const shouldFilters: QueryContainer[] = [];
  const filters: QueryContainer[] = [
    {
      terms: { 'status.S': params.statuses },
    },
  ];

  if (params.judges) {
    params.judges.forEach(judge => {
      const associatedJudgeFilters = {
        match_phrase: {
          'associatedJudge.S': judge,
        },
      };
      shouldFilters.push(associatedJudgeFilters);
    });
  }

  const start = performance.now();

  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: source,
        query: {
          bool: {
            filter: filters,
            minimum_should_match: 1,
            should: shouldFilters,
          },
        },
        sort: [{ 'sortableDocketNumber.N': { order: 'asc' } }],
      },
      index: 'efcms-case',
      size: MAX_ELASTICSEARCH_PAGINATION,
    },
  });

  const end = performance.now();

  console.log(`Time took ${end - start}ms`);

  return results;
})();
