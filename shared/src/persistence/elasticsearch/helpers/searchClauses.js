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

module.exports = { IS_PRACTITIONER, IS_USER };
