import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getCasesForUserInteractor } from '@shared/business/useCases/getCasesForUserInteractor';

/**
 * used for fetching all open and closed cases for a particular user
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCasesForUserLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getCasesForUserInteractor(applicationContext, authorizedUser);
  });
