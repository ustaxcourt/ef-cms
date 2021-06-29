module.exports = {
  properties: {
    'assigneeId.S': {
      type: 'keyword',
    },
    'associatedJudge.S': {
      type: 'text',
    },
    'completedAt.S': {
      type: 'text',
    },
    'completedBy.S': {
      type: 'text',
    },
    'docketNumber.S': {
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
