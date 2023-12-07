import { checkForReadyForTrialCasesLambda } from '../../../src/lambdas/cases/checkForReadyForTrialCasesLambda';
import { setHealthCheckCacheLambda } from '../../../src/lambdas/health/setHealthCheckCacheLambda';

export const checkForReadyForTrialCasesHandler =
  checkForReadyForTrialCasesLambda;
export const setHealthCheckCacheHandler = setHealthCheckCacheLambda;
