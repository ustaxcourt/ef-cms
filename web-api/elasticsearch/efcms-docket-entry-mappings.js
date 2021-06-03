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
      index: false,
      type: 'keyword',
    },
    'docketNumber.S': {
      type: 'keyword',
    },
    'docketNumberWithSuffix.S': {
      type: 'keyword',
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
      type: 'keyword',
    },
    'entityName.S': {
      type: 'keyword',
    },
    'eventCode.S': {
      type: 'keyword',
    },
    'filedBy.S': {
      index: false,
      type: 'keyword',
    },
    'filingDate.S': {
      type: 'date',
    },
    'indexedTimestamp.N': {
      index: false,
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
      index: false,
      type: 'keyword',
    },
    'privatePractitioners.L.M.userId.S': {
      type: 'keyword',
    },
    'sealedDate.S': {
      index: false,
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
      index: false,
      type: 'keyword',
    },
  },
};
