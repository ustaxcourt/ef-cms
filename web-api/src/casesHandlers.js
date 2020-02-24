module.exports = {
  caseAdvancedSearchLambda: require('./cases/caseAdvancedSearchLambda').handler,
  createCaseFromPaperLambda: require('./cases/createCaseFromPaperLambda')
    .handler,
  createCaseLambda: require('./cases/createCaseLambda').handler,
  getBlockedCasesLambda: require('./cases/getBlockedCasesLambda').handler,
  getCaseInventoryReportLambda: require('./cases/getCaseInventoryReportLambda')
    .handler,
  getCaseLambda: require('./cases/getCaseLambda').handler,
  getConsolidatedCasesByCaseLambda: require('./cases/getConsolidatedCasesByCaseLambda')
    .handler,
  removeCasePendingItemLambda: require('./cases/removeCasePendingItemLambda')
    .handler,
  saveCaseDetailInternalEditLambda: require('./cases/saveCaseDetailInternalEditLambda')
    .handler,
  serveCaseToIrsLambda: require('./cases/serveCaseToIrsLambda').handler,
};
