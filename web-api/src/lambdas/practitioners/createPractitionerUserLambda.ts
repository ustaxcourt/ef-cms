import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createPractitionerUserInteractor } from '@web-api/business/useCases/practitioner/createPractitionerUserInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * creates a privatePractitioner or irsPractitioner user
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const createPractitionerUserLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await createPractitionerUserInteractor(
      applicationContext,
      {
        user: JSON.parse(event.body).user,
      },
      authorizedUser,
    );
  });
