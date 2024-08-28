import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { completeDocketEntryQCInteractor } from '@web-api/business/useCases/docketEntry/completeDocketEntryQCInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * complete docket entry qc
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const completeDocketEntryQCLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await completeDocketEntryQCInteractor(
      applicationContext,
      JSON.parse(event.body),
      authorizedUser,
    );
  });
