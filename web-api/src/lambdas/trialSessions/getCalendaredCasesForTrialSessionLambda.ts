import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getCalendaredCasesForTrialSessionInteractor } from '@web-api/business/useCases/trialSessions/getCalendaredCasesForTrialSessionInteractor';

/**
 * get cases calendared on a trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCalendaredCasesForTrialSessionLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || {};

    return await getCalendaredCasesForTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId,
      },
      authorizedUser,
    );
  });
