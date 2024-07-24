import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { editPractitionerDocumentInteractor } from '@web-api/business/useCases/practitioner/editPractitionerDocumentInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * updates a practitioner document for a practitioner
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const editPractitionerDocumentLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await editPractitionerDocumentInteractor(
      applicationContext,
      {
        barNumber: event.pathParameters.barNumber,
        documentMetadata: JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
