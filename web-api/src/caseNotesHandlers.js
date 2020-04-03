module.exports = {
  deleteCaseNoteLambda: require('./caseNote/deleteCaseNoteLambda').handler,
  deleteUserCaseNoteLambda: require('./caseNote/deleteUserCaseNoteLambda')
    .handler,
  getUserCaseNoteForCasesLambda: require('./caseNote/getUserCaseNoteForCasesLambda')
    .handler,
  getUserCaseNoteLambda: require('./caseNote/getUserCaseNoteLambda').handler,
  saveCaseNoteLambda: require('./caseNote/saveCaseNoteLambda').handler,
  updateUserCaseNoteLambda: require('./caseNote/updateUserCaseNoteLambda')
    .handler,
};
