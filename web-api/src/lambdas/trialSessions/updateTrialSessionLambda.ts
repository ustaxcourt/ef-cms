import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { updateTrialSessionInteractor } from '@web-api/business/useCases/trialSessions/updateTrialSessionInteractor';

/**
 * updates a trial session.
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updateTrialSessionLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await updateTrialSessionInteractor(
      applicationContext,
      {
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
