import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getUserInteractor } from '@shared/business/useCases/getUserInteractor';

/**
 * used for fetching full user data
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getUserLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await getUserInteractor(applicationContext, authorizedUser);
    },
    {
      bypassMaintenanceCheck: true,
    },
  );
