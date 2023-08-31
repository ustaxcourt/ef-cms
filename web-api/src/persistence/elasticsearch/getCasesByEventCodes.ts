import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import { search } from './searchClient';

export const getCasesByEventCodes = async ({ applicationContext, params }) => {
  const documentQuery = {
    body: {
      _source: ['docketNumber'],
      query: {
        bool: {
          must: [
            {
              terms: {
                'docketNumber.S': params.cases.map(
                  caseInfo => caseInfo.docketNumber,
                ),
              },
            },
            {
              has_child: {
                query: {
                  bool: {
                    filter: [
                      {
                        terms: {
                          'eventCode.S': params.eventCodes,
                        },
                      },
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
                    ],
                  },
                },
                type: 'document',
              },
            },
          ],
        },
      },
      size: MAX_ELASTICSEARCH_PAGINATION,
    },
    index: 'efcms-docket-entry',
  };

  const { results } = await search({
    applicationContext,
    searchParameters: documentQuery,
  });

  return results;
};
