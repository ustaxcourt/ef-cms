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
      _source: ['admissionsStatus', 'barNumber', 'contact', 'name'],
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
