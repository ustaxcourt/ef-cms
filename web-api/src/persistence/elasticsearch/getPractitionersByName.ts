import { IS_PRACTITIONER } from './helpers/searchClauses';
import { PRACTITIONER_SEARCH_PAGE_SIZE } from '../../../../shared/src/business/entities/EntityConstants';
import { search } from './searchClient';

/**
 * getPractitionersByName
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.name the name to search by
 * @returns {*} the result
 */
export const getPractitionersByName = async ({ applicationContext, name }) => {
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
    },
    index: 'efcms-user',
    size: PRACTITIONER_SEARCH_PAGE_SIZE,
    track_total_hits: true,
  };

  // add lastCaseId extraction and pass it back

  const { results, total } = await search({
    applicationContext,
    searchParameters,
  });

  console.log('results', results);
  console.log('total', total);

  return { results, total };
};
