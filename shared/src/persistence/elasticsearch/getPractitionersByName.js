const {
  MAX_SEARCH_RESULTS,
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
  const isUserRecord = [
    { match: { 'pk.S': 'user|' } },
    { match: { 'sk.S': 'user|' } },
  ];
  const isPractitionerRole = {
    bool: {
      minimum_should_match: 1,
      should: [
        { match: { 'role.S': ROLES.inactivePractitioner } },
        { match: { 'role.S': ROLES.irsPractitioner } },
        { match: { 'role.S': ROLES.privatePractitioner } },
      ],
    },
  };

  const matchName = {
    simple_query_string: {
      fields: ['name.S'],
      query: name,
    },
  };

  const query = {
    bool: {
      must: [...isUserRecord, isPractitionerRole, matchName],
    },
  };

  const source = ['admissionsStatus', 'barNumber', 'contact', 'name'];

  const foundUsers = (
    await search({
      applicationContext,
      searchParameters: {
        body: {
          _source: source,
          query,
          size: MAX_SEARCH_RESULTS,
        },
        index: 'efcms-user',
      },
    })
  ).results;

  return foundUsers;
};
