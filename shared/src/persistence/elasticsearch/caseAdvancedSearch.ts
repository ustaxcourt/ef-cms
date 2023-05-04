import { MAX_SEARCH_CLIENT_RESULTS } from '../../business/entities/EntityConstants';
import { aggregateCommonQueryParams } from '../../business/utilities/aggregateCommonQueryParams';
import { isEmpty } from 'lodash';
import { search } from './searchClient';

/**
 * caseAdvancedSearchInteractor
 *
 * @param {object} providers the providers object containing applicationContext, countryType, petitionerName, petitionerState, yearFiledMax, yearFiledMin
 * @returns {object} the case data
 */
export const caseAdvancedSearch = async ({
  applicationContext,
  searchTerms,
}) => {
  const { commonQuery, exactMatchesQuery, nonExactMatchesQuery } =
    aggregateCommonQueryParams({ applicationContext, ...searchTerms });

  const source = [
    'caseCaption',
    'petitioners',
    'docketNumber',
    'docketNumberSuffix',
    'docketNumberWithSuffix',
    'irsPractitioners',
    'isSealed',
    'privatePractitioners',
    'receivedAt',
    'sealedDate',
  ];

  let results;

  ({ results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: source,
        query: {
          bool: {
            must: [...exactMatchesQuery, ...commonQuery],
          },
        },
        size: MAX_SEARCH_CLIENT_RESULTS,
      },
      index: 'efcms-case',
    },
  }));

  if (isEmpty(results)) {
    ({ results } = await search({
      applicationContext,
      searchParameters: {
        body: {
          _source: source,
          query: {
            bool: {
              must: [...nonExactMatchesQuery, ...commonQuery],
            },
          },
          size: MAX_SEARCH_CLIENT_RESULTS,
        },
        index: 'efcms-case',
      },
    }));
  }

  return results;
};
