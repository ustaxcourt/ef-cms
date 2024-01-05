import { createHash } from 'crypto';

export const efcmsWorkItemMappings = {
  properties: {
    'assigneeId.S': {
      type: 'keyword',
    },
    'associatedJudge.S': {
      fields: {
        raw: {
          type: 'keyword',
        },
      },
      type: 'text',
    },
    case_relations: {
      relations: {
        case: 'workItem',
      },
      type: 'join',
    },
    'completedAt.S': {
      type: 'date',
    },
    'completedBy.S': {
      type: 'text',
    },
    'docketNumber.S': {
      type: 'keyword',
    },
    'docketNumberWithSuffix.S': {
      type: 'keyword',
    },
    'highPriority.BOOL': {
      type: 'boolean',
    },
    'inProgress.BOOL': {
      type: 'boolean',
    },
    'indexedTimestamp.N': {
      type: 'text',
    },
    'isRead.BOOL': {
      type: 'boolean',
    },
    'leadDocketNumber.S': {
      type: 'keyword',
    },
    'pk.S': {
      type: 'keyword',
    },
    'section.S': {
      type: 'text',
    },
    'sk.S': {
      type: 'keyword',
    },
  },
};

const efcmsWorkItemMappingsHash: string = createHash('md5')
  .update(JSON.stringify(efcmsWorkItemMappings), 'utf8')
  .digest('hex');

export const efcmsWorkItemIndex: string = `efcms-work-item-${efcmsWorkItemMappingsHash}`;
