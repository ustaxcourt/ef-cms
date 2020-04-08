module.exports = {
  createUserLambda: require('./users/createUserLambda').createUserLambda,
  getCasesByUserLambda: require('./cases/getCasesByUserLambda')
    .getCasesByUserLambda,
  getConsolidatedCasesByUserLambda: require('./cases/getConsolidatedCasesByUserLambda')
    .getConsolidatedCasesByUserLambda,
  getDocumentQCInboxForUserLambda: require('./workitems/getDocumentQCInboxForUserLambda')
    .getDocumentQCInboxForUserLambda,
  getDocumentQCServedForUserLambda: require('./workitems/getDocumentQCServedForUserLambda')
    .getDocumentQCServedForUserLambda,
  getInboxMessagesForUserLambda: require('./workitems/getInboxMessagesForUserLambda')
    .getInboxMessagesForUserLambda,
  getInternalUsersLambda: require('./users/getInternalUsersLambda')
    .getInternalUsersLambda,
  getIrsPractitionersBySearchKeyLambda: require('./users/getIrsPractitionersBySearchKeyLambda')
    .getIrsPractitionersBySearchKeyLambda,
  getPrivatePractitionersBySearchKeyLambda: require('./users/getPrivatePractitionersBySearchKeyLambda')
    .getPrivatePractitionersBySearchKeyLambda,
  getSentMessagesForUserLambda: require('./workitems/getSentMessagesForUserLambda')
    .getSentMessagesForUserLambda,
  getUserByIdLambda: require('./users/getUserByIdLambda').getUserByIdLambda,
  getUserLambda: require('./users/getUserLambda').getUserLambda,
  privatePractitionerCaseAssociationLambda: require('./cases/privatePractitionerCaseAssociationLambda')
    .privatePractitionerCaseAssociationLambda,
  privatePractitionerPendingCaseAssociationLambda: require('./cases/privatePractitionerPendingCaseAssociationLambda')
    .privatePractitionerPendingCaseAssociationLambda,
  updateUserContactInformationLambda: require('./users/updateUserContactInformationLambda')
    .updateUserContactInformationLambda,
  verifyPendingCaseForUserLambda: require('./cases/verifyPendingCaseForUserLambda')
    .verifyPendingCaseForUserLambda,
};
