import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { setNoticesForCalendaredTrialSessionInteractor } from '@web-api/business/useCases/trialSessions/setNoticesForCalendaredTrialSessionInteractor';

/**
 * used for generating / setting notices of trial on cases set for the given trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const setNoticesForCalendaredTrialSessionLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || event.path || {};

    return await setNoticesForCalendaredTrialSessionInteractor(
      applicationContext,
      {
        ...JSON.parse(event.body),
        trialSessionId,
      },
      authorizedUser,
    );
  });
