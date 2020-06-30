const {
  checkForReadyForTrialCasesLambda,
} = require('../../../src/cases/checkForReadyForTrialCasesLambda');
const {
  reprocessFailedRecordsLambda,
} = require('../../../src/streams/reprocessFailedRecordsLambda');

exports.reprocessFailedRecordsHandler = reprocessFailedRecordsLambda;

exports.checkForReadyForTrialCasesHandler = checkForReadyForTrialCasesLambda;
