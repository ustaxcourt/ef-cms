import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import { isEmpty } from 'lodash';
import { search } from './searchClient';

export const getDocketNumbersWithServedEventCodes = async (
  applicationContext: IApplicationContext,
  {
    cases,
    eventCodes,
  }: { cases?: { docketNumber: string }[]; eventCodes: string[] },
): Promise<string[]> => {
  const docketNumbers = cases
    ? cases.map(caseInfo => caseInfo.docketNumber)
    : [];

  const mustClauses: QueryDslQueryContainer[] = [];

  if (!isEmpty(docketNumbers)) {
    mustClauses.push({
      terms: {
        'docketNumber.S': docketNumbers,
      },
    });
  }

  mustClauses.push({
    has_child: {
      query: {
        bool: {
          filter: [
            {
              terms: {
                'eventCode.S': eventCodes,
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
  });

  const documentQuery = {
    body: {
      _source: ['docketNumber'],
      query: {
        bool: {
          must: mustClauses,
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

  if (!results) {
    return [];
  }

  return results.map(item => item.docketNumber);
};
