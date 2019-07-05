module.exports = {
  addCoversheetLambda: require('./documents/addCoversheetLambda').handler,
  assignWorkItemsLambda: require('./workitems/assignWorkItemsLambda').handler,
  checkForReadyForTrialCases: require('./cases/checkForReadyForTrialCasesLambda')
    .handler,
  completeWorkItemLambda: require('./workitems/completeWorkItemLambda').handler,
  createCaseDeadlineLambda: require('./caseDeadline/createCaseDeadlineLambda')
    .handler,
  createCaseFromPaperLambda: require('./cases/createCaseFromPaperLambda')
    .handler,
  createCaseLambda: require('./cases/createCaseLambda').handler,
  createCourtIssuedOrderPdfFromHtmlLambda: require('./courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlLambda')
    .handler,
  createDocumentLambda: require('./users/createDocumentLambda').handler,
  createTrialSessionLambda: require('./trialSessions/createTrialSessionLambda')
    .handler,
  createUserLambda: require('./users/createUserLambda').handler,
  createWorkItemLambda: require('./workitems/createWorkItemLambda').handler,
  downloadPolicyUrlLambda: require('./documents/downloadPolicyUrlLambda')
    .handler,
  fileExternalDocumentToCaseLambda: require('./cases/fileExternalDocumentToCaseLambda')
    .handler,
  forwardWorkItemLambda: require('./workitems/forwardWorkItemLambda').handler,
  getCalendaredCasesForTrialSessionLambda: require('./trialSessions/getCalendaredCasesForTrialSessionLambda')
    .handler,
  getCaseDeadlinesForCaseLambda: require('./caseDeadline/getCaseDeadlinesForCaseLambda')
    .handler,
  getCaseLambda: require('./cases/getCaseLambda').handler,
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
  getInternalUsersLambda: require('./users/getInternalUsersLambda').handler,
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
  recallPetitionFromIRSHoldingQueueLambda: require('./cases/recallPetitionFromIRSHoldingQueueLambda')
    .handler,
  runBatchProcessLambda: require('./cases/runBatchProcessLambda').handler,
  sanitizePdfLambda: require('./documents/sanitizePdfLambda').handler,
  sendPetitionToIRSHoldingQueueLambda: require('./cases/sendPetitionToIRSHoldingQueueLambda')
    .handler,
  setCaseToReadyForTrialLambda: require('./cases/setCaseToReadyForTrialLambda')
    .handler,
  setTrialSessionAsSwingSessionLambda: require('./trialSessions/setTrialSessionAsSwingSessionLambda')
    .handler,
  setTrialSessionCalendarLambda: require('./trialSessions/setTrialSessionCalendarLambda')
    .handler,
  setWorkItemAsReadLambda: require('./workitems/setWorkItemAsReadLambda')
    .handler,
  signDocumentLambda: require('./documents/signDocumentLambda').handler,
  swaggerJsonLambda: require('./swagger/swaggerJsonLambda').handler,
  swaggerLambda: require('./swagger/swaggerLambda').handler,
  updateCaseLambda: require('./cases/updateCaseLambda').handler,
  updateCaseTrialSortTagsLambda: require('./cases/updateCaseTrialSortTagsLambda')
    .handler,
  validatePdfLambda: require('./documents/validatePdfLambda').handler,
  verifyCaseForUserLambda: require('./cases/verifyCaseForUserLambda').handler,
  verifyPendingCaseForUserLambda: require('./cases/verifyPendingCaseForUserLambda')
    .handler,
  virusScanPdfLambda: require('./documents/virusScanPdfLambda').handler,
};
