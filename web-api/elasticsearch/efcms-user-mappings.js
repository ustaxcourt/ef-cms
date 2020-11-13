module.exports = {
  properties: {
    'admissionsStatus.S': {
      type: 'keyword',
    },
    'barNumber.S': {
      index: false,
      type: 'keyword',
    },
    'contact.M.state.S': {
      index: false,
      type: 'text',
    },
    'entityName.S': {
      type: 'text',
    },
    'indexedTimestamp.N': {
      index: false,
      type: 'text',
    },
    'name.S': {
      type: 'text',
    },
    'pk.S': {
      type: 'text',
    },
    'role.S': {
      type: 'keyword',
    },
    'sk.S': {
      type: 'text',
    },
  },
};
