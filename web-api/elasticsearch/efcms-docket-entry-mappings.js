module.exports = {
  properties: {
    'associatedJudge.S': {
      type: 'text',
    },
    case_relations: {
      relations: {
        case: 'document',
      },
      type: 'join',
    },
    'caseCaption.S': {
      type: 'text',
    },
    'contactPrimary.M.name.S': {
      type: 'text',
    },
    'contactSecondary.M.name.S': {
      type: 'text',
    },
    'docketEntryId.S': {
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
    'documentContents.S': {
      analyzer: 'ustc_analyzer',
      type: 'text',
    },
    'documentTitle.S': {
      analyzer: 'ustc_analyzer',
      type: 'text',
    },
    'documentType.S': {
      type: 'text',
    },
    'entityName.S': {
      type: 'text',
    },
    'eventCode.S': {
      type: 'text',
    },
    'filingDate.S': {
      type: 'date',
    },
    'indexedTimestamp.N': {
      type: 'text',
    },
    'irsPractitioners.L.M.userId.S': {
      type: 'text',
    },
    'isSealed.BOOL': {
      type: 'boolean',
    },
    'judge.S': {
      type: 'text',
    },
    'numberOfPages.N': {
      type: 'text',
    },
    'pending.BOOL': {
      type: 'boolean',
    },
    'pk.S': {
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
    'servedAt.S': {
      type: 'date',
    },
    'signedJudgeName.S': {
      type: 'text',
    },
    'sk.S': {
      type: 'text',
    },
  },
};
