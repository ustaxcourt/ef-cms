const {
  MAX_SEARCH_CLIENT_RESULTS,
  ROLES,
} = require('../../business/entities/EntityConstants');
const { search } = require('./searchClient');

/**
 * getPractitionersByName
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.name the name to search by
 * @returns {*} the result
 */
exports.getPractitionersByName = async ({ applicationContext, name }) => {
  const searchParameters = {
    body: {
      _source: ['admissionsStatus', 'barNumber', 'contact', 'name'],
      query: {
        bool: {
          must: [
            {
              terms: {
                'entityName.S': [
                  'PrivatePractitioner',
                  'IrsPractitioner',
                  'Practitioner',
                ],
              },
            },
            {
              terms: {
                'role.S': [
                  ROLES.irsPractitioner,
                  ROLES.privatePractitioner,
                  ROLES.inactivePractitioner,
                ],
              },
            },
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
