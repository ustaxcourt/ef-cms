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
  saveCaseDetailInternalEditLambda: require('./cases/saveCaseDetailInternalEditLambda')
    .handler,
  sendPetitionToIRSHoldingQueueLambda: require('./cases/sendPetitionToIRSHoldingQueueLambda')
    .handler,
  unblockCaseLambda: require('./cases/unblockCaseLambda').handler,
  unprioritizeCaseLambda: require('./cases/unprioritizeCaseLambda').handler,
  updateCaseContextLambda: require('./cases/updateCaseContextLambda').handler,
  updateCaseTrialSortTagsLambda: require('./cases/updateCaseTrialSortTagsLambda')
    .handler,
  updateCounselOnCaseLambda: require('./cases/updateCounselOnCaseLambda')
    .handler,
  updatePrimaryContactLambda: require('./cases/updatePrimaryContactLambda')
    .handler,
};
