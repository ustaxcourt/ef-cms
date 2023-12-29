import { createHash } from 'crypto';

export const efcmsDocketEntryMappings = {
  properties: {
    'associatedJudge.S': {
      fields: {
        raw: {
          type: 'keyword',
        },
      },
      type: 'text',
    },
    'associatedJudgeId.S': {
      type: 'keyword',
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
    'createdAt.S': {
      type: 'date',
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
    'isFileAttached.BOOL': {
      type: 'boolean',
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
    'sealedTo.S': {
      type: 'keyword',
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
    'status.S': {
      type: 'keyword',
    },
  },
};

const efcmsDocketEntryMappingsHash: string = createHash('md5')
  .update(JSON.stringify(efcmsDocketEntryMappings), 'utf8')
  .digest('hex');

export const efcmsDocketEntryIndex: string = `efcms-docket-entry-${efcmsDocketEntryMappingsHash}`;
