import { checkForReadyForTrialCasesInteractor } from '@web-api/business/useCases/checkForReadyForTrialCasesInteractor';
import { genericHandler } from '../../genericHandler';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';

/**
 * lambda which is used for checking for ready for trial cases.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const checkForReadyForTrialCasesLambda = event => {
  // If this lambda is invoked while in read-only mode, we must return without doing anything.
  // Otherwise, the interactor will attempt to update cases and will fail
  if (process.env.READ_ONLY_MODE === 'true') {
    getDawsonLogger().info('Skipping checkForReadyForTrialCasesLambda due to read-only mode.');
    return Promise.resolve();
  }

  return genericHandler(event, async ({ applicationContext }) => {
    return await checkForReadyForTrialCasesInteractor(applicationContext);
  });
};
