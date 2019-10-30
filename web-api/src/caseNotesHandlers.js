module.exports = {
  createCaseNoteLambda: require('./caseNote/createCaseNoteLambda').handler,
  deleteCaseNoteLambda: require('./caseNote/deleteCaseNoteLambda').handler,
  getCaseNoteLambda: require('./caseNote/getCaseNoteLambda').handler,
  updateCaseNoteLambda: require('./caseNote/updateCaseNoteLambda').handler,
};
