import { genericHandler } from '../../genericHandler';

/**
 * Returns an upload url that allow the client to upload a practitioner document to an s3 bucket.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getPractitionerDocumentDownloadUrlLambda = event =>
  genericHandler(event, ({ applicationContext }) => {
    return applicationContext
      .getUseCases()
      .getPractitionerDocumentDownloadUrlInteractor(applicationContext, {
        barNumber: event.pathParameters.barNumber,
        practitionerDocumentFileId:
          event.pathParameters.practitionerDocumentFileId,
      });
  });
