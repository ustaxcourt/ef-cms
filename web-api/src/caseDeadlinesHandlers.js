module.exports = {
  createCaseDeadlineLambda: require('./caseDeadline/createCaseDeadlineLambda')
    .createCaseDeadlineLambda,
  deleteCaseDeadlineLambda: require('./caseDeadline/deleteCaseDeadlineLambda')
    .deleteCaseDeadlineLambda,
  getAllCaseDeadlinesLambda: require('./caseDeadline/getAllCaseDeadlinesLambda')
    .getAllCaseDeadlinesLambda,
  getCaseDeadlinesForCaseLambda: require('./caseDeadline/getCaseDeadlinesForCaseLambda')
    .getCaseDeadlinesForCaseLambda,
  updateCaseDeadlineLambda: require('./caseDeadline/updateCaseDeadlineLambda')
    .updateCaseDeadlineLambda,
};
