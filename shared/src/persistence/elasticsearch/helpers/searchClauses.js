const { ROLES } = require('../../../business/entities/EntityConstants');

// because searching for entityName matches is not sufficient!
const IS_USER = [
  { prefix: { 'pk.S': 'user|' } },
  { prefix: { 'sk.S': 'user|' } },
];

const IS_PRACTITIONER = [
  ...IS_USER,
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
];

const GET_MESSAGE_PARENT_CASE = {
  has_parent: {
    inner_hits: {
      _source: {
        includes: ['leadDocketNumber', 'docketNumber'],
      },
      name: 'case-mappings',
    },
    parent_type: 'case',
    query: { match_all: {} },
  },
};

module.exports = { GET_MESSAGE_PARENT_CASE, IS_PRACTITIONER, IS_USER };
