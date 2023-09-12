import { genericHandler } from '../../genericHandler';

/**
 * used for fetching full user data
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getUserLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .getUserInteractor(applicationContext);
    },
    {
      bypassMaintenanceCheck: true,
    },
  );
