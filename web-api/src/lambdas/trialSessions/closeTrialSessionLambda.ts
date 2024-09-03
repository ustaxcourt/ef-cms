import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { closeTrialSessionInteractor } from '@web-api/business/useCases/trialSessions/closeTrialSessionInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * closes a trial session.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const closeTrialSessionLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || {};

    return await closeTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId,
      },
      authorizedUser,
    );
  });
