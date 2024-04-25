import { IS_PRACTITIONER } from './helpers/searchClauses';
// import { PRACTITIONER_SEARCH_PAGE_SIZE } from '../../../../shared/src/business/entities/EntityConstants';
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
      search_after: [searchAfter],
      sort: [{ 'barNumber.S': 'asc' }],
    },
    index: 'efcms-user',
    size: PRACTITIONER_SEARCH_PAGE_SIZE,
    track_total_hits: true,
  };

  const searchResult = await search({
    applicationContext,
    searchParameters,
  });

  console.log('search result', searchResult);

  const {
    results,
    total,
  }: { results: PractitionerSearchResultType[]; total: number } = searchResult;

  // get last bar num

  console.log('results', results);

  return { lastBarNum: '1', results, total };
};
