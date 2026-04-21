import { checkForReadyForTrialCasesInteractor } from '@web-api/business/useCases/checkForReadyForTrialCasesInteractor';
import { genericHandler } from '../../genericHandler';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { rescheduleLambda } from '@web-api/dispatchers/sqs/rescheduleLambda';

/**
 * lambda which is used for checking for ready for trial cases.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const checkForReadyForTrialCasesLambda = event => {
  return genericHandler(event, async ({ applicationContext }) => {
    if (process.env.READ_ONLY_MODE === 'true') {
      getDawsonLogger().info(
        'Skipping checkForReadyForTrialCasesLambda due to read-only mode.',
      );
      await rescheduleLambda(applicationContext, { event }, 180);
      return;
    }

    return await checkForReadyForTrialCasesInteractor(applicationContext);
  });
};
