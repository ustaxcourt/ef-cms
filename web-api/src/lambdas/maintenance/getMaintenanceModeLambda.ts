import { genericHandler } from '../../genericHandler';

/**
 * used for fetching the value of maintenance mode
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getMaintenanceModeLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .getMaintenanceModeInteractor(applicationContext);
    },
    { bypassMaintenanceCheck: true },
  );
