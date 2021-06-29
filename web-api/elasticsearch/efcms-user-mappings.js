module.exports = {
  properties: {
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
    'indexedTimestamp.N': {
      type: 'text',
    },
    'name.S': {
      type: 'text',
    },
    'pk.S': {
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
