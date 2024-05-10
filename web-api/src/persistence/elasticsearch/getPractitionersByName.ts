import { IS_PRACTITIONER } from './helpers/searchClauses';
import { PRACTITIONER_SEARCH_PAGE_SIZE } from '@shared/business/entities/EntityConstants';
import { PractitionerSearchResultType } from '@web-client/presenter/computeds/AdvancedSearch/practitionerSearchHelper';
import { search } from './searchClient';

export const getPractitionersByName = async (
  applicationContext: IApplicationContext,
  { name, searchAfter },
): Promise<{
  lastKey: (string | number)[];
  total: number;
  results: PractitionerSearchResultType[];
}> => {
  const searchParameters = {
    body: {
      _source: [
        'admissionsStatus',
        'admissionsDate',
        'barNumber',
        'contact',
        'name',
        'practitionerType',
        'practiceType',
      ],
      query: {
        bool: {
          must: [
            ...IS_PRACTITIONER,
            {
              match: {
                'name.S': {
                  fuzziness: 'AUTO',
                  query: name,
                },
              },
            },
          ],
        },
      },
      search_after: searchAfter,
      sort: [
        '_score',
        { 'firstName.S': 'asc' },
        { 'lastName.S': 'asc' },
        { 'barNumber.S': 'asc' },
      ],
    },
    index: 'efcms-user',
    size: PRACTITIONER_SEARCH_PAGE_SIZE,
    track_scores: true,
    track_total_hits: true,
  };

  const {
    results,
    total,
  }: { results: PractitionerSearchResultType[]; total: number } = await search({
    applicationContext,
    searchParameters,
  });
  const lastKey =
    results.length > 0 && results[results.length - 1].sort
      ? results[results.length - 1].sort!
      : [];

  return { lastKey, results, total };
};
