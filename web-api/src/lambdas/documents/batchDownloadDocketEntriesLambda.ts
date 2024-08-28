import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { batchDownloadDocketEntriesInteractor } from '@web-api/business/useCases/document/batchDownloadDocketEntriesInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * batch download docket entries
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const batchDownloadDocketEntriesLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    await batchDownloadDocketEntriesInteractor(
      applicationContext,
      JSON.parse(event.body),
      authorizedUser,
    );
  });
