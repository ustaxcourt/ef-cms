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
    'contactPrimary.M.countryType.S': {
      type: 'text',
    },
    'contactPrimary.M.name.S': {
      type: 'text',
    },
    'contactPrimary.M.secondaryName.S': {
      type: 'text',
    },
    'contactPrimary.M.state.S': {
      type: 'text',
    },
    'contactSecondary.M.countryType.S': {
      type: 'text',
    },
    'contactSecondary.M.name.S': {
      type: 'text',
    },
    'contactSecondary.M.state.S': {
      type: 'text',
    },
    'docketEntries.L.M.createdAt.S': {
      type: 'date',
    },
    'docketEntries.L.M.docketEntryId.S': {
      type: 'text',
    },
    'docketEntries.L.M.documentType.S': {
      type: 'text',
    },
    'docketEntries.L.M.entityName.S': {
      type: 'text',
    },
    'docketEntries.L.M.eventCode.S': {
      type: 'text',
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
      type: 'text',
    },
    'docketNumber.S': {
      type: 'text',
    },
    'docketNumberSuffix.S': {
      type: 'text',
    },
    'docketNumberWithSuffix.S': {
      type: 'text',
    },
    'entityName.S': {
      type: 'text',
    },
    'hasPendingItems.BOOL': {
      type: 'boolean',
    },
    'indexedTimestamp.N': {
      type: 'text',
    },
    'irsPractitioners.L.M.userId.S': {
      type: 'text',
    },
    'pk.S': {
      type: 'text',
    },
    'preferredTrialCity.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.userId.S': {
      type: 'text',
    },
    'receivedAt.S': {
      type: 'date',
    },
    'sealedDate.S': {
      type: 'date',
    },
    'sk.S': {
      type: 'text',
    },
    'sortableDocketNumber.N': {
      fields: {
        keyword: {
          type: 'keyword',
        },
      },
      type: 'text',
    },
    'status.S': {
      type: 'text',
    },
    'userId.S': {
      type: 'text',
    },
  },
};
