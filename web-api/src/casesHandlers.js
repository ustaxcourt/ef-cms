module.exports = {
  addCoversheetLambda: require('./documents/addCoversheetLambda').handler,
  associatePractitionerWithCaseLambda: require('./manualAssociation/associatePractitionerWithCaseLambda')
    .handler,
  associateRespondentWithCaseLambda: require('./manualAssociation/associateRespondentWithCaseLambda')
    .handler,
  createCaseDeadlineLambda: require('./caseDeadline/createCaseDeadlineLambda')
    .handler,
  createCaseFromPaperLambda: require('./cases/createCaseFromPaperLambda')
    .handler,
  createCaseLambda: require('./cases/createCaseLambda').handler,
  createCaseNoteLambda: require('./caseNote/createCaseNoteLambda').handler,
  createWorkItemLambda: require('./workitems/createWorkItemLambda').handler,
  deleteCaseDeadlineLambda: require('./caseDeadline/deleteCaseDeadlineLambda')
    .handler,
  deleteCaseNoteLambda: require('./caseNote/deleteCaseNoteLambda').handler,
  fileCourtIssuedOrderToCaseLambda: require('./cases/fileCourtIssuedOrderToCaseLambda')
    .handler,
  fileDocketEntryToCaseLambda: require('./cases/fileDocketEntryToCaseLambda')
    .handler,
  fileExternalDocumentToCaseLambda: require('./cases/fileExternalDocumentToCaseLambda')
    .handler,
  getAllCaseDeadlinesLambda: require('./caseDeadline/getAllCaseDeadlinesLambda')
    .handler,
  getCaseDeadlinesForCaseLambda: require('./caseDeadline/getCaseDeadlinesForCaseLambda')
    .handler,
  getCaseLambda: require('./cases/getCaseLambda').handler,
  getCaseNoteLambda: require('./caseNote/getCaseNoteLambda').handler,
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
  updateCaseNoteLambda: require('./caseNote/updateCaseNoteLambda').handler,
  updateCaseTrialSortTagsLambda: require('./cases/updateCaseTrialSortTagsLambda')
    .handler,
  updateDocketEntryOnCaseLambda: require('./cases/updateDocketEntryOnCaseLambda')
    .handler,
  updatePrimaryContactLambda: require('./cases/updatePrimaryContactLambda')
    .handler,
};
