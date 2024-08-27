import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { setForHearingInteractor } from '@web-api/business/useCases/trialSessions/setForHearingInteractor';

/**
 * creates a new trial session.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const setForHearingLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { docketNumber, trialSessionId } =
      event.pathParameters || event.path || {};
    const { calendarNotes } = JSON.parse(event.body);

    return await setForHearingInteractor(
      applicationContext,
      {
        calendarNotes,
        docketNumber,
        trialSessionId,
      },
      authorizedUser,
    );
  });
