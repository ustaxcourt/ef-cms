const {
  checkForReadyForTrialCasesLambda,
} = require('../../../src/cases/checkForReadyForTrialCasesLambda');
const {
  getHealthCheckAndSetCacheLambda,
} = require('../../../src/health/getHealthCheckAndSetCacheLambda');

exports.checkForReadyForTrialCasesHandler = checkForReadyForTrialCasesLambda;
exports.getHealthCheckAndSetCacheHandler = getHealthCheckAndSetCacheLambda;
