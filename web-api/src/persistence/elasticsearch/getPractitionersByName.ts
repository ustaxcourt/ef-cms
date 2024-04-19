import { IS_PRACTITIONER } from './helpers/searchClauses';
import { MAX_SEARCH_CLIENT_RESULTS } from '../../../../shared/src/business/entities/EntityConstants';
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
        'barNumber',
        'contact',
        'name',
        'practitionerType',
        'practiceType',
        'admissionsDate',
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
      size: MAX_SEARCH_CLIENT_RESULTS,
    },
    index: 'efcms-user',
  };

  const { results } = await search({
    applicationContext,
    searchParameters,
  });

  return results;
};
