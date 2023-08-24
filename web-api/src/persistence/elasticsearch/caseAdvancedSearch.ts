import { MAX_SEARCH_CLIENT_RESULTS } from '../../../../shared/src/business/entities/EntityConstants';
import { aggregateCommonQueryParams } from '../../../../shared/src/business/utilities/aggregateCommonQueryParams';
import { isEmpty } from 'lodash';
import { search } from './searchClient';

/**
 * caseAdvancedSearchInteractor
 *
 * @param {object} providers the providers object containing applicationContext, countryType, petitionerName, petitionerState, endDate, startDate
 * @returns {object} the case data
 */
export const caseAdvancedSearch = async ({
  applicationContext,
  searchTerms,
}) => {
  const { commonQuery, exactMatchesQuery, nonExactMatchesQuery } =
    aggregateCommonQueryParams(searchTerms);

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
