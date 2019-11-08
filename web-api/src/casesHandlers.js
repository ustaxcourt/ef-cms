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
  getBlockedCasesLambda: require('./cases/getBlockedCasesLambda').handler,
  getCaseLambda: require('./cases/getCaseLambda').handler,
  prioritizeCaseLambda: require('./cases/prioritizeCaseLambda').handler,
  recallPetitionFromIRSHoldingQueueLambda: require('./cases/recallPetitionFromIRSHoldingQueueLambda')
    .handler,
  sendPetitionToIRSHoldingQueueLambda: require('./cases/sendPetitionToIRSHoldingQueueLambda')
    .handler,
  unblockCaseLambda: require('./cases/unblockCaseLambda').handler,
  unprioritizeCaseLambda: require('./cases/unprioritizeCaseLambda').handler,
  updateCaseCaptionLambda: require('./cases/updateCaseCaptionLambda').handler,
  updateCaseLambda: require('./cases/updateCaseLambda').handler,
  updateCaseStatusLambda: require('./cases/updateCaseStatusLambda').handler,
  updateCaseTrialSortTagsLambda: require('./cases/updateCaseTrialSortTagsLambda')
    .handler,
  updateCounselOnCaseLambda: require('./cases/updateCounselOnCaseLambda')
    .handler,
  updatePrimaryContactLambda: require('./cases/updatePrimaryContactLambda')
    .handler,
};
