import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getTrialSessionDetailsInteractor } from '@web-api/business/useCases/trialSessions/getTrialSessionDetailsInteractor';

/**
 * gets trial session details
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getTrialSessionDetailsLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || {};

    return await getTrialSessionDetailsInteractor(
      applicationContext,
      {
        trialSessionId,
      },
      authorizedUser,
    );
  });
