const { ROLES } = require('../../business/entities/EntityConstants');
const { search } = require('./searchClient');
const { uniqBy } = require('lodash');

/**
 * getPractitionersByName
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.name the name to search by
 * @returns {*} the result
 */
exports.getPractitionersByName = async ({ applicationContext, name }) => {
  const commonQuery = [
    {
      bool: {
        must: [{ match: { 'pk.S': 'user|' } }, { match: { 'sk.S': 'user|' } }],
      },
    },
    {
      bool: {
        should: [
          { match: { 'role.S': ROLES.irsPractitioner } },
          { match: { 'role.S': ROLES.privatePractitioner } },
          { match: { 'role.S': ROLES.inactivePractitioner } },
        ],
      },
    },
  ];

  const exactMatchesQuery = [];
  const nonExactMatchesQuery = [];

  const nameArray = name.toLowerCase().split(' ');
  exactMatchesQuery.push({
    bool: {
      minimum_should_match: nameArray.length,
      should: nameArray.map(word => {
        return {
          term: {
            'name.S': word,
          },
        };
      }),
    },
  });

  nonExactMatchesQuery.push({
    query_string: {
      fields: ['name.S'],
      query: `*${name}*`,
    },
  });

  const source = ['admissionsStatus', 'barNumber', 'contact', 'name'];

  let foundUsers = (
    await search({
      applicationContext,
      searchParameters: {
        body: {
          _source: source,
          query: {
            bool: {
              must: [...commonQuery, ...exactMatchesQuery],
            },
          },
          size: 5000,
        },
        index: 'efcms-user',
      },
    })
  ).results;

  foundUsers.sort((a, b) => {
    return a.barNumber.localeCompare(b.barNumber);
  });

  const nonExactUsers = (
    await search({
      applicationContext,
      searchParameters: {
        body: {
          _source: source,
          query: {
            bool: {
              must: [...commonQuery, ...nonExactMatchesQuery],
            },
          },
          size: 5000,
        },
        index: 'efcms-user',
      },
    })
  ).results;

  foundUsers = [...foundUsers, ...nonExactUsers];

  const uniqueFoundUsers = uniqBy(foundUsers, 'barNumber');

  return uniqueFoundUsers;
};
