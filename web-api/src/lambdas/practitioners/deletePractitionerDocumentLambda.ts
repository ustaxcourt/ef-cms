import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

/**
 * deletes a practitioner document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const deletePractitionerDocumentLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .deletePractitionerDocumentInteractor(
        applicationContext,
        {
          barNumber: event.pathParameters.barNumber,
          practitionerDocumentFileId:
            event.pathParameters.practitionerDocumentFileId,
        },
        authorizedUser,
      );
  });
