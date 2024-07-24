import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getTrialSessionsInteractor } from '@web-api/business/useCases/trialSessions/getTrialSessionsInteractor';

/**
 * gets all trial sessions
 *
 * @param {object} event the AWS event object
 * @param {object} authorizedUser the user object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getTrialSessionsLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getTrialSessionsInteractor(applicationContext, authorizedUser);
  });
