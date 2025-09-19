import { UnknownAuthUser } from '../../../../shared/src/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getRecentFilingsForUserInteractor } from '../../../../shared/src/business/useCases/getRecentFilingsForUserInteractor';

/**
 * used for fetching recent filings for the last 7 days for a particular user
 *
 * @param {object} event the AWS event object
 * @param {UnknownAuthUser} authorizedUser the authenticated user making the request
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getRecentFilingsForUserLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getRecentFilingsForUserInteractor(
      applicationContext,
      authorizedUser,
    );
  });
