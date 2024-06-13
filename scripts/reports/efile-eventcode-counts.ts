import { createApplicationContext } from '@web-api/applicationContext';
import { requireEnvVars } from '../../shared/admin-tools/util';
import { search } from '@web-api/persistence/elasticsearch/searchClient';
import { validateDateAndCreateISO } from '@shared/business/utilities/DateHandler';

requireEnvVars(['ENV', 'REGION']);
const applicationContext = createApplicationContext({});
const numOfEventCodes = 252;

// if (process.argv.length < 3) {
//   console.error('usage: efile-eventcode-counts.ts [year]');
//   process.exit(1);
// }

// const reportYear = parseInt(process.argv[2]);

const dateStart = validateDateAndCreateISO({
  day: '1',
  month: '1',
  year: '2021',
});
const dateEnd = validateDateAndCreateISO({
  day: '13',
  month: '6',
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
            term: {
              'isStricken.BOOL': false,
            },
          },
          {
            range: {
              'receivedAt.S': {
                gte: dateStart,
                lt: dateEnd,
              },
            },
          },
        ],
      },
    },
    size: 0,
    track_total_hits: true,
  },
  index: 'efcms-docket-entry',
};

async function main() {
  const { aggregations, total } = await search({
    applicationContext,
    searchParameters: documentQuery,
  });
  //   console.log(JSON.stringify(aggregations, null, 4));
  // console.table(aggregations.search_field_count.buckets);

  console.warn('total', total);
  console.log('eventcode,eventCount');
  for (const row of aggregations.search_field_count.buckets) {
    console.log(`${row.key},${row.doc_count}`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
