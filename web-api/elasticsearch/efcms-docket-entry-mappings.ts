import { Property } from '@opensearch-project/opensearch/api/_types/_common.mapping';
import { createHash } from 'crypto';

export const efcmsDocketEntryMappings: Property = {
  properties: {
    'associatedJudge.S': {
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
      type: 'text',
    },
    'documentTitle.S': {
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
    'userId.S': {
      type: 'keyword',
    },
  },
};

const efcmsDocketEntryMappingsHash: string = createHash('md5')
  .update(JSON.stringify(efcmsDocketEntryMappings), 'utf8')
  .digest('hex');

export const efcmsDocketEntryIndex: string = `efcms-docket-entry-${efcmsDocketEntryMappingsHash}`;
