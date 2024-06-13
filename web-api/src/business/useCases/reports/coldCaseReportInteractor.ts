import { IApplicationContext } from 'types/IApplicationContext';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import { formatResults } from '@web-api/persistence/elasticsearch/searchClient';

export const coldCaseReportInteractor = async (
  applicationContext: IApplicationContext,
) => {
  const entriesOfNotAtIssueCases = await applicationContext
    .getSearchClient()
    .search({
      body: {
        _source: ['docketNumber', 'pending', 'filingDate'],
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
            must_not: [
              {
                has_child: {
                  inner_hits: {
                    _source: ['filingDate.S', 'pending.BOOL'],
                    name: 'most_recent_child',
                    size: 1,
                    sort: [{ 'filingDate.S': { order: 'desc' } }],
                  },
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
        sort: [{ 'filingDate.S': { order: 'asc' } }],
      },
      index: 'efcms-docket-entry',
      size: 10000,
    });

  const { results } = formatResults(entriesOfNotAtIssueCases.body);

  return results;
};
