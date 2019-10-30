module.exports = {
  createCaseDeadlineLambda: require('./caseDeadline/createCaseDeadlineLambda')
    .handler,
  deleteCaseDeadlineLambda: require('./caseDeadline/deleteCaseDeadlineLambda')
    .handler,
  getAllCaseDeadlinesLambda: require('./caseDeadline/getAllCaseDeadlinesLambda')
    .handler,
  getCaseDeadlinesForCaseLambda: require('./caseDeadline/getCaseDeadlinesForCaseLambda')
    .handler,
  updateCaseDeadlineLambda: require('./caseDeadline/updateCaseDeadlineLambda')
    .handler,
};
