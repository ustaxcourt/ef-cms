const {
  checkForReadyForTrialCasesLambda,
} = require('../../../src/cases/checkForReadyForTrialCasesLambda');
const {
  setHealthCheckCacheLambda,
} = require('../../../src/health/setHealthCheckCacheLambda');

exports.checkForReadyForTrialCasesHandler = checkForReadyForTrialCasesLambda;
exports.setHealthCheckCacheHandler = setHealthCheckCacheLambda;
