import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getPractitionerDocumentDownloadUrlInteractor } from '@web-api/business/useCases/practitioner/getPractitionerDocumentDownloadUrlInteractor';

/**
 * Returns an upload url that allow the client to upload a practitioner document to an s3 bucket.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getPractitionerDocumentDownloadUrlLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, ({ applicationContext }) => {
    return getPractitionerDocumentDownloadUrlInteractor(
      applicationContext,
      {
        barNumber: event.pathParameters.barNumber,
        practitionerDocumentFileId:
          event.pathParameters.practitionerDocumentFileId,
      },
      authorizedUser,
    );
  });
