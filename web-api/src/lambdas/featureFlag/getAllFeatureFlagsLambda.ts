import { getAllFeatureFlagsFromPostgresInteractor } from '@web-api/business/useCases/featureFlag/getAllFeatureFlagsFromPostgresInteractor';
import { genericHandler } from '../../genericHandler';
import { getAllFeatureFlagsInteractor } from '@web-api/business/useCases/featureFlag/getAllFeatureFlagsInteractor';

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
			// TODO: THIS IS TEMPORARY UNTIL WE STRANGLE OUT DYNAMO FEATURE FLAGS;
      const DYNAMO_FEATURE_FLAGS =
        await getAllFeatureFlagsInteractor(applicationContext);
      const POSTGRES_FEATURE_FLAGS =
        await getAllFeatureFlagsFromPostgresInteractor(applicationContext);

      return {
        ...DYNAMO_FEATURE_FLAGS,
        ...POSTGRES_FEATURE_FLAGS,
      };
    },
    { bypassMaintenanceCheck: true },
  );
