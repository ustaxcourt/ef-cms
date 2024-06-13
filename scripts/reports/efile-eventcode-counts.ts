import { createApplicationContext } from '@web-api/applicationContext';
import { requireEnvVars } from '../../shared/admin-tools/util';
import { search } from '@web-api/persistence/elasticsearch/searchClient';
import { validateDateAndCreateISO } from '@shared/business/utilities/DateHandler';

requireEnvVars(['ENV', 'REGION']);
const applicationContext = createApplicationContext({});
const numOfEventCodes = 252;
const dateStart = validateDateAndCreateISO({
  day: '1',
  month: '1',
  year: '2023',
});
const dateEnd = validateDateAndCreateISO({
  day: '1',
  month: '1',
  year: '2024',
});

const documentQuery = {
  body: {
    aggs: {
      search_field_count: {
        terms: {
          field: 'eventCode.S',
          size: numOfEventCodes,
        },
      },
    },
    query: {
      bool: {
        filter: [
          { term: { 'entityName.S': 'DocketEntry' } },
          {
            exists: {
              field: 'servedAt',
            },
          },
          {
            term: {
              'isStricken.BOOL': false,
            },
          },
          //add filter by date here
          {
            range: {
              'filingDate.S': {
                gte: dateStart,
                lte: dateEnd, //todo: what's up with '/h'?
              },
            },
          },
          //add filter for cases within servedAt range
        ],
        // minimum_should_match: 1,
        // should: shouldFilters,
      },
    },
    size: 0,
    track_total_hits: true,
  },
  index: 'efcms-docket-entry',
};

async function main() {
  console.log('hello from main');
  const { aggregations, total } = await search({
    applicationContext,
    searchParameters: documentQuery,
  });
  //   console.log(JSON.stringify(aggregations, null, 4));
  console.table(aggregations.search_field_count.buckets);
  console.log('total', total);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
