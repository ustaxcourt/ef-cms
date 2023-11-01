/**
 * INITIAL SETUP:
 *   npx ts-node --transpile-only scripts/run-once-scripts/create-efcms-user-practitioner-firm-index.ts
 *
 * USAGE:
 *   npx ts-node --transpile-only shared/admin-tools/elasticsearch/find-firms-cases.ts > ~/Desktop/firms-cases.csv
 *
 * CLEANUP:
 *   npx ts-node --transpile-only scripts/run-once-scripts/delete-efcms-user-practitioner-firm-index.ts
 */

import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import { createApplicationContext } from '@web-api/applicationContext';
import { search } from '@web-api/persistence/elasticsearch/searchClient';

const getFirmsPractitioners = async ({ applicationContext }) => {
  const searchParameters = {
    body: {
      query: {
        bool: {
          must: [
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
            {
              wildcard: {
                'firmName.S': {
                  value: '*Jones*',
                },
              },
            },
            {
              wildcard: {
                'firmName.S': {
                  value: '*Day*',
                },
              },
            },
          ],
        },
      },
    },
    from: 0,
    index: 'efcms-user-practitioner-firm',
    size: MAX_ELASTICSEARCH_PAGINATION,
  };
  return (await search({ applicationContext, searchParameters }))?.results;
};

const getFirmsCases = async ({ applicationContext, firmsPractitionerIds }) => {
  const searchParameters = {
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
  const applicationContext = createApplicationContext({});
  const firmsPractitionerIds = (
    await getFirmsPractitioners({
      applicationContext,
    })
  )?.results.map(p => p.userId);
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
