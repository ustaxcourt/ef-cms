module.exports = {
  checkForReadyForTrialCases: require('./cases/checkForReadyForTrialCasesLambda')
    .handler,
  createCourtIssuedOrderPdfFromHtmlLambda: require('./courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlLambda')
    .handler,
  getCasesByUserLambda: require('./cases/getCasesByUserLambda').handler,
  getDocumentQCBatchedForUserLambda: require('./workitems/getDocumentQCBatchedForUserLambda')
    .handler,
  getDocumentQCInboxForUserLambda: require('./workitems/getDocumentQCInboxForUserLambda')
    .handler,
  getDocumentQCServedForUserLambda: require('./workitems/getDocumentQCServedForUserLambda')
    .handler,
  getInboxMessagesForUserLambda: require('./workitems/getInboxMessagesForUserLambda')
    .handler,
  getNotificationsLambda: require('./users/getNotificationsLambda').handler,
  getSentMessagesForUserLambda: require('./workitems/getSentMessagesForUserLambda')
    .handler,
  practitionerCaseAssociationLambda: require('./cases/practitionerCaseAssociationLambda')
    .handler,
  practitionerPendingCaseAssociationLambda: require('./cases/practitionerPendingCaseAssociationLambda')
    .handler,
  runBatchProcessLambda: require('./cases/runBatchProcessLambda').handler,
  swaggerJsonLambda: require('./swagger/swaggerJsonLambda').handler,
  swaggerLambda: require('./swagger/swaggerLambda').handler,
  verifyCaseForUserLambda: require('./cases/verifyCaseForUserLambda').handler,
  verifyPendingCaseForUserLambda: require('./cases/verifyPendingCaseForUserLambda')
    .handler,
};
