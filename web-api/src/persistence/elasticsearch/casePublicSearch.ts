import { CasePublicSearchRequestType } from '@shared/business/useCases/public/casePublicSearchInteractor';
import { MAX_SEARCH_RESULTS } from '../../../../shared/src/business/entities/EntityConstants';
import { aggregateCommonQueryParams } from '../../../../shared/src/business/utilities/aggregateCommonQueryParams';
import { search } from './searchClient';

export const casePublicSearch = async ({
  applicationContext,
  searchTerms,
}: {
  applicationContext: IApplicationContext;
  searchTerms: CasePublicSearchRequestType;
}) => {
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

  const { results } = await search({
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

  return results;
};
