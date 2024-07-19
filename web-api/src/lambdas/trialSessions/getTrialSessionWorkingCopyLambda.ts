import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

/**
 * get a judge's working copy of a trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getTrialSessionWorkingCopyLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { trialSessionId } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .getTrialSessionWorkingCopyInteractor(
        applicationContext,
        {
          trialSessionId,
        },
        authorizedUser,
      );
  });
