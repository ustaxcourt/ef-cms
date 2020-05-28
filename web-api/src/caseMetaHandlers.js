module.exports = {
  addConsolidatedCaseLambda: require('./cases/addConsolidatedCaseLambda')
    .addConsolidatedCaseLambda,
  addDeficiencyStatisticLambda: require('./cases/addDeficiencyStatisticLambda')
    .addDeficiencyStatisticLambda,
  blockCaseFromTrialLambda: require('./cases/blockCaseFromTrialLambda')
    .blockCaseFromTrialLambda,
  prioritizeCaseLambda: require('./cases/prioritizeCaseLambda')
    .prioritizeCaseLambda,
  removeConsolidatedCasesLambda: require('./cases/removeConsolidatedCasesLambda')
    .removeConsolidatedCasesLambda,
  sealCaseLambda: require('./cases/sealCaseLambda').sealCaseLambda,
  unblockCaseFromTrialLambda: require('./cases/unblockCaseFromTrialLambda')
    .unblockCaseFromTrialLambda,
  unprioritizeCaseLambda: require('./cases/unprioritizeCaseLambda')
    .unprioritizeCaseLambda,
  updateCaseContextLambda: require('./cases/updateCaseContextLambda')
    .updateCaseContextLambda,
  updateCaseTrialSortTagsLambda: require('./cases/updateCaseTrialSortTagsLambda')
    .updateCaseTrialSortTagsLambda,
  updateDeficiencyStatisticLambda: require('./cases/updateDeficiencyStatisticLambda')
    .updateDeficiencyStatisticLambda,
  updateOtherStatisticsLambda: require('./cases/updateOtherStatisticsLambda')
    .updateOtherStatisticsLambda,
  updateQcCompleteForTrialLambda: require('./cases/updateQcCompleteForTrialLambda')
    .updateQcCompleteForTrialLambda,
};
