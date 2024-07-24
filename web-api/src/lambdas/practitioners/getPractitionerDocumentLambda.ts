import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getPractitionerDocumentInteractor } from '@web-api/business/useCases/practitioner/getPractitionerDocumentInteractor';

/**
 * Returns a practitioner document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getPractitionerDocumentLambda = (
  event,
  authorizedUser: UnknownAuthUser,
): Promise<any | undefined> =>
  genericHandler(event, ({ applicationContext }) => {
    return getPractitionerDocumentInteractor(
      applicationContext,
      {
        barNumber: event.pathParameters.barNumber,
        practitionerDocumentFileId:
          event.pathParameters.practitionerDocumentFileId,
      },
      authorizedUser,
    );
  });
