import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used for checking for ready for trial cases.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const checkForReadyForTrialCasesLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .checkForReadyForTrialCasesInteractor(applicationContext);
    },
    {
      user: {},
    },
  );
