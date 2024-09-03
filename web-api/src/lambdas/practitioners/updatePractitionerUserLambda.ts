import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { updatePractitionerUserInteractor } from '@web-api/business/useCases/practitioner/updatePractitionerUserInteractor';

/**
 * updates a privatePractitioner or irsPractitioner user
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updatePractitionerUserLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { bypassDocketEntry = false, user } = JSON.parse(event.body);

    return await updatePractitionerUserInteractor(
      applicationContext,
      {
        barNumber: event.pathParameters.barNumber,
        bypassDocketEntry: bypassDocketEntry || false,
        user,
      },
      authorizedUser,
    );
  });
