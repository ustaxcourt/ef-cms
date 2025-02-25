#!/usr/bin/env -S npx ts-node --transpile-only

import { Search_Request } from '@opensearch-project/opensearch/api';
import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import {
  type ServerApplicationContext,
  applicationContext,
} from '@web-api/applicationContext';
import { generateCsv } from '../helpers/generate-csv';
import { pick } from 'lodash';
import { requireEnvVars } from '../../shared/admin-tools/util';
import { search } from '@web-api/persistence/elasticsearch/searchClient';

requireEnvVars(['ELASTICSEARCH_ENDPOINT', 'ENV']);

const OUTPUT_DIR = `${process.env.HOME}/Documents`;

const firmTerms: string[] = process.argv.slice(2);
if (!firmTerms.length) {
  console.error(
    'usage: scripts/reports/find-firms-cases.ts Firm Search Terms > ~/Desktop/firms-cases.csv',
  );
  process.exit(1);
}

const getFirmsPractitioners = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}): Promise<{ userId: string }[]> => {
  const must: {}[] = [
    {
      term: {
        'admissionsStatus.S': 'Active',
      },
    },
    {
      term: {
        'role.S': 'privatePractitioner',
      },
    },
  ];
  for (const firmTerm of firmTerms) {
    must.push({
      wildcard: {
        'firmName.S': {
          value: `*${firmTerm}*`,
        },
      },
    });
  }
  const searchParameters: Search_Request = {
    body: {
      query: {
        bool: {
          must,
        },
      },
    },
    from: 0,
    index: 'efcms-user',
    size: MAX_ELASTICSEARCH_PAGINATION,
  };
  return (await search({ applicationContext, searchParameters }))?.results;
};

const getFirmsCases = async ({
  applicationContext,
  firmsPractitionerIds,
}: {
  applicationContext: ServerApplicationContext;
  firmsPractitionerIds: string[];
}): Promise<
  {
    associatedJudge: string;
    caseCaption: string;
    docketNumber: string;
    status: string;
  }[]
> => {
  const searchParameters: Search_Request = {
    body: {
      query: {
        bool: {
          must: [
            {
              terms: {
                'privatePractitioners.L.M.userId.S': firmsPractitionerIds,
              },
            },
          ],
        },
      },
    },
    from: 0,
    index: 'efcms-case',
    size: MAX_ELASTICSEARCH_PAGINATION,
  };
  return (await search({ applicationContext, searchParameters }))?.results;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const firmsPractitionerIds = (
    await getFirmsPractitioners({
      applicationContext,
    })
  ).map(p => p.userId);
  const firmsCases = await getFirmsCases({
    applicationContext,
    firmsPractitionerIds,
  });
  const filename = `${OUTPUT_DIR}/${firmTerms.map(ft => ft.toLowerCase()).join('-')}-cases.csv`;
  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Judge', key: 'judge' },
    { header: 'Case Status', key: 'status' },
    { header: 'Case Title', key: 'caseCaption' },
  ];
  const rows = firmsCases.map(fc => {
    const judge =
      fc.associatedJudge
        ?.replace('Chief Special Trial ', '')
        .replace('Special Trial ', '')
        .replace('Judge ', '') || '';
    return {
      ...pick(fc, ['caseCaption', 'docketNumber', 'status']),
      judge,
    };
  });
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
})();
