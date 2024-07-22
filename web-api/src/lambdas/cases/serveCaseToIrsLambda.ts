import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

/**
 * serve case to irs
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const serveCaseToIrsLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext.getUseCases().serveCaseToIrsInteractor(
        applicationContext,
        {
          ...event.pathParameters,
          ...JSON.parse(event.body),
        },
        authorizedUser,
      );
    },
    { logResults: false },
  );
