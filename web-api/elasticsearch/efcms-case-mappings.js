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
    'contactPrimary.M.contactId.S': {
      type: 'keyword',
    },
    'contactPrimary.M.countryType.S': {
      type: 'keyword',
    },
    'contactPrimary.M.name.S': {
      type: 'text',
    },
    'contactPrimary.M.secondaryName.S': {
      type: 'text',
    },
    'contactPrimary.M.state.S': {
      type: 'keyword',
    },
    'contactSecondary.M.contactId.S': {
      type: 'keyword',
    },
    'contactSecondary.M.countryType.S': {
      type: 'keyword',
    },
    'contactSecondary.M.name.S': {
      type: 'text',
    },
    'contactSecondary.M.state.S': {
      type: 'keyword',
    },
    'docketEntries.L.M.createdAt.S': {
      type: 'date',
    },
    'docketEntries.L.M.docketEntryId.S': {
      type: 'keyword',
    },
    'docketEntries.L.M.documentType.S': {
      type: 'keyword',
    },
    'docketEntries.L.M.entityName.S': {
      type: 'keyword',
    },
    'docketEntries.L.M.eventCode.S': {
      type: 'keyword',
    },
    'docketEntries.L.M.filedBy.S': {
      type: 'text',
    },
    'docketEntries.L.M.filingDate.S': {
      type: 'date',
    },
    'docketEntries.L.M.indexedTimestamp.N': {
      type: 'text',
    },
    'docketEntries.L.M.isDraft.BOOL': {
      type: 'boolean',
    },
    'docketEntries.L.M.judge.S': {
      type: 'text',
    },
    'docketEntries.L.M.pending.BOOL': {
      type: 'boolean',
    },
    'docketEntries.L.M.receivedAt.S': {
      type: 'date',
    },
    'docketEntries.L.M.servedAt.S': {
      type: 'date',
    },
    'docketEntries.L.M.userId.S': {
      type: 'keyword',
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
