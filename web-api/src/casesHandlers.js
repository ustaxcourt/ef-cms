module.exports = {
  associatePractitionerWithCaseLambda: require('./manualAssociation/associatePractitionerWithCaseLambda')
    .handler,
  associateRespondentWithCaseLambda: require('./manualAssociation/associateRespondentWithCaseLambda')
    .handler,
  blockCaseLambda: require('./cases/blockCaseLambda').handler,
  caseSearchLambda: require('./cases/caseSearchLambda').handler,
  createCaseFromPaperLambda: require('./cases/createCaseFromPaperLambda')
    .handler,
  createCaseLambda: require('./cases/createCaseLambda').handler,
  deleteCounselFromCaseLambda: require('./cases/deleteCounselFromCaseLambda')
    .handler,
  generateCaseConfirmationPdfLambda: require('./cases/generateCaseConfirmationPdfLambda')
    .handler,
  getBlockedCasesLambda: require('./cases/getBlockedCasesLambda').handler,
  getCaseLambda: require('./cases/getCaseLambda').handler,
  prioritizeCaseLambda: require('./cases/prioritizeCaseLambda').handler,
  recallPetitionFromIRSHoldingQueueLambda: require('./cases/recallPetitionFromIRSHoldingQueueLambda')
    .handler,
  sendPetitionToIRSHoldingQueueLambda: require('./cases/sendPetitionToIRSHoldingQueueLambda')
    .handler,
  setCaseToReadyForTrialLambda: require('./cases/setCaseToReadyForTrialLambda')
    .handler,
  unblockCaseLambda: require('./cases/unblockCaseLambda').handler,
  unprioritizeCaseLambda: require('./cases/unprioritizeCaseLambda').handler,
  updateCaseLambda: require('./cases/updateCaseLambda').handler,
  updateCaseTrialSortTagsLambda: require('./cases/updateCaseTrialSortTagsLambda')
    .handler,
  updateCounselOnCaseLambda: require('./cases/updateCounselOnCaseLambda')
    .handler,
  updatePrimaryContactLambda: require('./cases/updatePrimaryContactLambda')
    .handler,
};
