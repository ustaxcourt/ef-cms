const {
  checkForReadyForTrialCasesLambda,
} = require('../../../src/cases/checkForReadyForTrialCasesLambda');
const {
  reprocessFailedRecordsLambda,
} = require('../../../src/streams/reprocessFailedRecordsLambda');

exports.reprocessFailedRecordsHandler = async event => {
  return reprocessFailedRecordsLambda(event);
};

exports.checkForReadyForTrialCasesHandler = async event => {
  return checkForReadyForTrialCasesLambda(event);
};
