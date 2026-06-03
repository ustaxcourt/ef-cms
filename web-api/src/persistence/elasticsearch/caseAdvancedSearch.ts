import { MAX_CASE_SEARCH_RESULTS } from '@shared/business/entities/EntityConstants';
import { aggregateCommonQueryParams } from '@web-api/business/utilities/aggregateCommonQueryParams';
import { isEmpty } from 'lodash';
import { search } from './searchClient';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { CaseAdvancedSearchParamsRequestType } from '@web-api/business/useCases/caseAdvancedSearchInteractor';

export const caseAdvancedSearch = async ({
  applicationContext,
  searchTerms,
}: {
  applicationContext: ServerApplicationContext;
  searchTerms: CaseAdvancedSearchParamsRequestType;
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
        query: { bool: { must: [...exactMatchesQuery, ...commonQuery] } },
        size: MAX_CASE_SEARCH_RESULTS,
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
          query: { bool: { must: [...nonExactMatchesQuery, ...commonQuery] } },
          size: MAX_CASE_SEARCH_RESULTS,
        },
        index: 'efcms-case',
      },
    }));
  }

  return results;
};
