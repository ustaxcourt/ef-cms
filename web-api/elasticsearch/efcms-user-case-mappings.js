module.exports = {
  properties: {
    'caseCaption.S': {
      index: false,
      type: 'text',
    },
    'closedDate.S': {
      index: false,
      type: 'date',
    },
    'createdAt.S': {
      index: false,
      type: 'date',
    },
    'docketNumber.S': {
      index: false,
      type: 'text',
    },
    'docketNumberWithSuffix.S': {
      index: false,
      type: 'text',
    },
    'entityName.S': {
      index: false,
      type: 'keyword',
    },
    'gsi1pk.S': {
      type: 'keyword',
    },
    'indexedTimestamp.N': {
      index: false,
      type: 'text',
    },
    'leadDocketNumber.S': {
      index: false,
      type: 'text',
    },
    'pk.S': {
      type: 'keyword',
    },
    'sk.S': {
      type: 'keyword',
    },
    'status.S': {
      type: 'keyword',
    },
  },
};
