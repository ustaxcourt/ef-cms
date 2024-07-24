import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { removePdfFromDocketEntryInteractor } from '@shared/business/useCases/removePdfFromDocketEntryInteractor';

/**
 * used for removing a pdf from a docket entry
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const removePdfFromDocketEntryLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await removePdfFromDocketEntryInteractor(
      applicationContext,
      event.pathParameters,
      authorizedUser,
    );
  });
