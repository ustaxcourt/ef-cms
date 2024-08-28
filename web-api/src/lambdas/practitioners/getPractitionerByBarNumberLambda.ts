import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getPractitionerByBarNumberInteractor } from '@web-api/business/useCases/practitioner/getPractitionerByBarNumberInteractor';

/**
 * gets practitioner user by bar number
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getPractitionerByBarNumberLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getPractitionerByBarNumberInteractor(
      applicationContext,
      {
        barNumber: event.pathParameters.barNumber,
      },
      authorizedUser,
    );
  });
