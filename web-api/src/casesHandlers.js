module.exports = {
  addConsolidatedCaseLambda: require('./cases/addConsolidatedCaseLambda')
    .handler,
  associatePractitionerWithCaseLambda: require('./manualAssociation/associatePractitionerWithCaseLambda')
    .handler,
  associateRespondentWithCaseLambda: require('./manualAssociation/associateRespondentWithCaseLambda')
    .handler,
  blockCaseFromTrialLambda: require('./cases/blockCaseFromTrialLambda').handler,
  caseAdvancedSearchLambda: require('./cases/caseAdvancedSearchLambda').handler,
  createCaseFromPaperLambda: require('./cases/createCaseFromPaperLambda')
    .handler,
  createCaseLambda: require('./cases/createCaseLambda').handler,
  deleteCounselFromCaseLambda: require('./cases/deleteCounselFromCaseLambda')
    .handler,
  getBlockedCasesLambda: require('./cases/getBlockedCasesLambda').handler,
  getCaseLambda: require('./cases/getCaseLambda').handler,
  getConsolidatedCasesByCaseLambda: require('./cases/getConsolidatedCasesByCaseLambda')
    .handler,
  prioritizeCaseLambda: require('./cases/prioritizeCaseLambda').handler,
  recallPetitionFromIRSHoldingQueueLambda: require('./cases/recallPetitionFromIRSHoldingQueueLambda')
    .handler,
  saveCaseDetailInternalEditLambda: require('./cases/saveCaseDetailInternalEditLambda')
    .handler,
  sendPetitionToIRSHoldingQueueLambda: require('./cases/sendPetitionToIRSHoldingQueueLambda')
    .handler,
  unblockCaseFromTrialLambda: require('./cases/unblockCaseFromTrialLambda')
    .handler,
  unprioritizeCaseLambda: require('./cases/unprioritizeCaseLambda').handler,
  updateCaseContextLambda: require('./cases/updateCaseContextLambda').handler,
  updateCaseTrialSortTagsLambda: require('./cases/updateCaseTrialSortTagsLambda')
    .handler,
  updateCounselOnCaseLambda: require('./cases/updateCounselOnCaseLambda')
    .handler,
  updatePrimaryContactLambda: require('./cases/updatePrimaryContactLambda')
    .handler,
};
