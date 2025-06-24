import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { updatePractitionerContactInformationInteractor } from '@web-api/business/useCases/user/updatePractitionerContactInformationInteractor';

/**
 * updates the practitioner contact info (used for a privatePractitioner or irsPractitioner)
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updatePractitionerContactInformationLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const body = JSON.parse(event.body);
    return await updatePractitionerContactInformationInteractor(
      applicationContext,
      { ...body, userId: (event.pathParameters || event.path).userId },
      authorizedUser,
    );
  });
