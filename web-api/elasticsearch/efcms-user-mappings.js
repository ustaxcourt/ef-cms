module.exports = {
  properties: {
    'admissionsStatus.S': {
      type: 'keyword',
    },
    'barNumber.S': {
      type: 'keyword',
    },
    'contact.M.state.S': {
      type: 'text',
    },
    'entityName.S': {
      type: 'text',
    },
    'indexedTimestamp.N': {
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
