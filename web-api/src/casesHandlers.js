module.exports = {
  caseAdvancedSearchLambda: require('./cases/caseAdvancedSearchLambda')
    .caseAdvancedSearchLambda,
  createCaseFromPaperLambda: require('./cases/createCaseFromPaperLambda')
    .createCaseFromPaperLambda,
  createCaseLambda: require('./cases/createCaseLambda').createCaseLambda,
  getCaseLambda: require('./cases/getCaseLambda').getCaseLambda,
  getConsolidatedCasesByCaseLambda: require('./cases/getConsolidatedCasesByCaseLambda')
    .getConsolidatedCasesByCaseLambda,
  removeCasePendingItemLambda: require('./cases/removeCasePendingItemLambda')
    .removeCasePendingItemLambda,
  saveCaseDetailInternalEditLambda: require('./cases/saveCaseDetailInternalEditLambda')
    .saveCaseDetailInternalEditLambda,
  serveCaseToIrsLambda: require('./cases/serveCaseToIrsLambda')
    .serveCaseToIrsLambda,
  timeoutLambda: require('./cases/timeoutLambda'),
};
