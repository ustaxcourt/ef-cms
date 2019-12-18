module.exports = {
  deleteCaseNoteLambda: require('./caseNote/deleteJudgesCaseNoteLambda')
    .handler,
  deleteJudgesCaseNoteLambda: require('./caseNote/deleteJudgesCaseNoteLambda')
    .handler,
  getJudgesCaseNoteLambda: require('./caseNote/getJudgesCaseNoteLambda')
    .handler,
  saveCaseNoteLambda: require('./caseNote/saveCaseNoteLambda').handler,
  updateJudgesCaseNoteLambda: require('./caseNote/updateJudgesCaseNoteLambda')
    .handler,
};
