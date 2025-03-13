import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getBlockedCasesInteractor } from '@web-api/business/useCases/blockedCases/getBlockedCasesInteractor';

/**
 * used for getting all the blocked cases for a trial location
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getBlockedCasesLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async () => {
    return await getBlockedCasesInteractor(
      {
        trialLocation: event.pathParameters.trialLocation,
        filterStatusForTrialLocation: event.queryStringParameters,
      },
      authorizedUser,
    );
  });
