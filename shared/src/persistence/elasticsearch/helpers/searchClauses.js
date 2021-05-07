const { ROLES } = require('../../../business/entities/EntityConstants');

// because searching for entityName matches is not sufficient!
export const IS_USER = [
  { prefix: { 'pk.S': 'user|' } },
  { prefix: { 'sk.S': 'user|' } },
];

export const IS_PRACTITIONER = [
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
