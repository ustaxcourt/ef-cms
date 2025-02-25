import { Property } from '@opensearch-project/opensearch/api/_types/_common.mapping';
import { createHash } from 'crypto';

export const efcmsUserMappings: Property = {
  properties: {
    'admissionsDate.S': {
      type: 'date',
    },
    'admissionsStatus.S': {
      type: 'keyword',
    },
    'barNumber.S': {
      type: 'keyword',
    },
    'contact.M.state.S': {
      type: 'keyword',
    },
    'entityName.S': {
      type: 'keyword',
    },
    'firstName.S': {
      type: 'keyword',
    },
    'firmName.S': {
      type: 'text',
    },
    'indexedTimestamp.N': {
      type: 'text',
    },
    'lastName.S': {
      type: 'keyword',
    },
    'name.S': {
      type: 'text',
    },
    'pk.S': {
      type: 'keyword',
    },
    'practitionerType.S': {
      type: 'keyword',
    },
    'role.S': {
      type: 'keyword',
    },
    'sk.S': {
      type: 'keyword',
    },
  },
};

const efcmsUserMappingsHash: string = createHash('md5')
  .update(JSON.stringify(efcmsUserMappings), 'utf8')
  .digest('hex');

export const efcmsUserIndex: string = `efcms-user-${efcmsUserMappingsHash}`;
