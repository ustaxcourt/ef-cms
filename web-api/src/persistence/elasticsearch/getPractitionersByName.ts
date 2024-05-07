import { IS_PRACTITIONER } from './helpers/searchClauses';
import { PRACTITIONER_SEARCH_PAGE_SIZE } from '../../../../shared/src/business/entities/EntityConstants';
import { PractitionerSearchResultType } from '../../../../web-client/src/presenter/computeds/AdvancedSearch/practitionerSearchHelper';
import { search } from './searchClient';

/**
 * getPractitionersByName
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.name the name to search by
 * @returns {*} the result
 */
export const getPractitionersByName = async ({
  applicationContext,
  name,
  searchAfter,
}) => {
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

  const matchingPractitioners: any[] = results;
  console.log('matches', matchingPractitioners);
  const lastKey =
    (matchingPractitioners[matchingPractitioners.length - 1]?.sort as Array<
      number | string
    >) || [];

  return { lastKey, results, total };
};
