import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createTrialSessionInteractor } from '@web-api/business/useCases/trialSessions/createTrialSessionInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * creates a new trial session.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const createTrialSessionLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await createTrialSessionInteractor(
      applicationContext,
      {
        trialSession: JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
