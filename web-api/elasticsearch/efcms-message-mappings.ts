import { createHash } from 'crypto';

export const efcmsMessageMappings = {
  properties: {
    case_relations: {
      relations: {
        case: 'message',
      },
      type: 'join',
    },
    'caseStatus.S': {
      type: 'keyword',
    },
    'caseTitle.S': {
      type: 'text',
    },
    'completedAt.S': {
      type: 'date',
    },
    'completedBy.S': {
      type: 'text',
    },
    'completedBySection.S': {
      type: 'keyword',
    },
    'completedByUserId.S': {
      type: 'keyword',
    },
    'completedMessage.S': {
      type: 'text',
    },
    'createdAt.S': {
      type: 'date',
    },
    'docketNumberWithSuffix.S': {
      type: 'keyword',
    },
    'entityName.S': {
      type: 'keyword',
    },
    'from.S': {
      type: 'text',
    },
    'fromSection.S': {
      type: 'keyword',
    },
    'fromUserId.S': {
      type: 'keyword',
    },
    'indexedTimestamp.N': {
      type: 'text',
    },
    'isCompleted.BOOL': {
      type: 'boolean',
    },
    'isRepliedTo.BOOL': {
      type: 'boolean',
    },
    'message.S': {
      type: 'text',
    },
    'parentMessageId.S': {
      type: 'keyword',
    },
    'subject.S': {
      type: 'text',
    },
    'to.S': {
      type: 'text',
    },
    'toSection.S': {
      type: 'keyword',
    },
    'toUserId.S': {
      type: 'keyword',
    },
  },
};

const efcmsMessageMappingsHash: string = createHash('md5')
  .update(JSON.stringify(efcmsMessageMappings), 'utf8')
  .digest('hex');

export const efcmsMessageIndex: string = `efcms-message-${efcmsMessageMappingsHash}`;
