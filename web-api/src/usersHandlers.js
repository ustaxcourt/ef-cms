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
  getIrsPractitionersBySearchKeyLambda: require('./users/getIrsPractitionersBySearchKeyLambda')
    .handler,
  getPrivatePractitionersBySearchKeyLambda: require('./users/getPrivatePractitionersBySearchKeyLambda')
    .handler,
  getSentMessagesForUserLambda: require('./workitems/getSentMessagesForUserLambda')
    .handler,
  getUserByIdLambda: require('./users/getUserByIdLambda').handler,
  getUserLambda: require('./users/getUserLambda').handler,
  privatePractitionerCaseAssociationLambda: require('./cases/privatePractitionerCaseAssociationLambda')
    .handler,
  privatePractitionerPendingCaseAssociationLambda: require('./cases/privatePractitionerPendingCaseAssociationLambda')
    .handler,
  updateAttorneyUserLambda: require('./users/updateAttorneyUserLambda').handler,
  updateUserContactInformationLambda: require('./users/updateUserContactInformationLambda')
    .handler,
  verifyPendingCaseForUserLambda: require('./cases/verifyPendingCaseForUserLambda')
    .handler,
};
