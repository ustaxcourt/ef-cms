import { QueryContainer } from '@opensearch-project/opensearch/api/_types/_common.query_dsl';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';

// because searching for entityName matches is not sufficient!
export const IS_USER: QueryContainer[] = [
  { prefix: { 'pk.S': 'user|' } },
  { prefix: { 'sk.S': 'user|' } },
];

export const IS_PRACTITIONER: QueryContainer[] = [
  ...IS_USER,
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
