module.exports = {
  properties: {
    'associatedJudge.S': {
      type: 'text',
    },
    'automaticBlocked.BOOL': {
      type: 'boolean',
    },
    'automaticBlockedDate.S': {
      type: 'date',
    },
    'automaticBlockedReason.S': {
      type: 'text',
    },
    'blocked.BOOL': {
      type: 'boolean',
    },
    'blockedDate.S': {
      type: 'date',
    },
    'blockedReason.S': {
      type: 'text',
    },
    'caseCaption.S': {
      type: 'text',
    },
    'closedDate.S': {
      type: 'date',
    },
    'docketNumber.S': {
      type: 'keyword',
    },
    'docketNumberSuffix.S': {
      type: 'keyword',
    },
    'docketNumberWithSuffix.S': {
      type: 'keyword',
    },
    'entityName.S': {
      type: 'keyword',
    },
    'hasPendingItems.BOOL': {
      type: 'boolean',
    },
    'indexedTimestamp.N': {
      type: 'text',
    },
    'irsPractitioners.L.M.userId.S': {
      type: 'keyword',
    },
    'isSealed.BOOL': { type: 'boolean' },
    'petitioners.L.M.contactId.S': {
      type: 'text',
    },
    'petitioners.L.M.contactType.S': {
      type: 'keyword',
    },
    'petitioners.L.M.countryType.S': {
      type: 'keyword',
    },
    'petitioners.L.M.name.S': {
      type: 'text',
    },
    'petitioners.L.M.secondaryName.S': {
      type: 'text',
    },
    'petitioners.L.M.state.S': {
      type: 'text',
    },
    'pk.S': {
      type: 'keyword',
    },
    'preferredTrialCity.S': {
      type: 'keyword',
    },
    'privatePractitioners.L.M.userId.S': {
      type: 'keyword',
    },
    'receivedAt.S': {
      type: 'date',
    },
    'sealedDate.S': {
      type: 'date',
    },
    'sk.S': {
      type: 'keyword',
    },
    'sortableDocketNumber.N': {
      fields: {
        keyword: {
          type: 'keyword',
        },
      },
      type: 'integer',
    },
    'status.S': {
      type: 'keyword',
    },
    'userId.S': {
      type: 'keyword',
    },
  },
};
