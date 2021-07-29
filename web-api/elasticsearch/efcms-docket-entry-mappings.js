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
    'docketEntryId.S': {
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
    'documentContents.S': {
      analyzer: 'english_exact',
      type: 'text',
    },
    'documentTitle.S': {
      analyzer: 'english_exact',
      type: 'text',
    },
    'documentType.S': {
      type: 'keyword',
    },
    'entityName.S': {
      type: 'keyword',
    },
    'eventCode.S': {
      type: 'keyword',
    },
    'filingDate.S': {
      type: 'date',
    },
    'indexedTimestamp.N': {
      type: 'text',
    },
    'irsPractitioners.L.M.userId.S': {
      type: 'keyword',
    },
    'isLegacyServed.BOOL': {
      type: 'boolean',
    },
    'isSealed.BOOL': {
      type: 'boolean',
    },
    'isStricken.BOOL': {
      type: 'boolean',
    },
    'judge.S': {
      type: 'text',
    },
    'numberOfPages.N': {
      type: 'integer',
    },
    'pending.BOOL': {
      type: 'boolean',
    },
    'petitioners.L.M.name.S': {
      type: 'text',
    },
    'pk.S': {
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
    'servedAt.S': {
      type: 'date',
    },
    'servedPartiesCode.S': {
      type: 'keyword',
    },
    'signedJudgeName.S': {
      type: 'text',
    },
    'sk.S': {
      type: 'keyword',
    },
  },
};
