import {
  CaseAdvancedSearchParamsRequestType,
  CaseSearchResult,
} from '@web-api/business/useCases/caseAdvancedSearchInteractor';
import {
  MAX_SEARCH_RESULTS,
  US_STATES,
} from '@shared/business/entities/EntityConstants';
import { aggregateCommonQueryParams } from '@shared/business/utilities/aggregateCommonQueryParams';
import { search } from './searchClient';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const casePublicSearch = async ({
  applicationContext,
  searchTerms,
}: {
  applicationContext: ServerApplicationContext;
  searchTerms: CaseAdvancedSearchParamsRequestType;
}): Promise<{ results: CaseSearchResult[] }> => {
  const { commonQuery, exactMatchesQuery } =
    aggregateCommonQueryParams(searchTerms);

  const sourceFields = [
    'caseCaption',
    'contactId',
    'docketNumber',
    'docketNumberSuffix',
    'docketNumberWithSuffix',
    'irsPractitioners',
    'partyType',
    'petitioners',
    'receivedAt',
    'sealedDate',
    'isSealed',
  ];

  const query = {
    bool: {
      must: [...exactMatchesQuery, ...commonQuery],
      must_not: [
        { exists: { field: 'sealedDate' } },
        { bool: { must: [{ term: { 'isSealed.BOOL': true } }] } },
      ],
    },
  };

  const cases = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: sourceFields,
        min_score: 0.1,
        query,
        size: MAX_SEARCH_RESULTS,
      },
      index: 'efcms-case',
    },
  });

  return {
    results: cases.results.map(c => {
      return {
        caseCaption: c.caseCaption,
        docketNumber: c.docketNumber,
        docketNumberWithSuffix: c.docketNumberWithSuffix,
        petitionerNames: c.petitioners?.map(p => p.name),
        petitionerStateNames: c.petitioners?.map(
          p => US_STATES[p.state] || p.state,
        ),
        receivedAt: c.receivedAt,
      };
    }),
  };
};
