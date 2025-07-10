import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { sealDocketEntryInteractor } from '@web-api/business/useCases/docketEntry/sealDocketEntryInteractor';

/**
 * used for sealing docket entries
 *
 * @param {object} event the AWS event object
 * @param {UnknownAuthUser} authorizedUser current user associated with the request
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const sealDocketEntryLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async () => {
    const {
      pathParameters: { docketEntryId, docketNumber },
    } = event;

    const { docketEntrySealedTo } = JSON.parse(event.body);

    return await sealDocketEntryInteractor(
      {
        docketEntryId,
        docketEntrySealedTo,
        docketNumber,
      },
      authorizedUser,
    );
  });
