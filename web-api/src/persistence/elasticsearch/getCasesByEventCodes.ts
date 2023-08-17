import { MAX_ELASTICSEARCH_PAGINATION } from '../../../../shared/src/business/entities/EntityConstants';
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
                  terms: {
                    'eventCode.S': params.eventCodes,
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
