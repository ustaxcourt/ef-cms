module.exports = {
  properties: {
    'assigneeId.S': {
      type: 'keyword',
    },
    'associatedJudge.S': {
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
