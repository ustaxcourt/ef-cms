import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';

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
export const GET_PARENT_CASE = {
  has_parent: {
    inner_hits: {
      _source: {
        includes: [
          'leadDocketNumber',
          'docketNumber',
          'trialDate',
          'trialLocation',
        ],
      },
      name: 'case-mappings',
    },
    parent_type: 'case',
    query: { match_all: {} },
  },
};
