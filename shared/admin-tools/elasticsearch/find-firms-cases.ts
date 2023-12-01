/**
 * INITIAL SETUP:
 *   npx ts-node --transpile-only scripts/run-once-scripts/create-efcms-user-practitioner-firm-index.ts
 *
 * USAGE:
 *   npx ts-node --transpile-only shared/admin-tools/elasticsearch/find-firms-cases.ts Firm Search Terms > ~/Desktop/firms-cases.csv
 *
 * CLEANUP:
 *   npx ts-node --transpile-only scripts/run-once-scripts/delete-efcms-user-practitioner-firm-index.ts
 */

import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import { Search } from '@opensearch-project/opensearch/api/requestParams';
import { search } from '@web-api/persistence/elasticsearch/searchClient';
import { serverApplicationContext } from '@web-api/applicationContext';

const firmTerms: string[] = process.argv.slice(2);
if (!firmTerms.length) {
  console.error(
    'usage: npx ts-node --transpile-only shared/admin-tools/elasticsearch/find-firms-cases.ts Firm Search Terms > ~/Desktop/firms-cases.csv',
  );
  process.exit(1);
}

const getFirmsPractitioners = async ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
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
  const searchParameters: Search = {
    body: {
      query: {
        bool: {
          must,
        },
      },
    },
    from: 0,
    index: 'efcms-user-practitioner-firm',
    size: MAX_ELASTICSEARCH_PAGINATION,
  };
  return (await search({ applicationContext, searchParameters }))?.results;
};

const getFirmsCases = async ({
  applicationContext,
  firmsPractitionerIds,
}: {
  applicationContext: IApplicationContext;
  firmsPractitionerIds: string[];
}): Promise<
  {
    associatedJudge: string;
    caseCaption: string;
    docketNumber: string;
    status: string;
  }[]
> => {
  const searchParameters: Search = {
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

(async () => {
  serverApplicationContext.setCurrentUser();
  const applicationContext = serverApplicationContext;
  const firmsPractitionerIds = (
    await getFirmsPractitioners({
      applicationContext,
    })
  ).map(p => p.userId);
  const firmsCases = await getFirmsCases({
    applicationContext,
    firmsPractitionerIds,
  });
  console.log(
    '"Docket Number","Associated Judge","Case Status","Case Caption"',
  );
  for (const firmsCase of firmsCases) {
    console.log(
      `"${firmsCase.docketNumber}","${firmsCase.associatedJudge}","${firmsCase.status}","${firmsCase.caseCaption}"`,
    );
  }
})();
