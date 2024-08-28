import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { unsealDocketEntryInteractor } from '@web-api/business/useCases/docketEntry/unsealDocketEntryInteractor';

/**
 * used for unsealing docket entries
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const unsealDocketEntryLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const {
      pathParameters: { docketEntryId, docketNumber },
    } = event;

    return await unsealDocketEntryInteractor(
      applicationContext,
      {
        docketEntryId,
        docketNumber,
      },
      authorizedUser,
    );
  });
