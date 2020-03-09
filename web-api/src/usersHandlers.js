module.exports = {
  createAttorneyUserLambda: require('./users/createAttorneyUserLambda').handler,
  createUserLambda: require('./users/createUserLambda').handler,
  getCasesByUserLambda: require('./cases/getCasesByUserLambda').handler,
  getConsolidatedCasesByUserLambda: require('./cases/getConsolidatedCasesByUserLambda')
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
  getUserByIdLambda: require('./users/getUserByIdLambda').handler,
  getUserLambda: require('./users/getUserLambda').handler,
  practitionerCaseAssociationLambda: require('./cases/practitionerCaseAssociationLambda')
    .handler,
  practitionerPendingCaseAssociationLambda: require('./cases/practitionerPendingCaseAssociationLambda')
    .handler,
  updateAttorneyUserLambda: require('./users/updateAttorneyUserLambda').handler,
  updateUserContactInformationLambda: require('./users/updateUserContactInformationLambda')
    .handler,
  verifyPendingCaseForUserLambda: require('./cases/verifyPendingCaseForUserLambda')
    .handler,
};
