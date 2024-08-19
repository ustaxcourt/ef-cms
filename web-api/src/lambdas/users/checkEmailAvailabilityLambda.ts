import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { checkEmailAvailabilityInteractor } from '@web-api/business/useCases/user/checkEmailAvailabilityInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * checks availability of an email address in cognito
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const checkEmailAvailabilityLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { email } = event.queryStringParameters;

    return await checkEmailAvailabilityInteractor(
      applicationContext,
      {
        email,
      },
      authorizedUser,
    );
  });
