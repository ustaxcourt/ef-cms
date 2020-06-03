module.exports = {
  caseAdvancedSearchLambda: require('./cases/caseAdvancedSearchLambda')
    .caseAdvancedSearchLambda,
  createCaseFromPaperLambda: require('./cases/createCaseFromPaperLambda')
    .createCaseFromPaperLambda,
  createCaseLambda: require('./cases/createCaseLambda').createCaseLambda,
  getCaseLambda: require('./cases/getCaseLambda').getCaseLambda,
  getClosedCasesLambda: require('./cases/getClosedCasesLambda')
    .getClosedCasesLambda,
  getConsolidatedCasesByCaseLambda: require('./cases/getConsolidatedCasesByCaseLambda')
    .getConsolidatedCasesByCaseLambda,
  getOpenCasesLambda: require('./cases/getOpenCasesLambda').getOpenCasesLambda,
  removeCasePendingItemLambda: require('./cases/removeCasePendingItemLambda')
    .removeCasePendingItemLambda,
  saveCaseDetailInternalEditLambda: require('./cases/saveCaseDetailInternalEditLambda')
    .saveCaseDetailInternalEditLambda,
  serveCaseToIrsLambda: require('./cases/serveCaseToIrsLambda')
    .serveCaseToIrsLambda,
};
