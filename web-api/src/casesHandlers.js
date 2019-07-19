module.exports = {
  addCoversheetLambda: require('./documents/addCoversheetLambda').handler,
  createCaseDeadlineLambda: require('./caseDeadline/createCaseDeadlineLambda')
    .handler,
  createCaseFromPaperLambda: require('./cases/createCaseFromPaperLambda')
    .handler,
  createCaseLambda: require('./cases/createCaseLambda').handler,
  createDocumentLambda: require('./users/createDocumentLambda').handler,
  createWorkItemLambda: require('./workitems/createWorkItemLambda').handler,
  deleteCaseDeadlineLambda: require('./caseDeadline/deleteCaseDeadlineLambda')
    .handler,
  fileCourtIssuedOrderToCaseLambda: require('./cases/fileCourtIssuedOrderToCaseLambda')
    .handler,
  fileDocketEntryToCaseLambda: require('./cases/fileDocketEntryToCaseLambda')
    .handler,
  fileExternalDocumentToCaseLambda: require('./cases/fileExternalDocumentToCaseLambda')
    .handler,
  getCaseDeadlinesForCaseLambda: require('./caseDeadline/getCaseDeadlinesForCaseLambda')
    .handler,
  getCaseLambda: require('./cases/getCaseLambda').handler,
  recallPetitionFromIRSHoldingQueueLambda: require('./cases/recallPetitionFromIRSHoldingQueueLambda')
    .handler,
  sendPetitionToIRSHoldingQueueLambda: require('./cases/sendPetitionToIRSHoldingQueueLambda')
    .handler,
  serveSignedStipDecisionLambda: require('./cases/serveSignedStipDecisionLambda')
    .handler,
  setCaseToReadyForTrialLambda: require('./cases/setCaseToReadyForTrialLambda')
    .handler,
  signDocumentLambda: require('./documents/signDocumentLambda').handler,
  updateCaseDeadlineLambda: require('./caseDeadline/updateCaseDeadlineLambda')
    .handler,
  updateCaseLambda: require('./cases/updateCaseLambda').handler,
  updateCaseTrialSortTagsLambda: require('./cases/updateCaseTrialSortTagsLambda')
    .handler,
  updatePrimaryContactLambda: require('./cases/updatePrimaryContactLambda')
    .handler,
};
