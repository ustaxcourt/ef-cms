import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createPractitionerDocumentInteractor } from '@web-api/business/useCases/practitioner/createPractitionerDocumentInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * creates a practitioner document for a practitioner
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const createPractitionerDocumentLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await createPractitionerDocumentInteractor(
      applicationContext,
      {
        barNumber: event.pathParameters.barNumber,
        documentMetadata: JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
