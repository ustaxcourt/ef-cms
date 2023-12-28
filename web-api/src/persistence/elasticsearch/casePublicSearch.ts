import { CaseAdvancedSearchParamsRequestType } from '@shared/business/useCases/caseAdvancedSearchInteractor';
import { MAX_SEARCH_RESULTS } from '../../../../shared/src/business/entities/EntityConstants';
import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { aggregateCommonQueryParams } from '../../../../shared/src/business/utilities/aggregateCommonQueryParams';
import { search } from './searchClient';

export type CasePublicSearchResultsType = {
  caseCaption?: string;
  contactId?: string;
  docketNumber: string;
  docketNumberSuffix?: string;
  docketNumberWithSuffix: string;
  irsPractitioners: RawIrsPractitioner[];
  partyType: string;
  petitioners: TPetitioner[];
  receivedAt: string;
  sealedDate?: string;
  isSealed: boolean;
};

export const casePublicSearch = async ({
  applicationContext,
  searchTerms,
}: {
  applicationContext: IApplicationContext;
  searchTerms: CaseAdvancedSearchParamsRequestType;
}): Promise<{ results: CasePublicSearchResultsType }> => {
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
        {
          exists: {
            field: 'sealedDate',
          },
        },
        {
          bool: {
            must: [
              {
                term: {
                  'isSealed.BOOL': true,
                },
              },
            ],
          },
        },
      ],
    },
  };

  return await search({
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
};
