import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { deleteTrialSessionInteractor } from '@web-api/business/useCases/trialSessions/deleteTrialSessionInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * deletes a trial session and all associated working session copies and puts any attached cases back to general docket.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const deleteTrialSessionLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || {};

    return await deleteTrialSessionInteractor(
      applicationContext,
      {
        trialSessionId,
      },
      authorizedUser,
    );
  });
