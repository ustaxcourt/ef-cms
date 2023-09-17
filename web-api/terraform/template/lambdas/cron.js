const {
  checkForReadyForTrialCasesLambda,
} = require('../../../src/lambdas/cases/checkForReadyForTrialCasesLambda');
const {
  setHealthCheckCacheLambda,
} = require('../../../src/lambdas/health/setHealthCheckCacheLambda');

exports.checkForReadyForTrialCasesHandler = checkForReadyForTrialCasesLambda;
exports.setHealthCheckCacheHandler = setHealthCheckCacheLambda;
