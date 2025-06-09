import { getAllFeatureFlagsFromPostgresInteractor } from '@web-api/business/useCases/featureFlag/getAllFeatureFlagsFromPostgresInteractor';
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
    async ({ applicationContext }) => {
      const POSTGRES_FEATURE_FLAGS =
        await getAllFeatureFlagsFromPostgresInteractor(applicationContext);

      return POSTGRES_FEATURE_FLAGS;
    },
    { bypassMaintenanceCheck: true },
  );
