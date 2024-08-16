import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { setTrialSessionCalendarInteractor } from '@web-api/business/useCases/trialSessions/setTrialSessionCalendarInteractor';

/**
 * set trial session calendar
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const setTrialSessionCalendarLambda = (
  event,
  authorizedUser: UnknownAuthUser,
): Promise<any | undefined> =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || {};

    return await setTrialSessionCalendarInteractor(
      applicationContext,
      {
        ...JSON.parse(event.body),
        trialSessionId,
      },
      authorizedUser,
    );
  });
