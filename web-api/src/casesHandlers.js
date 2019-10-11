module.exports = {
  associatePractitionerWithCaseLambda: require('./manualAssociation/associatePractitionerWithCaseLambda')
    .handler,
  associateRespondentWithCaseLambda: require('./manualAssociation/associateRespondentWithCaseLambda')
    .handler,
  caseSearchLambda: require('./cases/caseSearchLambda').handler,
  createCaseFromPaperLambda: require('./cases/createCaseFromPaperLambda')
    .handler,
  createCaseLambda: require('./cases/createCaseLambda').handler,
  deleteCounselFromCaseLambda: require('./cases/deleteCounselFromCaseLambda')
    .handler,
  fileCourtIssuedOrderToCaseLambda: require('./cases/fileCourtIssuedOrderToCaseLambda')
    .handler,
  fileDocketEntryToCaseLambda: require('./cases/fileDocketEntryToCaseLambda')
    .handler,
  fileExternalDocumentToCaseLambda: require('./cases/fileExternalDocumentToCaseLambda')
    .handler,
  getCaseLambda: require('./cases/getCaseLambda').handler,
  recallPetitionFromIRSHoldingQueueLambda: require('./cases/recallPetitionFromIRSHoldingQueueLambda')
    .handler,
  sendPetitionToIRSHoldingQueueLambda: require('./cases/sendPetitionToIRSHoldingQueueLambda')
    .handler,
  setCaseToReadyForTrialLambda: require('./cases/setCaseToReadyForTrialLambda')
    .handler,
  updateCaseLambda: require('./cases/updateCaseLambda').handler,
  updateCaseTrialSortTagsLambda: require('./cases/updateCaseTrialSortTagsLambda')
    .handler,
  updateCounselOnCase: require('./cases/updateCounselOnCase').handler,
  updateCourtIssuedOrderToCaseLambda: require('./cases/updateCourtIssuedOrderToCaseLambda')
    .handler,
  updateDocketEntryOnCaseLambda: require('./cases/updateDocketEntryOnCaseLambda')
    .handler,
  updatePrimaryContactLambda: require('./cases/updatePrimaryContactLambda')
    .handler,
};
