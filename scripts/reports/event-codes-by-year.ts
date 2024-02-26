// usage: npx ts-node --transpile-only shared/admin-tools/elasticsearch/find-m071s-and-m074s.js > ~/Desktop/m071s-and-m074s-filed-in-2021-and-2022.csv

const { requireEnvVars } = require('../util');
requireEnvVars(['ENV', 'REGION']);
const {
  createApplicationContext,
} = require('../../../web-api/src/applicationContext');
const {
  search,
} = require('../../../web-api/src/persistence/elasticsearch/searchClient');
const {
  validateDateAndCreateISO,
} = require('../../src/business/utilities/DateHandler');

const cachedCases = {};

const getCase = async ({ applicationContext, docketNumber }) => {
  if (docketNumber in cachedCases) {
    return cachedCases[docketNumber];
  }
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        from: 0,
        query: {
          bool: {
            must: {
              term: {
                'docketNumber.S': docketNumber,
              },
            },
          },
        },
        size: 1,
      },
      index: 'efcms-case',
    },
  });
  if (!results) {
    return;
  }
  cachedCases[docketNumber] = results[0];
  return results[0];
};

const getM071AndM074DocketEntriesFiledIn2021Or2022 = async ({
  applicationContext,
}) => {
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        from: 0,
        query: {
          bool: {
            must: [
              {
                range: {
                  'receivedAt.S': {
                    gte: validateDateAndCreateISO({
                      day: 1,
                      month: 1,
                      year: 2021,
                    }),
                    lt: validateDateAndCreateISO({
                      day: 1,
                      month: 1,
                      year: 2023,
                    }),
                  },
                },
              },
              {
                bool: {
                  should: [
                    {
                      term: {
                        'eventCode.S': 'M071',
                      },
                    },
                    {
                      term: {
                        'eventCode.S': 'M074',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        size: 20000,
        sort: [{ 'receivedAt.S': 'asc' }],
      },
      index: 'efcms-docket-entry',
    },
  });
  return results;
};

(async () => {
  const applicationContext = createApplicationContext({});
  const docketEntries = await getM071AndM074DocketEntriesFiledIn2021Or2022({
    applicationContext,
  });
  console.log(
    '"Docket Number","Date Filed","Document Type","Preferred Trial City","Associated Judge",' +
      '"Case Status","Case Caption"',
  );
  for (const de of docketEntries) {
    if (!('docketNumber' in de)) {
      continue;
    }
    const c = await getCase({
      applicationContext,
      docketNumber: de.docketNumber,
    });
    const associatedJudge = c.associatedJudge
      .replace('Chief Special Trial ', '')
      .replace('Special Trial ', '')
      .replace('Judge ', '');
    console.log(
      `"${c.docketNumberWithSuffix}","${de.receivedAt.split('T')[0]}",` +
        `"${de.documentType}","${c.preferredTrialCity}","${associatedJudge}",` +
        `"${c.status}","${c.caseCaption}"`,
    );
  }
})();
