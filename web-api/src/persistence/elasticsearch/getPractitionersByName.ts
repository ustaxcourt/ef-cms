import { IS_PRACTITIONER } from './helpers/searchClauses';
import { PRACTITIONER_SEARCH_PAGE_SIZE } from '@shared/business/entities/EntityConstants';
import { search } from './searchClient';

export type PractitionerSearchResultType = {
  admissionsStatus: string;
  barNumber: string;
  admissionsDate: string;
  contact: {
    address3: string;
    address2: string;
    city: string;
    phone: string;
    address1: string;
    postalCode: string;
    state: string;
    countryType: string;
  };
  name: string;
  practitionerType: string;
  practiceType: string;
  _score?: number;
  sort: string[];
};

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
              simple_query_string: {
                default_operator: 'and',
                fields: ['name.S'],
                query: name,
              },
            },
          ],
        },
      },
      search_after: searchAfter,
      sort: [
        { 'firstName.S': 'asc' },
        { 'lastName.S': 'asc' },
        { 'barNumber.S': 'asc' },
      ],
    },
    index: 'efcms-user',
    size: PRACTITIONER_SEARCH_PAGE_SIZE,
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
