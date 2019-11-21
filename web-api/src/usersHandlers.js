module.exports = {
  createUserLambda: require('./users/createUserLambda').handler,
  getCasesByUserLambda: require('./cases/getCasesByUserLambda').handler,
  getDocumentQCBatchedForUserLambda: require('./workitems/getDocumentQCBatchedForUserLambda')
    .handler,
  getDocumentQCInboxForUserLambda: require('./workitems/getDocumentQCInboxForUserLambda')
    .handler,
  getDocumentQCServedForUserLambda: require('./workitems/getDocumentQCServedForUserLambda')
    .handler,
  getInboxMessagesForUserLambda: require('./workitems/getInboxMessagesForUserLambda')
    .handler,
  getInternalUsersLambda: require('./users/getInternalUsersLambda').handler,
  getPractitionersBySearchKeyLambda: require('./users/getPractitionersBySearchKeyLambda')
    .handler,
  getRespondentsBySearchKeyLambda: require('./users/getRespondentsBySearchKeyLambda')
    .handler,
  getSentMessagesForUserLambda: require('./workitems/getSentMessagesForUserLambda')
    .handler,
  getUserLambda: require('./users/getUserLambda').handler,
  practitionerCaseAssociationLambda: require('./cases/practitionerCaseAssociationLambda')
    .handler,
  practitionerPendingCaseAssociationLambda: require('./cases/practitionerPendingCaseAssociationLambda')
    .handler,
  updateUserContactInformationLambda: require('./users/updateUserContactInformationLambda')
    .handler,
  verifyPendingCaseForUserLambda: require('./cases/verifyPendingCaseForUserLambda')
    .handler,
};
