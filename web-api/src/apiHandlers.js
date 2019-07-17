module.exports = {
  assignWorkItemsLambda: require('./workitems/assignWorkItemsLambda').handler,
  checkForReadyForTrialCases: require('./cases/checkForReadyForTrialCasesLambda')
    .handler,
  completeWorkItemLambda: require('./workitems/completeWorkItemLambda').handler,
  createCourtIssuedOrderPdfFromHtmlLambda: require('./courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlLambda')
    .handler,
  createTrialSessionLambda: require('./trialSessions/createTrialSessionLambda')
    .handler,
  downloadPolicyUrlLambda: require('./documents/downloadPolicyUrlLambda')
    .handler,
  forwardWorkItemLambda: require('./workitems/forwardWorkItemLambda').handler,
  getCalendaredCasesForTrialSessionLambda: require('./trialSessions/getCalendaredCasesForTrialSessionLambda')
    .handler,
  getCasesByUserLambda: require('./cases/getCasesByUserLambda').handler,
  getDocumentDownloadUrlLambda: require('./documents/getDocumentDownloadUrl')
    .handler,
  getDocumentQCBatchedForSectionLambda: require('./workitems/getDocumentQCBatchedForSectionLambda')
    .handler,
  getDocumentQCBatchedForUserLambda: require('./workitems/getDocumentQCBatchedForUserLambda')
    .handler,
  getDocumentQCInboxForSectionLambda: require('./workitems/getDocumentQCInboxForSectionLambda')
    .handler,
  getDocumentQCInboxForUserLambda: require('./workitems/getDocumentQCInboxForUserLambda')
    .handler,
  getDocumentQCServedForSectionLambda: require('./workitems/getDocumentQCServedForSectionLambda')
    .handler,
  getDocumentQCServedForUserLambda: require('./workitems/getDocumentQCServedForUserLambda')
    .handler,
  getEligibleCasesForTrialSessionLambda: require('./trialSessions/getEligibleCasesForTrialSessionLambda')
    .handler,
  getInboxMessagesForSectionLambda: require('./workitems/getInboxMessagesForSectionLambda')
    .handler,
  getInboxMessagesForUserLambda: require('./workitems/getInboxMessagesForUserLambda')
    .handler,
  getNotificationsLambda: require('./users/getNotificationsLambda').handler,
  getSentMessagesForSectionLambda: require('./workitems/getSentMessagesForSectionLambda')
    .handler,
  getSentMessagesForUserLambda: require('./workitems/getSentMessagesForUserLambda')
    .handler,
  getTrialSessionDetailsLambda: require('./trialSessions/getTrialSessionDetailsLambda')
    .handler,
  getTrialSessionsLambda: require('./trialSessions/getTrialSessionsLambda')
    .handler,
  getUploadPolicyLambda: require('./documents/getUploadPolicyLambda').handler,
  getUsersInSectionLambda: require('./users/getUsersInSectionLambda').handler,
  getWorkItemLambda: require('./workitems/getWorkItemLambda').handler,
  practitionerCaseAssociationLambda: require('./cases/practitionerCaseAssociationLambda')
    .handler,
  practitionerPendingCaseAssociationLambda: require('./cases/practitionerPendingCaseAssociationLambda')
    .handler,
  runBatchProcessLambda: require('./cases/runBatchProcessLambda').handler,
  sanitizePdfLambda: require('./documents/sanitizePdfLambda').handler,
  setTrialSessionAsSwingSessionLambda: require('./trialSessions/setTrialSessionAsSwingSessionLambda')
    .handler,
  setTrialSessionCalendarLambda: require('./trialSessions/setTrialSessionCalendarLambda')
    .handler,
  setWorkItemAsReadLambda: require('./workitems/setWorkItemAsReadLambda')
    .handler,
  swaggerJsonLambda: require('./swagger/swaggerJsonLambda').handler,
  swaggerLambda: require('./swagger/swaggerLambda').handler,
  validatePdfLambda: require('./documents/validatePdfLambda').handler,
  verifyCaseForUserLambda: require('./cases/verifyCaseForUserLambda').handler,
  verifyPendingCaseForUserLambda: require('./cases/verifyPendingCaseForUserLambda')
    .handler,
  virusScanPdfLambda: require('./documents/virusScanPdfLambda').handler,
};
