import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

/**
 * updates the user contact info (used for a privatePractitioner or irsPractitioner)
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updateUserContactInformationLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { contactInfo, firmName } = JSON.parse(event.body);
    return await applicationContext
      .getUseCases()
      .updateUserContactInformationInteractor(
        applicationContext,
        {
          contactInfo,
          firmName,
          userId: (event.pathParameters || event.path).userId,
        },
        authorizedUser,
      );
  });
