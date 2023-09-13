import { genericHandler } from '../../genericHandler';

/**
 * gets the value of the provided feature flag
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getAllFeatureFlagsLambda = event =>
  genericHandler(
    event,
    ({ applicationContext }) => {
      return applicationContext
        .getUseCases()
        .getAllFeatureFlagsInteractor(applicationContext);
    },
    { bypassMaintenanceCheck: true },
  );
