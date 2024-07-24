import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { unprioritizeCaseInteractor } from '@shared/business/useCases/unprioritizeCaseInteractor';

/**
 * used for removing the high priority from a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const unprioritizeCaseLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await unprioritizeCaseInteractor(
      applicationContext,
      {
        ...event.pathParameters,
      },
      authorizedUser,
    );
  });
