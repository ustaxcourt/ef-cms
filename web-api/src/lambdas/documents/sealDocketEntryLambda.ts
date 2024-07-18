import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

/**
 * used for sealing docket entries
 *
 * @param {object} event the AWS event object
 * @param {UnknownAuthUser} authorizedUser current user associated with the request
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const sealDocketEntryLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async ({ applicationContext }) => {
    const {
      pathParameters: { docketEntryId, docketNumber },
    } = event;

    const { docketEntrySealedTo } = JSON.parse(event.body);

    return await applicationContext.getUseCases().sealDocketEntryInteractor(
      applicationContext,
      {
        docketEntryId,
        docketEntrySealedTo,
        docketNumber,
      },
      authorizedUser,
    );
  });
