module.exports = {
  getDocumentQCInboxForSectionLambda: require('./workitems/getDocumentQCInboxForSectionLambda')
    .getDocumentQCInboxForSectionLambda,
  getDocumentQCServedForSectionLambda: require('./workitems/getDocumentQCServedForSectionLambda')
    .getDocumentQCServedForSectionLambda,
  getInboxMessagesForSectionLambda: require('./workitems/getInboxMessagesForSectionLambda')
    .getInboxMessagesForSectionLambda,
  getSentMessagesForSectionLambda: require('./workitems/getSentMessagesForSectionLambda')
    .getSentMessagesForSectionLambda,
  getUsersInSectionLambda: require('./users/getUsersInSectionLambda')
    .getUsersInSectionLambda,
};
