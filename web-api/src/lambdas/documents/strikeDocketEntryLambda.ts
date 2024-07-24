import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { strikeDocketEntryInteractor } from '@web-api/business/useCases/docketEntry/strikeDocketEntryInteractor';

/**
 * used for striking docket records
 *
 * @param {object} event the AWS event object
 * @param {UnknownAuthUser} authorizedUser current user associated with the request
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const strikeDocketEntryLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const {
      pathParameters: { docketEntryId, docketNumber },
    } = event;

    return await strikeDocketEntryInteractor(
      applicationContext,
      {
        docketEntryId,
        docketNumber,
      },
      authorizedUser,
    );
  });
