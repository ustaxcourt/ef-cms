import {
  CASE_STATUS_TYPES,
  COLD_CASE_LOOKBACK_IN_DAYS,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { ColdCaseEntry } from '@web-api/business/useCases/reports/coldCaseReportInteractor';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { formatResults, searchRaw } from '../searchClient';
// import { getDbReader } from '@web-api/database';

export async function getColdCases({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}) {
  // 10502 TODO: We need to get a minimum viable docket entry (docket number, filingDate, pending, etc.) into postgres

  // const generalDocketCases = await getDbReader(reader =>
  //   reader
  //     .selectFrom('dwCase')
  //     .where('status', '=', CASE_STATUS_TYPES.generalDocket)
  //     .select([
  //       'caseType',
  //       'createdAt',
  //       'docketNumber',
  //       'docketNumberSuffix',
  //       'leadDocketNumber',
  //       'preferredTrialCity',
  //     ])
  //     .execute(),
  // );

  const searchParameters = {
    body: {
      _source: [
        'docketNumber',
        'docketNumberWithSuffix',
        'filingDate',
        'createdAt',
        'caseType',
        'preferredTrialCity',
        'leadDocketNumber',
      ],
      query: {
        bool: {
          filter: [
            {
              term: {
                'status.S': CASE_STATUS_TYPES.generalDocket,
              },
            },
            {
              term: {
                'entityName.S': 'CaseDocketEntryMapping',
              },
            },
          ],
          must: [
            {
              has_child: {
                inner_hits: {
                  _source: ['filingDate.S', 'eventCode.S'],
                  name: 'most_recent_child',
                  size: 1,
                  sort: [{ 'filingDate.S': { order: 'desc' } }],
                },
                min_children: 1,
                query: {
                  match_all: {},
                },
                type: 'document',
              },
            },
          ],
          must_not: [
            {
              has_child: {
                query: {
                  bool: {
                    should: [
                      {
                        term: {
                          'pending.BOOL': true,
                        },
                      },
                      {
                        range: {
                          'filingDate.S': {
                            gt: `now-${COLD_CASE_LOOKBACK_IN_DAYS}d/d`,
                          },
                        },
                      },
                    ],
                  },
                },
                type: 'document',
              },
            },
          ],
        },
      },
    },
    index: 'efcms-docket-entry',
    size: 10000,
  };

  const entriesOfNotAtIssueCases = await searchRaw({
    applicationContext,
    searchParameters,
  });

  entriesOfNotAtIssueCases.body.hits.hits.forEach(hit => {
    hit._source.filingDate =
      hit.inner_hits.most_recent_child.hits.hits[0]._source.filingDate;
    hit._source.eventCode =
      hit.inner_hits.most_recent_child.hits.hits[0]._source.eventCode;
  });

  entriesOfNotAtIssueCases.body.hits.hits.sort((a, b) => {
    const compareFilingDate = a._source.filingDate.S.localeCompare(
      b._source.filingDate.S,
    );

    if (compareFilingDate === 0) {
      return Case.docketNumberSort(
        a._source.docketNumber.S,
        b._source.docketNumber.S,
      );
    } else {
      return compareFilingDate;
    }
  });

  const { results } = formatResults(entriesOfNotAtIssueCases.body) as {
    results: ColdCaseEntry[];
  };

  results.forEach(result => {
    delete (result as any)._score;
    delete (result as any).sort;
    result.createdAt = formatDateString(result.createdAt, FORMATS.MMDDYYYY);
    result.filingDate = formatDateString(result.filingDate, FORMATS.MMDDYYYY);
  });

  return results as ColdCaseEntry[];
}
