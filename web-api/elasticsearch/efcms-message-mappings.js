// eslint-disable-next-line spellcheck/spell-checker
/*
considerations:
  possibly customize the stop-word list to exclude words like "tax", "court", "irs"?

  test 'asciifolding' by putting the following into an Order contents: Déjà vu
  then search for "deja" to see if the order is returned.
*/
module.exports = {
  mappings: {
    dynamic: false,
    properties: {
      'attachments.L.M.documentId': {
        type: 'text',
      },
      'attachments.L.M.documentTitle': {
        type: 'text',
      },
      'caseId.S': {
        type: 'text',
      },
      'caseStatus.S': {
        type: 'text',
      },
      'caseTitle.S': {
        type: 'text',
      },
      'completedAt.S': {
        type: 'text',
      },
      'completedBySection.S': {
        type: 'text',
      },
      'completedByUserId.S': {
        type: 'text',
      },
      'completedMessage.S': {
        type: 'text',
      },
      'createdAt.S': {
        type: 'text',
      },
      'docketNumber.S': {
        type: 'text',
      },
      'docketNumberWithSuffix.S': {
        type: 'text',
      },
      'entityName.S': {
        type: 'text',
      },
      'from.S': {
        type: 'text',
      },
      'gsi1pk.S': {
        type: 'text',
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
      'messageId.S': {
        type: 'text',
      },
      'parentMessageId.S': {
        type: 'text',
      },
      'pk.S': {
        type: 'text',
      },
      'sk.S': {
        type: 'text',
      },
      'subject.S': {
        type: 'text',
      },
      'to.S': {
        type: 'text',
      },
      'toSection.S': {
        type: 'text',
      },
      'toUserId.S': {
        type: 'text',
      },
    },
  },
};
