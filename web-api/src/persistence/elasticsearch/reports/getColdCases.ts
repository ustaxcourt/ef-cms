import { ColdCaseEntry } from '@web-api/business/useCases/reports/coldCaseReportInteractor';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { IApplicationContext } from 'types/IApplicationContext';
import { formatResults } from '../searchClient';

export async function getColdCases({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}) {
  const entriesOfNotAtIssueCases = await applicationContext
    .getSearchClient()
    .search({
      body: {
        _source: [
          'docketNumber',
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
                  'status.S': 'General Docket - Not at Issue',
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
                              gt: 'now-120d/d',
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
    });

  entriesOfNotAtIssueCases.body.hits.hits.forEach(hit => {
    hit._source.filingDate =
      hit.inner_hits.most_recent_child.hits.hits[0]._source.filingDate;
    hit._source.eventCode =
      hit.inner_hits.most_recent_child.hits.hits[0]._source.eventCode;
  });

  entriesOfNotAtIssueCases.body.hits.hits.sort((a, b) => {
    return a._source.filingDate.S.localeCompare(b._source.filingDate.S);
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
