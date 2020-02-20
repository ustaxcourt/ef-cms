module.exports = {
  addConsolidatedCaseLambda: require('./cases/addConsolidatedCaseLambda')
    .handler,
  blockCaseFromTrialLambda: require('./cases/blockCaseFromTrialLambda').handler,
  prioritizeCaseLambda: require('./cases/prioritizeCaseLambda').handler,
  removeConsolidatedCasesLambda: require('./cases/removeConsolidatedCasesLambda')
    .handler,
  sealCaseLambda: require('./cases/sealCaseLambda').handler,
  unblockCaseFromTrialLambda: require('./cases/unblockCaseFromTrialLambda')
    .handler,
  unprioritizeCaseLambda: require('./cases/unprioritizeCaseLambda').handler,
  updateCaseContextLambda: require('./cases/updateCaseContextLambda').handler,
  updateCaseTrialSortTagsLambda: require('./cases/updateCaseTrialSortTagsLambda')
    .handler,
  updateQcCompleteForTrialLambda: require('./cases/updateQcCompleteForTrialLambda')
    .handler,
};
